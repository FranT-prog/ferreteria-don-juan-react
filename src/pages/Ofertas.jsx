import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductoService from '../services/ProductoService';

/**
 * Componente de Página: Ofertas
 *
 * Descripción: Muestra el catálogo de productos en oferta obtenidos desde
 * el backend Spring Boot (/api/v1/productos).
 */
const Ofertas = () => {
  const [ofertas, setOfertas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarOfertas = async () => {
      try {
        const { data: productos } = await ProductoService.obtenerTodos();
        const productosConDescuento = (productos || []).map((producto, index) => ({
          ...producto,
          descuento: [15, 20, 10, 25, 30, 12, 18, 22][index % 8],
          precioOriginal: Math.round((producto.precio || 0) * 1.15),
          precioOferta: producto.precio || 0
        }));
        setOfertas(productosConDescuento);
      } catch (error) {
        console.error('Error al cargar ofertas:', error);
      } finally {
        setCargando(false);
      }
    };

    cargarOfertas();
  }, []);

  return (
    <>
      <section
        className="text-white text-center py-5 mb-5 rounded"
        style={{
          background: 'linear-gradient(135deg, #dc3545 0%, #212529 100%)',
          minHeight: '200px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <div className="container">
          <h1 className="display-4 fw-bold mb-3">
            <i className="bi bi-tag-fill me-2"></i>
            Ofertas del Mes
          </h1>
          <p className="lead mb-0">
            Aprovecha los mejores descuentos en productos seleccionados
          </p>
        </div>
      </section>

      <section className="mb-5">
        {cargando ? (
          <div className="text-center py-5">
            <div className="spinner-border text-danger mb-2" role="status"></div>
            <p className="text-muted">Cargando ofertas desde el servidor...</p>
          </div>
        ) : (
          <div className="row g-4">
            {ofertas.length === 0 ? (
              <div className="col-12 text-center py-5">
                <i className="bi bi-inbox text-muted" style={{ fontSize: '4rem' }}></i>
                <p className="text-muted mt-3">No hay ofertas disponibles en este momento.</p>
              </div>
            ) : (
              ofertas.map((producto) => (
                <div className="col-12 col-md-6 col-lg-4" key={producto.id}>
                  <div className="card border-0 shadow-sm h-100 position-relative">
                    <span
                      className="badge bg-danger position-absolute top-0 end-0 m-3 px-3 py-2 fs-6"
                      style={{ zIndex: 10 }}
                    >
                      -{producto.descuento}%
                    </span>

                    <img
                      src={producto.imagen || 'https://via.placeholder.com/300x200?text=Producto'}
                      alt={producto.nombre}
                      className="card-img-top"
                      style={{ height: '220px', objectFit: 'cover' }}
                    />

                    <div className="card-body d-flex flex-column">
                      <span className="badge bg-secondary align-self-start mb-2">
                        {producto.categoria}
                      </span>
                      <h5 className="fw-bold">{producto.nombre}</h5>
                      <p className="text-muted small mb-2">Cód: {producto.codigo || producto.id}</p>

                      <div className="mt-auto">
                        <p className="mb-1">
                          <span className="text-muted text-decoration-line-through">
                            ${producto.precioOriginal.toLocaleString('es-CL')}
                          </span>
                          <span className="badge bg-success ms-2">
                            Ahorras ${(producto.precioOriginal - producto.precioOferta).toLocaleString('es-CL')}
                          </span>
                        </p>

                        <p className="fw-bold text-danger fs-3 mb-3">
                          ${producto.precioOferta.toLocaleString('es-CL')}
                        </p>

                        <div className="d-grid gap-2">
                          <Link
                            to={`/detalle/${producto.id}`}
                            className="btn btn-warning fw-bold"
                          >
                            <i className="bi bi-eye me-1"></i>Ver Detalle
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </section>

      <section
        className="text-center p-5 rounded mb-5 text-white"
        style={{ background: 'linear-gradient(135deg, #dc3545 0%, #212529 100%)' }}
      >
        <h2 className="fw-bold mb-3">¿No encuentras lo que buscas?</h2>
        <p className="lead mb-4">Explora todo nuestro catálogo completo</p>
        <Link to="/catalogo" className="btn btn-warning btn-lg fw-bold px-5">
          <i className="bi bi-shop me-2"></i>Ir al Catálogo
        </Link>
      </section>
    </>
  );
};

export default Ofertas;