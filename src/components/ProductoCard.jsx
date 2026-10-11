import React from 'react';
import { Link } from 'react-router-dom';

const ProductoCard = ({ producto, onActualizarCarrito }) => {
  const agregarAlCarrito = () => {
    let carrito = JSON.parse(localStorage.getItem('react_carrito')) || [];
    const existe = carrito.find(item => item.id === producto.id);

    if (existe) {
      carrito = carrito.map(item =>
        item.id === producto.id ? { ...item, cantidad: (item.cantidad || 1) + 1 } : item
      );
    } else {
      carrito.push({ ...producto, cantidad: 1 });
    }

    localStorage.setItem('react_carrito', JSON.stringify(carrito));
    let productos = JSON.parse(localStorage.getItem('react_productos')) || [];
  productos = productos.map(p =>
    p.id === producto.id
      ? { ...p, stock: Math.max(0, p.stock - 1) }
      : p
  );
  localStorage.setItem('react_productos', JSON.stringify(productos));
  window.location.reload();

    if (onActualizarCarrito) onActualizarCarrito();
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
        <p className="card-text text-muted small mb-2">Cód: {producto.id}</p>
        
        <div className="mb-2">
          <span className={`badge ${producto.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
            Stock: {producto.stock} unidades
          </span>
        </div>

        <div className="mt-auto pt-2">
          <h4 className="fw-bold text-danger mb-3">
            ${producto.precio ? producto.precio.toLocaleString() : producto.precio}
          </h4>
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