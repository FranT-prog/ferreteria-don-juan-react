import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const FormularioUsuario = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState({
    nombre: '',
    email: '',
    rol: 'Cliente',
    estado: 'Activo'
  });

  const handleChange = (e) => {
    setUsuario({
      ...usuario,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Traer usuarios existentes
    const usuariosGuardados = JSON.parse(localStorage.getItem('react_usuarios')) || [];
    
    // Generar un ID correlativo simulado
    const nuevoId = `USR-${String(usuariosGuardados.length + 1).padStart(3, '0')}`;
    
    const nuevoUsuario = {
      ...usuario,
      id: nuevoId
    };

    // Guardar y redirigir
    usuariosGuardados.push(nuevoUsuario);
    localStorage.setItem('react_usuarios', JSON.stringify(usuariosGuardados));
    
    // Volver al panel de admin
    navigate('/admin');
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card shadow-sm border-0 mt-4">
          <div className="card-header bg-dark text-white p-3">
            <h5 className="mb-0 fw-bold"><i className="bi bi-person-plus-fill me-2"></i>Registrar Nuevo Usuario</h5>
          </div>
          <div className="card-body p-4">
            <form onSubmit={handleSubmit}>
              
              <div className="mb-3">
                <label className="form-label fw-bold">Nombre Completo</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="nombre" 
                  value={usuario.nombre} 
                  onChange={handleChange} 
                  required 
                  placeholder="Ej. Ana Soto"
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Correo Electrónico</label>
                <input 
                  type="email" 
                  className="form-control" 
                  name="email" 
                  value={usuario.email} 
                  onChange={handleChange} 
                  required 
                  placeholder="ana@ejemplo.com"
                />
              </div>

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