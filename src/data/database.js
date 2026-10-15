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

// Crear un nuevo pedido con fecha actual automática
export const createPedido = (nuevoPedido) => {
  const pedidos = getPedidos();
  const id = `ORD-${String(pedidos.length + 1).padStart(3, '0')}`;
  const pedidoConId = { ...nuevoPedido, id, fecha: new Date().toISOString().split('T')[0] };
  pedidos.unshift(pedidoConId);
  localStorage.setItem('react_pedidos', JSON.stringify(pedidos));
  return pedidoConId;
};

// Actualizar el estado de un pedido (ej. 'Pendiente', 'Completado', 'Cancelado')
export const updateEstadoPedido = (id, nuevoEstado) => {
  const pedidos = getPedidos();
  const actualizados = pedidos.map(p => p.id === id ? { ...p, estado: nuevoEstado } : p);
  localStorage.setItem('react_pedidos', JSON.stringify(actualizados));
};

// Eliminar un pedido
export const deletePedido = (id) => {
  const pedidos = getPedidos();
  const filtrados = pedidos.filter(p => p.id !== id);
  localStorage.setItem('react_pedidos', JSON.stringify(filtrados));
};