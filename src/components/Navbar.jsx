import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ cantidadCarrito }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#D84315' }}>
      <div className="container">
        {/* Usamos Link en lugar de <a> para navegar sin recargar la página */}
        <Link className="navbar-brand fw-bold" to="/">
          <i className="bi bi-tools"></i> Ferretería Don Juan
        </Link>
        
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Catálogo</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin">Panel Admin</Link>
            </li>
          </ul>
          <div className="d-flex">
            <Link to="/carrito" className="btn btn-outline-light">
                <i className="bi bi-cart3"></i> Carrito ({cantidadCarrito || 0})
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;