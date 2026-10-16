import React, { useState, useEffect } from 'react';

/**
 * Componente de Página / Submódulo: PerfilUsuario
 * 
 * Descripción: Permite visualizar y editar la información del usuario autenticado (nombre completo,
 * correo electrónico y cambio de clave), además de presentar su ficha lateral con la insignia de rol.
 * 
 * Props Recibidas:
 * @param {Object} usuarioActivo - Objeto con los datos del usuario logueado enviado desde App.jsx o contenedores superiores.
 * 
 * Criterios Evaluados Aplicados:
 * 1. Comunicación de Componentes mediante Props: Consumo prioritario de la prop `usuarioActivo` con fallback de seguridad a `localStorage`.
 * 2. Manejo de Estado (useState) y Efectos de Sincronización (useEffect): Mantiene la sincronización del perfil cuando cambia la prop de usuario.
 * 3. Diseño Responsivo y Badges Dinámicos con Bootstrap: Uso de grillas de 2 columnas (`col-12 col-lg-4` y `col-lg-8`), badges redondos (`rounded-pill`) con colores condicionales según el rol (`bg-danger`, `bg-success`, `bg-primary`).
 */
// Ahora recibimos "usuarioActivo" como parámetro (prop)
const PerfilUsuario = ({ usuarioActivo }) => {
  // Estado local para almacenar la información del usuario en edición
  const [usuarioData, setUsuarioData] = useState({
    nombre: 'Cargando...',
    email: '',
    rol: 'Cliente'
  });

  /**
   * Hook useEffect: Se dispara al cargar el componente o cuando la prop `usuarioActivo` cambia.
   * Aplica un patrón de respaldo (fallback): primero usa la prop; si no existe, busca en LocalStorage.
   */
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

  /**
   * Manejador del Envío del Formulario (handleGuardarCambios):
   * Simula la actualización de datos del perfil y muestra alerta de confirmación.
   */
  const handleGuardarCambios = (e) => {
    e.preventDefault();
    alert('¡Perfil actualizado con éxito! (Modo Simulación)');
  };

  /**
   * Manejador de Cambios en los Inputs (handleChange):
   * Actualiza dinámicamente las propiedades del objeto `usuarioData` preservando los demás atributos.
   */
  const handleChange = (e) => {
    setUsuarioData({ ...usuarioData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container py-4">
      <div className="row g-4">
        {/* Tarjeta Lateral de Información del Usuario */}
        <div className="col-12 col-lg-4">
          <div className="card shadow-sm border-0 text-center pt-5 pb-4 h-100">
            {/* Avatar genérico del usuario con Bootstrap Icons */}
            <div className="mb-3">
              <i className="bi bi-person-circle text-secondary" style={{ fontSize: '5rem' }}></i>
            </div>
            <div className="card-body">
              <h4 className="fw-bold mb-1">{usuarioData.nombre}</h4>
              <p className="text-muted mb-3">{usuarioData.email}</p>
              
              {/* Badge Dinámico: Cambia de color según el rol ('Administrador' -> rojo, 'Vendedor' -> verde, otros -> azul) */}
              <span className={`badge px-3 py-2 fs-6 rounded-pill ${
                usuarioData.rol === 'Administrador' ? 'bg-danger' : 
                usuarioData.rol === 'Vendedor' ? 'bg-success' : 'bg-primary'
              }`}>
                {usuarioData.rol || 'Cliente'}
              </span>
            </div>
          </div>
        </div>

        {/* Formulario de Edición de Perfil y Seguridad */}
        <div className="col-12 col-lg-8">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-dark text-white py-3">
              <h5 className="mb-0 fw-bold"><i className="bi bi-gear-fill me-2"></i>Mi Perfil</h5>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleGuardarCambios}>
                <h6 className="fw-bold text-muted text-uppercase mb-3">Información Personal</h6>
                <div className="row mb-3">
                  {/* Campo Nombre Completo */}
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
                  {/* Campo Correo Electrónico (Modo Lectura / ReadOnly) */}
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

                {/* Sección de Seguridad: Campos de cambio de contraseña */}
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

                {/* Botón de Guardar Cambios */}
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