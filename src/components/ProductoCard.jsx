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
    if (onActualizarCarrito) onActualizarCarrito();
  };

  // 🎨 Función para obtener el ícono y color según la categoría
  const getEstiloCategoria = () => {
    const categoria = producto.categoria || 'Herramientas Manuales';
    
    if (categoria === 'Herramientas Manuales') {
      return {
        icono: 'bi-hammer',
        gradiente: 'linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%)'
      };
    }
    if (categoria === 'Materiales de Construcción') {
      return {
        icono: 'bi-bricks',
        gradiente: 'linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)'
      };
    }
    // Por defecto
    return {
      icono: 'bi-box-seam',
      gradiente: 'linear-gradient(135deg, #6c757d 0%, #495057 100%)'
    };
  };

  const estilo = getEstiloCategoria();
  const tieneImagen = producto.imagen && producto.imagen.trim() !== '' && !producto.imagen.includes('placeholder');

  return (
    <div className="card h-100 shadow-sm border-0">
      {/* ============================================
          IMAGEN O BANNER CON ÍCONO SEGÚN CATEGORÍA
      ============================================ */}
      {tieneImagen ? (
        <img
          src={producto.imagen}
          className="card-img-top"
          alt={producto.nombre}
          style={{ height: '180px', objectFit: 'cover' }}
        />
      ) : (
        <div
          className="d-flex align-items-center justify-content-center text-white"
          style={{
            height: '180px',
            background: estilo.gradiente
          }}
        >
          <i className={`bi ${estilo.icono}`} style={{ fontSize: '4rem' }}></i>
        </div>
      )}

      <div className="card-body d-flex flex-column p-3">
        {/* Categoría */}
        <span className="badge bg-secondary mb-2 align-self-start">
          {producto.categoria || 'Herramientas'}
        </span>

        {/* Nombre */}
        <h5 className="card-title fw-bold text-dark fs-6 mb-1">{producto.nombre}</h5>

        {/* Código */}
        <p className="card-text text-muted small mb-2">Cód: {producto.id}</p>

        {/* Stock con colores dinámicos */}
        <div className="mb-2">
          <span
            className={`badge ${
              producto.stock > 5
                ? 'bg-success'
                : producto.stock > 0
                ? 'bg-warning text-dark'
                : 'bg-danger'
            }`}
          >
            {producto.stock > 0 ? `Stock: ${producto.stock} unidades` : 'Agotado'}
          </span>
        </div>

        {/* Precio y botones */}
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
              <i className="bi bi-cart-plus me-1"></i>
              {producto.stock > 0 ? 'Añadir al Carrito' : 'Sin Stock'}
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