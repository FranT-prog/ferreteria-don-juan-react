import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

const Navbar = ({ contadorCarrito, usuarioActivo, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold text-warning" to="/">
          <i className="bi bi-tools me-2"></i>
          <span className="d-none d-sm-inline">Ferretería Don Juan</span>
          <span className="d-inline d-sm-none">Don Juan</span>
        </Link>

        {/* Carrito SIEMPRE visible */}
        <div className="d-flex align-items-center gap-2 order-lg-2 ms-auto me-2">
          <Link to="/carrito" className="btn btn-outline-warning position-relative btn-sm">
            <i className="bi bi-cart-fill"></i>
            <span className="d-none d-lg-inline ms-1">Carrito</span>
            {contadorCarrito > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {contadorCarrito}
              </span>
            )}
          </Link>
        </div>

        <button 
          className="navbar-toggler order-lg-3" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse order-lg-1" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active fw-bold' : ''}`} to="/">Inicio</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active fw-bold' : ''}`} to="/catalogo">Catálogo</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active fw-bold' : ''}`} to="/nosotros">Nosotros</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active fw-bold' : ''}`} to="/blog">Blog & Tips</NavLink>
            </li>

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

            {/* Login/Registro para mobile (dentro del menú) */}
            <li className="nav-item d-lg-none mt-2">
              {usuarioActivo ? (
                <button className="btn btn-light btn-sm w-100" onClick={handleLogout}>
                  <i className="bi bi-person-circle me-1"></i>Cerrar Sesión ({usuarioActivo.nombre})
                </button>
              ) : (
                <div className="d-flex gap-2">
                  <Link to="/login" className="btn btn-outline-light btn-sm flex-grow-1">Login</Link>
                  <Link to="/registro" className="btn btn-success btn-sm flex-grow-1">Registro</Link>
                </div>
              )}
            </li>
          </ul>

          {/* Login/Registro para desktop */}
          <div className="d-none d-lg-flex align-items-center gap-2">
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
              <>
                <Link to="/login" className="btn btn-outline-light btn-sm">Login</Link>
                <Link to="/registro" className="btn btn-success btn-sm">Registro</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;