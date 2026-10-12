import React, { useState, useEffect } from 'react';

const PerfilAdmin = () => {
  const [adminData, setAdminData] = useState({
    nombre: 'Admin Principal',
    email: 'admin@losmaestros.cl',
    rol: 'Administrador'
  });

  useEffect(() => {
    // Si tienes un usuario guardado al iniciar sesión, lo leemos aquí
    const usuarioLogueado = JSON.parse(localStorage.getItem('react_usuario_logueado'));
    if (usuarioLogueado) {
      setAdminData(usuarioLogueado);
    }
  }, []);

  const handleGuardarCambios = (e) => {
    e.preventDefault();
    alert('¡Datos actualizados correctamente! (Modo Simulación)');
  };

  return (
    <div className="w-100">
      <div className="row g-4">
        
        {/* COLUMNA IZQUIERDA: TARJETA DE RESUMEN */}
        <div className="col-12 col-lg-4">
          <div className="card shadow-sm border-0 text-center pt-5 pb-4 h-100">
            <div className="mb-3">
              <i className="bi bi-person-circle text-secondary" style={{ fontSize: '6rem' }}></i>
            </div>
            <div className="card-body">
              <h3 className="fw-bold mb-1">{adminData.nombre}</h3>
              <p className="text-muted mb-3">{adminData.email}</p>
              <span className="badge bg-danger px-3 py-2 fs-6 rounded-pill">{adminData.rol}</span>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: FORMULARIOS DE EDICIÓN */}
        <div className="col-12 col-lg-8">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-dark text-white py-3">
              <h5 className="mb-0 fw-bold"><i className="bi bi-gear-fill me-2"></i>Configuración de la Cuenta</h5>
            </div>
            <div className="card-body p-4 p-md-5">
              <form onSubmit={handleGuardarCambios}>
                
                <h6 className="fw-bold text-muted text-uppercase mb-3">Información Personal</h6>
                <div className="row mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-bold small">Nombre Completo</label>
                    <input type="text" className="form-control" defaultValue={adminData.nombre} required />
                  </div>
                  <div className="col-md-6 mt-3 mt-md-0">
                    <label className="form-label fw-bold small">Correo Electrónico</label>
                    <input type="email" className="form-control bg-light" defaultValue={adminData.email} readOnly title="El correo no se puede modificar" />
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

                <div className="text-end mt-5">
                  <button type="submit" className="btn btn-primary fw-bold px-4 py-2">
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

export default PerfilAdmin;