import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUsuario } from '../data/database';

const FormularioUsuario = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState({
    nombre: '',
    email: '',
    rol: 'Cliente',
    estado: 'Activo'
  });

  // Estado para controlar errores de validación
  const [errores, setErrores] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario({
      ...usuario,
      [name]: value
    });

    // Limpiar el error del campo cuando el usuario vuelva a escribir
    if (errores[name]) {
      setErrores({ ...errores, [name]: '' });
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    // 1. Validar Nombre Completo
    if (!usuario.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre completo es obligatorio.';
    }

    // 2. Validar Correo Electrónico (@gmail.com o @losmaestros.cl)
    const regexEmailDominio = /^[a-zA-Z0-9._%+-]+@(gmail\.com|losmaestros\.cl)$/i;
    if (!usuario.email.trim()) {
      nuevosErrores.email = 'El correo electrónico es obligatorio.';
    } else if (!regexEmailDominio.test(usuario.email.trim())) {
      nuevosErrores.email = 'El correo debe terminar en @gmail.com o @losmaestros.cl.';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar datos antes de guardar
    if (!validarFormulario()) {
      return;
    }

    // Guardar usando la capa centralizada de base de datos
    createUsuario({
      nombre: usuario.nombre.trim(),
      email: usuario.email.trim(),
      rol: usuario.rol,
      estado: usuario.estado
    });

    // Volver al panel de administración
    navigate('/admin');
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card shadow-sm border-0 mt-4">
          <div className="card-header bg-dark text-white p-3">
            <h5 className="mb-0 fw-bold">
              <i className="bi bi-person-plus-fill me-2"></i>Registrar Nuevo Usuario
            </h5>
          </div>
          <div className="card-body p-4">
            <form onSubmit={handleSubmit} noValidate>
              {/* Campo Nombre Completo */}
              <div className="mb-3">
                <label className="form-label fw-bold">Nombre Completo</label>
                <input 
                  type="text" 
                  className={`form-control ${errores.nombre ? 'is-invalid' : ''}`}
                  name="nombre" 
                  value={usuario.nombre} 
                  onChange={handleChange} 
                  placeholder="Ej. Ana Soto"
                />
                {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
              </div>

              {/* Campo Correo Electrónico */}
              <div className="mb-3">
                <label className="form-label fw-bold">Correo Electrónico</label>
                <input 
                  type="email" 
                  className={`form-control ${errores.email ? 'is-invalid' : ''}`}
                  name="email" 
                  value={usuario.email} 
                  onChange={handleChange} 
                  placeholder="ana@gmail.com o ana@losmaestros.cl"
                />
                {errores.email && <div className="invalid-feedback">{errores.email}</div>}
              </div>

              {/* Campos Rol y Estado */}
              <div className="row mb-4">
                <div className="col-md-6">
                  <label className="form-label fw-bold">Rol del Sistema</label>
                  <select 
                    className="form-select" 
                    name="rol" 
                    value={usuario.rol} 
                    onChange={handleChange}
                  >
                    <option value="Cliente">Cliente</option>
                    <option value="Vendedor">Vendedor</option>
                    <option value="Administrador">Administrador</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Estado Inicial</label>
                  <select 
                    className="form-select" 
                    name="estado" 
                    value={usuario.estado} 
                    onChange={handleChange}
                  >
                    <option value="Activo">Activo</option>
                    <option value="Bloqueado">Bloqueado</option>
                  </select>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2">
                <Link to="/admin" className="btn btn-secondary">Cancelar</Link>
                <button type="submit" className="btn btn-dark fw-bold">Guardar Usuario</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormularioUsuario;