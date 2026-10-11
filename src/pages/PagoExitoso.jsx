import React from 'react';
import { Link } from 'react-router-dom';

const PagoExitoso = () => {
  return (
    <div className="text-center mt-5 p-5 bg-white shadow-sm rounded">
      <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '5rem' }}></i>
      <h1 className="mt-3 text-success fw-bold">¡Pago Exitoso!</h1>
      <p className="lead text-muted">Tu pedido ha sido procesado correctamente y ya está en preparación.</p>
      <Link to="/" className="btn btn-outline-primary mt-4 px-4 py-2 fw-bold">
        Volver a la tienda
      </Link>
    </div>
  );
};

export default PagoExitoso;