import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DIRECCION_TIENDA, HORARIO_ATENCION, formatearFechaLarga } from '../utils/tienda';

/**
 * Componente de Página: PagoExitoso
 *
 * Descripción: Vista de confirmación recibida tras completar el flujo de compra/pago en el carrito.
 * Notifica al cliente que la orden fue procesada con éxito. Si eligió "Retiro en tienda", le indica
 * dónde, desde qué fecha (asignada por la tienda) y en qué horario puede retirar su pedido.
 *
 * Datos recibidos: el Carrito navega con `state: { tipoEntrega, fechaRetiro }` (React Router).
 */
const PagoExitoso = () => {
  const { state } = useLocation();
  const esRetiro = state?.tipoEntrega === 'Retiro';

  return (
    /* Contenedor principal estilizado como una tarjeta flotante de confirmación */
    <div className="text-center mt-5 p-5 bg-white shadow-sm rounded">
      {/* Icono vectorial gigante de éxito de Bootstrap Icons */}
      <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '5rem' }}></i>

      {/* Mensaje principal de confirmación */}
      <h1 className="mt-3 text-success fw-bold">¡Pago Exitoso!</h1>

      {/* Detalle secundario con tipografía suavizada */}
      <p className="lead text-muted">Tu pedido ha sido procesado correctamente y ya está en preparación.</p>

      {/* Solo para retiro en tienda: dónde, desde cuándo y en qué horario retirar */}
      {esRetiro && (
        <div className="alert alert-success d-inline-block text-start mt-2 mb-0" role="alert">
          <i className="bi bi-shop me-2"></i>
          Puedes retirar tu pedido en <strong>{DIRECCION_TIENDA}</strong> desde el{' '}
          <strong>{formatearFechaLarga(state.fechaRetiro)}</strong>, en nuestro horario de atención:{' '}
          {HORARIO_ATENCION}.
        </div>
      )}

      <div className="d-flex flex-wrap justify-content-center gap-2 mt-4">
        <Link to="/mi-cuenta" className="btn btn-success px-4 py-2 fw-bold">
          <i className="bi bi-bag-check me-2"></i>Ver mis pedidos
        </Link>
        <Link to="/" className="btn btn-outline-primary px-4 py-2 fw-bold">
          Volver a la tienda
        </Link>
      </div>
    </div>
  );
};

export default PagoExitoso;