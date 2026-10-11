import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  getUsuarios, 
  updateEstadoUsuario, 
  deleteUsuario, 
  getProductos, 
  deleteProducto, 
  getPedidos, 
  updateEstadoPedido, 
  deletePedido 
} from '../data/database';

const PanelAdmin = () => {
  const [vistaActiva, setVistaActiva] = useState('reportes'); // 'reportes' | 'pedidos' | 'productos' | 'usuarios'
  const [usuarios, setUsuarios] = useState([]);
  const [productos, setProductos] = useState([]);
  const [pedidos, setPedidos] = useState([]);

  // Filtros de búsqueda
  const [filtroEstadoPedido, setFiltroEstadoPedido] = useState('todos');
  const [busquedaProducto, setBusquedaProducto] = useState('');
  const [busquedaUsuario, setBusquedaUsuario] = useState('');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = () => {
    setUsuarios(getUsuarios());
    setProductos(getProductos());
    setPedidos(getPedidos());
  };

  // --- Funciones para Pedidos ---
  const handleActualizarEstadoPedido = (id, nuevoEstado) => {
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

  // --- Funciones para Usuarios ---
  const handleCambiarEstadoUsuario = (id) => {
    updateEstadoUsuario(id);
    setUsuarios(getUsuarios());
  };

  const handleEliminarUsuario = (id) => {
    if (window.confirm(`¿Estás seguro de eliminar el usuario ${id}?`)) {
      deleteUsuario(id);
      setUsuarios(getUsuarios());
    }
  };

  // --- Funciones para Productos ---
  const handleEliminarProducto = (id) => {
    if (window.confirm(`¿Estás seguro de eliminar el producto ${id}?`)) {
      deleteProducto(id);
      setProductos(getProductos());
    }
  };

  // Cuentas y Métricas
  const totalIngresos = pedidos.reduce((acc, p) => p.estado !== 'Cancelado' ? acc + p.total : acc, 0);
  const pedidosPendientes = pedidos.filter(p => p.estado === 'Pendiente' || p.estado === 'En preparación').length;

  // Listas Filtradas
  const pedidosFiltrados = pedidos.filter(p => {
    if (filtroEstadoPedido === 'todos') return true;
    return p.estado === filtroEstadoPedido;
  });

  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(busquedaProducto.toLowerCase()) ||
    p.id.toLowerCase().includes(busquedaProducto.toLowerCase())
  );

  const usuariosFiltrados = usuarios.filter(u =>
    u.nombre.toLowerCase().includes(busquedaUsuario.toLowerCase()) ||
    u.email.toLowerCase().includes(busquedaUsuario.toLowerCase()) ||
    u.rol.toLowerCase().includes(busquedaUsuario.toLowerCase())
  );

  return (
    <div className="container-fluid px-0">
      {/* Encabezado */}
      <div className="bg-dark text-white p-4 rounded-3 shadow-sm mb-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div>
          <h2 className="fw-bold mb-1 text-warning"><i className="bi bi-shield-lock me-2"></i>Panel de Administración</h2>
          <p className="mb-0 text-white-50">Control de ventas, usuarios, órdenes de despacho e inventario global.</p>
        </div>
        <div className="d-flex gap-2">
          <span className="bg-secondary text-white px-3 py-2 rounded-2 fw-bold shadow-sm">
            <i className="bi bi-people me-1"></i> Usuarios: {usuarios.length}
          </span>
          <span className="bg-warning text-dark px-3 py-2 rounded-2 fw-bold shadow-sm">
            <i className="bi bi-cash-coin me-1"></i> Ventas: ${totalIngresos.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Pestañas del Sistema */}
      <ul className="nav nav-tabs nav-fill mb-4 border-bottom border-2">
        <li className="nav-item">
          <button
            className={`nav-link fw-bold fs-5 py-3 ${vistaActiva === 'reportes' ? 'active text-dark border-dark border-bottom-0' : 'text-secondary'}`}
            onClick={() => setVistaActiva('reportes')}
          >
            <i className="bi bi-graph-up-arrow me-2"></i>Métricas & Reportes
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link fw-bold fs-5 py-3 ${vistaActiva === 'pedidos' ? 'active text-dark border-dark border-bottom-0' : 'text-secondary'}`}
            onClick={() => setVistaActiva('pedidos')}
          >
            <i className="bi bi-receipt-cutoff me-2"></i>Gestión de Pedidos ({pedidos.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link fw-bold fs-5 py-3 ${vistaActiva === 'productos' ? 'active text-dark border-dark border-bottom-0' : 'text-secondary'}`}
            onClick={() => setVistaActiva('productos')}
          >
            <i className="bi bi-boxes me-2"></i>Productos ({productos.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link fw-bold fs-5 py-3 ${vistaActiva === 'usuarios' ? 'active text-dark border-dark border-bottom-0' : 'text-secondary'}`}
            onClick={() => setVistaActiva('usuarios')}
          >
            <i className="bi bi-people-fill me-2"></i>Usuarios ({usuarios.length})
          </button>
        </li>
      </ul>

      {/* ======================================================== */}
      {/* VISTA 1: REPORTES Y MÉTRICAS                             */}
      {/* ======================================================== */}
      {vistaActiva === 'reportes' && (
        <div>
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm bg-primary text-white p-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-white-50 fw-bold">INGRESOS TOTALES</h6>
                    <h3 className="fw-bold mb-0">${totalIngresos.toLocaleString()}</h3>
                  </div>
                  <i className="bi bi-currency-dollar display-4 opacity-50"></i>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm bg-warning text-dark p-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-dark-50 fw-bold">PEDIDOS PENDIENTES</h6>
                    <h3 className="fw-bold mb-0">{pedidosPendientes} órdenes</h3>
                  </div>
                  <i className="bi bi-hourglass-split display-4 opacity-50"></i>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm bg-success text-white p-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-white-50 fw-bold">PRODUCTOS EN STOCK</h6>
                    <h3 className="fw-bold mb-0">{productos.length} ítems</h3>
                  </div>
                  <i className="bi bi-box-seam display-4 opacity-50"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3">
              <h5 className="fw-bold mb-0 text-dark"><i className="bi bi-clock-history me-2"></i>Últimas Transacciones Registradas</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Orden</th>
                      <th>Fecha</th>
                      <th>Cliente</th>
                      <th>Total</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedidos.slice(0, 5).map(p => (
                      <tr key={p.id}>
                        <td className="fw-bold text-primary">{p.id}</td>
                        <td>{p.fecha}</td>
                        <td>{p.cliente}</td>
                        <td className="fw-bold text-danger">${p.total.toLocaleString()}</td>
                        <td>{obtenerBadgeEstado(p.estado)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VISTA 2: GESTIÓN DE PEDIDOS                             */}
      {/* ======================================================== */}
      {vistaActiva === 'pedidos' && (
        <div className="card shadow-sm border-0">
          <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h5 className="fw-bold mb-0 text-dark">
              <i className="bi bi-list-task me-2"></i>Listado Global de Pedidos
            </h5>
            <div className="d-flex align-items-center gap-2">
              <label className="fw-bold text-muted small m-0">Filtrar Estado:</label>
              <select
                className="form-select form-select-sm border-dark fw-bold"
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
                        No hay pedidos registrados con este filtro.
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
                            onChange={(e) => handleActualizarEstadoPedido(pedido.id, e.target.value)}
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
                              className="btn btn-outline-dark fw-bold"
                              title="Ver detalle de la orden"
                            >
                              <i className="bi bi-eye-fill"></i> Detalle
                            </Link>
                            <button
                              className="btn btn-outline-danger"
                              title="Eliminar orden"
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

      {/* ======================================================== */}
      {/* VISTA 3: GESTIÓN DE PRODUCTOS                            */}
      {/* ======================================================== */}
      {vistaActiva === 'productos' && (
        <div className="card shadow-sm border-0">
          <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h5 className="fw-bold mb-0 text-dark"><i className="bi bi-tools me-2"></i>Inventario de Productos</h5>
            <div className="d-flex gap-2">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Buscar por código o nombre..."
                value={busquedaProducto}
                onChange={(e) => setBusquedaProducto(e.target.value)}
                style={{ width: '220px' }}
              />
              <Link to="/admin/nuevo" className="btn btn-sm btn-dark fw-bold">
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
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Stock</th>
                    <th>Precio</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productosFiltrados.map((prod) => (
                    <tr key={prod.id}>
                      <td className="fw-bold text-muted">{prod.id}</td>
                      <td>
                        <img src={prod.imagen || 'https://via.placeholder.com/50'} alt={prod.nombre} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                      </td>
                      <td className="fw-bold">{prod.nombre}</td>
                      <td><span className="badge bg-light text-dark border">{prod.categoria}</span></td>
                      <td>
                        <span className={`badge ${prod.stock > 5 ? 'bg-success' : prod.stock > 0 ? 'bg-warning text-dark' : 'bg-danger'}`}>
                          {prod.stock} un.
                        </span>
                      </td>
                      <td className="fw-bold text-danger">${prod.precio.toLocaleString()}</td>
                      <td className="text-center">
                        <div className="btn-group btn-group-sm">
                          <Link to={`/admin/editar/${prod.id}`} className="btn btn-outline-primary"><i className="bi bi-pencil-square"></i></Link>
                          <button className="btn btn-outline-danger" onClick={() => handleEliminarProducto(prod.id)}><i className="bi bi-trash"></i></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VISTA 4: GESTIÓN DE USUARIOS                             */}
      {/* ======================================================== */}
      {vistaActiva === 'usuarios' && (
        <div className="card shadow-sm border-0">
          <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h5 className="fw-bold mb-0 text-dark"><i className="bi bi-people-fill me-2"></i>Cuentas de Usuario</h5>
            <div className="d-flex gap-2">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Buscar usuario o correo..."
                value={busquedaUsuario}
                onChange={(e) => setBusquedaUsuario(e.target.value)}
                style={{ width: '220px' }}
              />
              <Link to="/admin/usuario/nuevo" className="btn btn-sm btn-dark fw-bold">
                <i className="bi bi-person-plus-fill me-1"></i> Nuevo Usuario
              </Link>
            </div>
          </div>

          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosFiltrados.map((usr) => (
                    <tr key={usr.id}>
                      <td className="fw-bold text-muted">{usr.id}</td>
                      <td className="fw-bold">{usr.nombre}</td>
                      <td>{usr.email}</td>
                      <td>
                        <span className={`badge ${usr.rol === 'Administrador' ? 'bg-danger' : usr.rol === 'Vendedor' ? 'bg-success' : 'bg-secondary'}`}>
                          {usr.rol}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${usr.estado === 'Activo' ? 'bg-success' : 'bg-danger'}`}>
                          {usr.estado}
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="btn-group btn-group-sm">
                          <button
                            className={`btn ${usr.estado === 'Activo' ? 'btn-outline-warning' : 'btn-outline-success'}`}
                            onClick={() => handleCambiarEstadoUsuario(usr.id)}
                            title={usr.estado === 'Activo' ? 'Bloquear usuario' : 'Activar usuario'}
                          >
                            <i className={`bi ${usr.estado === 'Activo' ? 'bi-lock-fill' : 'bi-unlock-fill'}`}></i>
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => handleEliminarUsuario(usr.id)}
                            title="Eliminar cuenta"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PanelAdmin;