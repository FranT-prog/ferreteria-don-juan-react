// ==========================================
// BASE DE DATOS - FERRETERÍA DON JUAN
// ==========================================

/**
 * Módulo de Persistencia de Datos (Simulación de Base de Datos Local)
 * 
 * Descripción: Maneja la capa de datos de la aplicación utilizando 'localStorage' del navegador.
 * Proporciona las funciones CRUD (Crear, Leer, Actualizar, Eliminar) para Productos, Usuarios y Pedidos.
 * 
 * Criterios Evaluados Aplicados:
 * 1. Almacenamiento en JSON: Uso de JSON.stringify() para guardar y JSON.parse() para leer arreglos de datos.
 * 2. Modularidad JavaScript: Funciones exportadas (export) para ser reutilizadas en componentes y páginas.
 */

import { hoyISO, sumarDias, diasEntre } from '../utils/fechas';

// Días que se demora (estimado) la entrega de un pedido desde que se realiza
export const DIAS_ENTREGA_ESTIMADA = 3;

// Días de plazo para pagar una compra cargada a la cuenta corriente del cliente
export const DIAS_PLAZO_CREDITO = 30;

// Línea de crédito (en pesos) asignada por defecto a un cliente
export const LIMITE_CREDITO_DEFECTO = 300000;

// Arreglo de datos semilla (Seed Data) para inicializar el catálogo de productos
const PRODUCTOS_INICIALES = [
  { 
    id: 'LLA-001', 
    nombre: 'Llave Ajustable', 
    precio: 8590, 
    stock: 19, 
    categoria: 'Herramientas Manuales', 
    descripcion: 'Llave ajustable de acero.', 
    imagen: '/llave_ajustable.jpg'
  },
  { 
    id: 'CIN-001', 
    nombre: 'Cinta Métrica', 
    precio: 4990, 
    stock: 15, 
    categoria: 'Herramientas Manuales', 
    descripcion: 'Cinta métrica de 5 metros.', 
    imagen: '/cinta_metrica.jpg'
  },
  { 
    id: 'NIV-001', 
    nombre: 'Nivel de Burbuja', 
    precio: 6990, 
    stock: 12, 
    categoria: 'Herramientas Manuales', 
    descripcion: 'Nivel de burbuja de aluminio.', 
    imagen: '/nivel_de_burbuja.jpg' 
  },
  { 
    id: 'DES-001', 
    nombre: 'Set de Destornilladores', 
    precio: 12990, 
    stock: 8, 
    categoria: 'Herramientas Manuales', 
    descripcion: 'Set de 6 destornilladores.', 
    imagen: '/caja_destornillador.jpg' 
  },
  { 
    id: 'TIJ-001', 
    nombre: 'Tijeras de Corte', 
    precio: 8990, 
    stock: 6, 
    categoria: 'Herramientas Manuales', 
    descripcion: 'Tijeras para hojalata.', 
    imagen: '/tijeras_de_corte.jpg' 
  },
  { 
    id: 'MAT-001', 
    nombre: 'Cemento 25kg', 
    precio: 7990, 
    stock: 49, 
    categoria: 'Materiales de Construcción', 
    descripcion: 'Saco de cemento de 25 kg.', 
    imagen: '/saco_de_cemento_de.jpg' 
  },
  { 
    id: 'MAT-002', 
    nombre: 'Arena Fina (saco)', 
    precio: 4990, 
    stock: 30, 
    categoria: 'Materiales de Construcción', 
    descripcion: 'Saco de arena fina.', 
    imagen: '/saco_de_arena_fina.jpg' 
  },
  { 
    id: 'MAT-003', 
    nombre: 'Ladrillo de arcilla', 
    precio: 350, 
    stock: 500, 
    categoria: 'Materiales de Construcción', 
    descripcion: 'Ladrillo de arcilla.', 
    imagen: '/ladrillo_de_arcilla.jpg' 
  }
];

// Arreglo inicial de usuarios con roles asignados (Administrador, Vendedor, Cliente)
const USUARIOS_INICIALES = [
  { id: 'USR-001', nombre: 'Admin Principal', email: 'admin@losmaestros.cl', password: '123', rol: 'Administrador', estado: 'Activo' },
  { id: 'USR-002', nombre: 'Carlos Vendedor', email: 'ventas@losmaestros.cl', password: '123', rol: 'Vendedor', estado: 'Activo' },
  { id: 'USR-003', nombre: 'Juan Pérez', email: 'cliente@gmail.com', password: '123', rol: 'Cliente', estado: 'Activo' }
];

// Arreglo inicial vacío para los pedidos realizados
const PEDIDOS_INICIALES = [];

/**
 * Función de Inicialización:
 * Comprueba si existen las claves en LocalStorage.
 * Si no existen, guarda las colecciones iniciales convirtiéndolas a String JSON.
 */
const inicializarBD = () => {
  if (!localStorage.getItem('react_productos')) {
    localStorage.setItem('react_productos', JSON.stringify(PRODUCTOS_INICIALES));
  }
  if (!localStorage.getItem('react_usuarios')) {
    localStorage.setItem('react_usuarios', JSON.stringify(USUARIOS_INICIALES));
  }
  if (!localStorage.getItem('react_pedidos')) {
    localStorage.setItem('react_pedidos', JSON.stringify(PEDIDOS_INICIALES));
  }
};

// Ejecuación automática al cargar el módulo
inicializarBD();

/**
 * Datos de demostración para el cliente de ejemplo (cliente@gmail.com):
 * agrega pedidos en distintas etapas y abonos a su cuenta corriente, con fechas relativas a HOY,
 * para poder ver las pantallas del cliente (pedidos en curso, historial y cuenta corriente).
 * Se ejecuta una sola vez (la bandera 'react_demo_cliente_v1' evita duplicar los datos).
 * Usa localStorage directamente porque se ejecuta al cargar el módulo, antes de definir getPedidos().
 */
const sembrarDatosDemoCliente = () => {
  if (localStorage.getItem('react_demo_cliente_v1')) return;

  const hoy = hoyISO();
  const cliente = USUARIOS_INICIALES.find(u => u.rol === 'Cliente');
  const prod = (id, cantidad) => {
    const p = PRODUCTOS_INICIALES.find(x => x.id === id);
    return { id: p.id, nombre: p.nombre, precio: p.precio, cantidad };
  };

  // Arma un pedido de demostración: 'hace' = días atrás en que se hizo, 'avance' = [estado, días atrás] de cada cambio
  const armar = (id, hace, avance, items, formaPago, direccion) => {
    const fecha = sumarDias(hoy, -hace);
    const estado = avance[avance.length - 1][0];
    return {
      id,
      fecha,
      cliente: cliente.nombre,
      rut: '12345678K',
      email: cliente.email,
      usuarioId: cliente.id,
      direccion,
      formaPago,
      estado,
      total: items.reduce((acc, it) => acc + it.precio * it.cantidad, 0),
      items,
      fechaEntrega: sumarDias(fecha, DIAS_ENTREGA_ESTIMADA),
      historialEstados: avance.map(([est, atras]) => ({ estado: est, fecha: sumarDias(hoy, -atras) })),
      ...(estado === 'Entregado' ? { fechaEntregaReal: sumarDias(hoy, -avance[avance.length - 1][1]) } : {})
    };
  };

  const dir = 'Av. Concha y Toro #1234, Puente Alto';
  const demo = [
    armar('ORD-D01', 2, [['Pendiente', 2], ['En preparación', 1], ['Despachado', 0]],
      [prod('MAT-001', 10), prod('MAT-002', 5)], 'Cuenta corriente', dir),
    armar('ORD-D02', 1, [['Pendiente', 1], ['En preparación', 0]],
      [prod('LLA-001', 1), prod('CIN-001', 2)], 'Contado', dir),
    armar('ORD-D03', 20, [['Pendiente', 20], ['En preparación', 19], ['Despachado', 18], ['Entregado', 17]],
      [prod('NIV-001', 1), prod('DES-001', 2)], 'Cuenta corriente', dir),
    armar('ORD-D04', 45, [['Pendiente', 45], ['En preparación', 44], ['Despachado', 43], ['Entregado', 42]],
      [prod('MAT-003', 200), prod('MAT-001', 4)], 'Cuenta corriente', dir),
    armar('ORD-D05', 60, [['Pendiente', 60], ['En preparación', 59], ['Despachado', 58], ['Entregado', 57]],
      [prod('TIJ-001', 2)], 'Contado', dir),
    armar('ORD-D06', 30, [['Pendiente', 30], ['Cancelado', 29]],
      [prod('DES-001', 1)], 'Contado', dir)
  ];

  const pedidos = JSON.parse(localStorage.getItem('react_pedidos')) || [];
  localStorage.setItem('react_pedidos', JSON.stringify([...pedidos, ...demo]));

  const abonos = JSON.parse(localStorage.getItem('react_abonos')) || [];
  abonos.push({
    id: 'PAG-D01',
    usuarioId: cliente.id,
    fecha: sumarDias(hoy, -30),
    monto: 30000,
    metodo: 'Transferencia',
    descripcion: 'Abono a cuenta corriente'
  });
  localStorage.setItem('react_abonos', JSON.stringify(abonos));

  localStorage.setItem('react_demo_cliente_v1', 'true');
};

sembrarDatosDemoCliente();

// ==========================================
// FUNCIONES CRUD: PRODUCTOS
// ==========================================

// Leer todos los productos de localStorage
export const getProductos = () => {
  return JSON.parse(localStorage.getItem('react_productos')) || [];
};

// Buscar un producto específico por su ID
export const getProductoById = (id) => {
  const productos = getProductos();
  return productos.find(p => p.id === id);
};

// Crear un nuevo producto generando un ID secuencial automático
export const createProducto = (nuevoProd) => {
  const productos = getProductos();
  const id = `PROD-${String(productos.length + 1).padStart(3, '0')}`;
  const productoConId = { ...nuevoProd, id };
  productos.push(productoConId);
  localStorage.setItem('react_productos', JSON.stringify(productos));
  return productoConId;
};

// Actualizar los datos de un producto existente por su ID
export const updateProducto = (id, datosActualizados) => {
  const productos = getProductos();
  const index = productos.findIndex(p => p.id === id);
  if (index !== -1) {
    productos[index] = { ...productos[index], ...datosActualizados };
    localStorage.setItem('react_productos', JSON.stringify(productos));
    return true;
  }
  return false;
};

// Eliminar un producto por su ID
export const deleteProducto = (id) => {
  const productos = getProductos();
  const filtrados = productos.filter(p => p.id !== id);
  localStorage.setItem('react_productos', JSON.stringify(filtrados));
};

// ==========================================
// FUNCIONES CRUD: USUARIOS
// ==========================================

// Leer todos los usuarios de localStorage
export const getUsuarios = () => {
  return JSON.parse(localStorage.getItem('react_usuarios')) || [];
};

// Registrar un nuevo usuario en localStorage
export const createUsuario = (nuevoUser) => {
  const usuarios = getUsuarios();
  const id = `USR-${String(usuarios.length + 1).padStart(3, '0')}`;
  const usuarioConId = { ...nuevoUser, id };
  usuarios.push(usuarioConId);
  localStorage.setItem('react_usuarios', JSON.stringify(usuarios));
  return usuarioConId;
};

// Alternar el estado de un usuario entre 'Activo' y 'Bloqueado'
export const updateEstadoUsuario = (id) => {
  const usuarios = getUsuarios();
  const actualizados = usuarios.map(u => {
    if (u.id === id) {
      return { ...u, estado: u.estado === 'Activo' ? 'Bloqueado' : 'Activo' };
    }
    return u;
  });
  localStorage.setItem('react_usuarios', JSON.stringify(actualizados));
};

// Eliminar un usuario de localStorage
export const deleteUsuario = (id) => {
  const usuarios = getUsuarios();
  const filtrados = usuarios.filter(u => u.id !== id);
  localStorage.setItem('react_usuarios', JSON.stringify(filtrados));
};

// ==========================================
// FUNCIONES CRUD: PEDIDOS
// ==========================================

// Leer la lista de pedidos realizados
export const getPedidos = () => {
  return JSON.parse(localStorage.getItem('react_pedidos')) || [];
};

// Crear un nuevo pedido con fecha actual automática.
// Además registra la fecha estimada de entrega y el historial de estados (para la línea de tiempo del cliente).
export const createPedido = (nuevoPedido) => {
  const pedidos = getPedidos();
  const id = `ORD-${String(pedidos.length + 1).padStart(3, '0')}`;
  const fecha = new Date().toISOString().split('T')[0];
  const estado = nuevoPedido.estado || 'Pendiente';
  const pedidoConId = {
    ...nuevoPedido,
    id,
    fecha,
    fechaEntrega: sumarDias(fecha, DIAS_ENTREGA_ESTIMADA),
    historialEstados: [{ estado, fecha }]
  };
  pedidos.unshift(pedidoConId);
  localStorage.setItem('react_pedidos', JSON.stringify(pedidos));
  return pedidoConId;
};

// Actualizar el estado de un pedido (ej. 'Pendiente', 'Completado', 'Cancelado').
// Guarda cuándo ocurrió el cambio y, si pasa a 'Entregado', la fecha real de entrega.
export const updateEstadoPedido = (id, nuevoEstado) => {
  const pedidos = getPedidos();
  const hoy = hoyISO();
  const actualizados = pedidos.map(p => {
    if (p.id !== id) return p;
    const historial = p.historialEstados || [{ estado: p.estado, fecha: p.fecha }];
    const cambio = p.estado !== nuevoEstado;
    return {
      ...p,
      estado: nuevoEstado,
      historialEstados: cambio ? [...historial, { estado: nuevoEstado, fecha: hoy }] : historial,
      ...(nuevoEstado === 'Entregado' ? { fechaEntregaReal: hoy } : {})
    };
  });
  localStorage.setItem('react_pedidos', JSON.stringify(actualizados));
};

// Eliminar un pedido
export const deletePedido = (id) => {
  const pedidos = getPedidos();
  const filtrados = pedidos.filter(p => p.id !== id);
  localStorage.setItem('react_pedidos', JSON.stringify(filtrados));
};

// ==========================================
// FUNCIONES: VISTAS DEL CLIENTE (PEDIDOS Y CUENTA CORRIENTE)
// ==========================================

// Pedidos de un cliente (más recientes primero). Se vinculan por 'usuarioId' o, si el pedido
// no lo tiene (pedidos antiguos), por el correo con el que se hizo la compra.
export const getPedidosDeCliente = (usuario) => {
  if (!usuario) return [];
  const email = (usuario.email || '').toLowerCase();
  return getPedidos()
    .filter(p => (p.usuarioId && p.usuarioId === usuario.id) || (email && (p.email || '').toLowerCase() === email))
    .sort((a, b) => (b.fecha || '').localeCompare(a.fecha || ''));
};

// Leer todos los abonos (pagos) registrados a cuentas corrientes
export const getAbonos = () => {
  return JSON.parse(localStorage.getItem('react_abonos')) || [];
};

// Registrar un abono (pago) a la cuenta corriente de un cliente
export const createAbono = (usuarioId, monto, metodo = 'Transferencia', descripcion = 'Abono a cuenta corriente') => {
  const abonos = getAbonos();
  const abono = {
    id: `PAG-${String(abonos.length + 1).padStart(3, '0')}`,
    usuarioId,
    fecha: hoyISO(),
    monto,
    metodo,
    descripcion
  };
  abonos.push(abono);
  localStorage.setItem('react_abonos', JSON.stringify(abonos));
  return abono;
};

/**
 * Calcula el estado de la cuenta corriente de un cliente.
 *  - Cargos: pedidos pagados con 'Cuenta corriente' que no estén cancelados (vencen a los 30 días).
 *  - Abonos: pagos registrados por el cliente.
 *  - Los abonos se imputan a los cargos más antiguos primero (FIFO).
 * @param {Object} usuario - Cliente (usa 'id', 'email' y, opcionalmente, 'limiteCredito').
 * @param {string} hoy - Fecha de referencia 'YYYY-MM-DD' (por defecto, hoy).
 * @returns {Object} Resumen con saldos, documentos y movimientos con saldo acumulado.
 */
export const getCuentaCorriente = (usuario, hoy = hoyISO()) => {
  const limite = usuario?.limiteCredito ?? LIMITE_CREDITO_DEFECTO;

  // Parte de cada pedido que se cargó a la cuenta corriente: en un pago mixto es solo una porción del total.
  // Los pedidos antiguos (sin 'montoCredito') se consideran a crédito completo si su forma de pago fue 'Cuenta corriente'.
  const montoACredito = (p) =>
    p.montoCredito !== undefined ? p.montoCredito : (p.formaPago === 'Cuenta corriente' ? p.total : 0);

  const cargos = getPedidosDeCliente(usuario)
    .filter(p => montoACredito(p) > 0 && p.estado !== 'Cancelado')
    .map(p => ({
      id: p.id,
      tipo: 'Cargo',
      fecha: p.fecha,
      descripcion: montoACredito(p) < p.total ? `Compra ${p.id} (parte a crédito)` : `Compra ${p.id}`,
      monto: montoACredito(p),
      vencimiento: sumarDias(p.fecha, DIAS_PLAZO_CREDITO)
    }));

  const abonos = getAbonos()
    .filter(a => a.usuarioId === usuario?.id)
    .map(a => ({
      id: a.id,
      tipo: 'Abono',
      fecha: a.fecha,
      descripcion: `${a.descripcion || 'Pago recibido'} (${a.metodo || 'Pago'})`,
      monto: a.monto
    }));

  const totalCargos = cargos.reduce((acc, c) => acc + c.monto, 0);
  const totalAbonos = abonos.reduce((acc, a) => acc + a.monto, 0);

  // Imputación FIFO: el dinero abonado paga primero las compras más antiguas
  let porImputar = totalAbonos;
  const documentos = [...cargos]
    .sort((a, b) => a.fecha.localeCompare(b.fecha) || a.id.localeCompare(b.id))
    .map(c => {
      const pagado = Math.min(c.monto, porImputar);
      porImputar -= pagado;
      const pendiente = c.monto - pagado;
      const estado = pendiente === 0 ? 'Pagado' : (c.vencimiento < hoy ? 'Vencido' : 'Por vencer');
      return { ...c, pagado, pendiente, estado };
    });

  const saldoVencido = documentos.filter(d => d.estado === 'Vencido').reduce((acc, d) => acc + d.pendiente, 0);
  const saldoPendiente = Math.max(0, totalCargos - totalAbonos);
  const proximos = documentos.filter(d => d.estado === 'Por vencer').sort((a, b) => a.vencimiento.localeCompare(b.vencimiento));

  // Libro de movimientos con saldo acumulado (positivo = el cliente debe)
  let acumulado = 0;
  const movimientos = [...cargos, ...abonos]
    .sort((a, b) => a.fecha.localeCompare(b.fecha) || (a.tipo === 'Cargo' ? -1 : 1))
    .map(m => {
      acumulado += m.tipo === 'Cargo' ? m.monto : -m.monto;
      return { ...m, saldo: acumulado };
    });

  return {
    limiteCredito: limite,
    totalCargos,
    totalAbonos,
    saldoPendiente,
    saldoAFavor: Math.max(0, totalAbonos - totalCargos),
    saldoVencido,
    saldoPorVencer: saldoPendiente - saldoVencido,
    // El saldo a favor (abonos que superan la deuda) suma al crédito disponible
    creditoDisponible: Math.max(0, limite - (totalCargos - totalAbonos)),
    // Solo la línea de crédito, sin contar el dinero a favor
    lineaCreditoDisponible: Math.max(0, limite - saldoPendiente),
    porcentajeUso: limite > 0 ? Math.min(100, Math.round((saldoPendiente / limite) * 100)) : 0,
    proximoVencimiento: proximos[0] ? { fecha: proximos[0].vencimiento, monto: proximos[0].pendiente, dias: diasEntre(hoy, proximos[0].vencimiento) } : null,
    documentos: documentos.reverse(),
    movimientos
  };
};
