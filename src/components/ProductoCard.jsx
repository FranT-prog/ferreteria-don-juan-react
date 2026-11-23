import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Componente Funcional: ProductoCard
 */
const ProductoCard = ({ producto, onActualizarCarrito }) => {
  const [cantidad, setCantidad] = useState(1);

  const handleSumar = () => {
    if (cantidad < producto.stock) {
      setCantidad(cantidad + 1);
    }
  };

  const handleRestar = () => {
    if (cantidad > 1) {
      setCantidad(cantidad - 1);
    }
  };

  const agregarAlCarrito = () => {
    let carrito = JSON.parse(localStorage.getItem('react_carrito')) || [];
    const existe = carrito.find(item => String(item.id) === String(producto.id));

    if (existe) {
      carrito = carrito.map(item => {
        if (String(item.id) === String(producto.id)) {
          const nuevaCantidad = Math.min((item.cantidad || 1) + cantidad, producto.stock);
          return { ...item, stock: producto.stock, cantidad: nuevaCantidad };
        }
        return item;
      });
    } else {
      carrito.push({ ...producto, cantidad });
    }

    localStorage.setItem('react_carrito', JSON.stringify(carrito));

    if (onActualizarCarrito) onActualizarCarrito();
    setCantidad(1);
  };

  return (
    <div className="card h-100 shadow-sm border-0">
      <img
        src={producto.imagen || 'https://via.placeholder.com/300x200?text=Producto'}
        className="card-img-top"
        alt={producto.nombre}
        style={{ height: '180px', objectFit: 'cover' }}
      />

      <div className="card-body d-flex flex-column p-3">
        <span className="badge bg-secondary mb-2 align-self-start">
          {producto.categoria || 'Herramientas'}
        </span>

        <h5 className="card-title fw-bold text-dark fs-6 mb-1">{producto.nombre}</h5>
        <p className="card-text text-muted small mb-2">Cód: {producto.codigo || producto.id}</p>

        <div className="mb-2">
          <span className={`badge ${producto.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
            Stock: {producto.stock} unidades
          </span>
        </div>

        <div className="mt-auto pt-2">
          <h4 className="fw-bold text-danger mb-3">
            ${producto.precio ? producto.precio.toLocaleString('es-CL') : 0}
          </h4>

          {producto.stock > 0 && (
            <div className="d-flex align-items-center justify-content-center mb-3">
              <button
                className="btn btn-sm btn-outline-secondary px-3"
                onClick={handleRestar}
                disabled={cantidad <= 1}
              >
                -
              </button>
              <span className="mx-3 fw-bold fs-5">{cantidad}</span>
              <button
                className="btn btn-sm btn-outline-secondary px-3"
                onClick={handleSumar}
                disabled={cantidad >= producto.stock}
              >
                +
              </button>
            </div>
          )}

          <div className="d-grid gap-2">
            <button
              onClick={agregarAlCarrito}
              className="btn btn-warning fw-bold text-dark btn-sm"
              disabled={producto.stock <= 0}
            >
              <i className="bi bi-cart-plus me-1"></i> Añadir al Carrito
            </button>

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