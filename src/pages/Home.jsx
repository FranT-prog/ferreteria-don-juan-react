import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [productosDestacados, setProductosDestacados] = useState([]);

  useEffect(() => {
    const productos = JSON.parse(localStorage.getItem('react_productos')) || [];
    setProductosDestacados(productos.slice(0, 3));
  }, []);

  return (
    <>
      {/* ============================================
          HERO BANNER CON GRADIENTE Y DECORACIÓN
      ============================================ */}
      <section
        className="text-white text-center py-5 mb-5 rounded position-relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #D84315 0%, #212529 100%)',
          minHeight: '400px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <i className="bi bi-tools position-absolute opacity-25" style={{ fontSize: '15rem', top: '-2rem', left: '-2rem' }}></i>
        <i className="bi bi-hammer position-absolute opacity-25" style={{ fontSize: '12rem', bottom: '-2rem', right: '-1rem' }}></i>

        <div className="container position-relative py-4">
          <span className="badge bg-warning text-dark mb-3 px-3 py-2 fs-6">
            <i className="bi bi-star-fill me-1"></i>Ferretería N°1 de la Región
          </span>
          <h1 className="display-3 fw-bold mb-3">
         <span className="text-warning">Ferretería Don Juan</span>
          </h1>
          <p className="lead mb-4 fs-4">
            Todo lo que necesitas para construir tus sueños, en un solo lugar
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/catalogo" className="btn btn-warning btn-lg fw-bold px-4">
              <i className="bi bi-shop me-2"></i>Ver Catálogo
            </Link>
            <Link to="/ofertas" className="btn btn-outline-light btn-lg px-4">
              <i className="bi bi-tag-fill me-2"></i>Ofertas
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================
          CATEGORÍAS
      ============================================ */}
      <section className="mb-5">
        <h2 className="text-center fw-bold mb-4">
          <i className="bi bi-grid-3x3-gap-fill me-2 text-warning"></i>
          Nuestras Categorías
        </h2>
        <div className="row g-4 justify-content-center">
          <div className="col-12 col-md-5">
            {/* 👇 CAMBIO: ahora apunta a /categoria/herramientas-manuales */}
            <Link to="/categoria/herramientas-manuales" className="text-decoration-none">
              <div className="card border-0 shadow-lg h-100 text-center category-card" style={{ transition: 'transform 0.3s' }}>
                <div className="card-body py-5" style={{ background: 'linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%)', color: 'white', borderRadius: '0.5rem' }}>
                  <i className="bi bi-hammer" style={{ fontSize: '4rem' }}></i>
                  <h3 className="fw-bold mt-3 mb-2">Herramientas Manuales</h3>
                  <p className="mb-0">Llaves, destornilladores, niveles y más.</p>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-12 col-md-5">
            {/* 👇 CAMBIO: ahora apunta a /categoria/materiales-de-construccion */}
            <Link to="/categoria/materiales-de-construccion" className="text-decoration-none">
              <div className="card border-0 shadow-lg h-100 text-center category-card" style={{ transition: 'transform 0.3s' }}>
                <div className="card-body py-5" style={{ background: 'linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)', color: 'white', borderRadius: '0.5rem' }}>
                  <i className="bi bi-bricks" style={{ fontSize: '4rem' }}></i>
                  <h3 className="fw-bold mt-3 mb-2">Materiales de Construcción</h3>
                  <p className="mb-0">Cemento, arena, ladrillos y más.</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================
          OFERTAS DESTACADAS
      ============================================ */}
      <section className="mb-5">
        <h2 className="text-center fw-bold mb-4">
          <i className="bi bi-tag-fill me-2 text-danger"></i>
          <span className="text-danger">Ofertas</span> del Mes
        </h2>
        <div className="row g-4">
          {productosDestacados.length === 0 ? (
            <div className="col-12 text-center">
              <p className="text-muted">Cargando ofertas...</p>
            </div>
          ) : (
            productosDestacados.map((producto) => (
              <div className="col-12 col-md-4" key={producto.id}>
                <div className="card border-0 shadow-sm h-100">
                  <div className="position-relative">
                    <span className="badge bg-danger position-absolute top-0 start-0 m-2 px-3 py-2">
                      <i className="bi bi-tag-fill me-1"></i>-15%
                    </span>
                    <img
                      src={producto.imagen}
                      alt={producto.nombre}
                      className="card-img-top"
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="card-body d-flex flex-column">
                    <span className="badge bg-secondary align-self-start mb-2">
                      {producto.categoria}
                    </span>
                    <h5 className="fw-bold">{producto.nombre}</h5>
                    <div className="mt-auto">
                      <p className="mb-1">
                        <span className="text-muted text-decoration-line-through small">
                          ${Math.round(producto.precio * 1.15).toLocaleString()}
                        </span>
                      </p>
                      <p className="fw-bold text-warning fs-4 mb-2">
                        ${producto.precio.toLocaleString()}
                      </p>
                      <Link to={`/detalle/${producto.id}`} className="btn btn-warning w-100 fw-bold">
                        <i className="bi bi-eye me-1"></i>Ver Oferta
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="text-center mt-4">
          <Link to="/ofertas" className="btn btn-outline-danger px-4">
            Ver todas las ofertas <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>
      </section>

      {/* ============================================
          POR QUÉ ELEGIRNOS
      ============================================ */}
      <section className="mb-5">
        <h2 className="text-center fw-bold mb-4">
          <i className="bi bi-star-fill me-2 text-warning"></i>
          ¿Por qué elegirnos?
        </h2>
        <div className="row g-4">
          <div className="col-12 col-md-3 text-center">
            <div className="p-4 rounded shadow-sm h-100 bg-white">
              <div className="rounded-circle bg-primary d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '70px', height: '70px' }}>
                <i className="bi bi-truck text-white fs-2"></i>
              </div>
              <h5 className="fw-bold">Envío Rápido</h5>
              <p className="text-muted small mb-0">Despacho en 24-48 horas.</p>
            </div>
          </div>
          <div className="col-12 col-md-3 text-center">
            <div className="p-4 rounded shadow-sm h-100 bg-white">
              <div className="rounded-circle bg-success d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '70px', height: '70px' }}>
                <i className="bi bi-award text-white fs-2"></i>
              </div>
              <h5 className="fw-bold">Calidad Garantizada</h5>
              <p className="text-muted small mb-0">Mejores marcas del mercado.</p>
            </div>
          </div>
          <div className="col-12 col-md-3 text-center">
            <div className="p-4 rounded shadow-sm h-100 bg-white">
              <div className="rounded-circle bg-warning d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '70px', height: '70px' }}>
                <i className="bi bi-headset text-white fs-2"></i>
              </div>
              <h5 className="fw-bold">Soporte 24/7</h5>
              <p className="text-muted small mb-0">Atención personalizada.</p>
            </div>
          </div>
          <div className="col-12 col-md-3 text-center">
            <div className="p-4 rounded shadow-sm h-100 bg-white">
              <div className="rounded-circle bg-danger d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '70px', height: '70px' }}>
                <i className="bi bi-credit-card text-white fs-2"></i>
              </div>
              <h5 className="fw-bold">Pago Seguro</h5>
              <p className="text-muted small mb-0">Múltiples métodos de pago.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          HORARIOS Y CONTACTO
      ============================================ */}
      <section className="mb-5">
        <div className="row g-4">
          <div className="col-12 col-md-6">
            <div className="card border-0 shadow-sm h-100" style={{ background: 'linear-gradient(135deg, #212529 0%, #495057 100%)', color: 'white' }}>
              <div className="card-body p-4">
                <h3 className="fw-bold mb-4">
                  <i className="bi bi-clock-fill text-warning me-2"></i>Horarios de Atención
                </h3>
                <ul className="list-unstyled mb-0">
                  <li className="d-flex justify-content-between py-2 border-bottom border-secondary">
                    <span><i className="bi bi-calendar-week me-2"></i>Lunes a Viernes</span>
                    <strong>8:30 - 18:30</strong>
                  </li>
                  <li className="d-flex justify-content-between py-2 border-bottom border-secondary">
                    <span><i className="bi bi-calendar-week me-2"></i>Sábado</span>
                    <strong>9:00 - 14:00</strong>
                  </li>
                  <li className="d-flex justify-content-between py-2">
                    <span><i className="bi bi-calendar-x me-2"></i>Domingo</span>
                    <strong className="text-warning">Cerrado</strong>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="card border-0 shadow-sm h-100" style={{ background: 'linear-gradient(135deg, #D84315 0%, #fd7e14 100%)', color: 'white' }}>
              <div className="card-body p-4">
                <h3 className="fw-bold mb-4">
                  <i className="bi bi-telephone-fill text-warning me-2"></i>Contáctanos
                </h3>
                <ul className="list-unstyled mb-4">
                  <li className="mb-3">
                    <i className="bi bi-geo-alt-fill me-2"></i>
                    Av. Francisco de Aguirre 450, La Serena
                  </li>
                  <li className="mb-3">
                    <i className="bi bi-telephone-fill me-2"></i>
                    +56 9 1234 5678
                  </li>
                  <li className="mb-3">
                    <i className="bi bi-envelope-fill me-2"></i>
                    contacto@donjuan.cl
                  </li>
                </ul>
                <Link to="/contacto" className="btn btn-light fw-bold">
                  <i className="bi bi-chat-dots me-2"></i>Enviar Mensaje
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          LLAMADA A LA ACCIÓN FINAL
      ============================================ */}
      <section
        className="text-center p-5 rounded mb-5 text-white shadow-lg"
        style={{ background: 'linear-gradient(135deg, #D84315 0%, #212529 100%)' }}
      >
        <h2 className="fw-bold mb-3">¿Listo para empezar tu proyecto?</h2>
        <p className="lead mb-4">Explora nuestro catálogo completo</p>
        <Link to="/catalogo" className="btn btn-warning btn-lg fw-bold px-5">
          <i className="bi bi-cart-fill me-2"></i>Ir al Catálogo
        </Link>
      </section>

      <style>{`
        .category-card:hover {
          transform: translateY(-8px);
        }
      `}</style>
    </>
  );
};

export default Home;