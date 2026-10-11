import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const PanelAdmin = () => {
  const [vistaActiva, setVistaActiva] = useState('reportes'); // 'reportes' | 'usuarios' | 'productos'
  const [usuarios, setUsuarios] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    // 1. Cargar Usuarios
    let usuariosGuardados = JSON.parse(localStorage.getItem('react_usuarios'));
    if (!usuariosGuardados || usuariosGuardados.length === 0) {
      usuariosGuardados = [
        { id: 'USR-001', nombre: 'Admin Principal', email: 'admin@losmaestros.cl', rol: 'Administrador', estado: 'Activo' },
        { id: 'USR-002', nombre: 'Carlos Vendedor', email: 'ventas@losmaestros.cl', rol: 'Vendedor', estado: 'Activo' },
        { id: 'USR-003', nombre: 'Juan Pérez', email: 'juan.perez@example.com', rol: 'Cliente', estado: 'Activo' },
        { id: 'USR-004', nombre: 'Usuario Suspendido', email: 'spam@correo.com', rol: 'Cliente', estado: 'Bloqueado' }
      ];
      localStorage.setItem('react_usuarios', JSON.stringify(usuariosGuardados));
    }
    setUsuarios(usuariosGuardados);

    // 2. Cargar Pedidos 
    const pedidosGuardados = JSON.parse(localStorage.getItem('react_pedidos')) || [];
    setPedidos(pedidosGuardados);

    // 3. Cargar Productos 
    const productosGuardados = JSON.parse(localStorage.getItem('react_productos')) || [];
    setProductos(productosGuardados);
  }, []);

  // --- Funciones de Usuarios ---
  const cambiarEstadoUsuario = (id) => {
    const usuariosActualizados = usuarios.map(user => {
      if (user.id === id) {
        return { ...user, estado: user.estado === 'Activo' ? 'Bloqueado' : 'Activo' };
      }
      return user;
    });
    setUsuarios(usuariosActualizados);
    localStorage.setItem('react_usuarios', JSON.stringify(usuariosActualizados));
  };

  const eliminarUsuario = (id) => {
    if (window.confirm('¿Eliminar este usuario de forma permanente?')) {
      const usuariosActualizados = usuarios.filter(u => u.id !== id);
      setUsuarios(usuariosActualizados);
      localStorage.setItem('react_usuarios', JSON.stringify(usuariosActualizados));
    }
  };

  // --- Funciones de Productos ---
  const eliminarProducto = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto del catálogo?')) {
      const productosActualizados = productos.filter(p => p.id !== id);
      setProductos(productosActualizados);
      localStorage.setItem('react_productos', JSON.stringify(productosActualizados));
    }
  };

  // --- Cálculos para Reportes ---
  const ingresosTotales = pedidos.filter(p => p.estado !== 'Cancelado').reduce((acc, p) => acc + p.total, 0);
  const totalPedidos = pedidos.length;
  const pedidosCompletados = pedidos.filter(p => p.estado === 'Entregado').length;
  const ticketPromedio = totalPedidos > 0 ? (ingresosTotales / totalPedidos) : 0;

  return (
    <div className="container-fluid px-0">
      <div className="bg-dark text-white p-4 rounded-3 shadow-sm mb-4">
        <h2 className="fw-bold mb-1"><i className="bi bi-shield-lock me-2"></i>Panel de Administración</h2>
        <p className="mb-0 text-white-50">Gestión global de la plataforma, usuarios, catálogo y analítica de ventas.</p>
      </div>

      {/* Pestañas de Navegación */}
      <ul className="nav nav-tabs nav-fill mb-4 border-bottom border-2">
        <li className="nav-item">
          <button className={`nav-link fw-bold fs-5 py-3 ${vistaActiva === 'reportes' ? 'active text-dark border-dark border-bottom-0' : 'text-secondary'}`} onClick={() => setVistaActiva('reportes')}>
            <i className="bi bi-graph-up-arrow me-2"></i>Reportes
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link fw-bold fs-5 py-3 ${vistaActiva === 'usuarios' ? 'active text-dark border-dark border-bottom-0' : 'text-secondary'}`} onClick={() => setVistaActiva('usuarios')}>
            <i className="bi bi-people me-2"></i>Usuarios
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link fw-bold fs-5 py-3 ${vistaActiva === 'productos' ? 'active text-dark border-dark border-bottom-0' : 'text-secondary'}`} onClick={() => setVistaActiva('productos')}>
            <i className="bi bi-tools me-2"></i>Productos
          </button>
        </li>
      </ul>

      {/* VISTA 1: REPORTES */}
      {vistaActiva === 'reportes' && (
        <div className="animate__animated animate__fadeIn">
          <div className="row mb-4">
            <div className="col-md-3">
              <div className="card border-0 shadow-sm bg-success text-white">
                <div className="card-body">
                  <h6 className="text-uppercase fw-bold opacity-75">Ingresos Totales</h6>
                  <h2 className="fw-bold mb-0">${ingresosTotales.toLocaleString()}</h2>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm bg-primary text-white">
                <div className="card-body">
                  <h6 className="text-uppercase fw-bold opacity-75">Total Pedidos</h6>
                  <h2 className="fw-bold mb-0">{totalPedidos}</h2>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm bg-info text-white">
                <div className="card-body">
                  <h6 className="text-uppercase fw-bold opacity-75">Entregas Exitosas</h6>
                  <h2 className="fw-bold mb-0">{pedidosCompletados}</h2>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm bg-warning text-dark">
                <div className="card-body">
                  <h6 className="text-uppercase fw-bold opacity-75">Ticket Promedio</h6>
                  <h2 className="fw-bold mb-0">${Math.round(ticketPromedio).toLocaleString()}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VISTA 2: USUARIOS */}
      {vistaActiva === 'usuarios' && (
        <div className="card shadow-sm border-0 animate__animated animate__fadeIn">
          <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
            <h5 className="fw-bold mb-0"><i className="bi bi-person-lines-fill me-2"></i>Directorio de Usuarios</h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>ID Usuario</th>
                    <th>Nombre y Apellido</th>
                    <th>Correo Electrónico</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map(user => (
                    <tr key={user.id}>
                      <td className="text-muted fw-bold">{user.id}</td>
                      <td className="fw-bold">{user.nombre}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`badge ${user.rol === 'Administrador' ? 'bg-danger' : user.rol === 'Vendedor' ? 'bg-primary' : 'bg-secondary'}`}>
                          {user.rol}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${user.estado === 'Activo' ? 'bg-success' : 'bg-warning text-dark'}`}>
                          {user.estado}
                        </span>
                      </td>
                      <td className="text-center">
                        <button 
                          className={`btn btn-sm me-2 ${user.estado === 'Activo' ? 'btn-outline-warning' : 'btn-outline-success'}`}
                          onClick={() => cambiarEstadoUsuario(user.id)}
                          disabled={user.rol === 'Administrador'}
                        >
                          <i className={`bi ${user.estado === 'Activo' ? 'bi-lock-fill' : 'bi-unlock-fill'}`}></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => eliminarUsuario(user.id)} disabled={user.rol === 'Administrador'}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VISTA 3: PRODUCTOS */}
      {vistaActiva === 'productos' && (
        <div className="card shadow-sm border-0 animate__animated animate__fadeIn">
          <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
            <h5 className="fw-bold mb-0 text-dark">
              <i className="bi bi-boxes me-2"></i>Catálogo General
            </h5>
            <Link to="/admin/nuevo" className="btn btn-sm btn-dark fw-bold">
              <i className="bi bi-plus-lg me-1"></i> Nuevo Producto
            </Link>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>Código</th>
                    <th>Producto</th>
                    <th>Stock</th>
                    <th>Precio</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map(prod => (
                    <tr key={prod.id}>
                      <td className="text-muted fw-bold">{prod.id}</td>
                      <td className="fw-bold">{prod.nombre}</td>
                      <td>
                        <span className={`badge ${prod.stock > 0 ? 'bg-success' : 'bg-danger'}`}>{prod.stock} un.</span>
                      </td>
                      <td className="fw-bold text-danger">${prod.precio.toLocaleString()}</td>
                      <td className="text-center">
                        <Link to={`/admin/editar/${prod.id}`} className="btn btn-sm btn-outline-primary me-2">
                          <i className="bi bi-pencil-square"></i>
                        </Link>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => eliminarProducto(prod.id)}>
                          <i className="bi bi-trash"></i>
                        </button>
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