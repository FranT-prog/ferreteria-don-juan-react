import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

/**
 * Componente de Página: Categorias
 * 
 * Descripción: Presenta la lista principal de categorías de la ferretería
 * calculando de forma dinámica la cantidad de productos asociados a cada una.
 * 
 * Criterios Evaluados Aplicados:
 * 1. Manejo de Estado (useState) y Efectos (useEffect): Carga las categorías y productos de 'localStorage' al iniciar la vista.
 * 2. Componentes y Grillas de Bootstrap: Uso de contenedores (`container`), tarjetas de Bootstrap (`card`), tipografía responsiva y sistema de grilla centrado (`row g-4 justify-content-center`).
 * 3. Enrutamiento Dinámico con React Router: Generación de enlaces `<Link>` navegables con slugs legibles mediante la función `slugify`.
 */
const Categorias = () => {
  // Estado local para almacenar el listado de categorías junto con el conteo de sus productos
  const [categorias, setCategorias] = useState([]);

  // Arreglo de estilos visuales en gradiente para alternar colores dinámicamente en las tarjetas
  const colores = [
    'linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%)', 
    'linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)', 
    'linear-gradient(135deg, #198754 0%, #20c997 100%)', 
    'linear-gradient(135deg, #6f42c1 0%, #d63384 100%)'
  ];
  
  // Arreglo de clases de Bootstrap Icons para asignar un icono ilustrativo a cada categoría
  const iconos = ['bi-hammer', 'bi-bricks', 'bi-paint-bucket', 'bi-wrench'];

  /**
   * Hook useEffect: Se ejecuta al cargar la página en el DOM.
   * Lee las categorías y productos guardados en 'localStorage', calcula cuántos productos
   * pertenecen a cada categoría usando `.filter().length` y actualiza el estado.
   */
  useEffect(() => {
    const catsGuardadas = JSON.parse(localStorage.getItem('react_categorias')) || [];
    const productos = JSON.parse(localStorage.getItem('react_productos')) || [];
    
    // Contamos cuántos productos tiene asignada cada categoría en tiempo real
    const listaConConteo = catsGuardadas.map(cat => {
      const cantidad = productos.filter(p => p.categoria === cat.nombre).length;
      return { ...cat, cantidad };
    });
    
    setCategorias(listaConConteo);
  }, []);

  /**
   * Función auxiliar 'slugify':
   * Transforma el nombre de la categoría a formato amigable para la URL (slug).
   * Ej: "Herramientas Eléctricas" -> "herramientas-electricas"
   */
  const slugify = (texto) => {
    return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-');
  };

  return (
    <>
      {/* Banner / Encabezado estilizado con fondo degradado y tipografía grande de Bootstrap */}
      <section className="text-white text-center py-5 mb-5 rounded" style={{ background: 'linear-gradient(135deg, #212529 0%, #D84315 100%)' }}>
        <div className="container">
          <h1 className="display-4 fw-bold mb-3"><i className="bi bi-grid-3x3-gap-fill me-2"></i>Nuestras Categorías</h1>
          <p className="lead mb-0">Explora nuestros productos por categoría</p>
        </div>
      </section>

      {/* Sección principal de tarjetas de categorías centradas */}
      <section className="mb-5">
        <div className="row g-4 justify-content-center">
          {/* Renderizado Condicional: Mensaje alternativo si no hay categorías creadas */}
          {categorias.length === 0 ? (
            <div className="col-12 text-center"><p className="text-muted">No hay categorías creadas aún.</p></div>
          ) : (
            /* Mapeo del arreglo de categorías para renderizar las tarjetas navegables */
            categorias.map((cat, index) => {
              const slug = slugify(cat.nombre);
              // Asignación cíclica de color e icono según el índice del elemento
              const color = colores[index % colores.length];
              const icono = iconos[index % iconos.length];
              
              return (
                /* Columna responsiva: Ocupa 12 columnas en móvil y 5 columnas centradas en escritorio */
                <div className="col-12 col-md-5" key={cat.id || cat.nombre}>
                  {/* Enlace dinámico hacia la vista detallada de la categoría usando el slug */}
                  <Link to={`/categoria/${slug}`} className="text-decoration-none">
                    {/* Componente Card de Bootstrap con sombra marcada (shadow-lg) */}
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

      {/* Estilos CSS embebidos para la animación suave al pasar el mouse por la tarjeta */}
      <style>{`.category-card:hover { transform: translateY(-8px); }`}</style>
    </>
  );
};

export default Categorias;