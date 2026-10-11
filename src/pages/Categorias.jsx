import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const productos = JSON.parse(localStorage.getItem('react_productos')) || [];
    // Obtener categorías únicas con conteo de productos
    const conteo = productos.reduce((acc, prod) => {
      acc[prod.categoria] = (acc[prod.categoria] || 0) + 1;
      return acc;
    }, {});
    
    const listaCategorias = Object.keys(conteo).map((nombre) => ({
      nombre,
      cantidad: conteo[nombre]
    }));
    
    setCategorias(listaCategorias);
  }, []);

  // Mapeo de categoría a slug para URL
  const slugify = (texto) => {
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-');
  };

  return (
    <>
      {/* Banner */}
      <section
        className="text-white text-center py-5 mb-5 rounded"
        style={{ background: 'linear-gradient(135deg, #212529 0%, #D84315 100%)' }}
      >
        <div className="container">
          <h1 className="display-4 fw-bold mb-3">
            <i className="bi bi-grid-3x3-gap-fill me-2"></i>
            Nuestras Categorías
          </h1>
          <p className="lead mb-0">Explora nuestros productos por categoría</p>
        </div>
      </section>

      {/* Grid de categorías */}
      <section className="mb-5">
        <div className="row g-4 justify-content-center">
          {categorias.length === 0 ? (
            <div className="col-12 text-center">
              <p className="text-muted">Cargando categorías...</p>
            </div>
          ) : (
            categorias.map((cat) => {
              const slug = slugify(cat.nombre);
              const esHerramientas = cat.nombre === 'Herramientas Manuales';
              
              return (
                <div className="col-12 col-md-5" key={cat.nombre}>
                  <Link to={`/categoria/${slug}`} className="text-decoration-none">
                    <div className="card border-0 shadow-lg h-100 text-center category-card" style={{ transition: 'transform 0.3s' }}>
                      <div
                        className="card-body py-5"
                        style={{
                          background: esHerramientas
                            ? 'linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%)'
                            : 'linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)',
                          color: 'white',
                          borderRadius: '0.5rem'
                        }}
                      >
                        <i
                          className={`bi ${esHerramientas ? 'bi-hammer' : 'bi-bricks'}`}
                          style={{ fontSize: '4rem' }}
                        ></i>
                        <h3 className="fw-bold mt-3 mb-2">{cat.nombre}</h3>
                        <p className="mb-0">{cat.cantidad} productos disponibles</p>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })
          )}
        </div>
      </section>

      <style>{`
        .category-card:hover {
          transform: translateY(-8px);
        }
      `}</style>
    </>
  );
};

export default Categorias;