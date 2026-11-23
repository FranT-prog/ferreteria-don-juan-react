import React, { useState, useEffect } from 'react';
import ProductoCard from '../components/ProductoCard';
import ProductoService from '../services/ProductoService';

/**
 * Componente de Página: Catalogo
 *
 * Descripción: Muestra el catálogo principal de productos obtenidos desde el backend
 * Spring Boot (/api/v1/productos) con barra de búsqueda, filtrado por categorías
 * dinámicas y renderizado de tarjetas reutilizables (<ProductoCard />).
 *
 * @param {Function} onActualizarCarrito - Callback para actualizar el contador del carrito en el Navbar.
 */
const Catalogo = ({ onActualizarCarrito }) => {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('Todas');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setError('');
        const { data } = await ProductoService.obtenerTodos();
        setProductos(data);
      } catch (err) {
        console.error('Error al cargar productos:', err);
        setError('No se pudieron cargar los productos. Verifica que el backend esté en ejecución.');
      } finally {
        setCargando(false);
      }
    };

    cargarProductos();
  }, []);

  const productosFiltrados = productos.filter(prod => {
    const coincideBusqueda = (prod.nombre || '').toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = categoria === 'Todas' || prod.categoria === categoria;
    return coincideBusqueda && coincideCategoria;
  });

  const categoriasUnicas = ['Todas', ...new Set(productos.map(p => p.categoria || 'Sin categoría'))];

  return (
    <div>
      {/* Banner / Encabezado */}
      <div className="bg-dark text-white p-3 p-md-4 rounded-3 shadow-sm mb-3 mb-md-4 text-center">
        <h1 className="fw-bold mb-2 fs-3 fs-md-1">Catálogo de Productos</h1>
        <p className="text-white-50 mb-0 small small-md">Encuentra las mejores herramientas y materiales para tu proyecto.</p>
      </div>

      {/* FILTROS */}
      <div className="card shadow-sm border-0 mb-3 mb-md-4 bg-light">
        <div className="card-body p-3">
          <div className="row g-2 g-md-3">
            <div className="col-12 col-md-8">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Buscar producto..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
            </div>
            <div className="col-12 col-md-4">
              <select
                className="form-select fw-bold text-secondary"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              >
                {categoriasUnicas.map((cat, index) => (
                  <option key={index} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ESTADO DE CARGA / ERROR / GRILLA */}
      {cargando ? (
        <div className="text-center py-5">
          <div className="spinner-border text-warning mb-3" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="text-muted">Cargando catálogo desde el servidor...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger text-center py-3">{error}</div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3 g-md-4">
          {productosFiltrados.length === 0 ? (
            <div className="col-12 text-center py-5">
              <i className="bi bi-search display-1 text-muted mb-3 d-block"></i>
              <h4 className="text-muted">No se encontraron productos</h4>
              <p>Intenta con otros términos de búsqueda o cambia la categoría.</p>
            </div>
          ) : (
            productosFiltrados.map(producto => (
              <div className="col d-flex align-items-stretch" key={producto.id}>
                <ProductoCard
                  producto={producto}
                  onActualizarCarrito={onActualizarCarrito}
                />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Catalogo;