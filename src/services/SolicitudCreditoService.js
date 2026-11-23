import api from './api';

class SolicitudCreditoService {
  obtenerTodas() {
    return api.get('/solicitudes-credito');
  }

  obtenerPorUsuario(usuarioId) {
    return api.get(`/solicitudes-credito/usuario/${usuarioId}`);
  }

  // solicitud: { usuarioId, nombre, montoSolicitado }
  crear(solicitud) {
    return api.post('/solicitudes-credito', solicitud);
  }

  // accion: 'Aprobada' o 'Rechazada'
  responder(id, accion) {
    return api.put(`/solicitudes-credito/${id}/responder`, { accion });
  }
}

export default new SolicitudCreditoService();