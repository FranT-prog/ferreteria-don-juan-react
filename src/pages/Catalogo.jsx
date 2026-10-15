import React, { useState, useEffect } from 'react';
import ProductoCard from '../components/ProductoCard';

/**
 * Componente de Página: Catalogo
 * 
 * Descripción: Muestra el catálogo principal de productos con barra de búsqueda,
 * filtrado por categorías dinámicas y renderizado de tarjetas reutilizables (<ProductoCard />).
 * 
 * Props Recibidas (Paso de Parámetros):
 * @param {Function} onActualizarCarrito - Callback proveniente del componente global/padre para actualizar el contador del carrito en el Navbar.
 * 
 * Criterios Evaluados Aplicados:
 * 1. Manejo de Estado (useState) y Efectos (useEffect): Maneja la lista de productos y los filtros activos (búsqueda y categoría).
 * 2. Componentes de Bootstrap: Uso de banners (`bg-dark`), controles de formulario (`input-group`, `form-control`, `form-select`) y grilla responsiva (`row row-cols-*`).
 * 3. Renderizado de Componentes Personalizados y Reutilización: Pasa la información individual de cada producto como `props` a `<ProductoCard />`.
 */
const Catalogo = ({ onActualizarCarrito }) => {
  // Estado local para almacenar el listado completo de productos recuperados de localStorage
  const [productos, setProductos] = useState([]);
  
  // Estado local para capturar el texto ingresado en la barra de búsqueda
  const [busqueda, setBusqueda] = useState('');
  
  // Estado local para almacenar la categoría seleccionada en el menú desplegable
  const [categoria, setCategoria] = useState('Todas');

  /**
   * Hook useEffect: Se ejecuta una sola vez al cargar la página en el DOM.
   * Carga los productos desde 'localStorage'. Si no existen o la lista está vacía,
   * crea un listado semilla inicial y lo guarda en memoria local.
   */
  useEffect(() => {
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

  /**
   * Filtrado Combinado en Tiempo Real:
   * Evalúa si cada producto coincide tanto con el texto buscado (ignorando mayúsculas/minúsculas)
   * como con la categoría seleccionada.
   */
  const productosFiltrados = productos.filter(prod => {
    const coincideBusqueda = prod.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = categoria === 'Todas' || prod.categoria === categoria;
    return coincideBusqueda && coincideCategoria;
  });

  // Obtención dinámica de categorías únicas existentes utilizando Set de ES6
  const categoriasUnicas = ['Todas', ...new Set(productos.map(p => p.categoria || 'Sin categoría'))];

  return (
    <div>
      {/* Banner / Encabezado de la Sección con estilos oscuros y responsivos de Bootstrap */}
      <div className="bg-dark text-white p-3 p-md-4 rounded-3 shadow-sm mb-3 mb-md-4 text-center">
        <h1 className="fw-bold mb-2 fs-3 fs-md-1">Catálogo de Productos</h1>
        <p className="text-white-50 mb-0 small small-md">Encuentra las mejores herramientas y materiales para tu proyecto.</p>
      </div>

      {/* FILTROS: Tarjeta que contiene la barra de búsqueda y el menú desplegable de categorías */}
      <div className="card shadow-sm border-0 mb-3 mb-md-4 bg-light">
        <div className="card-body p-3">
          <div className="row g-2 g-md-3">
            {/* Campo de búsqueda con icono integrado de Bootstrap (input-group) */}
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
            {/* Desplegable de selección de categoría */}
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

      {/* GRILLA: Despliegue responsivo de productos (1 col en móvil, 2 en tablet, 3-4 en escritorio) */}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3 g-md-4">
        {/* Mensaje condicional si no hay coincidencias en la búsqueda */}
        {productosFiltrados.length === 0 ? (
          <div className="col-12 text-center py-5">
            <i className="bi bi-search display-1 text-muted mb-3 d-block"></i>
            <h4 className="text-muted">No se encontraron productos</h4>
            <p>Intenta con otros términos de búsqueda o cambia la categoría.</p>
          </div>
        ) : (
          /* Mapeo del arreglo filtrado pasando props al componente hijo ProductoCard */
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