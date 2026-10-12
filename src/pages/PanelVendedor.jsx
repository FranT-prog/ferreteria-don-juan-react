import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPedidos, updateEstadoPedido, deletePedido, getProductos, deleteProducto } from '../data/database';
import GestionCategorias from './GestionCategorias';


const PanelVendedor = () => {
  const [vistaActiva, setVistaActiva] = useState('pedidos');
  const [pedidos, setPedidos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [filtroEstadoPedido, setFiltroEstadoPedido] = useState('todos');
  const [busquedaProducto, setBusquedaProducto] = useState('');

  useEffect(() => {
    // Cargar datos desde la capa centralizada (database.js)
    setPedidos(getPedidos());
    setProductos(getProductos());
  }, []);

  // --- Funciones para Pedidos ---
  const handleActualizarEstado = (id, nuevoEstado) => {
    updateEstadoPedido(id, nuevoEstado);
    setPedidos(getPedidos());
  };

  const handleEliminarPedido = (id) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar permanentemente el pedido ${id}?`)) {
      deletePedido(id);
      setPedidos(getPedidos());
    }
  };

  const obtenerBadgeEstado = (estado) => {
    switch (estado) {
      case 'Pendiente':
        return <span className="badge bg-warning text-dark"><i className="bi bi-clock me-1"></i>Pendiente</span>;
      case 'En preparación':
        return <span className="badge bg-info text-dark"><i className="bi bi-box-seam me-1"></i>En preparación</span>;
      case 'Despachado':
        return <span className="badge bg-primary"><i className="bi bi-truck me-1"></i>Despachado</span>;
      case 'Entregado':
        return <span className="badge bg-success"><i className="bi bi-check-circle me-1"></i>Entregado</span>;
      case 'Cancelado':
        return <span className="badge bg-danger"><i className="bi bi-x-circle me-1"></i>Cancelado</span>;
      default:
        return <span className="badge bg-secondary">{estado}</span>;
    }
  };

  // --- Funciones para Productos ---
  const handleEliminarProducto = (id) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar el producto con código ${id}?`)) {
      deleteProducto(id);
      setProductos(getProductos());
    }
  };

  // Filtros de búsqueda
  const pedidosFiltrados = pedidos.filter(p => {
    if (filtroEstadoPedido === 'todos') return true;
    return p.estado === filtroEstadoPedido;
  });

  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(busquedaProducto.toLowerCase()) ||
    p.id.toLowerCase().includes(busquedaProducto.toLowerCase()) ||
    (p.categoria && p.categoria.toLowerCase().includes(busquedaProducto.toLowerCase()))
  );

  const totalVentas = pedidos.reduce((acc, p) => p.estado !== 'Cancelado' ? acc + p.total : acc, 0);
  const pedidosPendientes = pedidos.filter(p => p.estado === 'Pendiente' || p.estado === 'En preparación').length;

  return (
    <div className="container-fluid px-0">
      {/* Encabezado */}
      <div className="bg-success text-white p-4 rounded-3 shadow-sm mb-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div>
          <h2 className="fw-bold mb-1"><i className="bi bi-person-badge me-2"></i>Panel del Vendedor</h2>
          <p className="mb-0 text-white-50">Módulo de control de ventas, despacho de órdenes e inventario de productos.</p>
        </div>
        <div className="d-flex gap-2">
          <span className="bg-white text-success px-3 py-2 rounded-2 fw-bold shadow-sm">
            <i className="bi bi-cash-stack me-1"></i> Ventas: ${totalVentas.toLocaleString()}
          </span>
          <span className="bg-white text-dark px-3 py-2 rounded-2 fw-bold shadow-sm">
            <i className="bi bi-hourglass-split me-1 text-warning"></i> Pendientes: {pedidosPendientes}
          </span>
        </div>
      </div>

      {/* Pestañas */}
      <ul className="nav nav-tabs nav-fill mb-4 border-bottom border-2">
        <li className="nav-item">
          <button
            className={`nav-link fw-bold fs-5 py-3 ${vistaActiva === 'pedidos' ? 'active text-success border-success border-bottom-0' : 'text-secondary'}`}
            onClick={() => setVistaActiva('pedidos')}
          >
            <i className="bi bi-receipt-cutoff me-2"></i>Gestión de Pedidos ({pedidos.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link fw-bold fs-5 py-3 ${vistaActiva === 'productos' ? 'active text-success border-success border-bottom-0' : 'text-secondary'}`}
            onClick={() => setVistaActiva('productos')}
          >
            <i className="bi bi-boxes me-2"></i>Gestión de Productos ({productos.length})
          </button>
        </li>
        {/* NUEVA PESTAÑA: Categorías */}
        <li className="nav-item">
          <button
            className={`nav-link fw-bold fs-5 py-3 ${vistaActiva === 'categorias' ? 'active text-success border-success border-bottom-0' : 'text-secondary'}`}
            onClick={() => setVistaActiva('categorias')}
          >
            <i className="bi bi-tags-fill me-2"></i>Gestión de Categorías
          </button>
        </li>
      </ul>

      {/* PESTAÑA PEDIDOS */}
      {vistaActiva === 'pedidos' && (
        <div className="card shadow-sm border-0">
          <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h5 className="fw-bold mb-0 text-success">
              <i className="bi bi-list-task me-2"></i>Listado de Pedidos Recibidos
            </h5>
            <div className="d-flex align-items-center gap-2">
              <label className="fw-bold text-muted small m-0">Filtrar por Estado:</label>
              <select
                className="form-select form-select-sm border-success fw-bold"
                value={filtroEstadoPedido}
                onChange={(e) => setFiltroEstadoPedido(e.target.value)}
                style={{ width: '180px' }}
              >
                <option value="todos">Todos los estados</option>
                <option value="Pendiente">Pendientes</option>
                <option value="En preparación">En preparación</option>
                <option value="Despachado">Despachados</option>
                <option value="Entregado">Entregados</option>
                <option value="Cancelado">Cancelados</option>
              </select>
            </div>
          </div>

          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>N° Pedido</th>
                    <th>Fecha</th>
                    <th>Cliente</th>
                    <th>Items</th>
                    <th>Total ($)</th>
                    <th>Estado Actual</th>
                    <th>Cambiar Estado</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidosFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-5 text-muted">
                        <i className="bi bi-inbox display-6 d-block mb-2"></i>
                        No se encontraron pedidos con el filtro seleccionado.
                      </td>
                    </tr>
                  ) : (
                    pedidosFiltrados.map((pedido) => (
                      <tr key={pedido.id}>
                        <td className="fw-bold text-primary">{pedido.id}</td>
                        <td>{pedido.fecha}</td>
                        <td>
                          <div className="fw-bold">{pedido.cliente}</div>
                          <small className="text-muted">{pedido.rut || 'S/RUT'}</small>
                        </td>
                        <td>
                          <span className="badge bg-secondary">
                            {pedido.items ? pedido.items.length : 1} art.
                          </span>
                        </td>
                        <td className="fw-bold text-danger">
                          ${pedido.total.toLocaleString()}
                        </td>
                        <td>{obtenerBadgeEstado(pedido.estado)}</td>
                        <td>
                          <select
                            className="form-select form-select-sm border-secondary"
                            value={pedido.estado}
                            onChange={(e) => handleActualizarEstado(pedido.id, e.target.value)}
                          >
                            <option value="Pendiente">Pendiente</option>
                            <option value="En preparación">En preparación</option>
                            <option value="Despachado">Despachado</option>
                            <option value="Entregado">Entregado</option>
                            <option value="Cancelado">Cancelado</option>
                          </select>
                        </td>
                        <td className="text-center">
                          <div className="btn-group btn-group-sm">
                            <Link
                              to={`/vendedor/pedido/${pedido.id}`}
                              className="btn btn-outline-success fw-bold"
                              title="Ver detalle"
                            >
                              <i className="bi bi-eye-fill"></i> Detalle
                            </Link>
                            <button
                              className="btn btn-outline-danger"
                              title="Eliminar pedido"
                              onClick={() => handleEliminarPedido(pedido.id)}
                            >
                              <i className="bi bi-trash-fill"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}


      {/* PESTAÑA PRODUCTOS */}
      {vistaActiva === 'productos' && (
        <div className="card shadow-sm border-0">
          <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h5 className="fw-bold mb-0 text-success">
              <i className="bi bi-tools me-2"></i>Inventario de Productos
            </h5>
            <div className="d-flex gap-2 align-items-center flex-wrap">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Buscar producto o código..."
                value={busquedaProducto}
                onChange={(e) => setBusquedaProducto(e.target.value)}
                style={{ width: '220px' }}
              />
              <Link to="/admin/nuevo" className="btn btn-sm btn-success fw-bold">
                <i className="bi bi-plus-lg me-1"></i> Nuevo Producto
              </Link>
            </div>
          </div>

          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>Código</th>
                    <th>Imagen</th>
                    <th>Nombre del Producto</th>
                    <th>Categoría</th>
                    <th>Stock</th>
                    <th>Precio</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productosFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-5 text-muted">
                        <i className="bi bi-box-seam display-6 d-block mb-2"></i>
                        No hay productos registrados en el inventario.
                      </td>
                    </tr>
                  ) : (
                    productosFiltrados.map((prod) => (
                      <tr key={prod.id}>
                        <td className="fw-bold text-muted">{prod.id}</td>
                        <td>
                          <img
                            src={prod.imagen || 'https://via.placeholder.com/50'}
                            alt={prod.nombre}
                            style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '6px' }}
                          />
                        </td>
                        <td className="fw-bold">{prod.nombre}</td>
                        <td>
                          <span className="badge bg-light text-dark border">
                            {prod.categoria || 'Sin categoría'}
                          </span>
                        </td>
                        <td>
                          {prod.stock > 5 ? (
                            <span className="badge bg-success">{prod.stock} un.</span>
                          ) : prod.stock > 0 ? (
                            <span className="badge bg-warning text-dark">Bajo ({prod.stock} un.)</span>
                          ) : (
                            <span className="badge bg-danger">Agotado (0)</span>
                          )}
                        </td>
                        <td className="fw-bold text-danger">
                          ${prod.precio ? prod.precio.toLocaleString() : prod.precio}
                        </td>
                        <td className="text-center">
                          <div className="btn-group btn-group-sm">
                            <Link
                              to={`/admin/editar/${prod.id}`}
                              className="btn btn-outline-primary"
                              title="Editar producto"
                            >
                              <i className="bi bi-pencil-square"></i> Editar
                            </Link>
                            <button
                              className="btn btn-outline-danger"
                              title="Eliminar producto"
                              onClick={() => handleEliminarProducto(prod.id)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA CATEGORÍAS */}
      {vistaActiva === 'categorias' && (
        <GestionCategorias />
      )}
    </div>
  );
};

export default PanelVendedor;