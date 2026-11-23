import api from './api';

class PedidoService {
  obtenerTodos() {
    return api.get('/pedidos');
  }

  obtenerPorId(id) {
    return api.get(`/pedidos/${id}`);
  }

  obtenerPorCliente(email) {
    return api.get(`/pedidos/cliente/${email}`);
  }

  crear(pedido) {
    return api.post('/pedidos', pedido);
  }

  actualizarEstado(id, estado) {
    return api.put(`/pedidos/${id}/estado`, { estado });
  }

  eliminar(id) {
    return api.delete(`/pedidos/${id}`);
  }
}

export default new PedidoService();