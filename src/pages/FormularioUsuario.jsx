import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import UsuarioService from '../services/UsuarioService';

/**
 * Componente de Página: FormularioUsuario
 *
 * Descripción: Registra un nuevo usuario en el backend Spring Boot
 * (POST /api/v1/usuarios/registro) con rol y estado inicial.
 */
const FormularioUsuario = () => {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'Cliente',
    estado: 'Activo'
  });
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setUsuario({
      ...usuario,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setGuardando(true);

    try {
      await UsuarioService.registrar({
        nombre: usuario.nombre.trim(),
        email: usuario.email.trim().toLowerCase(),
        password: usuario.password,
        rol: usuario.rol,
        activo: usuario.estado === 'Activo'
      });
      navigate('/admin');
    } catch (err) {
      const mensaje = err.response?.data?.mensaje || 'No se pudo registrar el usuario en el servidor.';
      setError(mensaje);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card shadow-sm border-0 mt-4">
          <div className="card-header bg-dark text-white p-3">
            <h5 className="mb-0 fw-bold"><i className="bi bi-person-plus-fill me-2"></i>Registrar Nuevo Usuario</h5>
          </div>

          <div className="card-body p-4">
            {error && <div className="alert alert-danger py-2">{error}</div>}

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

              <div className="mb-3">
                <label className="form-label fw-bold">Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={usuario.password}
                  onChange={handleChange}
                  required
                  minLength={3}
                  placeholder="••••••••"
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
                <button type="submit" className="btn btn-dark fw-bold" disabled={guardando}>
                  {guardando ? 'Guardando...' : 'Guardar Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormularioUsuario;