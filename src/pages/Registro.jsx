import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUsuario, getUsuarios } from '../data/database';

const Registro = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmarPassword: ''
  });

  const [errores, setErrores] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errores[name]) {
      setErrores({ ...errores, [name]: '' });
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    // 1. Validar Nombre (No vacío y sin números)
    const regexSoloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre completo es obligatorio.';
    } else if (!regexSoloLetras.test(formData.nombre.trim())) {
      nuevosErrores.nombre = 'El nombre no puede contener números ni caracteres especiales.';
    }

    // 2. Validar Correo (@gmail.com o @losmaestros.cl)
    const regexEmailDominio = /^[a-zA-Z0-9._%+-]+@(gmail\.com|losmaestros\.cl)$/i;
    if (!formData.email.trim()) {
      nuevosErrores.email = 'El correo electrónico es obligatorio.';
    } else if (!regexEmailDominio.test(formData.email.trim())) {
      nuevosErrores.email = 'El correo debe terminar en @gmail.com o @losmaestros.cl.';
    } else {
      // Validar si el correo ya existe registrado
      const usuariosExistentes = getUsuarios();
      const existe = usuariosExistentes.some(
        u => u.email.toLowerCase() === formData.email.trim().toLowerCase()
      );
      if (existe) {
        nuevosErrores.email = 'Este correo ya se encuentra registrado en el sistema.';
      }
    }

    // 3. Validar Contraseña (Mínimo 3 caracteres)
    if (!formData.password) {
      nuevosErrores.password = 'La contraseña es obligatoria.';
    } else if (formData.password.length < 3) {
      nuevosErrores.password = 'La contraseña debe tener al menos 3 caracteres.';
    }

    // 4. Validar Confirmación de Contraseña
    if (formData.password !== formData.confirmarPassword) {
      nuevosErrores.confirmarPassword = 'Las contraseñas no coinciden.';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    // Registrar nuevo usuario con rol 'Cliente' por defecto
    const nuevoUsuario = createUsuario({
      nombre: formData.nombre.trim(),
      email: formData.email.trim(),
      password: formData.password,
      rol: 'Cliente',
      estado: 'Activo'
    });

    // Iniciar sesión automáticamente tras el registro
    localStorage.setItem('react_usuario_activo', JSON.stringify(nuevoUsuario));

    navigate('/');
    window.location.reload(); // Para refrescar la sesión en la barra de navegación
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
              {/* Nombre Completo */}
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

              {/* Correo Electrónico */}
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

              {/* Contraseña */}
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

              {/* Confirmar Contraseña */}
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

              <button type="submit" className="btn btn-warning w-100 fw-bold py-2 shadow-sm mb-3">
                Registrarse e Iniciar Sesión
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

