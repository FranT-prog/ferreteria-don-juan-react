import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);

  const colores = [
    'linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%)', 
    'linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)', 
    'linear-gradient(135deg, #198754 0%, #20c997 100%)', 
    'linear-gradient(135deg, #6f42c1 0%, #d63384 100%)'
  ];
  const iconos = ['bi-hammer', 'bi-bricks', 'bi-paint-bucket', 'bi-wrench'];

  useEffect(() => {
    const catsGuardadas = JSON.parse(localStorage.getItem('react_categorias')) || [];
    const productos = JSON.parse(localStorage.getItem('react_productos')) || [];
    
    // Contamos cuántos productos tiene asignada cada categoría
    const listaConConteo = catsGuardadas.map(cat => {
      const cantidad = productos.filter(p => p.categoria === cat.nombre).length;
      return { ...cat, cantidad };
    });
    
    setCategorias(listaConConteo);
  }, []);

  const slugify = (texto) => {
    return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-');
  };

  return (
    <>
      <section className="text-white text-center py-5 mb-5 rounded" style={{ background: 'linear-gradient(135deg, #212529 0%, #D84315 100%)' }}>
        <div className="container">
          <h1 className="display-4 fw-bold mb-3"><i className="bi bi-grid-3x3-gap-fill me-2"></i>Nuestras Categorías</h1>
          <p className="lead mb-0">Explora nuestros productos por categoría</p>
        </div>
      </section>

      <section className="mb-5">
        <div className="row g-4 justify-content-center">
          {categorias.length === 0 ? (
            <div className="col-12 text-center"><p className="text-muted">No hay categorías creadas aún.</p></div>
          ) : (
            categorias.map((cat, index) => {
              const slug = slugify(cat.nombre);
              const color = colores[index % colores.length];
              const icono = iconos[index % iconos.length];
              
              return (
                <div className="col-12 col-md-5" key={cat.id || cat.nombre}>
                  <Link to={`/categoria/${slug}`} className="text-decoration-none">
                    <div className="card border-0 shadow-lg h-100 text-center category-card" style={{ transition: 'transform 0.3s' }}>
                      <div className="card-body py-5" style={{ background: color, color: 'white', borderRadius: '0.5rem' }}>
                        <i className={`bi ${icono}`} style={{ fontSize: '4rem' }}></i>
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

      <style>{`.category-card:hover { transform: translateY(-8px); }`}</style>
    </>
  );
};

export default Categorias;