import React, { useState, useEffect } from 'react';
// Asegúrate de que esta ruta apunte correctamente a tu database.js
import { getSolicitudesCredito, responderSolicitudCredito } from '../data/database';

const SolicitudesAdmin = () => {
  const [solicitudes, setSolicitudes] = useState([]);

  // Función para cargar las solicitudes y poner las más recientes primero
  const cargarSolicitudes = () => {
    const data = getSolicitudesCredito();
    setSolicitudes([...data].reverse()); 
  };

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  // Función para que el admin apruebe o rechace
  const manejarRespuesta = (id, accion) => {
    if (window.confirm(`¿Seguro que deseas marcar esta solicitud como ${accion}?`)) {
      responderSolicitudCredito(id, accion);
      cargarSolicitudes(); // Recarga la tabla para reflejar el cambio
    }
  };

  return (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-header bg-warning text-dark fw-bold d-flex align-items-center">
        <i className="bi bi-envelope-paper me-2"></i> 
        Solicitudes de Aumento de Crédito
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Límite Actual</th>
                <th>Solicitado</th>
                <th>Estado</th>
                <th className="text-center">Acción</th>
              </tr>
            </thead>
            <tbody>
              {solicitudes.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">
                    No hay solicitudes pendientes.
                  </td>
                </tr>
              ) : (
                solicitudes.map(s => (
                  <tr key={s.id}>
                    <td className="fw-bold text-muted">{s.id}</td>
                    <td>{s.nombre}</td>
                    <td>${Number(s.montoActual).toLocaleString()}</td>
                    <td className="fw-bold text-primary">${Number(s.montoSolicitado).toLocaleString()}</td>
                    <td>
                      <span className={`badge ${s.estado === 'Pendiente' ? 'bg-warning text-dark' : s.estado === 'Aprobada' ? 'bg-success' : 'bg-danger'}`}>
                        {s.estado}
                      </span>
                    </td>
                    <td className="text-center">
                      {s.estado === 'Pendiente' && (
                        <div className="btn-group btn-group-sm">
                          <button className="btn btn-outline-success" onClick={() => manejarRespuesta(s.id, 'Aprobada')} title="Aprobar">
                            <i className="bi bi-check-lg"></i>
                          </button>
                          <button className="btn btn-outline-danger" onClick={() => manejarRespuesta(s.id, 'Rechazada')} title="Rechazar">
                            <i className="bi bi-x-lg"></i>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SolicitudesAdmin;