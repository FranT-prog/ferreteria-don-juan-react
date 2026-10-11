import React from 'react';
import { Link } from 'react-router-dom';

const ProductoCard = ({ producto, enCarrito, onAgregarRemover }) => {
  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100 shadow-sm">
        <img 
          src={producto.imagen} 
          className="card-img-top" 
          alt={producto.nombre} 
          style={{ height: '180px', objectFit: 'cover' }}
        />
        <div className="card-body d-flex flex-column">
          <span className="badge bg-secondary mb-2 w-auto align-self-start">
            {producto.categoria}
          </span>
          <h5 className="card-title fw-bold">{producto.nombre}</h5>
          <p className="card-text text-muted small mb-1">Cód: {producto.id}</p>
          
          <div className="mb-2">
            <span className={`badge ${producto.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
              Stock: {producto.stock} unidades
            </span>
          </div>

          <p className="fs-4 fw-bold text-danger my-2">${producto.precio.toLocaleString()}</p>

          <div className="mt-auto d-flex gap-2">
            <Link to={`/detalle/${producto.id}`} className="btn btn-outline-primary w-50">
              Ver detalle
            </Link>
            <button 
              className={`btn w-50 ${enCarrito ? 'btn-success' : 'btn-warning text-white'}`}
              onClick={() => onAgregarRemover(producto)}
              disabled={producto.stock <= 0}
            >
              {enCarrito ? 'Comprado ✓' : 'Comprar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductoCard;