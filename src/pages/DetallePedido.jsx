import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPedidos, updateEstadoPedido } from '../data/database';

/**
 * Componente de Página: DetallePedido
 * 
 * Descripción: Muestra el desglose completo de una orden de compra específica (datos del cliente,
 * estado de despacho y tabla detallada de productos comprados) accediendo mediante su ID dinámico.
 * Permite cambiar el estado del pedido ('Pendiente', 'Despachado', 'Entregado', etc.).
 * 
 * Criterios Evaluados Aplicados:
 * 1. Enrutamiento Dinámico (useParams & useNavigate): Recupera el ID de la orden desde la URL y permite navegación condicional según el rol del usuario ('Administrador' o 'Vendedor').
 * 2. Manejo de Estado (useState) y Efectos (useEffect): Consulta el pedido desde 'database.js' y sincroniza los cambios de estado local y en LocalStorage.
 * 3. Componentes y Tablas de Bootstrap: Uso de tarjetas de detalle (`card`), selectores grandes (`form-select-lg`), indicador de carga (`spinner-border`) y tablas responsivas estilizadas (`table table-bordered`).
 */
const DetallePedido = () => {
  // Hook useParams para capturar el ID del pedido enviado en la URL (:id)
  const { id } = useParams();
  
  // Hook useNavigate para redirigir al usuario entre paneles
  const navigate = useNavigate();

  // Estado local para almacenar la información completa del pedido seleccionado
  const [pedido, setPedido] = useState(null);

  // Estado local para almacenar la información del usuario autenticado y verificar su rol
  const [usuarioActivo, setUsuarioActivo] = useState(null);

  /**
   * Hook useEffect: Se ejecuta al cargar el componente o cambiar la ID / navegación.
   * Carga el usuario activo y busca la orden coincidente en la base de datos de LocalStorage.
   */
  useEffect(() => {
    // 1. Cargar el usuario activo desde LocalStorage para determinar su rol
    const usuario = JSON.parse(localStorage.getItem('react_usuario_activo'));
    setUsuarioActivo(usuario);

    // 2. Obtener la lista de pedidos mediante la función de la base de datos
    const pedidosGuardados = getPedidos();
    const pedidoEncontrado = pedidosGuardados.find(p => p.id === id);
    
    if (pedidoEncontrado) {
      // Si el pedido no tiene "items" (compatibilidad de datos antiguos), le asignamos un arreglo genérico de respaldo
      if (!pedidoEncontrado.items) {
        pedidoEncontrado.items = [
          { id: 'PROD-GENERICO', nombre: 'Artículos Varios', precio: pedidoEncontrado.total, cantidad: 1 }
        ];
      }
      setPedido(pedidoEncontrado);
    } else {
      // Si el pedido no existe en la base de datos, redirigir al panel correspondiente según el rol
      if (usuario?.rol === 'Administrador') {
        navigate('/admin');
      } else {
        navigate('/vendedor');
      }
    }
  }, [id, navigate]);

  /**
   * Actualiza el estado del pedido en la base de datos de LocalStorage
   * y en el estado local del componente para refrescar la interfaz inmediatamente.
   * @param {string} nuevoEstado - Nuevo estado asignado ('Despachado', 'Entregado', etc.).
   */
  const cambiarEstado = (nuevoEstado) => {
    updateEstadoPedido(id, nuevoEstado);
    setPedido(prev => ({ ...prev, estado: nuevoEstado }));
  };

  /**
   * Manejador para el botón "Volver":
   * Redirige al usuario al panel administrativo o al del vendedor dependiendo de su rol.
   */
  const handleVolver = () => {
    if (usuarioActivo?.rol === 'Administrador') {
      navigate('/admin');
    } else {
      navigate('/vendedor');
    }
  };

  // Renderizado Condicional de Carga: Muestra un Spinner de Bootstrap si el pedido aún no se recupera
  if (!pedido) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-success" role="status"></div>
        <p className="mt-2 text-muted">Cargando detalles del pedido...</p>
      </div>
    );
  }

  return (
    <div className="container py-2">
      {/* Botón de retorno inteligente orientado según el rol del usuario */}
      <div className="mb-3">
        <button onClick={handleVolver} className="btn btn-outline-secondary btn-sm fw-bold">
          <i className="bi bi-arrow-left me-1"></i> 
          Volver a {usuarioActivo?.rol === 'Administrador' ? 'Panel de Administración' : 'Panel del Vendedor'}
        </button>
      </div>

      {/* Tarjeta contenedora de Bootstrap para los detalles del pedido */}
      <div className="card shadow-sm border-0">
        {/* Cabecera de la Tarjeta */}
        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center p-3">
          <h4 className="m-0 fw-bold">
            <i className="bi bi-receipt me-2 text-warning"></i>Gestión del Pedido: {pedido.id}
          </h4>
          <span className="badge bg-warning text-dark fs-6">{pedido.fecha}</span>
        </div>
        
        <div className="card-body p-4">
          <div className="row mb-4 g-4">
            {/* Columna 1: Información Personal y Despacho del Cliente */}
            <div className="col-md-6">
              <div className="p-3 bg-light rounded-3 border">
                <h5 className="fw-bold border-bottom pb-2 text-dark">
                  <i className="bi bi-person-lines-fill me-2"></i>Datos del Cliente
                </h5>
                <p className="mb-1"><strong>Nombre:</strong> {pedido.cliente || 'Cliente General'}</p>
                <p className="mb-1"><strong>RUT:</strong> {pedido.rut || 'Sin RUT'}</p>
                <p className="mb-1"><strong>Correo:</strong> {pedido.email || 'Sin correo registrado'}</p>
                <p className="mb-0"><strong>Dirección:</strong> {pedido.direccion || 'Retiro en Sucursal'}</p>
              </div>
            </div>

            {/* Columna 2: Selector para cambiar el estado del envío */}
            <div className="col-md-6">
              <div className="p-3 bg-light rounded-3 border">
                <h5 className="fw-bold border-bottom pb-2 text-dark">
                  <i className="bi bi-truck me-2"></i>Gestión de Envío
                </h5>
                <label className="fw-bold text-muted mb-2 small">Cambiar Estado del Pedido:</label>
                {/* Desplegable interactivo para modificar el estado del pedido */}
                <select 
                  className="form-select form-select-lg border-secondary fw-bold"
                  value={pedido.estado}
                  onChange={(e) => cambiarEstado(e.target.value)}
                >
                  <option value="Pendiente">Pendiente (Pago recibido)</option>
                  <option value="En preparación">En preparación (En bodega)</option>
                  <option value="Despachado">Despachado (En camino)</option>
                  <option value="Entregado">Entregado (Finalizado)</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sección de Tabla de Artículos Comprados */}
          <h5 className="fw-bold border-bottom pb-2 mb-3 text-dark">
            <i className="bi bi-box-seam me-2"></i>Artículos Comprados
          </h5>
          <div className="table-responsive">
            <table className="table table-bordered align-middle">
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
                {/* Mapeo del arreglo de ítems contenidos en la orden */}
                {pedido.items.map((item, index) => {
                  const cantidad = item.cantidad || 1;
                  const subtotal = item.precio * cantidad;
                  return (
                    <tr key={index}>
                      <td className="text-muted small fw-bold">{item.id}</td>
                      <td className="fw-bold">{item.nombre}</td>
                      <td className="text-center fw-bold">{cantidad}</td>
                      <td className="text-end">${item.precio.toLocaleString()}</td>
                      <td className="text-end fw-bold">${subtotal.toLocaleString()}</td>
                    </tr>
                  );
                })}
                {/* Fila final de Total Pagado */}
                <tr className="table-secondary">
                  <td colSpan="4" className="text-end fw-bold fs-5">TOTAL PAGADO:</td>
                  <td className="text-end fw-bold fs-5 text-danger">${pedido.total.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetallePedido;