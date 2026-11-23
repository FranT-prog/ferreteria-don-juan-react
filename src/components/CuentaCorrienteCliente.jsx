import React, { useState } from 'react';
import { formatearFecha, formatearPeso } from '../utils/fechas';
import SolicitudCreditoService from '../services/SolicitudCreditoService';
import { Link } from 'react-router-dom';

const COLOR_DOCUMENTO = { 'Pagado': 'bg-success', 'Por vencer': 'bg-warning text-dark', 'Vencido': 'bg-danger' };

/**
 * Componente Funcional: CuentaCorrienteCliente
 *
 * Descripción: Presenta la cuenta corriente del cliente obtenida desde Spring Boot
 * y permite registrar abonos contra el endpoint PUT /api/v1/cuentas-corrientes/:id/abonar.
 */
const CuentaCorrienteCliente = ({ cuenta, onAbonar, onHabilitarCuenta}) => {
  const [monto, setMonto] = useState('');
  const [metodo, setMetodo] = useState('Transferencia');
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [abonando, setAbonando] = useState(false);

  const [montoSolicitado, setMontoSolicitado] = useState('');
  const [mensajeSolicitud, setMensajeSolicitud] = useState('');

  if (!cuenta) {
    return (
      <div className="alert alert-info text-center py-4 shadow-sm">
        <h5 className="fw-bold">Aún no tienes una cuenta corriente habilitada</h5>
        <p className="mb-3 text-muted">
          Contacta a la administración de <strong>Ferretería Don Juan</strong> para solicitar tu línea de crédito.
        </p>
        {onHabilitarCuenta ? (
          <button
            type="button"
            className="btn btn-success fw-bold"
            onClick={onHabilitarCuenta}
          >
            <i className="bi bi-plus-circle me-2"></i>Habilitar Cuenta Corriente ($300.000)
          </button>
        ) : (
          <Link to="/contacto" className="btn btn-warning fw-bold text-dark">
            <i className="bi bi-envelope-fill me-2"></i>Solicitar Cuenta Corriente
          </Link>
        )}
      </div>
    );
  }

    const handleSolicitarAumento = async (e) => {
    e.preventDefault();
    const limiteActual = cuenta.limiteCredito || 300000;

    if (Number(montoSolicitado) <= limiteActual) {
      setMensajeSolicitud('El monto solicitado debe ser mayor a tu límite actual.');
      return;
    }

    const usuarioStr =
      localStorage.getItem('react_usuario_activo') ||
      localStorage.getItem('usuarioActivo') ||
      localStorage.getItem('usuario');
    const usuarioActivo = usuarioStr ? JSON.parse(usuarioStr) : null;

    if (!usuarioActivo?.id) {
      setMensajeSolicitud('Debes iniciar sesión para solicitar un aumento.');
      return;
    }

    try {
      // La solicitud se guarda en el backend (no en localStorage) para que el administrador la vea
      await SolicitudCreditoService.crear({
        usuarioId: usuarioActivo.id,
        nombre: usuarioActivo.nombre,
        montoSolicitado: Number(montoSolicitado)
      });
      setMensajeSolicitud('Solicitud enviada al administrador con éxito.');
      setMontoSolicitado('');
    } catch (err) {
      setMensajeSolicitud(err.response?.data?.mensaje || 'No se pudo enviar la solicitud. Verifica que el servidor esté activo.');
    }
  };
    const handleAbonar = async (e) => {
    e.preventDefault();
    const valor = parseInt(monto, 10);
    if (!valor || valor <= 0) {
      setError('Ingresa un monto válido mayor a $0.');
      setExito('');
      return;
    }
    if (valor > cuenta.saldoPendiente) {
      setError(`El monto no puede superar tu saldo pendiente (${formatearPeso(cuenta.saldoPendiente)}).`);
      setExito('');
      return;
    }

    try {
      setAbonando(true);
      if (onAbonar) await onAbonar(valor, metodo);
      setMonto('');
      setError('');
      setExito(`Abono de ${formatearPeso(valor)} registrado correctamente.`);
    } catch (err) {
      setError('No se pudo registrar el abono en el servidor. Intenta nuevamente.');
      setExito('');
    } finally {
      setAbonando(false);
    }
  };

  const sinMovimientos = (cuenta.movimientos || []).length === 0;
  const colorBarra = cuenta.porcentajeUso >= 85 ? 'bg-danger' : cuenta.porcentajeUso >= 60 ? 'bg-warning' : 'bg-success';

  return (
    <div>
      {cuenta.saldoVencido > 0 ? (
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <i className="bi bi-exclamation-triangle-fill fs-4 me-3"></i>
          <div>
            <strong>Tienes {formatearPeso(cuenta.saldoVencido)} vencidos.</strong>
            <div className="small">Regulariza tu pago para seguir comprando a crédito.</div>
          </div>
        </div>
      ) : cuenta.proximoVencimiento ? (
        <div className="alert alert-info d-flex align-items-center" role="alert">
          <i className="bi bi-calendar-event fs-4 me-3"></i>
          <div>
            <strong>Próximo vencimiento: {formatearFecha(cuenta.proximoVencimiento.fecha)}</strong>
            <div className="small">
              {formatearPeso(cuenta.proximoVencimiento.monto)} · en {cuenta.proximoVencimiento.dias} día(s)
            </div>
          </div>
        </div>
      ) : (
        <div className="alert alert-success d-flex align-items-center" role="alert">
          <i className="bi bi-check-circle-fill fs-4 me-3"></i>
          <strong>Estás al día, no tienes saldo pendiente.</strong>
        </div>
      )}

      {/* Indicadores principales */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <small className="text-muted text-uppercase fw-bold">Saldo pendiente</small>
              <div className={`fs-3 fw-bold ${cuenta.saldoPendiente > 0 ? 'text-danger' : 'text-success'}`}>
                {formatearPeso(cuenta.saldoPendiente)}
              </div>
            </div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <small className="text-muted text-uppercase fw-bold">Crédito disponible</small>
              <div className="fs-3 fw-bold text-success">{formatearPeso(cuenta.creditoDisponible)}</div>
            </div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <small className="text-muted text-uppercase fw-bold">Límite de crédito</small>
              <div className="fs-3 fw-bold">{formatearPeso(cuenta.limiteCredito)}</div>
            </div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <small className="text-muted text-uppercase fw-bold">Saldo vencido</small>
              <div className={`fs-3 fw-bold ${cuenta.saldoVencido > 0 ? 'text-danger' : 'text-success'}`}>
                {cuenta.saldoVencido > 0 ? formatearPeso(cuenta.saldoVencido) : 'Al día'}
              </div>
              <small className="text-muted">Por vencer: {formatearPeso(cuenta.saldoPorVencer)}</small>
            </div>
          </div>
        </div>
      </div>

      {/* Uso de la línea de crédito */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between mb-2">
            <strong>Uso de tu línea de crédito</strong>
            <strong>{cuenta.porcentajeUso}%</strong>
          </div>
          <div className="progress" style={{ height: '12px' }}>
            <div
              className={`progress-bar ${colorBarra}`}
              role="progressbar"
              style={{ width: `${cuenta.porcentajeUso}%` }}
              aria-valuenow={cuenta.porcentajeUso}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
        </div>
      </div>

      {/* Formulario de solicitud de aumento */}
      <div className="card shadow-sm border-0 mb-4 bg-light">
        <div className="card-body">
          <h5 className="fw-bold mb-3"><i className="bi bi-graph-up-arrow text-primary me-2"></i>Solicitar Aumento de Límite</h5>

          <form onSubmit={handleSolicitarAumento} className="row g-3 align-items-end">
            <div className="col-12 col-md-5">
              <label className="form-label fw-bold small text-muted">Nuevo monto deseado</label>
              <div className="input-group">
                <span className="input-group-text">$</span>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Ej. 500000"
                  value={montoSolicitado}
                  onChange={(e) => setMontoSolicitado(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="col-12 col-md-3">
              <button type="submit" className="btn btn-primary fw-bold w-100">
                Solicitar
              </button>
            </div>
          </form>
          {mensajeSolicitud && (
            <div className={`mt-3 mb-0 alert ${mensajeSolicitud.includes('éxito') ? 'alert-success' : 'alert-warning'} py-2`}>
              {mensajeSolicitud}
            </div>
          )}
        </div>
      </div>

      {exito && (
        <div className="alert alert-success d-flex align-items-center" role="alert">
          <i className="bi bi-check-circle-fill fs-4 me-3"></i>
          <strong>{exito}</strong>
        </div>
      )}

      {/* Formulario para abonar */}
      {cuenta.saldoPendiente > 0 && (
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body">
            <h5 className="fw-bold mb-3"><i className="bi bi-cash-coin me-2"></i>Abonar a mi cuenta</h5>
            <form onSubmit={handleAbonar} className="row g-3 align-items-end">
              <div className="col-12 col-md-5">
                <label className="form-label fw-bold small text-muted">Monto a abonar</label>
                <input
                  type="number"
                  min="1"
                  className={`form-control ${error ? 'is-invalid' : ''}`}
                  placeholder="Ej. 20000"
                  value={monto}
                  onChange={(e) => { setMonto(e.target.value); setError(''); }}
                />
                {error && <div className="invalid-feedback">{error}</div>}
              </div>
              <div className="col-12 col-md-4">
                <label className="form-label fw-bold small text-muted">Medio de pago</label>
                <select className="form-select" value={metodo} onChange={(e) => setMetodo(e.target.value)}>
                  <option value="Transferencia">Transferencia</option>
                  <option value="Tarjeta de crédito">Tarjeta de crédito</option>
                  <option value="Efectivo">Efectivo en sucursal</option>
                </select>
              </div>
              <div className="col-12 col-md-3">
                <button type="submit" className="btn btn-success fw-bold w-100" disabled={abonando}>
                  <i className="bi bi-check2-circle me-2"></i>{abonando ? 'Abonando...' : 'Abonar'}
                </button>
              </div>
            </form>
            <small className="text-muted d-block mt-2">
              Puedes abonar hasta tu saldo pendiente. El abono actualiza tu saldo y crédito disponible en el servidor.
            </small>
          </div>
        </div>
      )}
      

      {sinMovimientos ? (
        <div className="alert alert-secondary text-center">Aún no tienes movimientos en tu cuenta corriente.</div>
      ) : (
        <>
          <h5 className="fw-bold mb-3"><i className="bi bi-file-earmark-text me-2"></i>Documentos</h5>
          <div className="card shadow-sm border-0 mb-4">
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>Documento</th>
                    <th>Fecha</th>
                    <th>Vencimiento</th>
                    <th className="text-end">Monto</th>
                    <th className="text-end">Pendiente</th>
                    <th className="text-center">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {cuenta.documentos.map((d) => (
                    <tr key={d.id}>
                      <td className="fw-bold">{d.id}</td>
                      <td>{formatearFecha(d.fecha)}</td>
                      <td>{formatearFecha(d.vencimiento)}</td>
                      <td className="text-end">{formatearPeso(d.monto)}</td>
                      <td className="text-end fw-bold">{formatearPeso(d.pendiente)}</td>
                      <td className="text-center">
                        <span className={`badge ${COLOR_DOCUMENTO[d.estado]}`}>{d.estado}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <h5 className="fw-bold mb-3"><i className="bi bi-journal-text me-2"></i>Movimientos</h5>
          <div className="card shadow-sm border-0">
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>Fecha</th>
                    <th>Descripción</th>
                    <th className="text-end">Cargo</th>
                    <th className="text-end">Abono</th>
                    <th className="text-end">Saldo</th>
                  </tr>
                </thead>
                <tbody>
                  {[...cuenta.movimientos].reverse().map((m) => (
                    <tr key={`${m.tipo}-${m.id}`}>
                      <td>{formatearFecha(m.fecha)}</td>
                      <td>{m.descripcion}</td>
                      <td className="text-end text-danger">{m.tipo === 'Cargo' ? formatearPeso(m.monto) : ''}</td>
                      <td className="text-end text-success">{m.tipo === 'Abono' ? formatearPeso(m.monto) : ''}</td>
                      <td className="text-end fw-bold">{formatearPeso(m.saldo)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CuentaCorrienteCliente;