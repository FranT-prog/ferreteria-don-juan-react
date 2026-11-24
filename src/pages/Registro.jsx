import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import UsuarioService from '../services/UsuarioService';

/**
 * Componente de Página: Registro
 *
 * Descripción: Crea una nueva cuenta de Cliente en Spring Boot (/api/v1/usuarios/registro)
 * y realiza login automático para obtener sus tokens JWT y mantener la sesión activa.
 */
const Registro = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmarPassword: ''
  });

  const [errores, setErrores] = useState({});
  const [registrando, setRegistrando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errores[name]) {
      setErrores({ ...errores, [name]: '' });
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    const regexSoloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre completo es obligatorio.';
    } else if (!regexSoloLetras.test(formData.nombre.trim())) {
      nuevosErrores.nombre = 'El nombre no puede contener números ni caracteres especiales.';
    }

    const regexEmailDominio = /^[a-zA-Z0-9._%+-]+@(gmail\.com|losmaestros\.cl)$/i;
    if (!formData.email.trim()) {
      nuevosErrores.email = 'El correo electrónico es obligatorio.';
    } else if (!regexEmailDominio.test(formData.email.trim())) {
      nuevosErrores.email = 'El correo debe terminar en @gmail.com o @losmaestros.cl.';
    }

    if (!formData.password) {
      nuevosErrores.password = 'La contraseña es obligatoria.';
    } else if (formData.password.length < 3) {
      nuevosErrores.password = 'La contraseña debe tener al menos 3 caracteres.';
    }

    if (formData.password !== formData.confirmarPassword) {
      nuevosErrores.confirmarPassword = 'Las contraseñas no coinciden.';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    const emailNormalizado = formData.email.trim().toLowerCase();

    try {
      setRegistrando(true);

      // 1. Registrar usuario en Spring Boot (H2)
      await UsuarioService.registrar({
        nombre: formData.nombre.trim(),
        email: emailNormalizado,
        password: formData.password,
        rol: 'Cliente',
        activo: true
      });

      // 2. Iniciar sesión automáticamente para obtener y guardar los tokens JWT
      const { data } = await UsuarioService.login(emailNormalizado, formData.password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('react_usuario_activo', JSON.stringify(data.usuario));

      navigate('/');
      window.location.reload();
    } catch (err) {
      const mensaje = err.response?.data?.mensaje || 'Error al registrar el usuario en el servidor.';
      setErrores((prev) => ({ ...prev, email: mensaje }));
    } finally {
      setRegistrando(false);
    }
  };

  return (
    <div className="row justify-content-center py-4">
      <div className="col-md-6 col-lg-5">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-dark text-white text-center p-3">
            <h4 className="mb-0 fw-bold">
              <i className="bi bi-person-plus-fill me-2 text-warning"></i>Crear Cuenta
            </h4>
          </div>
          <div className="card-body p-4">
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label className="form-label fw-bold small text-muted">Nombre Completo</label>
                <input
                  type="text"
                  className={`form-control ${errores.nombre ? 'is-invalid' : ''}`}
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej. Juan Pérez"
                />
                {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold small text-muted">Correo Electrónico</label>
                <input
                  type="email"
                  className={`form-control ${errores.email ? 'is-invalid' : ''}`}
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="juan@gmail.com o juan@losmaestros.cl"
                />
                {errores.email && <div className="invalid-feedback">{errores.email}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold small text-muted">Contraseña</label>
                <input
                  type="password"
                  className={`form-control ${errores.password ? 'is-invalid' : ''}`}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Mínimo 3 caracteres"
                />
                {errores.password && <div className="invalid-feedback">{errores.password}</div>}
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold small text-muted">Confirmar Contraseña</label>
                <input
                  type="password"
                  className={`form-control ${errores.confirmarPassword ? 'is-invalid' : ''}`}
                  name="confirmarPassword"
                  value={formData.confirmarPassword}
                  onChange={handleChange}
                  placeholder="Repite tu contraseña"
                />
                {errores.confirmarPassword && <div className="invalid-feedback">{errores.confirmarPassword}</div>}
              </div>

              <button
                type="submit"
                className="btn btn-warning w-100 fw-bold py-2 shadow-sm mb-3"
                disabled={registrando}
              >
                {registrando ? 'Creando cuenta...' : 'Registrarse e Iniciar Sesión'}
              </button>

              <div className="text-center">
                <small className="text-muted">
                  ¿Ya tienes una cuenta? <Link to="/login" className="fw-bold text-decoration-none">Inicia sesión aquí</Link>
                </small>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registro;