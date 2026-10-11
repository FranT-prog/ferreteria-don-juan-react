import React from 'react';
import { Link } from 'react-router-dom';

const PagoRechazado = () => {
  return (
    <div className="container text-center mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-sm border-danger">
            <div className="card-body py-5">
              <i className="bi bi-x-circle-fill text-danger" style={{ fontSize: '4rem' }}></i>
              <h2 className="mt-4 text-danger">No se pudo realizar el pago</h2>
              <p className="text-muted mt-3">
                Lo sentimos, hubo un problema al procesar tu transacción. Por favor, verifica los datos ingresados o intenta con otro medio de pago.
              </p>
              <div className="mt-4">
                <Link to="/carrito" className="btn btn-outline-danger w-100 mb-2">
                  Volver al Carrito
                </Link>
                <Link to="/" className="btn btn-primary w-100">
                  Volver al Inicio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PagoRechazado;