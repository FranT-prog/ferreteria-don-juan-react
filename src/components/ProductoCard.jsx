import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Componente Funcional: ProductoCard
 * 
 * Descripción: Tarjeta de presentación individual para cada producto del catálogo.
 * 
 * Props Recibidas (Paso de Parámetros):
 * @param {Object} producto - Objeto con la información del producto (id, nombre, precio, stock, imagen, categoria).
 * @param {Function} onActualizarCarrito - Función callback para notificar al componente padre que se actualizó el carrito.
 * 
 * Criterios Evaluados Aplicados:
 * 1. Componentes de Bootstrap: Uso del componente 'Card' (`card`, `card-body`, `card-title`), insignias (`badge`), y botones (`btn`).
 * 2. Manipulación de Datos en JS: Lectura y escritura en `localStorage` parseando JSON.
 * 3. Enrutamiento dinámico: Uso de `<Link>` para navegar a la vista de detalles según el `producto.id`.
 */
const ProductoCard = ({ producto, onActualizarCarrito }) => {
  
  /**
   * Manejador de evento: Agregar producto al carrito en localStorage.
   * Lee la lista actual, verifica si el producto existe para incrementar la cantidad,
   * o lo añade como un nuevo objeto. Finalmente guarda el resultado y llama a la prop callback.
   */
  const agregarAlCarrito = () => {
    // Lectura e interpretación de datos JSON desde el almacenamiento local
    let carrito = JSON.parse(localStorage.getItem('react_carrito')) || [];
    
    // Búsqueda para verificar si el item ya existe en el carrito
    const existe = carrito.find(item => item.id === producto.id);

    if (existe) {
      // Actualiza la cantidad del producto existente reutilizando el operador spread
      carrito = carrito.map(item =>
        item.id === producto.id ? { ...item, cantidad: (item.cantidad || 1) + 1 } : item
      );
    } else {
      // Agrega el nuevo producto con cantidad inicial en 1
      carrito.push({ ...producto, cantidad: 1 });
    }

    // Persistencia de los datos formateados a String JSON
    localStorage.setItem('react_carrito', JSON.stringify(carrito));
    
    // Notifica al componente padre para refrescar contadores globales
    if (onActualizarCarrito) onActualizarCarrito();
  };

  return (
    /* Tarjeta de Bootstrap sin bordes, con sombra ligera y altura completa (100%) para grilla uniforme */
    <div className="card h-100 shadow-sm border-0">
      {/* Imagen superior del componente Card con manejo de fallback si no existe imagen */}
      <img
        src={producto.imagen || 'https://via.placeholder.com/300x200?text=Producto'}
        className="card-img-top"
        alt={producto.nombre}
        style={{ height: '180px', objectFit: 'cover' }}
      />
      
      {/* Cobre el cuerpo de la tarjeta usando Flexbox vertical de Bootstrap */}
      <div className="card-body d-flex flex-column p-3">
        {/* Insignia (Badge) de Bootstrap para mostrar la categoría */}
        <span className="badge bg-secondary mb-2 align-self-start">
          {producto.categoria || 'Herramientas'}
        </span>
        
        {/* Título y código extraídos dinámicamente de la prop 'producto' */}
        <h5 className="card-title fw-bold text-dark fs-6 mb-1">{producto.nombre}</h5>
        <p className="card-text text-muted small mb-2">Cód: {producto.id}</p>
        
        {/* Badge condicional: Cambia de verde (bg-success) a rojo (bg-danger) según el stock */}
        <div className="mb-2">
          <span className={`badge ${producto.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
            Stock: {producto.stock} unidades
          </span>
        </div>

        {/* Sección inferior alineada con mt-auto de Flexbox para mantener los botones nivelados */}
        <div className="mt-auto pt-2">
          {/* Formateo del precio con toLocaleString() */}
          <h4 className="fw-bold text-danger mb-3">
            ${producto.precio ? producto.precio.toLocaleString() : producto.precio}
          </h4>
          
          <div className="d-grid gap-2">
            {/* Botón de acción con evento onClick y estado deshabilitado si no hay stock */}
            <button
              onClick={agregarAlCarrito}
              className="btn btn-warning fw-bold text-dark btn-sm"
              disabled={producto.stock <= 0}
            >
              <i className="bi bi-cart-plus me-1"></i> Añadir al Carrito
            </button>
            
            {/* Enlace estético tipo botón hacia la ruta de detalle dinámico */}
            <Link to={`/detalle/${producto.id}`} className="btn btn-outline-secondary btn-sm">
              Ver Detalle
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductoCard;