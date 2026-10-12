import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const DetalleProducto = ({ onActualizarCarrito }) => {
  const { id } = useParams(); // Obtenemos el ID de la URL
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [enCarrito, setEnCarrito] = useState(false);

  useEffect(() => {
    // 1. Buscar el producto en la "base de datos"
    const prodsGuardados = JSON.parse(localStorage.getItem('react_productos')) || [];
    const prodEncontrado = prodsGuardados.find(p => p.id === id);

    if (prodEncontrado) {
      setProducto(prodEncontrado);

      // 2. Verificar si ya está en el carrito
      const carritoGuardado = JSON.parse(localStorage.getItem('react_carrito')) || [];
      const existe = carritoGuardado.some(item => item.id === id);
      setEnCarrito(existe);
    } else {
      // Si no existe, podemos redirigir a la tienda o mostrar error
      navigate('/'); 
    }
  }, [id, navigate]);

  const handleCarrito = () => {
    let carritoActual = JSON.parse(localStorage.getItem('react_carrito')) || [];
    
    if (enCarrito) {
      carritoActual = carritoActual.filter(item => item.id !== id);
      setEnCarrito(false);
    } else {
      carritoActual.push(producto);
      setEnCarrito(true);
    }

    localStorage.setItem('react_carrito', JSON.stringify(carritoActual));
    if (onActualizarCarrito) onActualizarCarrito();
  };

  if (!producto) {
    return <div className="text-center mt-5">Cargando...</div>;
  }

  return (
    <div>
      <div className="mb-3">
        <Link to="/catalogo" className="btn btn-outline-secondary btn-sm">
          <i className="bi bi-arrow-left"></i> Volver al Catálogo
        </Link>
      </div>

      <div className="card shadow-sm border-0">
        <div className="row g-0 align-items-center">
          <div className="col-md-5">
            <img 
              src={producto.imagen} 
              className="img-fluid rounded-start p-3" 
              alt={producto.nombre} 
              style={{ maxHeight: '400px', width: '100%', objectFit: 'contain' }}
            />
          </div>
          <div className="col-md-7">
            <div className="card-body p-4 p-md-5">
              <span className="badge bg-danger mb-2">Nuevo</span>
              <h1 className="card-title fw-bold display-6">{producto.nombre}</h1>
              <p className="text-muted mb-4">Código único del fabricante: <strong className="text-dark">{producto.id}</strong></p>
              
              <div className="bg-light p-3 rounded mb-4">
                <h6 className="text-muted m-0 mb-1">Stock Disponible</h6>
                <div className="d-flex align-items-center gap-2">
                  <span className={`badge ${producto.stock > 0 ? 'bg-success' : 'bg-danger'} fs-6`}>
                    {producto.stock} unidades
                  </span>
                  <span className="text-muted small">| Categoría: {producto.categoria}</span>
                </div>
              </div>

              <div className="mb-5">
                <p className="text-muted m-0">Precio de lista (con IVA):</p>
                <span className="display-5 fw-bold text-danger">${producto.precio.toLocaleString()}</span>
              </div>

              <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                <button 
                  className={`btn btn-lg px-5 fw-bold ${enCarrito ? 'btn-success' : 'btn-warning text-white'}`}
                  onClick={handleCarrito}
                  disabled={producto.stock <= 0}
                >
                  <i className={`bi ${enCarrito ? 'bi-cart-check-fill' : 'bi-cart-plus-fill'} me-2`}></i>
                  {enCarrito ? 'En el Carrito' : 'Agregar al Carrito'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-white shadow-sm rounded">
        <h4>Descripción del Producto</h4>
        <p className="lead text-secondary mb-4">
          {producto.descripcion || 'Este producto no cuenta con especificaciones detalladas registradas por el momento.'}
        </p>
      </div>
    </div>
  );
};

export default DetalleProducto;