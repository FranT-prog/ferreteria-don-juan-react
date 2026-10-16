import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUsuario, getUsuarios } from '../data/database';

/**
 * Componente de Página: Registro
 * 
 * Descripción: Permite a un usuario nuevo crear una cuenta en la aplicación. Realiza validaciones estrictas
 * en tiempo real para el nombre (solo letras), el dominio de correo (@gmail.com o @losmaestros.cl), la existencia previa del correo,
 * la longitud de la clave y la coincidencia de contraseñas.
 * 
 * Criterios Evaluados Aplicados:
 * 1. Validación de Formularios y Expresiones Regulares (Regex): Uso de expresiones regulares para restringir números/caracteres en el nombre y dominios permitidos en el correo.
 * 2. Manejo de Estado Complejo (useState): Mantiene el estado de las entradas (`formData`) y de las alertas de error por campo (`errores`).
 * 3. Feedback Visual de Validation en Bootstrap: Clases dinámicas `is-invalid` y contenedores `invalid-feedback` para mostrar alertas bajo el input con error.
 * 4. Integración con Base de Datos Centralizada (`database.js`): Persistencia del nuevo usuario con `createUsuario` e inicio de sesión automático en LocalStorage.
 */
const Registro = () => {
  // Hook useNavigate para redirigir al usuario al Home tras registrarse
  const navigate = useNavigate();

  // Estado compuesto (objeto) para capturar los valores ingresados en el formulario
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmarPassword: ''
  });

  // Estado compuesto (objeto) para almacenar los mensajes de error por cada input
  const [errores, setErrores] = useState({});

  /**
   * Manejador de Cambios Unificado (handleChange):
   * Actualiza el valor del input en `formData` y limpia el mensaje de error del campo que el usuario está corrigiendo.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Si había un error previo en este campo, lo borra al volver a escribir
    if (errores[name]) {
      setErrores({ ...errores, [name]: '' });
    }
  };

  /**
   * Función de Validación Completa (validarFormulario):
   * Evalúa cada regla de negocio y llena el objeto `nuevosErrores`. Retorna true si no existen errores.
   */
  const validarFormulario = () => {
    const nuevosErrores = {};

    // 1. Validar Nombre (No vacío y sin números/caracteres especiales mediante Regex)
    const regexSoloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre completo es obligatorio.';
    } else if (!regexSoloLetras.test(formData.nombre.trim())) {
      nuevosErrores.nombre = 'El nombre no puede contener números ni caracteres especiales.';
    }

    // 2. Validar Correo (@gmail.com o @losmaestros.cl) y unicidad en la base de datos
    const regexEmailDominio = /^[a-zA-Z0-9._%+-]+@(gmail\.com|losmaestros\.cl)$/i;
    if (!formData.email.trim()) {
      nuevosErrores.email = 'El correo electrónico es obligatorio.';
    } else if (!regexEmailDominio.test(formData.email.trim())) {
      nuevosErrores.email = 'El correo debe terminar en @gmail.com o @losmaestros.cl.';
    } else {
      // Validar si el correo ya existe registrado utilizando getUsuarios() de database.js
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

    // 4. Validar Confirmación de Contraseña (Coincidencia con la primera clave)
    if (formData.password !== formData.confirmarPassword) {
      nuevosErrores.confirmarPassword = 'Las contraseñas no coinciden.';
    }

    // Guarda los errores encontrados y devuelve true si no hubo fallos
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  /**
   * Manejador del Envío (handleSubmit):
   * Intercepta el evento Submit, ejecuta `validarFormulario()`. Si todo es correcto, registra al usuario con rol 'Cliente',
   * guarda la sesión activa en 'localStorage' y redirige a la raíz `/`.
   */
  const handleSubmit = (e) => {
    e.preventDefault(); // Detiene el comportamiento de envío tradicional

    // Detiene el proceso si las validaciones no se cumplen
    if (!validarFormulario()) {
      return;
    }

    // Registrar nuevo usuario con rol 'Cliente' por defecto usando la capa centralizada database.js
    const nuevoUsuario = createUsuario({
      nombre: formData.nombre.trim(),
      email: formData.email.trim(),
      password: formData.password,
      rol: 'Cliente',
      estado: 'Activo'
    });

    // Iniciar sesión automáticamente tras el registro guardando el objeto en localStorage
    localStorage.setItem('react_usuario_activo', JSON.stringify(nuevoUsuario));

    navigate('/');
    window.location.reload(); // Para refrescar la sesión en la barra de navegación
  };

  return (
    /* Layout centrado con cuadrícula de Bootstrap */
    <div className="row justify-content-center py-4">
      <div className="col-md-6 col-lg-5">
        {/* Tarjeta contenedora sin bordes y con sombra suave */}
        <div className="card shadow-sm border-0">
          <div className="card-header bg-dark text-white text-center p-3">
            <h4 className="mb-0 fw-bold">
              <i className="bi bi-person-plus-fill me-2 text-warning"></i>Crear Cuenta
            </h4>
          </div>
          <div className="card-body p-4">
            {/* Formulario deshabilitando validaciones nativas HTML con noValidate */}
            <form onSubmit={handleSubmit} noValidate>
              
              {/* Campo Nombre Completo */}
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
                {/* Mensaje de error dinámico de Bootstrap */}
                {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
              </div>

              {/* Campo Correo Electrónico */}
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

              {/* Campo Contraseña */}
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

              {/* Campo Confirmar Contraseña */}
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

              {/* Botón de Envio */}
              <button type="submit" className="btn btn-warning w-100 fw-bold py-2 shadow-sm mb-3">
                Registrarse e Iniciar Sesión
              </button>

              {/* Enlace para usuarios ya registrados */}
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