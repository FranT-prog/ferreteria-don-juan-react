import api from './api';

class UsuarioService {
  obtenerTodos() {
    return api.get('/usuarios');
  }

  obtenerPorId(id) {
    return api.get(`/usuarios/${id}`);
  }

  registrar(usuario) {
    return api.post('/usuarios/registro', usuario);
  }

  login(email, password) {
    return api.post('/usuarios/login', { email, password });
  }

  actualizar(id, usuario) {
    return api.put(`/usuarios/${id}`, usuario);
  }

  cambiarEstadoActivo(id, activo) {
    return api.patch(`/usuarios/${id}/activo`, { activo });
  }

  eliminar(id) {
    return api.delete(`/usuarios/${id}`);
  }
}

export default new UsuarioService();