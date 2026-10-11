import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPedidos, updateEstadoPedido } from '../data/database';

const DetallePedido = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState(null);
  const [usuarioActivo, setUsuarioActivo] = useState(null);

  useEffect(() => {
    // 1. Cargar el usuario activo para saber su rol
    const usuario = JSON.parse(localStorage.getItem('react_usuario_activo'));
    setUsuarioActivo(usuario);

    // 2. Obtener la lista de pedidos centralizada
    const pedidosGuardados = getPedidos();
    const pedidoEncontrado = pedidosGuardados.find(p => p.id === id);
    
    if (pedidoEncontrado) {
      // Si el pedido no tiene "items", le asignamos un arreglo genérico de respaldo
      if (!pedidoEncontrado.items) {
        pedidoEncontrado.items = [
          { id: 'PROD-GENERICO', nombre: 'Artículos Varios', precio: pedidoEncontrado.total, cantidad: 1 }
        ];
      }
      setPedido(pedidoEncontrado);
    } else {
      // Si el pedido no existe, redirigir según el rol del usuario
      if (usuario?.rol === 'Administrador') {
        navigate('/admin');
      } else {
        navigate('/vendedor');
      }
    }
  }, [id, navigate]);

  const cambiarEstado = (nuevoEstado) => {
    updateEstadoPedido(id, nuevoEstado);
    setPedido(prev => ({ ...prev, estado: nuevoEstado }));
  };

  const handleVolver = () => {
    if (usuarioActivo?.rol === 'Administrador') {
      navigate('/admin');
    } else {
      navigate('/vendedor');
    }
  };

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
      <div className="mb-3">
        <button onClick={handleVolver} className="btn btn-outline-secondary btn-sm fw-bold">
          <i className="bi bi-arrow-left me-1"></i> 
          Volver a {usuarioActivo?.rol === 'Administrador' ? 'Panel de Administración' : 'Panel del Vendedor'}
        </button>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center p-3">
          <h4 className="m-0 fw-bold">
            <i className="bi bi-receipt me-2 text-warning"></i>Gestión del Pedido: {pedido.id}
          </h4>
          <span className="badge bg-warning text-dark fs-6">{pedido.fecha}</span>
        </div>
        
        <div className="card-body p-4">
          <div className="row mb-4 g-4">
            {/* Datos del Cliente */}
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

            {/* Gestión del Envío */}
            <div className="col-md-6">
              <div className="p-3 bg-light rounded-3 border">
                <h5 className="fw-bold border-bottom pb-2 text-dark">
                  <i className="bi bi-truck me-2"></i>Gestión de Envío
                </h5>
                <label className="fw-bold text-muted mb-2 small">Cambiar Estado del Pedido:</label>
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