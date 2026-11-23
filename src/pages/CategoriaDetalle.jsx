import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductoService from '../services/ProductoService';

const slugify = (texto = '') =>
  texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-');

/**
 * Componente de Página: CategoriaDetalle
 *
 * Descripción: Muestra los productos de una categoría específica consultados
 * desde el backend Spring Boot (/api/v1/productos).
 */
const CategoriaDetalle = () => {
  const { categoria } = useParams();
  const [productos, setProductos] = useState([]);
  const [nombreCategoria, setNombreCategoria] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarPorCategoria = async () => {
      setCargando(true);
      try {
        const { data: todosProductos } = await ProductoService.obtenerTodos();
        const filtrados = (todosProductos || []).filter(
          (p) => slugify(p.categoria || '') === categoria
        );

        setProductos(filtrados);

        if (filtrados.length > 0) {
          setNombreCategoria(filtrados[0].categoria);
        } else {
          const categoriasGuardadas = JSON.parse(localStorage.getItem('react_categorias')) || [];
          const catEncontrada = categoriasGuardadas.find((c) => slugify(c.nombre) === categoria);
          setNombreCategoria(catEncontrada ? catEncontrada.nombre : categoria.replace(/-/g, ' '));
        }
      } catch (error) {
        console.error('Error al cargar productos por categoría:', error);
      } finally {
        setCargando(false);
      }
    };

    cargarPorCategoria();
  }, [categoria]);

  return (
    <>
      <section className="text-white text-center py-5 mb-5 rounded" style={{ background: 'linear-gradient(135deg, #198754 0%, #20c997 100%)' }}>
        <div className="container">
          <i className="bi bi-box-seam" style={{ fontSize: '3rem' }}></i>
          <h1 className="display-4 fw-bold mt-3 mb-2">{nombreCategoria}</h1>
          <p className="lead mb-0">{productos.length} productos disponibles</p>
        </div>
      </section>

      <section className="mb-5">
        {cargando ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success mb-2" role="status"></div>
            <p className="text-muted">Cargando productos...</p>
          </div>
        ) : productos.length === 0 ? (
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
                      src={producto.imagen || 'https://via.placeholder.com/300x200?text=Producto'}
                      alt={producto.nombre}
                      className="card-img-top"
                      style={{ height: '220px', objectFit: 'cover' }}
                    />
                    <div className="card-body d-flex flex-column">
                      <span className="badge bg-secondary align-self-start mb-2">{producto.categoria}</span>
                      <h5 className="fw-bold">{producto.nombre}</h5>
                      <p className="mb-2">
                        <span className={`badge ${producto.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                          Stock: {producto.stock}
                        </span>
                      </p>
                      <p className="fw-bold text-warning fs-4 mb-3">
                        ${(producto.precio || 0).toLocaleString('es-CL')}
                      </p>
                      <div className="mt-auto d-grid gap-2">
                        <Link to={`/detalle/${producto.id}`} className="btn btn-warning fw-bold">
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