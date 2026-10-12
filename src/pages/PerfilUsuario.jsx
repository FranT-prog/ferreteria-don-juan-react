import React, { useState, useEffect } from 'react';

// Ahora recibimos "usuarioActivo" como parámetro (prop)
const PerfilUsuario = ({ usuarioActivo }) => {
  const [usuarioData, setUsuarioData] = useState({
    nombre: 'Cargando...',
    email: '',
    rol: 'Cliente'
  });

  useEffect(() => {
    // 1. Priorizamos el usuario que nos envía App.jsx
    if (usuarioActivo) {
      setUsuarioData(usuarioActivo);
    } else {
      // 2. Si no llega, buscamos en localStorage (buscamos varias llaves posibles por seguridad)
      const guardado = JSON.parse(localStorage.getItem('usuarioActivo')) 
                    || JSON.parse(localStorage.getItem('react_usuario_logueado'));
      if (guardado) {
        setUsuarioData(guardado);
      } else {
        setUsuarioData({ nombre: 'Usuario', email: 'usuario@ejemplo.com', rol: 'Cliente' });
      }
    }
  }, [usuarioActivo]);

  const handleGuardarCambios = (e) => {
    e.preventDefault();
    alert('¡Perfil actualizado con éxito! (Modo Simulación)');
  };

  const handleChange = (e) => {
    setUsuarioData({ ...usuarioData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container py-4">
      <div className="row g-4">
        {/* Tarjeta Lateral de Información */}
        <div className="col-12 col-lg-4">
          <div className="card shadow-sm border-0 text-center pt-5 pb-4 h-100">
            <div className="mb-3">
              <i className="bi bi-person-circle text-secondary" style={{ fontSize: '5rem' }}></i>
            </div>
            <div className="card-body">
              <h4 className="fw-bold mb-1">{usuarioData.nombre}</h4>
              <p className="text-muted mb-3">{usuarioData.email}</p>
              <span className={`badge px-3 py-2 fs-6 rounded-pill ${
                usuarioData.rol === 'Administrador' ? 'bg-danger' : 
                usuarioData.rol === 'Vendedor' ? 'bg-success' : 'bg-primary'
              }`}>
                {usuarioData.rol || 'Cliente'}
              </span>
            </div>
          </div>
        </div>

        {/* Formulario de Edición */}
        <div className="col-12 col-lg-8">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-dark text-white py-3">
              <h5 className="mb-0 fw-bold"><i className="bi bi-gear-fill me-2"></i>Mi Perfil</h5>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleGuardarCambios}>
                <h6 className="fw-bold text-muted text-uppercase mb-3">Información Personal</h6>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold small">Nombre Completo</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="nombre" 
                      value={usuarioData.nombre} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                  <div className="col-md-6 mt-3 mt-md-0">
                    <label className="form-label fw-bold small">Correo Electrónico</label>
                    <input 
                      type="email" 
                      className="form-control bg-light" 
                      value={usuarioData.email} 
                      readOnly 
                      title="El correo no se puede modificar" 
                    />
                  </div>
                </div>

                <hr className="my-4 text-muted" />

                <h6 className="fw-bold text-muted text-uppercase mb-3">Seguridad</h6>
                <div className="row mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-bold small">Nueva Contraseña</label>
                    <input type="password" className="form-control" placeholder="••••••••" />
                  </div>
                  <div className="col-md-6 mt-3 mt-md-0">
                    <label className="form-label fw-bold small">Confirmar Contraseña</label>
                    <input type="password" className="form-control" placeholder="••••••••" />
                  </div>
                </div>

                <div className="text-end">
                  <button type="submit" className="btn btn-success fw-bold px-4">
                    <i className="bi bi-save me-2"></i>Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilUsuario;