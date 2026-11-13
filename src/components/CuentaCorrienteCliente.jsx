import React, { useState } from 'react';
import { formatearFecha, formatearPeso } from '../utils/fechas';

// Color de la insignia según el estado de cada documento (compra a crédito)
const COLOR_DOCUMENTO = { 'Pagado': 'bg-success', 'Por vencer': 'bg-warning text-dark', 'Vencido': 'bg-danger' };

/**
 * Componente Funcional: CuentaCorrienteCliente
 *
 * Descripción: Presenta la cuenta corriente del cliente: saldo pendiente, crédito disponible, límite,
 * saldo vencido, uso de la línea de crédito, formulario de abono, documentos (compras a crédito)
 * y libro de movimientos.
 *
 * Props Recibidas:
 * @param {Object} cuenta - Resultado de getCuentaCorriente() en database.js.
 * @param {Function} onAbonar - Callback (monto, metodo) que registra el abono en la capa de datos.
 *
 * Criterios Evaluados Aplicados:
 * 1. Comunicación mediante Props: los cálculos vienen resueltos desde la capa de datos y el abono se delega al padre por callback.
 * 2. Renderizado condicional: alertas y colores distintos según haya deuda vencida, por vencer o esté al día.
 * 3. Manejo de estado y formularios (useState): monto, medio de pago y mensajes de error/éxito.
 * 4. Componentes de Bootstrap: cards de indicadores, progress bar, alerts, badges y table-responsive.
 */
const CuentaCorrienteCliente = ({ cuenta, onAbonar }) => {
  // Estados del formulario de abono
  const [monto, setMonto] = useState('');
  const [metodo, setMetodo] = useState('Transferencia');
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  /**
   * Manejador del formulario de abono: valida el monto, avisa al padre (onAbonar)
   * para que lo guarde y muestra un mensaje de confirmación.
   */
  const handleAbonar = (e) => {
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
    if (onAbonar) onAbonar(valor, metodo);
    setMonto('');
    setError('');
    setExito(`Abono de ${formatearPeso(valor)} registrado correctamente.`);
  };

  const sinMovimientos = cuenta.movimientos.length === 0;

  // Color de la barra de uso del crédito: verde (<60%), amarillo (<85%), rojo (>=85%)
  const colorBarra = cuenta.porcentajeUso >= 85 ? 'bg-danger' : cuenta.porcentajeUso >= 60 ? 'bg-warning' : 'bg-success';

  return (
    <div>
      {/* Mensaje principal según la situación de la cuenta */}
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

      {/* Mensaje de confirmación del último abono */}
      {exito && (
        <div className="alert alert-success d-flex align-items-center" role="alert">
          <i className="bi bi-check-circle-fill fs-4 me-3"></i>
          <strong>{exito}</strong>
        </div>
      )}

      {/* Formulario para abonar: solo si hay saldo pendiente */}
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
                {/* Este es el <select> de medios de pago del abono */}
                <select className="form-select" value={metodo} onChange={(e) => setMetodo(e.target.value)}>
                  <option value="Transferencia">Transferencia</option>
                  <option value="Tarjeta de crédito">Tarjeta de crédito</option>
                  <option value="Efectivo">Efectivo en sucursal</option>
                </select>
              </div>
              <div className="col-12 col-md-3">
                <button type="submit" className="btn btn-success fw-bold w-100">
                  <i className="bi bi-check2-circle me-2"></i>Abonar
                </button>
              </div>
            </form>
            <small className="text-muted d-block mt-2">
              Puedes abonar hasta tu saldo pendiente. Los abonos pagan primero las compras más antiguas.
            </small>
          </div>
        </div>
      )}

      {sinMovimientos ? (
        <div className="alert alert-secondary text-center">Aún no tienes movimientos en tu cuenta corriente.</div>
      ) : (
        <>
          {/* Documentos: cada compra a crédito con su estado de pago */}
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
                      <td className="text-center"><span className={`badge ${COLOR_DOCUMENTO[d.estado]}`}>{d.estado}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Libro de movimientos con saldo acumulado (más reciente primero) */}
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