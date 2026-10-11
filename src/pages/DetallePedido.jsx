import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const DetallePedido = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState(null);

  useEffect(() => {
    const pedidosGuardados = JSON.parse(localStorage.getItem('react_pedidos')) || [];
    const pedidoEncontrado = pedidosGuardados.find(p => p.id === id);
    
    if (pedidoEncontrado) {
      // Si el pedido no tiene "items" (porque usamos los de prueba básicos), le agregamos uno genérico para que no se rompa la vista
      if (!pedidoEncontrado.items) {
        pedidoEncontrado.items = [
          { id: 'PROD-GENERICO', nombre: 'Artículos Varios', precio: pedidoEncontrado.total, cantidad: 1 }
        ];
      }
      setPedido(pedidoEncontrado);
    } else {
      navigate('/vendedor'); // Si no existe, volvemos al panel
    }
  }, [id, navigate]);

  const cambiarEstado = (nuevoEstado) => {
    const pedidosGuardados = JSON.parse(localStorage.getItem('react_pedidos')) || [];
    const index = pedidosGuardados.findIndex(p => p.id === id);
    
    if (index !== -1) {
      pedidosGuardados[index].estado = nuevoEstado;
      localStorage.setItem('react_pedidos', JSON.stringify(pedidosGuardados));
      setPedido({ ...pedido, estado: nuevoEstado });
    }
  };

  if (!pedido) return <div className="text-center mt-5">Cargando pedido...</div>;

  return (
    <div>
      <div className="mb-3">
        <Link to="/vendedor" className="btn btn-outline-success btn-sm">
          <i className="bi bi-arrow-left"></i> Volver al Panel Vendedor
        </Link>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-header bg-success text-white d-flex justify-content-between align-items-center p-3">
          <h4 className="m-0 fw-bold"><i className="bi bi-receipt me-2"></i>Gestión del Pedido: {pedido.id}</h4>
          <span className="badge bg-light text-dark fs-6">{pedido.fecha}</span>
        </div>
        
        <div className="card-body p-4">
          <div className="row mb-4">
            <div className="col-md-6">
              <h5 className="fw-bold border-bottom pb-2">Datos del Cliente</h5>
              <p className="mb-1"><strong>Nombre:</strong> {pedido.cliente}</p>
              <p className="mb-1"><strong>RUT:</strong> 12.345.678-9</p>
              <p className="mb-1"><strong>Dirección:</strong> Av. Concha y Toro 1234, Puente Alto</p>
            </div>
            <div className="col-md-6">
              <h5 className="fw-bold border-bottom pb-2">Gestión de Envío</h5>
              <label className="fw-bold text-muted mb-2">Cambiar Estado del Pedido:</label>
              <select 
                className="form-select form-select-lg border-success"
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

          <h5 className="fw-bold border-bottom pb-2 mb-3">Artículos Comprados</h5>
          <table className="table table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>Código</th>
                <th>Producto</th>
                <th className="text-center">Cant.</th>
                <th className="text-end">Precio Unitario</th>
                <th className="text-end">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {pedido.items.map((item, index) => (
                <tr key={index}>
                  <td className="text-muted small">{item.id}</td>
                  <td className="fw-bold">{item.nombre}</td>
                  <td className="text-center">1</td>
                  <td className="text-end">${item.precio.toLocaleString()}</td>
                  <td className="text-end fw-bold">${item.precio.toLocaleString()}</td>
                </tr>
              ))}
              <tr className="table-success">
                <td colSpan="4" className="text-end fw-bold fs-5">TOTAL PAGADO:</td>
                <td className="text-end fw-bold fs-5 text-danger">${pedido.total.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DetallePedido;