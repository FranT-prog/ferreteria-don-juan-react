import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

const Navbar = ({ contadorCarrito, usuarioActivo, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold text-warning" to="/">
          <i className="bi bi-tools me-2"></i>Ferretería Los Maestros
        </Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active fw-bold' : ''}`} to="/">Catálogo</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active fw-bold' : ''}`} to="/nosotros">Nosotros</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active fw-bold' : ''}`} to="/blog">Blog & Tips</NavLink>
            </li>

            {/* Accesos por Rol */}
            {usuarioActivo?.rol === 'Administrador' && (
              <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link text-warning ${isActive ? 'active fw-bold' : ''}`} to="/admin">
                  <i className="bi bi-shield-lock me-1"></i>Admin
                </NavLink>
              </li>
            )}

            {(usuarioActivo?.rol === 'Vendedor' || usuarioActivo?.rol === 'Administrador') && (
              <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link text-success ${isActive ? 'active fw-bold' : ''}`} to="/vendedor">
                  <i className="bi bi-person-badge me-1"></i>Vendedor
                </NavLink>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-3">
            <Link to="/carrito" className="btn btn-outline-warning position-relative">
              <i className="bi bi-cart-fill me-1"></i> Carrito
              {contadorCarrito > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {contadorCarrito}
                </span>
              )}
            </Link>

            {usuarioActivo ? (
              <div className="dropdown">
                <button className="btn btn-light btn-sm dropdown-toggle fw-bold" type="button" data-bs-toggle="dropdown">
                  <i className="bi bi-person-circle me-1"></i>{usuarioActivo.nombre}
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><span className="dropdown-item-text text-muted small">Rol: {usuarioActivo.rol}</span></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item text-danger fw-bold" onClick={handleLogout}>Cerrar Sesión</button></li>
                </ul>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login" className="btn btn-outline-light btn-sm">Login</Link>
                <Link to="/registro" className="btn btn-success btn-sm">Registro</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;