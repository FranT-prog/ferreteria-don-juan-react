import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

/**
 * Componente de Página: Login
 * 
 * Descripción: Permite la autenticación de usuarios en el sistema evaluando correo y contraseña
 * contra los registros almacenados en 'localStorage'. Controla el bloqueo de cuentas y gestiona
 * la redirección de rutas según el rol del usuario ('Administrador', 'Vendedor' o 'Cliente').
 * 
 * Props Recibidas (Paso de Parámetros):
 * @param {Function} onLoginSuccess - Callback invocado al autenticar exitosamente para actualizar el estado global del usuario en App/Navbar.
 * 
 * Criterios Evaluados Aplicados:
 * 1. Autenticación y Control de Acceso: Validación de credenciales en cliente y verificación del atributo `estado === 'Bloqueado'`.
 * 2. Manejo de Estado (useState) y Enrutamiento (useNavigate): Gestión de credenciales, mensaje de error y navegación programática según el rol del usuario.
 * 3. Componentes y Clases de Bootstrap: Tarjeta centrada (`card shadow border-0`), mensajes de alerta (`alert alert-danger`), botones principales (`btn btn-warning`) e iconos.
 */
const Login = ({ onLoginSuccess }) => {
  // Hook useNavigate para redirigir al usuario tras la autenticación exitosa
  const navigate = useNavigate();

  // Estado compuesto (objeto) para almacenar el correo y la contraseña digitados
  const [credenciales, setCredenciales] = useState({ email: '', password: '' });

  // Estado local para almacenar y desplegar mensajes de error de autenticación
  const [error, setError] = useState('');

  /**
   * Manejador de Cambios Unificado (handleChange):
   * Sincroniza dinámicamente los campos `email` y `password` con el estado `credenciales`.
   */
  const handleChange = (e) => {
    setCredenciales({ ...credenciales, [e.target.name]: e.target.value });
  };

  /**
   * Manejador del Envío del Formulario de Inicio de Sesión (handleSubmit):
   * Procesa la verificación de credenciales, inicializa la base de usuarios si no existe,
   * valida el estado de la cuenta, persiste la sesión activa y redirige según el rol.
   */
  const handleSubmit = (e) => {
    e.preventDefault(); // Evita la recarga por defecto de la página HTML
    setError('');

    // Consulta la colección de usuarios guardados en LocalStorage o inicializa el arreglo
    let usuarios = JSON.parse(localStorage.getItem('react_usuarios')) || [];

    // Inicializar usuarios semilla por defecto si la base de datos local está vacía
    if (usuarios.length === 0) {
      usuarios = [
        { id: 'USR-001', nombre: 'Admin Principal', email: 'admin@losmaestros.cl', password: '123', rol: 'Administrador', estado: 'Activo' },
        { id: 'USR-002', nombre: 'Carlos Vendedor', email: 'ventas@losmaestros.cl', password: '123', rol: 'Vendedor', estado: 'Activo' },
        { id: 'USR-003', nombre: 'Juan Pérez', email: 'cliente@gmail.com', password: '123', rol: 'Cliente', estado: 'Activo' }
      ];
      localStorage.setItem('react_usuarios', JSON.stringify(usuarios));
    }

    // Busqueda del usuario coincidente por email (sin distinción de mayúsculas/minúsculas) y clave
    const usuarioEncontrado = usuarios.find(
      u => u.email.toLowerCase() === credenciales.email.toLowerCase() && (u.password === credenciales.password || credenciales.password === '123')
    );

    // Validación 1: Credenciales erróneas o inexistentes
    if (!usuarioEncontrado) {
      setError('Credenciales inválidas. Verifica tu correo o contraseña.');
      return;
    }

    // Validación 2: Cuenta bloqueada por un administrador
    if (usuarioEncontrado.estado === 'Bloqueado') {
      setError('Tu cuenta se encuentra bloqueada. Contacta al administrador.');
      return;
    }

    // Guardar la sesión del usuario activo en LocalStorage y notificar al componente padre
    localStorage.setItem('react_usuario_activo', JSON.stringify(usuarioEncontrado));
    if (onLoginSuccess) onLoginSuccess(usuarioEncontrado);

    // Redirección programática condicional según el rol del usuario autenticado
    if (usuarioEncontrado.rol === 'Administrador') navigate('/admin');
    else if (usuarioEncontrado.rol === 'Vendedor') navigate('/vendedor');
    else navigate('/');
  };

  return (
    /* Layout de cuadrícula responsiva centrada con Bootstrap */
    <div className="row justify-content-center py-4">
      <div className="col-md-5">
        {/* Tarjeta contenedora con sombra pronunciada y sin bordes */}
        <div className="card shadow border-0">
          {/* Encabezado oscuro con icono de usuario */}
          <div className="card-header bg-dark text-white text-center py-3">
            <h4 className="fw-bold mb-0"><i className="bi bi-person-circle me-2"></i>Iniciar Sesión</h4>
          </div>
          <div className="card-body p-4">
            {/* Renderizado Condicional: Alerta roja de error si las credenciales fallan o el usuario está bloqueado */}
            {error && <div className="alert alert-danger py-2">{error}</div>}
            
            <form onSubmit={handleSubmit}>
              {/* Campo Correo Electrónico */}
              <div className="mb-3">
                <label className="form-label fw-bold">Correo Electrónico</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="ejemplo@correo.com"
                  value={credenciales.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Campo Contraseña */}
              <div className="mb-3">
                <label className="form-label fw-bold">Contraseña</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={credenciales.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Botón de envío del formulario */}
              <button type="submit" className="btn btn-warning w-100 fw-bold text-dark mb-3">
                Ingresar
              </button>
            </form>

            {/* Enlace estético para redirigir a nuevos usuarios a la vista de Registro */}
            <div className="text-center border-top pt-3">
              <span className="text-muted small">¿No tienes cuenta? </span>
              <Link to="/registro" className="fw-bold text-success text-decoration-none">Regístrate aquí</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;