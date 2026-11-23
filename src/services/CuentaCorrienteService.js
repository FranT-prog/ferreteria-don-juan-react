import api from './api';

class CuentaCorrienteService {
  obtenerTodas() {
    return api.get('/cuentas-corrientes');
  }

  obtenerPorCliente(email) {
    return api.get(`/cuentas-corrientes/cliente/${email}`);
  }

  guardar(cuenta) {
    return api.post('/cuentas-corrientes', cuenta);
  }

  abonar(id, monto) {
    return api.put(`/cuentas-corrientes/${id}/abonar`, { monto });
  }
}

export default new CuentaCorrienteService();