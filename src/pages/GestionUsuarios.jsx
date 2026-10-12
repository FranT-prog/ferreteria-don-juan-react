import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  
  // Vistas y filtros
  const [vistaActual, setVistaActual] = useState('lista'); 
  const [usuarioActivo, setUsuarioActivo] = useState(null);
  const [comprasUsuario, setComprasUsuario] = useState([]);
  const [busquedaUsuario, setBusquedaUsuario] = useState('');

  useEffect(() => {
    // Cargar usuarios
    const usersGuardados = JSON.parse(localStorage.getItem('react_usuarios')) || [];
    setUsuarios(usersGuardados);
    
    // Cargar pedidos para el historial
    const pedidosGuardados = JSON.parse(localStorage.getItem('react_pedidos')) || [];
    setPedidos(pedidosGuardados);
  }, []);

  // Filtrado para el buscador
  const usuariosFiltrados = usuarios.filter(usr => 
    usr.nombre?.toLowerCase().includes(busquedaUsuario.toLowerCase()) || 
    usr.email?.toLowerCase().includes(busquedaUsuario.toLowerCase())
  );

  // --- FUNCIONES PARA EDITAR ---
  const abrirEdicion = (user) => {
    setUsuarioActivo({ ...user });
    setVistaActual('editar');
  };

  const manejarCambioEdicion = (e) => {
    setUsuarioActivo({ ...usuarioActivo, [e.target.name]: e.target.value });
  };

  const guardarEdicion = (e) => {
    e.preventDefault();
    const actualizados = usuarios.map(u => 
      (u.id === usuarioActivo.id || u.email === usuarioActivo.email) ? usuarioActivo : u
    );
    setUsuarios(actualizados);
    localStorage.setItem('react_usuarios', JSON.stringify(actualizados));
    alert('Usuario actualizado con éxito');
    setVistaActual('lista');
  };

  // --- FUNCIONES PARA HISTORIAL ---
  const verHistorial = (user) => {
    setUsuarioActivo(user);
    const compras = pedidos.filter(p => p.email === user.email);
    setComprasUsuario(compras);
    setVistaActual('historial');
  };

  // --- FUNCIONES ORIGINALES DE TU DISEÑO (Bloquear/Eliminar) ---
  const handleCambiarEstadoUsuario = (identificador) => {
    const actualizados = usuarios.map(u => {
      if (u.id === identificador || u.email === identificador) {
        return { ...u, estado: u.estado === 'Activo' ? 'Bloqueado' : 'Activo' };
      }
      return u;
    });
    setUsuarios(actualizados);
    localStorage.setItem('react_usuarios', JSON.stringify(actualizados));
  };

  const handleEliminarUsuario = (identificador) => {
    if (window.confirm('¿Estás seguro de eliminar a este usuario?')) {
      const filtrados = usuarios.filter(u => u.id !== identificador && u.email !== identificador);
      setUsuarios(filtrados);
      localStorage.setItem('react_usuarios', JSON.stringify(filtrados));
    }
  };

  return (
    <div className="w-100">
      {/* VISTA 1: TU DISEÑO ORIGINAL MEJORADO */}
      {vistaActual === 'lista' && (
        <div className="card shadow-sm border-0">
          <div className="card-header bg-dark text-white py-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h5 className="fw-bold mb-0"><i className="bi bi-people-fill me-2"></i>Cuentas de Usuario</h5>
            <div className="d-flex gap-2">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Buscar usuario o correo..."
                value={busquedaUsuario}
                onChange={(e) => setBusquedaUsuario(e.target.value)}
                style={{ width: '220px' }}
              />
              <Link to="/admin/usuario/nuevo" className="btn btn-sm btn-light fw-bold">
                <i className="bi bi-person-plus-fill me-1"></i> Nuevo
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
                  {usuariosFiltrados.length === 0 ? (
                    <tr><td colSpan="6" className="text-center py-4">No se encontraron usuarios</td></tr>
                  ) : (
                    usuariosFiltrados.map((usr) => (
                      <tr key={usr.id || usr.email}>
                        <td className="fw-bold text-muted">{usr.id || '-'}</td>
                        <td className="fw-bold">{usr.nombre}</td>
                        <td>{usr.email}</td>
                        <td>
                          <span className={`badge ${usr.rol === 'Administrador' ? 'bg-danger' : usr.rol === 'Vendedor' ? 'bg-success' : 'bg-secondary'}`}>
                            {usr.rol || 'Cliente'}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${usr.estado === 'Activo' ? 'bg-success' : 'bg-danger'}`}>
                            {usr.estado || 'Activo'}
                          </span>
                        </td>
                        <td className="text-center">
                          <div className="btn-group btn-group-sm">
                            <button className="btn btn-outline-info" onClick={() => verHistorial(usr)} title="Ver Historial">
                              <i className="bi bi-clock-history"></i>
                            </button>
                            <button className="btn btn-outline-primary" onClick={() => abrirEdicion(usr)} title="Editar">
                              <i className="bi bi-pencil-square"></i>
                            </button>
                            <button
                              className={`btn ${usr.estado === 'Activo' ? 'btn-outline-warning' : 'btn-outline-success'}`}
                              onClick={() => handleCambiarEstadoUsuario(usr.id || usr.email)}
                              title={usr.estado === 'Activo' ? 'Bloquear usuario' : 'Activar usuario'}
                            >
                              <i className={`bi ${usr.estado === 'Activo' ? 'bi-lock-fill' : 'bi-unlock-fill'}`}></i>
                            </button>
                            <button className="btn btn-outline-danger" onClick={() => handleEliminarUsuario(usr.id || usr.email)} title="Eliminar cuenta">
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

      {/* VISTA 2: EDITAR USUARIO */}
      {vistaActual === 'editar' && usuarioActivo && (
        <div className="card shadow-sm border-0 bg-light mx-auto" style={{ maxWidth: '600px' }}>
          <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center py-3">
             <h5 className="mb-0 fw-bold">Editar Usuario</h5>
             <button className="btn btn-sm btn-outline-light" onClick={() => setVistaActual('lista')}>Volver</button>
          </div>
          <div className="card-body p-4">
            <form onSubmit={guardarEdicion}>
              <div className="mb-3">
                <label className="form-label text-muted small fw-bold">Nombre Completo</label>
                <input type="text" className="form-control" name="nombre" value={usuarioActivo.nombre} onChange={manejarCambioEdicion} required />
              </div>
              <div className="mb-3">
                <label className="form-label text-muted small fw-bold">Correo Electrónico</label>
                <input type="email" className="form-control text-muted" name="email" value={usuarioActivo.email} readOnly />
              </div>
              <div className="mb-4">
                <label className="form-label text-muted small fw-bold">Rol del Usuario</label>
                <select className="form-select" name="rol" value={usuarioActivo.rol || 'Cliente'} onChange={manejarCambioEdicion}>
                  <option value="Cliente">Cliente</option>
                  <option value="Vendedor">Vendedor</option>
                  <option value="Administrador">Administrador</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary w-100 fw-bold">Guardar Cambios</button>
            </form>
          </div>
        </div>
      )}

      {/* VISTA 3: HISTORIAL DE COMPRAS */}
      {vistaActual === 'historial' && usuarioActivo && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
             <h4 className="fw-bold">Historial de {usuarioActivo.nombre}</h4>
             <button className="btn btn-sm btn-dark" onClick={() => setVistaActual('lista')}>
               <i className="bi bi-arrow-left me-1"></i>Volver a la lista
             </button>
          </div>
          <div className="alert alert-secondary small">
            Email: <strong>{usuarioActivo.email}</strong>
          </div>

          {comprasUsuario.length === 0 ? (
            <div className="text-center py-5 bg-light rounded border">
              <i className="bi bi-bag-x text-muted" style={{ fontSize: '3rem' }}></i>
              <p className="text-muted mt-3">Este usuario no tiene compras registradas.</p>
            </div>
          ) : (
            <div className="row g-3">
              {comprasUsuario.map((compra, index) => (
                <div className="col-md-6" key={index}>
                  <div className="card shadow-sm border-0 h-100">
                    <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                      <span className="small fw-bold">Orden #{compra.id || index + 1000}</span>
                      <span className={`badge ${compra.estado === 'Entregado' ? 'bg-success' : 'bg-warning text-dark'}`}>
                        {compra.estado || 'Pendiente'}
                      </span>
                    </div>
                    <div className="card-body">
                      <p className="small text-muted mb-2"><i className="bi bi-geo-alt me-1"></i> {compra.direccion}</p>
                      <hr className="my-2"/>
                      <ul className="list-unstyled mb-3 small">
                        {compra.items && compra.items.map((item, i) => (
                          <li key={i} className="d-flex justify-content-between mb-1">
                            <span>{item.cantidad}x {item.nombre}</span>
                            <span className="text-muted">${(item.precio * item.cantidad).toLocaleString()}</span>
                          </li>
                        ))}
                      </ul>
                      <h6 className="fw-bold d-flex justify-content-between text-danger mb-0">
                        Total Pagado: <span>${compra.total.toLocaleString()}</span>
                      </h6>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GestionUsuarios;