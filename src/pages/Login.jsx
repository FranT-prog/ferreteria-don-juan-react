import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import UsuarioService from '../services/UsuarioService';

/**
 * Componente de Página: Login
 *
 * Descripción: Autentica usuarios contra Spring Boot (/api/v1/usuarios/login),
 * almacena los tokens JWT (Access + Refresh) y el usuario activo en localStorage,
 * y redirige según el rol ('Administrador', 'Vendedor' o 'Cliente').
 */
const Login = ({ onLoginSuccess }) => {
  const navigate = useNavigate();

  const [credenciales, setCredenciales] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    setCredenciales({ ...credenciales, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      const { data } = await UsuarioService.login(
        credenciales.email.trim().toLowerCase(),
        credenciales.password
      );

      const usuarioEncontrado = data.usuario;

      if (usuarioEncontrado.activo === false || usuarioEncontrado.estado === 'Bloqueado') {
        setError('Tu cuenta se encuentra bloqueada o desactivada. Contacta al administrador.');
        return;
      }

      // Persiste tokens JWT y sesión activa en LocalStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('react_usuario_activo', JSON.stringify(usuarioEncontrado));

      if (onLoginSuccess) onLoginSuccess(usuarioEncontrado);

      const rol = usuarioEncontrado.rol?.toLowerCase();
      if (rol === 'administrador' || rol === 'admin') {
        navigate('/admin');
      } else if (rol === 'vendedor') {
        navigate('/vendedor');
      } else {
        navigate('/');
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError(err.response.data?.mensaje || 'Credenciales inválidas. Verifica tu correo o contraseña.');
      } else {
        setError('No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.');
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="row justify-content-center py-4">
      <div className="col-md-5">
        <div className="card shadow border-0">
          <div className="card-header bg-dark text-white text-center py-3">
            <h4 className="fw-bold mb-0">
              <i className="bi bi-person-circle me-2"></i>Iniciar Sesión
            </h4>
          </div>
          <div className="card-body p-4">
            {error && <div className="alert alert-danger py-2">{error}</div>}

            <form onSubmit={handleSubmit}>
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

              <button
                type="submit"
                className="btn btn-warning w-100 fw-bold text-dark mb-3"
                disabled={cargando}
              >
                {cargando ? 'Ingresando...' : 'Ingresar'}
              </button>
            </form>

            <div className="text-center border-top pt-3">
              <span className="text-muted small">¿No tienes cuenta? </span>
              <Link to="/registro" className="fw-bold text-success text-decoration-none">
                Regístrate aquí
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;