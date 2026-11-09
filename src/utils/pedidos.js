import { DIAS_ENTREGA_ESTIMADA } from '../data/database';
import { sumarDias } from './fechas';

/**
 * Módulo de Utilidades: pedidos.js
 *
 * Descripción: Reglas de negocio compartidas por las vistas del cliente (etapas de un pedido,
 * si está en curso, qué fecha de entrega mostrar).
 */

// Etapas por las que avanza un pedido normal. El orden del arreglo ES el orden de la línea de tiempo.
// Los nombres de 'estado' coinciden con las opciones del <select> de DetallePedido.jsx.
export const ETAPAS_PEDIDO = [
  { estado: 'Pendiente', titulo: 'Pedido recibido', detalle: 'Pago confirmado', icono: 'bi-receipt' },
  { estado: 'En preparación', titulo: 'En preparación', detalle: 'Armando tu pedido en bodega', icono: 'bi-box-seam' },
  { estado: 'Despachado', titulo: 'Despachado', detalle: 'En camino a tu dirección', icono: 'bi-truck' },
  { estado: 'Entregado', titulo: 'Entregado', detalle: 'Pedido recibido', icono: 'bi-house-check' }
];

// Un pedido está "en curso" mientras no haya terminado (ni entregado ni cancelado)
export const esPedidoEnCurso = (pedido) =>
  pedido.estado !== 'Entregado' && pedido.estado !== 'Cancelado';

// Si el pedido no tiene items (datos antiguos), se muestra una línea genérica con el total
export const obtenerItems = (pedido) =>
  pedido.items && pedido.items.length > 0
    ? pedido.items
    : [{ id: '—', nombre: 'Artículos varios', precio: pedido.total || 0, cantidad: 1 }];

/**
 * Devuelve qué fecha de entrega mostrar según el estado del pedido.
 * - Entregado: la fecha real (si existe) o la prometida.
 * - En curso: la fecha estimada (si no se guardó, se calcula sumando días a la fecha del pedido).
 * - Cancelado: no hay fecha de entrega.
 */
export const obtenerFechaEntrega = (pedido) => {
  if (pedido.estado === 'Cancelado') {
    return { etiqueta: 'Entrega', fecha: null };
  }
  if (pedido.estado === 'Entregado') {
    return { etiqueta: 'Entregado el', fecha: pedido.fechaEntregaReal || pedido.fechaEntrega || pedido.fecha };
  }
  return {
    etiqueta: 'Entrega estimada',
    fecha: pedido.fechaEntrega || sumarDias(pedido.fecha, DIAS_ENTREGA_ESTIMADA)
  };
};

// Fecha en que el pedido llegó a una etapa (según el historial de estados guardado)
export const fechaDeEtapa = (pedido, etapa, indice) => {
  const registro = (pedido.historialEstados || []).find((h) => h.estado === etapa.estado);
  if (registro) return registro.fecha;
  if (indice === 0) return pedido.fecha; // la primera etapa siempre ocurre al hacer el pedido
  if (etapa.estado === 'Entregado' && pedido.estado === 'Entregado') {
    return pedido.fechaEntregaReal || pedido.fechaEntrega || null;
  }
  return null;
};