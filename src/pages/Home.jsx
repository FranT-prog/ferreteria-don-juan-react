import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [productosDestacados, setProductosDestacados] = useState([]);
  const [categoriasHome, setCategoriasHome] = useState([]);

  const colores = [
    'linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%)', // Azul
    'linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)', // Naranja
    'linear-gradient(135deg, #198754 0%, #20c997 100%)', // Verde
    'linear-gradient(135deg, #6f42c1 0%, #d63384 100%)'  // Morado
  ];
  const iconos = ['bi-hammer', 'bi-bricks', 'bi-paint-bucket', 'bi-wrench'];

  useEffect(() => {
    // 1. Cargar productos destacados
    const productos = JSON.parse(localStorage.getItem('react_productos')) || [];
    setProductosDestacados(productos.slice(0, 3));

    // 2. Definir categorías actualizadas
    const categoriasActualizadas = [
      { id: 'cat-1', nombre: 'Herramientas Manuales', descripcion: 'Martillos, destornilladores, alicates.' },
      { id: 'cat-2', nombre: 'Materiales de Construcción', descripcion: 'Cemento, arena, ladrillos y materiales de obra.' }
    ];

    // 3. Forzar actualización en localStorage
    localStorage.setItem('react_categorias', JSON.stringify(categoriasActualizadas));
    setCategoriasHome(categoriasActualizadas);
  }, []);

  const slugify = (texto) => {
    return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-');
  };

  return (
    <>
      {/* HERO BANNER */}
      <section className="text-white text-center py-3 py-md-5 mb-4 mb-md-5 rounded position-relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #D84315 0%, #212529 100%)', minHeight: '320px', display: 'flex', alignItems: 'center' }}>
        <i className="bi bi-tools position-absolute opacity-25 d-none d-md-block" style={{ fontSize: '15rem', top: '-2rem', left: '-2rem', pointerEvents: 'none' }}></i>
        <div className="container-fluid position-relative py-3 py-md-4 px-3">
          <span className="badge bg-warning text-dark mb-3 px-3 py-2 fs-6"><i className="bi bi-star-fill me-1"></i>Ferretería N°1 de la Región</span>
          <h1 className="display-6 display-md-3 fw-bold mb-3"><span className="text-warning">Ferretería Don Juan</span></h1>
          <p className="lead mb-4 fs-6 fs-md-4">Todo lo que necesitas para construir tus sueños, en un solo lugar</p>
          <div className="d-flex justify-content-center gap-2 gap-md-3 flex-wrap">
            <Link to="/catalogo" className="btn btn-warning btn-lg fw-bold px-3"><i className="bi bi-shop me-2"></i>Ver Catálogo</Link>
            <Link to="/ofertas" className="btn btn-outline-light btn-lg px-3"><i className="bi bi-tag-fill me-2"></i>Ofertas</Link>
          </div>
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section className="mb-4 mb-md-5">
        <h2 className="text-center fw-bold mb-4 fs-3 fs-md-2">
          <i className="bi bi-grid-3x3-gap-fill me-2 text-warning"></i>Nuestras Categorías
        </h2>
        <div className="row g-3 g-md-4 justify-content-center">
          {categoriasHome.map((cat, index) => {
            const slug = slugify(cat.nombre);
            const color = colores[index % colores.length];
            const icono = iconos[index % iconos.length];

            return (
              <div className="col-12 col-sm-10 col-md-5" key={cat.id}>
                <Link to={`/categoria/${slug}`} className="text-decoration-none">
                  <div className="card border-0 shadow-lg h-100 text-center category-card" style={{ transition: 'transform 0.3s' }}>
                    <div className="card-body py-4 py-md-5" style={{ background: color, color: 'white', borderRadius: '0.5rem' }}>
                      <i className={`bi ${icono}`} style={{ fontSize: '3rem' }}></i>
                      <h3 className="fw-bold mt-3 mb-2 fs-4 fs-md-3">{cat.nombre}</h3>
                      <p className="mb-0 small small-md">{cat.descripcion}</p>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-4">
          <Link to="/categorias" className="btn btn-outline-primary px-4 fw-bold">
            Ver todas las categorías <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>
      </section>

      {/* OFERTAS DESTACADAS */}
      <section className="mb-4 mb-md-5">
        <h2 className="text-center fw-bold mb-4 fs-3 fs-md-2">
          <i className="bi bi-tag-fill me-2 text-danger"></i>
          <span className="text-danger">Ofertas</span> del Mes
        </h2>
        <div className="row g-3 g-md-4">
          {productosDestacados.length === 0 ? (
            <div className="col-12 text-center">
              <p className="text-muted">Cargando ofertas...</p>
            </div>
          ) : (
            productosDestacados.map((producto) => (
              <div className="col-12 col-sm-6 col-md-4" key={producto.id}>
                <div className="card border-0 shadow-sm h-100">
                  <div className="position-relative">
                    <span className="badge bg-warning text-dark mb-3 px-2 px-md-3 py-2 small small-md">
                    <i className="bi bi-star-fill me-1"></i>Ferretería N°1 de la Región
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

      {/* POR QUÉ ELEGIRNOS */}
      <section className="mb-4 mb-md-5">
        <h2 className="text-center fw-bold mb-4 fs-3 fs-md-2">
          <i className="bi bi-star-fill me-2 text-warning"></i>
          ¿Por qué elegirnos?
        </h2>
        <div className="row g-3 g-md-4">
          <div className="col-6 col-md-3 text-center">
            <div className="p-3 p-md-4 rounded shadow-sm h-100 bg-white">
              <div className="rounded-circle bg-primary d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                <i className="bi bi-truck text-white fs-3"></i>
              </div>
              <h6 className="fw-bold fs-6 fs-md-5">Envío Rápido</h6>
              <p className="text-muted small mb-0 d-none d-md-block">Despacho en 24-48 horas.</p>
            </div>
          </div>
          <div className="col-6 col-md-3 text-center">
            <div className="p-3 p-md-4 rounded shadow-sm h-100 bg-white">
              <div className="rounded-circle bg-success d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                <i className="bi bi-award text-white fs-3"></i>
              </div>
              <h6 className="fw-bold fs-6 fs-md-5">Calidad Garantizada</h6>
              <p className="text-muted small mb-0 d-none d-md-block">Mejores marcas del mercado.</p>
            </div>
          </div>
          <div className="col-6 col-md-3 text-center">
            <div className="p-3 p-md-4 rounded shadow-sm h-100 bg-white">
              <div className="rounded-circle bg-warning d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                <i className="bi bi-headset text-white fs-3"></i>
              </div>
              <h6 className="fw-bold fs-6 fs-md-5">Soporte 24/7</h6>
              <p className="text-muted small mb-0 d-none d-md-block">Atención personalizada.</p>
            </div>
          </div>
          <div className="col-6 col-md-3 text-center">
            <div className="p-3 p-md-4 rounded shadow-sm h-100 bg-white">
              <div className="rounded-circle bg-danger d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                <i className="bi bi-credit-card text-white fs-3"></i>
              </div>
              <h6 className="fw-bold fs-6 fs-md-5">Pago Seguro</h6>
              <p className="text-muted small mb-0 d-none d-md-block">Múltiples métodos de pago.</p>
            </div>
          </div>
        </div>
      </section>

      {/* HORARIOS Y CONTACTO */}
      <section className="mb-4 mb-md-5">
        <div className="row g-3 g-md-4">
          <div className="col-12 col-md-6">
            <div className="card border-0 shadow-sm h-100" style={{ background: 'linear-gradient(135deg, #212529 0%, #495057 100%)', color: 'white' }}>
              <div className="card-body p-3 p-md-4">
                <h4 className="fw-bold mb-3 mb-md-4 fs-5 fs-md-3">
                  <i className="bi bi-clock-fill text-warning me-2"></i>Horarios de Atención
                </h4>
                <ul className="list-unstyled mb-0 small small-md">
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
              <div className="card-body p-3 p-md-4">
                <h4 className="fw-bold mb-3 mb-md-4 fs-5 fs-md-3">
                  <i className="bi bi-telephone-fill text-warning me-2"></i>Contáctanos
                </h4>
                <ul className="list-unstyled mb-3 mb-md-4 small small-md">
                  <li className="mb-2 mb-md-3">
                    <i className="bi bi-geo-alt-fill me-2"></i>
                    Av. Francisco de Aguirre 450, La Serena
                  </li>
                  <li className="mb-2 mb-md-3">
                    <i className="bi bi-telephone-fill me-2"></i>
                    +56 9 1234 5678
                  </li>
                  <li className="mb-2 mb-md-3">
                    <i className="bi bi-envelope-fill me-2"></i>
                    contacto@donjuan.cl
                  </li>
                </ul>
                <Link to="/contacto" className="btn btn-light fw-bold w-100 w-md-auto">
                  <i className="bi bi-chat-dots me-2"></i>Enviar Mensaje
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section
        className="text-center p-4 p-md-5 rounded mb-4 mb-md-5 text-white shadow-lg"
        style={{ background: 'linear-gradient(135deg, #D84315 0%, #212529 100%)' }}
      >
        <h2 className="fw-bold mb-3 fs-4 fs-md-2">¿Listo para empezar tu proyecto?</h2>
        <p className="lead mb-4 fs-6 fs-md-4">Explora nuestro catálogo completo</p>
        <Link to="/catalogo" className="btn btn-warning btn-lg fw-bold px-4 px-md-5">
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