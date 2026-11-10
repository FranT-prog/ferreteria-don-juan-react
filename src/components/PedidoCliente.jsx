import React, { useState } from 'react';
import LineaTiempoPedido from './LineaTiempoPedido';
import { esPedidoEnCurso, obtenerFechaEntrega, obtenerItems } from '../utils/pedidos';
import { formatearFecha, formatearPeso, hoyISO } from '../utils/fechas';

// Color e icono de la insignia (badge) según el estado del pedido; coincide con PanelVendedor
const ESTILOS_ESTADO = {
  'Pendiente': { clase: 'bg-warning text-dark', icono: 'bi-clock' },
  'En preparación': { clase: 'bg-info text-dark', icono: 'bi-box-seam' },
  'Despachado': { clase: 'bg-primary', icono: 'bi-truck' },
  'Entregado': { clase: 'bg-success', icono: 'bi-check-circle' },
  'Cancelado': { clase: 'bg-danger', icono: 'bi-x-circle' }
};

/**
 * Componente Funcional: PedidoCliente
 *
 * Descripción: Tarjeta que resume un pedido del cliente (número, estado, fecha de pedido, fecha de entrega,
 * forma de pago y total) con un botón para desplegar el detalle de los productos comprados.
 *
 * Props Recibidas:
 * @param {Object} pedido - Pedido a mostrar.
 * @param {boolean} lineaTiempoSiempreVisible - Si es true, la línea de tiempo se ve siempre (pestaña "En curso");
 *                                              si es false, solo aparece al desplegar el detalle (historial).
 *
 * Criterios Evaluados Aplicados:
 * 1. Manejo de Estado (useState): controla si el detalle está desplegado.
 * 2. Comunicación entre componentes: recibe el pedido por props y delega la línea de tiempo a <LineaTiempoPedido />.
 * 3. Componentes de Bootstrap: card, badge, grilla responsiva (row/col) y table-responsive.
 */
const PedidoCliente = ({ pedido, lineaTiempoSiempreVisible = false }) => {
  // Estado local: ¿está desplegado el detalle de productos?
  const [abierto, setAbierto] = useState(false);

  const estilo = ESTILOS_ESTADO[pedido.estado] || { clase: 'bg-secondary', icono: 'bi-question-circle' };
  const entrega = obtenerFechaEntrega(pedido);
  const items = obtenerItems(pedido);

  // Un pedido en curso cuya fecha estimada ya pasó se marca como atrasado
  const atrasado = esPedidoEnCurso(pedido) && entrega.fecha && entrega.fecha < hoyISO();

  return (
    <div className="card shadow-sm border-0 mb-3">
      <div className="card-body p-4">
        {/* Encabezado: número de pedido, estado y total */}
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">
          <div>
            <h5 className="fw-bold mb-2">
              <i className="bi bi-receipt text-warning me-2"></i>Pedido {pedido.id}
            </h5>
            <span className={`badge ${estilo.clase}`}>
              <i className={`bi ${estilo.icono} me-1`}></i>{pedido.estado}
            </span>
          </div>
          <div className="text-end">
            <small className="text-muted d-block">Total</small>
            <span className="fs-4 fw-bold text-danger">{formatearPeso(pedido.total)}</span>
          </div>
        </div>

        {/* Datos clave: fecha del pedido, fecha de entrega, forma de pago y dirección */}
        <div className="row g-3 mb-3">
          <div className="col-6 col-md-3">
            <small className="text-muted d-block">Fecha de pedido</small>
            <strong>{formatearFecha(pedido.fecha)}</strong>
          </div>
          <div className="col-6 col-md-3">
            <small className="text-muted d-block">{entrega.etiqueta}</small>
            <strong className={atrasado ? 'text-danger' : ''}>
              {entrega.fecha ? formatearFecha(entrega.fecha) : '—'}
            </strong>
            {atrasado && <small className="text-danger d-block">Entrega atrasada</small>}
          </div>
          <div className="col-6 col-md-3">
            <small className="text-muted d-block">Forma de pago</small>
            <strong>{pedido.formaPago || 'Contado'}</strong>
              {/* Si el pago se dividió, se muestra cuánto fue con cada método */}
            {pedido.pagos && pedido.pagos.length > 1 && (
              <small className="text-muted d-block">
                {pedido.pagos.map((pg) => `${pg.metodo}: ${formatearPeso(pg.monto)}`).join(' · ')}
              </small>
            )}
          </div>
          <div className="col-6 col-md-3">
            <small className="text-muted d-block">Despacho</small>
            <strong>{pedido.direccion || 'Retiro en sucursal'}</strong>
          </div>
        </div>

        {/* Línea de tiempo: siempre visible en "En curso"; en el historial solo al desplegar */}
        {(lineaTiempoSiempreVisible || abierto) && (
          <div className="border rounded-3 bg-light p-3 mb-3">
            <LineaTiempoPedido pedido={pedido} />
          </div>
        )}

        {/* Botón para mostrar / ocultar el detalle de productos */}
        <button
          type="button"
          className="btn btn-outline-dark btn-sm fw-bold"
          onClick={() => setAbierto(!abierto)}
          aria-expanded={abierto}
        >
          <i className={`bi ${abierto ? 'bi-chevron-up' : 'bi-chevron-down'} me-1`}></i>
          {abierto ? 'Ocultar detalle' : 'Ver detalle'}
        </button>

        {/* Detalle de productos comprados */}
        {abierto && (
          <div className="table-responsive mt-3">
            <table className="table table-bordered align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th>Código</th>
                  <th>Producto</th>
                  <th className="text-center">Cant.</th>
                  <th className="text-end">Precio Unitario</th>
                  <th className="text-end">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => {
                  const cantidad = item.cantidad || 1;
                  return (
                    <tr key={index}>
                      <td className="text-muted small fw-bold">{item.id}</td>
                      <td className="fw-bold">{item.nombre}</td>
                      <td className="text-center">{cantidad}</td>
                      <td className="text-end">{formatearPeso(item.precio)}</td>
                      <td className="text-end fw-bold">{formatearPeso(item.precio * cantidad)}</td>
                    </tr>
                  );
                })}
                <tr className="table-secondary">
                  <td colSpan="4" className="text-end fw-bold">TOTAL:</td>
                  <td className="text-end fw-bold text-danger">{formatearPeso(pedido.total)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PedidoCliente;