import api from './api';

class ProductoService {
  obtenerTodos() {
    return api.get('/productos');
  }

  obtenerPorId(id) {
    return api.get(`/productos/${id}`);
  }

  obtenerStockBajo() {
    return api.get('/productos/stock-bajo');
  }

  crear(producto) {
    return api.post('/productos', producto);
  }

  actualizar(id, producto) {
    return api.put(`/productos/${id}`, producto);
  }

  eliminar(id) {
    return api.delete(`/productos/${id}`);
  }
}

export default new ProductoService();