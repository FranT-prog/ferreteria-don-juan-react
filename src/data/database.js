// ==========================================
// FUENTE DE DATOS E INTEGRACIÓN DE PERSISTENCIA
// ==========================================

// Datos semilla por defecto (Base de datos inicial)
const PRODUCTOS_INICIALES = [
  { id: 'PROD-001', nombre: 'Martillo Cincelador 16oz', precio: 12990, stock: 15, categoria: 'Herramientas Manuales', descripcion: 'Martillo de acero forjado con mango ergonómico antideslizante.', imagen: 'https://via.placeholder.com/300x200?text=Martillo' },
  { id: 'PROD-002', nombre: 'Juego de Destornilladores (6 pzas)', precio: 12000, stock: 8, categoria: 'Herramientas Manuales', descripcion: 'Set de destornilladores de precisión cromo-vanadio.', imagen: 'https://via.placeholder.com/300x200?text=Destornilladores' },
  { id: 'PROD-003', nombre: 'Taladro Inalámbrico 20V', precio: 85990, stock: 5, categoria: 'Herramientas Eléctricas', descripcion: 'Taladro percutor con 2 baterías de litio y maletín de transporte.', imagen: 'https://via.placeholder.com/300x200?text=Taladro' },
  { id: 'PROD-004', nombre: 'Sierra Manual para Madera 18"', precio: 14500, stock: 20, categoria: 'Herramientas Manuales', descripcion: 'Serrucho de hoja templada con dientes de triple afilado.', imagen: 'https://via.placeholder.com/300x200?text=Sierra' }
];

const USUARIOS_INICIALES = [
  { id: 'USR-001', nombre: 'Admin Principal', email: 'admin@losmaestros.cl', password: '123', rol: 'Administrador', estado: 'Activo' },
  { id: 'USR-002', nombre: 'Carlos Vendedor', email: 'ventas@losmaestros.cl', password: '123', rol: 'Vendedor', estado: 'Activo' },
  { id: 'USR-003', nombre: 'Juan Pérez', email: 'cliente@gmail.com', password: '123', rol: 'Cliente', estado: 'Activo' }
];

const PEDIDOS_INICIALES = [
  {
    id: 'ORD-001',
    fecha: '2026-10-10',
    cliente: 'Juan Pérez',
    rut: '12.345.678-9',
    email: 'cliente@gmail.com',
    direccion: 'Av. Concha y Toro 1234, Puente Alto',
    total: 24990,
    estado: 'Pendiente',
    items: [{ id: 'PROD-001', nombre: 'Martillo Cincelador 16oz', precio: 12990, cantidad: 1 }]
  }
];

// Inicialización de LocalStorage
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

inicializarBD();

// ==========================================
// FUNCIONES CRUD: PRODUCTOS
// ==========================================
export const getProductos = () => {
  return JSON.parse(localStorage.getItem('react_productos')) || [];
};

export const getProductoById = (id) => {
  const productos = getProductos();
  return productos.find(p => p.id === id);
};

export const createProducto = (nuevoProd) => {
  const productos = getProductos();
  const id = `PROD-${String(productos.length + 1).padStart(3, '0')}`;
  const productoConId = { ...nuevoProd, id };
  productos.push(productoConId);
  localStorage.setItem('react_productos', JSON.stringify(productos));
  return productoConId;
};

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

export const deleteProducto = (id) => {
  const productos = getProductos();
  const filtrados = productos.filter(p => p.id !== id);
  localStorage.setItem('react_productos', JSON.stringify(filtrados));
};

// ==========================================
// FUNCIONES CRUD: USUARIOS
// ==========================================
export const getUsuarios = () => {
  return JSON.parse(localStorage.getItem('react_usuarios')) || [];
};

export const createUsuario = (nuevoUser) => {
  const usuarios = getUsuarios();
  const id = `USR-${String(usuarios.length + 1).padStart(3, '0')}`;
  const usuarioConId = { ...nuevoUser, id };
  usuarios.push(usuarioConId);
  localStorage.setItem('react_usuarios', JSON.stringify(usuarios));
  return usuarioConId;
};

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

export const deleteUsuario = (id) => {
  const usuarios = getUsuarios();
  const filtrados = usuarios.filter(u => u.id !== id);
  localStorage.setItem('react_usuarios', JSON.stringify(filtrados));
};

// ==========================================
// FUNCIONES CRUD: PEDIDOS
// ==========================================
export const getPedidos = () => {
  return JSON.parse(localStorage.getItem('react_pedidos')) || [];
};

export const createPedido = (nuevoPedido) => {
  const pedidos = getPedidos();
  const id = `ORD-${String(pedidos.length + 1).padStart(3, '0')}`;
  const pedidoConId = { ...nuevoPedido, id, fecha: new Date().toISOString().split('T')[0] };
  pedidos.unshift(pedidoConId);
  localStorage.setItem('react_pedidos', JSON.stringify(pedidos));
  return pedidoConId;
};

export const updateEstadoPedido = (id, nuevoEstado) => {
  const pedidos = getPedidos();
  const actualizados = pedidos.map(p => p.id === id ? { ...p, estado: nuevoEstado } : p);
  localStorage.setItem('react_pedidos', JSON.stringify(actualizados));
};

export const deletePedido = (id) => {
  const pedidos = getPedidos();
  const filtrados = pedidos.filter(p => p.id !== id);
  localStorage.setItem('react_pedidos', JSON.stringify(filtrados));
};