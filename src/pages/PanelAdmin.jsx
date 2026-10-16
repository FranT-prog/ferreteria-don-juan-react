import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  getUsuarios, 
  getProductos, 
  deleteProducto, 
  getPedidos, 
  updateEstadoPedido, 
  deletePedido 
} from '../data/database';
import ReportesProductos from './ReportesProductos'; 
import GestionCategorias from './GestionCategorias';
import GestionUsuarios from './GestionUsuarios';
import PerfilUsuario from './PerfilUsuario';

/**
 * Componente de Página: PanelAdmin
 * 
 * Descripción: Panel central de administración (Back-Office) de la ferretería.
 * Integra la gestión de dashboard de métricas, listado global de órdenes, inventario de productos,
 * y orquesta mediante submódulos las secciones de categorías, reportes, usuarios y perfil.
 * 
 * Criterios Evaluados Aplicados:
 * 1. Arquitectura Modular SPA (Single Page Application): Alterna entre vistas locales mediante el estado `vistaActiva` y reuso de subcomponentes (`GestionCategorias`, `GestionUsuarios`, etc.).
 * 2. Cálculo de Métricas y Filtros Avanzados: Procesa en tiempo real ingresos acumulados con `.reduce()` y filtrado dinámico en búsquedas con `.filter()`.
 * 3. Menú Lateral Responsivo (Sidebar + Backdrop): Soporte móvil mediante el estado `menuMovilAbierto`, botón flotante tipo hamburguesa y capa de sombra traslúcida.
 */
const PanelAdmin = () => {
  // Estado para controlar la sección o pestaña activa ('dashboard', 'pedidos', 'productos', 'categorias', etc.)
  const [vistaActiva, setVistaActiva] = useState('dashboard');
  
  // Estado booleano para alternar la visibilidad del menú desplegable en dispositivos móviles
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);

  // Estados locales para almacenar los datos traídos desde la base de datos centralizada
  const [usuarios, setUsuarios] = useState([]);
  const [productos, setProductos] = useState([]);
  const [pedidos, setPedidos] = useState([]);

  // Estados para los campos de filtrado y búsqueda en las tablas
  const [filtroEstadoPedido, setFiltroEstadoPedido] = useState('todos');
  const [busquedaProducto, setBusquedaProducto] = useState('');

  /**
   * Hook useEffect: Se ejecuta una vez al montar el componente.
   * Invoca la función `cargarDatos` para consultar LocalStorage mediante la capa de datos (`database.js`).
   */
  useEffect(() => {
    cargarDatos();
  }, []);

  /**
   * Carga/Refresca las colecciones de usuarios, productos y pedidos desde 'database.js'.
   */
  const cargarDatos = () => {
    setUsuarios(getUsuarios());
    setProductos(getProductos());
    setPedidos(getPedidos());
  };

  /**
   * Actualiza el estado de un pedido en la base de datos y refresca el estado local de la tabla.
   */
  const handleActualizarEstadoPedido = (id, nuevoEstado) => {
    updateEstadoPedido(id, nuevoEstado);
    setPedidos(getPedidos());
  };

  /**
   * Elimina un pedido previa confirmación nativa del usuario (`window.confirm`).
   */
  const handleEliminarPedido = (id) => {
    if (window.confirm(`¿Estás seguro de eliminar el pedido ${id}?`)) {
      deletePedido(id);
      setPedidos(getPedidos());
    }
  };

  /**
   * Función auxiliar que devuelve un componente Badge de Bootstrap personalizado según el estado del pedido.
   */
  const obtenerBadgeEstado = (estado) => {
    switch (estado) {
      case 'Pendiente': return <span className="badge bg-warning text-dark">Pendiente</span>;
      case 'En preparación': return <span className="badge bg-info text-dark">En preparación</span>;
      case 'Despachado': return <span className="badge bg-primary">Despachado</span>;
      case 'Entregado': return <span className="badge bg-success">Entregado</span>;
      case 'Cancelado': return <span className="badge bg-danger">Cancelado</span>;
      default: return <span className="badge bg-secondary">{estado}</span>;
    }
  };

  /**
   * Elimina un producto del inventario previa confirmación y actualiza el estado.
   */
  const handleEliminarProducto = (id) => {
    if (window.confirm(`¿Estás seguro de eliminar el producto ${id}?`)) {
      deleteProducto(id);
      setProductos(getProductos());
    }
  };

  /**
   * Cambia la vista del panel principal y cierra automáticamente el menú en móviles.
   */
  const cambiarVista = (vista) => {
    setVistaActiva(vista);
    setMenuMovilAbierto(false); // Cierra el menú al hacer clic en móvil
  };

  // Métricas: Suma acumulada de ingresos considerando únicamente pedidos no cancelados
  const totalIngresos = pedidos.reduce((acc, p) => p.estado !== 'Cancelado' ? acc + p.total : acc, 0);

  // Listas Filtradas en tiempo real para las tablas de Órdenes e Inventario
  const pedidosFiltrados = pedidos.filter(p => filtroEstadoPedido === 'todos' || p.estado === filtroEstadoPedido);
  const productosFiltrados = productos.filter(p => p.nombre.toLowerCase().includes(busquedaProducto.toLowerCase()) || p.id.toLowerCase().includes(busquedaProducto.toLowerCase()));

  return (
    <div className="d-flex position-relative" style={{ minHeight: '100vh', backgroundColor: '#f4f5f7' }}>
      
      {/* BOTÓN HAMBURGUESA (Solo visible en móviles) */}
      <button 
        className="btn btn-dark d-md-none position-fixed bottom-0 start-0 m-3 rounded-circle shadow"
        style={{ zIndex: 1100, width: '55px', height: '55px' }}
        type="button"
        onClick={() => setMenuMovilAbierto(!menuMovilAbierto)}
      >
        <i className={`bi ${menuMovilAbierto ? 'bi-x-lg' : 'bi-list'} fs-4`}></i>
      </button>

      {/* FONDO OSCURO PARA MÓVIL (Backdrop traslúcido) */}
      {menuMovilAbierto && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50 d-md-none" 
          style={{ zIndex: 1040 }}
          onClick={() => setMenuMovilAbierto(false)}
        ></div>
      )}

      {/* SIDEBAR DEL ADMIN - Menú de navegación lateral */}
      <div 
        className={`bg-white border-end shadow-sm d-flex flex-column flex-shrink-0 ${
          menuMovilAbierto ? 'position-fixed top-0 start-0 h-100' : 'd-none d-md-flex'
        }`}
        style={{ 
          width: '250px',
          minHeight: '100vh',
          zIndex: 1050,
          transition: 'all 0.3s ease'
        }}
      >
        <div className="p-3 bg-dark text-white d-flex justify-content-between align-items-center">
          <h5 className="m-0 fw-bold">don juan</h5>
          <button 
            type="button" 
            className="btn-close btn-close-white d-md-none" 
            onClick={() => setMenuMovilAbierto(false)}
          ></button>
        </div>
        
        <div className="p-0 d-flex flex-column flex-grow-1 justify-content-between">
          {/* Botones de navegación de las distintas vistas */}
          <ul className="nav nav-pills flex-column mb-auto p-3 gap-1">
            <li className="nav-item">
              <button 
                className={`nav-link text-start w-100 ${vistaActiva === 'dashboard' ? 'active bg-primary text-white' : 'text-dark'}`} 
                onClick={() => cambiarVista('dashboard')}
              >
                <i className="bi bi-grid-fill me-2"></i> Dashboard
              </button>
            </li>
            <li>
              <button 
                className={`nav-link text-start w-100 ${vistaActiva === 'pedidos' ? 'active bg-primary text-white' : 'text-dark'}`} 
                onClick={() => cambiarVista('pedidos')}
              >
                <i className="bi bi-cart-fill me-2"></i> Órdenes
              </button>
            </li>
            <li>
              <button 
                className={`nav-link text-start w-100 ${vistaActiva === 'productos' ? 'active bg-primary text-white' : 'text-dark'}`} 
                onClick={() => cambiarVista('productos')}
              >
                <i className="bi bi-box-seam me-2"></i> Productos
              </button>
            </li>
            <li>
              <button 
                className={`nav-link text-start w-100 ${vistaActiva === 'categorias' ? 'active bg-primary text-white' : 'text-dark'}`} 
                onClick={() => cambiarVista('categorias')}
              >
                <i className="bi bi-tags-fill me-2"></i> Categorías
              </button>
            </li>
            <li>
              <button 
                className={`nav-link text-start w-100 ${vistaActiva === 'usuarios' ? 'active bg-primary text-white' : 'text-dark'}`} 
                onClick={() => cambiarVista('usuarios')}
              >
                <i className="bi bi-people-fill me-2"></i> Usuarios
              </button>
            </li>
            <li>
              <button 
                className={`nav-link text-start w-100 ${vistaActiva === 'reportesProductos' ? 'active bg-primary text-white' : 'text-dark'}`} 
                onClick={() => cambiarVista('reportesProductos')}
              >
                <i className="bi bi-bar-chart-fill me-2"></i> Reportes
              </button>
            </li>
            
            <hr className="text-muted my-2" />
            
            <li>
              <button 
                className={`nav-link text-start w-100 ${vistaActiva === 'perfil' ? 'active bg-primary text-white' : 'text-dark'}`} 
                onClick={() => cambiarVista('perfil')}
              >
                <i className="bi bi-person-circle me-2"></i> Perfil
              </button>
            </li>
          </ul>

          <div className="p-3 border-top">
            <Link to="/" className="btn btn-dark w-100 mb-2 text-start">
              <i className="bi bi-shop me-2"></i> Tienda
            </Link>
          </div>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL DINÁMICO */}
      <div className="flex-grow-1 p-4 overflow-auto" style={{ width: '100%' }}>
        
        {/* VISTA 1: DASHBOARD CON TARJETAS DE MÉTRICAS Y ACCESOS RÁPIDOS */}
        {vistaActiva === 'dashboard' && (
          <div>
            <div className="mb-4">
              <h3 className="fw-bold text-dark mb-0">Dashboard</h3>
              <p className="text-muted">Resumen de las actividades diarias</p>
            </div>

            {/* Tarjetas resumen de métricas */}
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <div className="card border-0 text-white bg-primary shadow-sm h-100">
                  <div className="card-body d-flex align-items-center">
                    <i className="bi bi-cart3 display-4 me-3"></i>
                    <div>
                      <h5 className="mb-0 fw-normal">Compras</h5>
                      <h2 className="fw-bold mb-1">${totalIngresos.toLocaleString()}</h2>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card border-0 text-white shadow-sm h-100" style={{backgroundColor: '#198754'}}>
                  <div className="card-body d-flex align-items-center">
                    <i className="bi bi-box-seam display-4 me-3"></i>
                    <div>
                      <h5 className="mb-0 fw-normal">Productos</h5>
                      <h2 className="fw-bold mb-1">{productos.length}</h2>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card border-0 text-white bg-warning shadow-sm h-100">
                  <div className="card-body d-flex align-items-center">
                    <i className="bi bi-people display-4 me-3"></i>
                    <div>
                      <h5 className="mb-0 fw-normal">Usuarios</h5>
                      <h2 className="fw-bold mb-1">{usuarios.length}</h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cuadrícula de accesos directos a secciones */}
            <div className="row g-3">
              {[
                { id: 'dashboard', title: 'Dashboard', icon: 'bi-speedometer2', color: 'text-primary', desc: 'Visión general de todas las métricas y estadísticas.' },
                { id: 'pedidos', title: 'Órdenes', icon: 'bi-cart', color: 'text-primary', desc: 'Gestión y seguimiento de todas las órdenes.' },
                { id: 'productos', title: 'Productos', icon: 'bi-box', color: 'text-primary', desc: 'Administrar inventario y detalles de los productos.' },
                { id: 'categorias', title: 'Categorías', icon: 'bi-tags', color: 'text-primary', desc: 'Organizar productos en categorías.' },
                { id: 'usuarios', title: 'Usuarios', icon: 'bi-people', color: 'text-primary', desc: 'Gestión de cuentas de usuario y sus roles.' },
                { id: 'reportesProductos', title: 'Reportes', icon: 'bi-bar-chart', color: 'text-primary', desc: 'Generación de informes detallados sobre operaciones.' },
                { id: 'perfil', title: 'Perfil', icon: 'bi-person', color: 'text-primary', desc: 'Administración de la información personal.' },
                { id: 'tienda', title: 'Tienda', icon: 'bi-shop', color: 'text-primary', desc: 'Visualiza tu tienda en tiempo real.', isLink: true }
              ].map((item, index) => (
                <div className="col-md-3" key={index}>
                  {item.isLink ? (
                    <Link to="/" className="card border-0 shadow-sm h-100 text-center p-3 text-decoration-none action-card">
                      <div className="card-body">
                        <i className={`bi ${item.icon} ${item.color} fs-1 mb-2`}></i>
                        <h6 className="fw-bold text-dark">{item.title}</h6>
                        <p className="small text-muted mb-0">{item.desc}</p>
                      </div>
                    </Link>
                  ) : (
                    <div className="card border-0 shadow-sm h-100 text-center p-3 action-card" style={{cursor: 'pointer'}} onClick={() => cambiarVista(item.id)}>
                      <div className="card-body">
                        <i className={`bi ${item.icon} ${item.color} fs-1 mb-2`}></i>
                        <h6 className="fw-bold text-dark">{item.title}</h6>
                        <p className="small text-muted mb-0">{item.desc}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VISTA 2: LISTADO GLOBAL DE PEDIDOS / ÓRDENES */}
        {vistaActiva === 'pedidos' && (
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
              <h5 className="fw-bold mb-0 text-dark">
                <i className="bi bi-list-task me-2"></i>Listado Global de Pedidos
              </h5>
              <div className="d-flex align-items-center gap-2">
                <label className="fw-bold text-muted small m-0">Filtrar Estado:</label>
                <select
                  className="form-select form-select-sm border-dark fw-bold"
                  value={filtroEstadoPedido}
                  onChange={(e) => setFiltroEstadoPedido(e.target.value)}
                  style={{ width: '180px' }}
                >
                  <option value="todos">Todos los estados</option>
                  <option value="Pendiente">Pendientes</option>
                  <option value="En preparación">En preparación</option>
                  <option value="Despachado">Despachados</option>
                  <option value="Entregado">Entregados</option>
                  <option value="Cancelado">Cancelados</option>
                </select>
              </div>
            </div>

            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th>N° Pedido</th>
                      <th>Fecha</th>
                      <th>Cliente</th>
                      <th>Items</th>
                      <th>Total ($)</th>
                      <th>Estado Actual</th>
                      <th>Cambiar Estado</th>
                      <th className="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedidosFiltrados.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center py-5 text-muted">
                          <i className="bi bi-inbox display-6 d-block mb-2"></i>
                          No hay pedidos registrados con este filtro.
                        </td>
                      </tr>
                    ) : (
                      pedidosFiltrados.map((pedido) => (
                        <tr key={pedido.id}>
                          <td className="fw-bold text-primary">{pedido.id}</td>
                          <td>{pedido.fecha}</td>
                          <td>
                            <div className="fw-bold">{pedido.cliente}</div>
                            <small className="text-muted">{pedido.rut || 'S/RUT'}</small>
                          </td>
                          <td>
                            <span className="badge bg-secondary">
                              {pedido.items ? pedido.items.length : 1} art.
                            </span>
                          </td>
                          <td className="fw-bold text-danger">
                            ${pedido.total.toLocaleString()}
                          </td>
                          <td>{obtenerBadgeEstado(pedido.estado)}</td>
                          <td>
                            <select
                              className="form-select form-select-sm border-secondary"
                              value={pedido.estado}
                              onChange={(e) => handleActualizarEstadoPedido(pedido.id, e.target.value)}
                            >
                              <option value="Pendiente">Pendiente</option>
                              <option value="En preparación">En preparación</option>
                              <option value="Despachado">Despachado</option>
                              <option value="Entregado">Entregado</option>
                              <option value="Cancelado">Cancelado</option>
                            </select>
                          </td>
                          <td className="text-center">
                            <div className="btn-group btn-group-sm">
                              <Link
                                to={`/vendedor/pedido/${pedido.id}`}
                                className="btn btn-outline-dark fw-bold"
                                title="Ver detalle de la orden"
                              >
                                <i className="bi bi-eye-fill"></i> Detalle
                              </Link>
                              <button
                                className="btn btn-outline-danger"
                                title="Eliminar orden"
                                onClick={() => handleEliminarPedido(pedido.id)}
                              >
                                <i className="bi bi-trash-fill"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VISTA 3: INVENTARIO DE PRODUCTOS */}
        {vistaActiva === 'productos' && (
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
              <h5 className="fw-bold mb-0 text-dark"><i className="bi bi-tools me-2"></i>Inventario de Productos</h5>
              <div className="d-flex gap-2">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Buscar por código o nombre..."
                  value={busquedaProducto}
                  onChange={(e) => setBusquedaProducto(e.target.value)}
                  style={{ width: '220px' }}
                />
                <Link to="/admin/nuevo" className="btn btn-sm btn-dark fw-bold">
                  <i className="bi bi-plus-lg me-1"></i> Nuevo Producto
                </Link>
              </div>
            </div>

            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th>Código</th>
                      <th>Imagen</th>
                      <th>Nombre</th>
                      <th>Categoría</th>
                      <th>Stock</th>
                      <th>Precio</th>
                      <th className="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productosFiltrados.map((prod) => (
                      <tr key={prod.id}>
                        <td className="fw-bold text-muted">{prod.id}</td>
                        <td>
                          <img src={prod.imagen || 'https://via.placeholder.com/50'} alt={prod.nombre} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                        </td>
                        <td className="fw-bold">{prod.nombre}</td>
                        <td><span className="badge bg-light text-dark border">{prod.categoria}</span></td>
                        <td>
                          <span className={`badge ${prod.stock > 5 ? 'bg-success' : prod.stock > 0 ? 'bg-warning text-dark' : 'bg-danger'}`}>
                            {prod.stock} un.
                          </span>
                        </td>
                        <td className="fw-bold text-danger">${prod.precio.toLocaleString()}</td>
                        <td className="text-center">
                          <div className="btn-group btn-group-sm">
                            <Link to={`/admin/editar/${prod.id}`} className="btn btn-outline-primary"><i className="bi bi-pencil-square"></i></Link>
                            <button className="btn btn-outline-danger" onClick={() => handleEliminarProducto(prod.id)}><i className="bi bi-trash"></i></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* RENDERIZADO DE SUBMÓDULOS IMPORTADOS DE FORMA CONDICIONAL */}
        {vistaActiva === 'categorias' && <GestionCategorias />}
        {vistaActiva === 'reportesProductos' && <ReportesProductos />}
        {vistaActiva === 'usuarios' && <GestionUsuarios />}
        {vistaActiva === 'perfil' && <PerfilUsuario />}
        
      </div>
    </div>
  );
};

export default PanelAdmin;