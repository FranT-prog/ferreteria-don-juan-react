import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Registro = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ nombre: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    const usuariosGuardados = JSON.parse(localStorage.getItem('react_usuarios')) || [];

    if (usuariosGuardados.some(u => u.email.toLowerCase() === formData.email.toLowerCase())) {
      setError('El correo electrónico ya está registrado.');
      return;
    }

    const nuevoUsuario = {
      id: `USR-${String(usuariosGuardados.length + 1).padStart(3, '0')}`,
      nombre: formData.nombre,
      email: formData.email,
      password: formData.password,
      rol: 'Cliente',
      estado: 'Activo'
    };

    usuariosGuardados.push(nuevoUsuario);
    localStorage.setItem('react_usuarios', JSON.stringify(usuariosGuardados));
    alert('Registro exitoso. Ahora puedes iniciar sesión.');
    navigate('/login');
  };

  return (
    <div className="row justify-content-center py-4">
      <div className="col-md-6">
        <div className="card shadow border-0">
          <div className="card-header bg-success text-white text-center py-3">
            <h4 className="fw-bold mb-0"><i className="bi bi-person-plus-fill me-2"></i>Crear Cuenta Nueva</h4>
          </div>
          <div className="card-body p-4">
            {error && <div className="alert alert-danger py-2">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-bold">Nombre Completo</label>
                <input
                  type="text"
                  name="nombre"
                  className="form-control"
                  placeholder="Juan Pérez"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Correo Electrónico</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="juan.perez@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-bold">Contraseña</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Confirmar Contraseña</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-control"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-success w-100 fw-bold mb-3">
                Registrarse
              </button>
            </form>

            <div className="text-center border-top pt-3">
              <span className="text-muted small">¿Ya tienes cuenta? </span>
              <Link to="/login" className="fw-bold text-dark text-decoration-none">Inicia sesión aquí</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registro;