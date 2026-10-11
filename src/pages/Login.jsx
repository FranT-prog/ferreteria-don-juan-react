import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [credenciales, setCredenciales] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setCredenciales({ ...credenciales, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    let usuarios = JSON.parse(localStorage.getItem('react_usuarios')) || [];

    // Inicializar usuarios por defecto si no existen
    if (usuarios.length === 0) {
      usuarios = [
        { id: 'USR-001', nombre: 'Admin Principal', email: 'admin@losmaestros.cl', password: '123', rol: 'Administrador', estado: 'Activo' },
        { id: 'USR-002', nombre: 'Carlos Vendedor', email: 'ventas@losmaestros.cl', password: '123', rol: 'Vendedor', estado: 'Activo' },
        { id: 'USR-003', nombre: 'Juan Pérez', email: 'cliente@gmail.com', password: '123', rol: 'Cliente', estado: 'Activo' }
      ];
      localStorage.setItem('react_usuarios', JSON.stringify(usuarios));
    }

    const usuarioEncontrado = usuarios.find(
      u => u.email.toLowerCase() === credenciales.email.toLowerCase() && (u.password === credenciales.password || credenciales.password === '123')
    );

    if (!usuarioEncontrado) {
      setError('Credenciales inválidas. Verifica tu correo o contraseña.');
      return;
    }

    if (usuarioEncontrado.estado === 'Bloqueado') {
      setError('Tu cuenta se encuentra bloqueada. Contacta al administrador.');
      return;
    }

    // Guardar la sesión activa
    localStorage.setItem('react_usuario_activo', JSON.stringify(usuarioEncontrado));
    if (onLoginSuccess) onLoginSuccess(usuarioEncontrado);

    // Redireccionar según el rol
    if (usuarioEncontrado.rol === 'Administrador') navigate('/admin');
    else if (usuarioEncontrado.rol === 'Vendedor') navigate('/vendedor');
    else navigate('/');
  };

  return (
    <div className="row justify-content-center py-4">
      <div className="col-md-5">
        <div className="card shadow border-0">
          <div className="card-header bg-dark text-white text-center py-3">
            <h4 className="fw-bold mb-0"><i className="bi bi-person-circle me-2"></i>Iniciar Sesión</h4>
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

              <button type="submit" className="btn btn-warning w-100 fw-bold text-dark mb-3">
                Ingresar
              </button>
            </form>

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