import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-5 py-4">
      <div className="container">
        <div className="row g-3">
          {/* Columna 1: Info de la tienda */}
          <div className="col-12 col-md-6 col-lg-4 mb-3 mb-md-0">
            <h5 className="text-warning fw-bold">
              <i className="bi bi-tools me-2"></i>Ferretería Don Juan
            </h5>
            <p className="text-secondary small">
              Tu ferretería de confianza. Encuentra herramientas manuales,
              eléctricas y materiales de construcción de la mejor calidad.
            </p>
          </div>

          {/* Columna 2: Enlaces rápidos */}
          <div className="col-6 col-md-6 col-lg-4">
            <h5 className="text-warning fw-bold fs-6">Enlaces Rápidos</h5>
            <ul className="list-unstyled small mb-0">
              <li className="mb-2">
                <Link to="/catalogo" className="text-white text-decoration-none">
                  <i className="bi bi-chevron-right me-1"></i>Catálogo
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/nosotros" className="text-white text-decoration-none">
                  <i className="bi bi-chevron-right me-1"></i>Nosotros
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/contacto" className="text-white text-decoration-none">
                  <i className="bi bi-chevron-right me-1"></i>Contacto
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/blog" className="text-white text-decoration-none">
                  <i className="bi bi-chevron-right me-1"></i>Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Contacto y redes */}
          <div className="col-6 col-md-6 col-lg-4">
            <h5 className="text-warning fw-bold fs-6">Contacto</h5>
            <ul className="list-unstyled small text-secondary mb-0">
              <li className="mb-2">
                <i className="bi bi-geo-alt-fill me-2"></i>Av. Francisco de Aguirre 450, La Serena
              </li>
              <li className="mb-2">
                <i className="bi bi-telephone-fill me-2"></i>+56 9 1234 5678
              </li>
              <li className="mb-2">
                <i className="bi bi-envelope-fill me-2"></i>contacto@donjuan.cl
              </li>
              <li className="mb-2">
                <i className="bi bi-clock-fill me-2"></i>Lun-Vie: 8:30 - 18:30
              </li>
              <li className="mb-2">
                <i className="bi bi-clock-fill me-2"></i>Sáb: 9:00 - 14:00
              </li>
            </ul>
            <div className="d-flex gap-3 fs-5 mt-2">
              <a href="#facebook" className="text-white"><i className="bi bi-facebook"></i></a>
              <a href="#instagram" className="text-white"><i className="bi bi-instagram"></i></a>
              <a href="#twitter" className="text-white"><i className="bi bi-twitter"></i></a>
              <a href="#whatsapp" className="text-white"><i className="bi bi-whatsapp"></i></a>
            </div>
          </div>
        </div>

        <hr className="border-secondary" />

        {/* Copyright */}
        <div className="text-center small text-secondary">
          <p className="mb-0">
            &copy; 2024 Ferretería Don Juan. Todos los derechos reservados. | Duoc UC
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;