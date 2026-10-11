import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

const CategoriaDetalle = () => {
  const { categoria } = useParams();
  const [productos, setProductos] = useState([]);
  const [nombreCategoria, setNombreCategoria] = useState('');

  // Función para convertir slug a nombre
  const slugToNombre = (slug) => {
    if (slug === 'herramientas-manuales') return 'Herramientas Manuales';
    if (slug === 'materiales-de-construccion') return 'Materiales de Construcción';
    return slug;
  };

  useEffect(() => {
    const todosProductos = JSON.parse(localStorage.getItem('react_productos')) || [];
    const nombre = slugToNombre(categoria);
    setNombreCategoria(nombre);
    
    const filtrados = todosProductos.filter((p) => p.categoria === nombre);
    setProductos(filtrados);
  }, [categoria]);

  const colorBanner = nombreCategoria === 'Herramientas Manuales'
    ? 'linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%)'
    : 'linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)';

  const icono = nombreCategoria === 'Herramientas Manuales' ? 'bi-hammer' : 'bi-bricks';

  return (
    <>
      {/* Banner */}
      <section
        className="text-white text-center py-5 mb-5 rounded"
        style={{ background: colorBanner }}
      >
        <div className="container">
          <i className={`bi ${icono}`} style={{ fontSize: '3rem' }}></i>
          <h1 className="display-4 fw-bold mt-3 mb-2">{nombreCategoria}</h1>
          <p className="lead mb-0">{productos.length} productos disponibles</p>
        </div>
      </section>

      {/* Productos */}
      <section className="mb-5">
        {productos.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-inbox text-muted" style={{ fontSize: '4rem' }}></i>
            <p className="text-muted mt-3">No hay productos en esta categoría.</p>
            <Link to="/categorias" className="btn btn-outline-secondary mt-3">
              <i className="bi bi-arrow-left me-1"></i>Volver a Categorías
            </Link>
          </div>
        ) : (
          <>
            <div className="row g-4">
              {productos.map((producto) => (
                <div className="col-12 col-md-6 col-lg-4" key={producto.id}>
                  <div className="card border-0 shadow-sm h-100">
                    <img
                      src={producto.imagen}
                      alt={producto.nombre}
                      className="card-img-top"
                      style={{ height: '220px', objectFit: 'cover' }}
                    />
                    <div className="card-body d-flex flex-column">
                      <span className="badge bg-secondary align-self-start mb-2">
                        {producto.categoria}
                      </span>
                      <h5 className="fw-bold">{producto.nombre}</h5>
                      <p className="text-muted small mb-2">Cód: {producto.id}</p>
                      <p className="mb-2">
                        <span className="badge bg-success">Stock: {producto.stock}</span>
                      </p>
                      <p className="fw-bold text-warning fs-4 mb-3">
                        ${producto.precio.toLocaleString()}
                      </p>
                      <div className="mt-auto d-grid gap-2">
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
              ))}
            </div>

            <div className="text-center mt-5">
              <Link to="/categorias" className="btn btn-outline-secondary">
                <i className="bi bi-arrow-left me-1"></i>Volver a Categorías
              </Link>
            </div>
          </>
        )}
      </section>
    </>
  );
};

export default CategoriaDetalle;