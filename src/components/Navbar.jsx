import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

const Navbar = ({ contadorCarrito, usuarioActivo, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark shadow-sm sticky-top" style={{ backgroundColor: '#fd7e14' }}>
      <div className="container">
        {/* Brand / Logotipo con ícono destacado */}
        <Link className="navbar-brand fw-bold text-white fs-4 d-flex align-items-center" to="/">
          <span className="bg-dark text-warning rounded-circle d-inline-flex align-items-center justify-content-center me-2 shadow-sm" style={{ width: '38px', height: '38px' }}>
            <i className="bi bi-tools fs-6"></i>
          </span>
          Ferretería Don Juan
        </Link>

        {/* Sección del Carrito (Siempre visible, estilizado en negro para máximo contraste) */}
        <div className="d-flex align-items-center gap-2 order-lg-2 ms-auto me-2 me-lg-0">
          <Link to="/carrito" className="btn btn-dark btn-sm fw-bold px-3 rounded-pill shadow-sm position-relative">
            <i className="bi bi-cart-fill text-warning"></i>
            <span className="d-none d-lg-inline ms-1">Carrito</span>
            {contadorCarrito > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-light">
                {contadorCarrito}
              </span>
            )}
          </Link>
        </div>

        {/* Botón Toggler para dispositivos móviles */}
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

        {/* Contenido colapsable */}
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

            {/* Enlaces por rol (en blanco para buena legibilidad sobre fondo naranjo) */}
            {usuarioActivo?.rol === 'Cliente' && (
              <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link text-white ${isActive ? 'active fw-bold text-decoration-underline' : ''}`} to="/mi-cuenta">
                  <i className="bi bi-bag-check me-1"></i>Mis Pedidos
                </NavLink>
              </li>
            )}

            {usuarioActivo?.rol === 'Administrador' && (
              <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link text-white ${isActive ? 'active fw-bold text-decoration-underline' : ''}`} to="/admin">
                  <i className="bi bi-shield-lock me-1"></i>Admin
                </NavLink>
              </li>
            )}

            {(usuarioActivo?.rol === 'Vendedor' || usuarioActivo?.rol === 'Administrador') && (
              <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link text-white ${isActive ? 'active fw-bold text-decoration-underline' : ''}`} to="/vendedor">
                  <i className="bi bi-person-badge me-1"></i>Vendedor
                </NavLink>
              </li>
            )}

            {/* Opciones de Perfil / Login para vista Móvil */}
            <li className="nav-item d-lg-none mt-2">
              {usuarioActivo ? (
                <div className="d-flex flex-column gap-2">
                  <Link to="/perfil" className="btn btn-outline-light btn-sm w-100 text-start">
                    <i className="bi bi-person-gear me-2"></i>Mi Perfil
                  </Link>
                  <Link to="/mi-cuenta" className="btn btn-outline-light btn-sm w-100 text-start">
                    <i className="bi bi-bag-check me-2"></i>Mis Pedidos y Cuenta
                  </Link>
                  <button className="btn btn-dark btn-sm w-100 text-start" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2"></i>Cerrar Sesión ({usuarioActivo.nombre})
                  </button>
                </div>
              ) : (
                <div className="d-flex align-items-center gap-2 mt-2">
                  <Link to="/login" className="btn btn-outline-light btn-sm rounded-pill px-3 fw-bold">
                    Login
                  </Link>
                  <Link to="/registro" className="btn btn-light text-dark btn-sm fw-bold px-3 rounded-pill shadow-sm">
                    Registro
                  </Link>
                </div>
              )}
            </li>
          </ul>

          {/* Opciones de Perfil / Login para vista Escritorio */}
          <div className="d-none d-lg-flex align-items-center gap-2 me-2">
            {usuarioActivo ? (
              <div className="dropdown">
                <button className="btn btn-light text-dark btn-sm dropdown-toggle fw-bold rounded-pill px-3 shadow-sm" type="button" data-bs-toggle="dropdown">
                  <i className="bi bi-person-circle me-1 text-primary"></i>{usuarioActivo.nombre}
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow border-0">
                  <li><span className="dropdown-item-text text-muted small">Rol: {usuarioActivo.rol}</span></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <Link to="/perfil" className="dropdown-item">
                      <i className="bi bi-person-gear me-2"></i> Mi Perfil
                    </Link>
                  </li>
                  <li>
                    <Link to="/mi-cuenta" className="dropdown-item">
                      <i className="bi bi-bag-check me-2"></i> Mis Pedidos y Cuenta
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item text-danger fw-bold" onClick={handleLogout}>Cerrar Sesión</button></li>
                </ul>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-light rounded-pill px-3 fw-bold btn-sm">
                  Login
                </Link>
                <Link to="/registro" className="btn btn-light text-dark rounded-pill px-3 fw-bold shadow-sm btn-sm">
                  Registro
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;