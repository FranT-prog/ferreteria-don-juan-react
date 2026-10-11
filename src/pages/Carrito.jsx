import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Carrito = ({ onActualizarCarrito }) => {
  const [carrito, setCarrito] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem('react_carrito')) || [];
    setCarrito(carritoGuardado);
  }, []);

  const eliminarDelCarrito = (id) => {
    const nuevoCarrito = carrito.filter(item => item.id !== id);
    setCarrito(nuevoCarrito);
    localStorage.setItem('react_carrito', JSON.stringify(nuevoCarrito));
    if (onActualizarCarrito) onActualizarCarrito();
  };

  const calcularTotal = () => {
    return carrito.reduce((total, item) => total + item.precio, 0);
  };

  const procesarPago = () => {
    // Vaciamos el carrito al pagar
    localStorage.removeItem('react_carrito');
    if (onActualizarCarrito) onActualizarCarrito();
    // Redirigimos a la pantalla de éxito
    navigate('/pago-exitoso');
  };

  return (
    <div>
      <h2 className="fw-bold text-dark mb-4">Tu Carrito de Compras</h2>
      
      {carrito.length === 0 ? (
        <div className="alert alert-info shadow-sm">
          Tu carrito está vacío. <Link to="/" className="alert-link">Vuelve al catálogo</Link> para agregar productos.
        </div>
      ) : (
        <div className="row">
          <div className="col-md-8">
            <ul className="list-group mb-3 shadow-sm">
              {carrito.map(item => (
                <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center p-3">
                  <div className="d-flex gap-3 align-items-center">
                    <img src={item.imagen} alt={item.nombre} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '5px' }} />
                    <div>
                      <h6 className="my-0 fw-bold">{item.nombre}</h6>
                      <small className="text-muted">Cód: {item.id}</small>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <span className="text-dark fw-bold fs-5">${item.precio.toLocaleString()}</span>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => eliminarDelCarrito(item.id)}>
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm border-0 bg-light">
              <div className="card-body">
                <h5 className="card-title fw-bold">Resumen de Compra</h5>
                <hr />
                <div className="d-flex justify-content-between mb-4">
                  <span className="fs-5">Total a pagar:</span>
                  <strong className="fs-4 text-danger">${calcularTotal().toLocaleString()}</strong>
                </div>
                <button className="btn btn-success btn-lg w-100 fw-bold" onClick={procesarPago}>
                  <i className="bi bi-credit-card-fill me-2"></i> Pagar Ahora
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Carrito;