import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PedidoService from '../services/PedidoService';

/**
 * Componente de Página: DetallePedido
 *
 * Descripción: Muestra el desglose completo de un pedido consultado desde el backend
 * Spring Boot (/api/v1/pedidos/:id) y permite actualizar su estado (/api/v1/pedidos/:id/estado).
 */
const DetallePedido = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pedido, setPedido] = useState(null);
  const [usuarioActivo, setUsuarioActivo] = useState(null);
  const [actualizando, setActualizando] = useState(false);

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('react_usuario_activo'));
    setUsuarioActivo(usuario);

    const cargarPedido = async () => {
      try {
        const { data } = await PedidoService.obtenerPorId(id);
        setPedido(data);
      } catch (error) {
        console.error('Error al cargar el pedido:', error);
        if (usuario?.rol === 'Administrador') {
          navigate('/admin');
        } else {
          navigate('/vendedor');
        }
      }
    };

    cargarPedido();
  }, [id, navigate]);

  const cambiarEstado = async (nuevoEstado) => {
    try {
      setActualizando(true);
      await PedidoService.actualizarEstado(id, nuevoEstado);
      setPedido(prev => ({ ...prev, estado: nuevoEstado }));
    } catch (error) {
      alert('No se pudo actualizar el estado del pedido en el servidor.');
    } finally {
      setActualizando(false);
    }
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

  const fechaPedido = pedido.fechaCreacion
    ? pedido.fechaCreacion.split('T')[0]
    : pedido.fecha || '-';

  const items = pedido.items || [];

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
            <i className="bi bi-receipt me-2 text-warning"></i>Gestión del Pedido: ORD-{pedido.id}
          </h4>
          <span className="badge bg-warning text-dark fs-6">{fechaPedido}</span>
        </div>

        <div className="card-body p-4">
          <div className="row mb-4 g-4">
            <div className="col-md-6">
              <div className="p-3 bg-light rounded-3 border">
                <h5 className="fw-bold border-bottom pb-2 text-dark">
                  <i className="bi bi-person-lines-fill me-2"></i>Datos del Cliente
                </h5>
                <p className="mb-1"><strong>Nombre:</strong> {pedido.cliente || 'Cliente General'}</p>
                <p className="mb-1"><strong>RUT:</strong> {pedido.rut || 'Sin RUT'}</p>
                <p className="mb-1"><strong>Correo:</strong> {pedido.email || 'Sin correo registrado'}</p>
                <p className="mb-1"><strong>Entrega:</strong> {pedido.tipoEntrega || 'Despacho a domicilio'}</p>
                <p className="mb-1"><strong>Dirección:</strong> {pedido.direccion || 'Retiro en Sucursal'}</p>
                <p className="mb-0"><strong>Forma de pago:</strong> {pedido.formaPago || 'Contado'}</p>
              </div>
            </div>

            <div className="col-md-6">
              <div className="p-3 bg-light rounded-3 border">
                <h5 className="fw-bold border-bottom pb-2 text-dark">
                  <i className="bi bi-truck me-2"></i>Gestión de Envío
                </h5>
                <label className="fw-bold text-muted mb-2 small">Cambiar Estado del Pedido:</label>
                <select
                  className="form-select form-select-lg border-secondary fw-bold"
                  value={pedido.estado}
                  disabled={actualizando}
                  onChange={(e) => cambiarEstado(e.target.value)}
                >
                  <option value="Pendiente">Pendiente (Pago recibido)</option>
                  <option value="Pago pendiente a fin de mes">Pago pendiente a fin de mes (Cuenta corriente)</option>
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
                {items.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-3">
                      Este pedido no tiene artículos detallados.
                    </td>
                  </tr>
                ) : (
                  items.map((item, index) => {
                    const cantidad = item.cantidad || 1;
                    const precioUnitario = item.precioUnitario ?? item.producto?.precio ?? item.precio ?? 0;
                    const subtotal = precioUnitario * cantidad;
                    const codigo = item.producto?.codigo || item.producto?.id || item.id;
                    const nombre = item.producto?.nombre || item.nombre || 'Producto';

                    return (
                      <tr key={item.id || index}>
                        <td className="text-muted small fw-bold">{codigo}</td>
                        <td className="fw-bold">{nombre}</td>
                        <td className="text-center fw-bold">{cantidad}</td>
                        <td className="text-end">${precioUnitario.toLocaleString('es-CL')}</td>
                        <td className="text-end fw-bold">${subtotal.toLocaleString('es-CL')}</td>
                      </tr>
                    );
                  })
                )}
                <tr className="table-secondary">
                  <td colSpan="4" className="text-end fw-bold fs-5">TOTAL PAGADO:</td>
                  <td className="text-end fw-bold fs-5 text-danger">
                    ${(pedido.total || 0).toLocaleString('es-CL')}
                  </td>
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