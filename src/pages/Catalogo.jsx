import React, { useState, useEffect } from 'react';
import ProductoCard from '../components/ProductoCard';

const Catalogo = ({ onActualizarCarrito }) => {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('Todas');

  useEffect(() => {
    // Inicializar catálogo si no existe en localStorage
    let productosGuardados = JSON.parse(localStorage.getItem('react_productos'));
    
    if (!productosGuardados || productosGuardados.length === 0) {
      productosGuardados = [
        { id: 'PROD-001', nombre: 'Martillo Cincelador 16oz', precio: 12990, stock: 15, categoria: 'Herramientas Manuales', imagen: 'https://via.placeholder.com/300x200?text=Martillo' },
        { id: 'PROD-002', nombre: 'Juego de Destornilladores (6 pzas)', precio: 12000, stock: 8, categoria: 'Herramientas Manuales', imagen: 'https://via.placeholder.com/300x200?text=Destornilladores' },
        { id: 'PROD-003', nombre: 'Taladro Inalámbrico 20V', precio: 85990, stock: 5, categoria: 'Herramientas Eléctricas', imagen: 'https://via.placeholder.com/300x200?text=Taladro' },
        { id: 'PROD-004', nombre: 'Sierra Manual para Madera 18"', precio: 14500, stock: 20, categoria: 'Herramientas Manuales', imagen: 'https://via.placeholder.com/300x200?text=Sierra' },
        { id: 'PROD-005', nombre: 'Cemento Melón Extra 25kg', precio: 4500, stock: 50, categoria: 'Materiales de Construcción', imagen: 'https://via.placeholder.com/300x200?text=Cemento' }
      ];
      localStorage.setItem('react_productos', JSON.stringify(productosGuardados));
    }
    
    setProductos(productosGuardados);
  }, []);

  // Lógica de filtrado doble (Por nombre y por categoría)
  const productosFiltrados = productos.filter(prod => {
    const coincideBusqueda = prod.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = categoria === 'Todas' || prod.categoria === categoria;
    return coincideBusqueda && coincideCategoria;
  });

  // Extraer categorías únicas para el selector dinámico
  const categoriasUnicas = ['Todas', ...new Set(productos.map(p => p.categoria || 'Sin categoría'))];

  return (
    <div>
      <div className="bg-dark text-white p-4 rounded-3 shadow-sm mb-4 text-center">
        <h1 className="fw-bold mb-2">Catálogo de Productos</h1>
        <p className="text-white-50 mb-0">Encuentra las mejores herramientas y materiales para tu proyecto.</p>
      </div>

      {/* SECCIÓN DE FILTROS DE BÚSQUEDA */}
      <div className="card shadow-sm border-0 mb-4 bg-light">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-8">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <i className="bi bi-search"></i>
                </span>
                <input 
                  type="text" 
                  className="form-control border-start-0" 
                  placeholder="Buscar producto por nombre..." 
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
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

      {/* GRILLA DE PRODUCTOS */}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
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
    </div>
  );
};

export default Catalogo;