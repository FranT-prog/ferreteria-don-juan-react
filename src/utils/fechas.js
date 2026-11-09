/**
 * Módulo de Utilidades: fechas.js
 *
 * Descripción: Funciones puras para trabajar con fechas en formato ISO corto ('YYYY-MM-DD'),
 * que es el formato en que 'database.js' guarda la fecha de los pedidos.
 *
 * Por qué existe: `new Date('2026-11-09')` interpreta la fecha en UTC y, en Chile (UTC-3/-4),
 * puede mostrar el día anterior. Estas funciones construyen la fecha en hora LOCAL para evitarlo.
 */

// Agrega un cero a la izquierda cuando el número tiene un solo dígito (ej. 5 -> '05')
const dosDigitos = (n) => String(n).padStart(2, '0');

// Convierte 'YYYY-MM-DD' en un objeto Date en hora local (o null si no hay fecha)
export const aFechaLocal = (iso) => {
  if (!iso) return null;
  const [anio, mes, dia] = String(iso).slice(0, 10).split('-').map(Number);
  return new Date(anio, mes - 1, dia);
};

// Convierte un objeto Date en 'YYYY-MM-DD' usando la hora local
export const aISO = (fecha) =>
  `${fecha.getFullYear()}-${dosDigitos(fecha.getMonth() + 1)}-${dosDigitos(fecha.getDate())}`;

// Fecha de hoy en formato 'YYYY-MM-DD'
export const hoyISO = () => aISO(new Date());

// Suma (o resta, si es negativo) días a una fecha ISO y devuelve otra fecha ISO
export const sumarDias = (iso, dias) => {
  const fecha = aFechaLocal(iso);
  fecha.setDate(fecha.getDate() + dias);
  return aISO(fecha);
};

// Cantidad de días entre dos fechas ISO (positivo si 'hasta' es posterior a 'desde')
export const diasEntre = (desde, hasta) =>
  Math.round((aFechaLocal(hasta) - aFechaLocal(desde)) / 86400000);

// Fecha legible en español de Chile: '9 nov 2026'
export const formatearFecha = (iso) =>
  iso
    ? aFechaLocal(iso).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—';

// Monto en pesos chilenos con separador de miles: '$12.990'
export const formatearPeso = (monto) => `$${Number(monto || 0).toLocaleString('es-CL')}`;