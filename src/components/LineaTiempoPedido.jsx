import React from 'react';
import { ETAPAS_PEDIDO, fechaDeEtapa } from '../utils/pedidos';
import { formatearFecha } from '../utils/fechas';

/**
 * Componente Funcional: LineaTiempoPedido
 *
 * Descripción: Muestra en qué etapa va un pedido (Recibido -> En preparación -> Despachado -> Entregado).
 * Las etapas ya cumplidas se ven en verde con un check, la etapa actual en amarillo y las siguientes en gris.
 * En pantallas grandes se dibuja en horizontal y en celulares en vertical (los estilos están en index.css).
 *
 * Props Recibidas:
 * @param {Object} pedido - Pedido con al menos 'estado' y 'fecha'; opcionalmente 'historialEstados'.
 *
 * Criterios Evaluados Aplicados:
 * 1. Comunicación mediante Props: el componente no guarda estado, dibuja lo que recibe del padre.
 * 2. Renderizado condicional: un pedido 'Cancelado' muestra una alerta en vez de la línea de tiempo.
 * 3. Renderizado de listas con .map() y clases dinámicas según la etapa.
 */
const LineaTiempoPedido = ({ pedido }) => {
  // Un pedido cancelado no avanza por las etapas: se informa con una alerta
  if (pedido.estado === 'Cancelado') {
    return (
      <div className="alert alert-danger d-flex align-items-center mb-0" role="alert">
        <i className="bi bi-x-circle-fill fs-4 me-3"></i>
        <div>
          <strong>Pedido cancelado</strong>
          <div className="small">Este pedido ya no se despachará.</div>
        </div>
      </div>
    );
  }

  // Posición de la etapa actual dentro del arreglo de etapas (si el estado es desconocido, parte en la primera)
  const indiceActual = Math.max(0, ETAPAS_PEDIDO.findIndex((e) => e.estado === pedido.estado));
  const finalizado = pedido.estado === 'Entregado';

  return (
    <ol className="linea-tiempo" aria-label="Línea de tiempo del pedido">
      {ETAPAS_PEDIDO.map((etapa, i) => {
        // Etapa cumplida (verde), actual (amarillo) o pendiente (gris)
        const situacion = i < indiceActual || finalizado ? 'completada' : i === indiceActual ? 'actual' : 'pendiente';
        const fecha = situacion === 'pendiente' ? null : fechaDeEtapa(pedido, etapa, i);

        return (
          <li
            key={etapa.estado}
            className={`linea-tiempo__paso linea-tiempo__paso--${situacion}`}
            aria-current={situacion === 'actual' ? 'step' : undefined}
          >
            <span className="linea-tiempo__icono">
              <i className={`bi ${situacion === 'completada' ? 'bi-check-lg' : etapa.icono}`}></i>
            </span>
            <div className="linea-tiempo__texto">
              <strong>{etapa.titulo}</strong>
              {/* Si ya ocurrió muestra la fecha; si es la etapa actual, su descripción; si falta, queda vacío */}
              <small className="text-muted">
                {situacion === 'actual' && !finalizado ? etapa.detalle : fecha ? formatearFecha(fecha) : etapa.detalle}
              </small>
            </div>
          </li>
        );
      })}
    </ol>
  );
};

export default LineaTiempoPedido;