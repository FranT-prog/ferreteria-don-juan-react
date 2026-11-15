import { aFechaLocal, sumarDias } from './fechas';

/**
 * Módulo de Utilidades: tienda.js
 *
 * Descripción: Datos de la sucursal (dirección y horario de atención) y la regla con que la tienda
 * asigna la fecha de retiro de un pedido. Si cambia la dirección u horario, se edita SOLO aquí.
 */

export const DIRECCION_TIENDA = 'Av. Francisco de Aguirre 450, La Serena';
export const HORARIO_ATENCION = 'Lunes a Viernes de 8:30 a 18:30 hrs y Sábados de 9:00 a 14:00 hrs';

/**
 * La tienda asigna la fecha de retiro: el siguiente día de atención después de la compra.
 * Como el domingo está cerrado, si el día siguiente cae domingo se pasa al lunes.
 * @param {string} fechaCompraISO - Fecha de la compra en formato 'YYYY-MM-DD'.
 * @returns {string} Fecha de retiro en formato 'YYYY-MM-DD'.
 */
export const calcularFechaRetiro = (fechaCompraISO) => {
  let fecha = sumarDias(fechaCompraISO, 1);
  if (aFechaLocal(fecha).getDay() === 0) fecha = sumarDias(fecha, 1); // 0 = domingo
  return fecha;
};

// Fecha legible y completa: 'martes 17 de noviembre de 2026'
export const formatearFechaLarga = (iso) =>
  iso
    ? aFechaLocal(iso).toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : '—';