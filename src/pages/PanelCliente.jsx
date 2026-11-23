import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import PedidoService from '../services/PedidoService';
import CuentaCorrienteService from '../services/CuentaCorrienteService';
import { DIAS_ENTREGA_ESTIMADA, DIAS_PLAZO_CREDITO } from '../data/database';
import { esPedidoEnCurso } from '../utils/pedidos';
import { hoyISO, sumarDias, diasEntre } from '../utils/fechas';
import PedidoCliente from '../components/PedidoCliente';
import CuentaCorrienteCliente from '../components/CuentaCorrienteCliente';

const leerSesion = () => {
  try {
    return JSON.parse(localStorage.getItem('react_usuario_activo'));
  } catch {
    return null;
  }
};

// Adapta el Pedido de Spring Boot al formato que espera <PedidoCliente />
const normalizarPedido = (p) => {
  const fecha = p.fechaCreacion ? p.fechaCreacion.split('T')[0] : hoyISO();
  const estado = p.estado || 'Pendiente';

  return {
    ...p,
    fecha,
    fechaEntrega: p.fechaEntrega || sumarDias(fecha, DIAS_ENTREGA_ESTIMADA),
    historialEstados: p.historialEstados || [{ estado, fecha }],
    items: (p.items || []).map((it) => ({
      id: it.producto?.id ?? it.id,
      nombre: it.producto?.nombre || it.nombre || 'Producto',
      precio: it.precioUnitario ?? it.producto?.precio ?? it.precio ?? 0,
      cantidad: it.cantidad || 1
    }))
  };
};

// Combina la CuentaCorriente de H2 con los pedidos a crédito del cliente
const construirResumenCuenta = (cuentaDB, pedidosNormalizados) => {
  if (!cuentaDB) return null;

  const hoy = hoyISO();
  const creditoDisponible = cuentaDB.creditoDisponible || 0;
  const saldoPendiente = cuentaDB.saldoPendiente || 0;
  const saldoVencido = cuentaDB.saldoVencido || 0;
  const limiteCredito = creditoDisponible + saldoPendiente;
  const saldoPorVencer = Math.max(0, saldoPendiente - saldoVencido);
  const porcentajeUso = limiteCredito > 0 ? Math.min(100, Math.round((saldoPendiente / limiteCredito) * 100)) : 0;

  const documentos = pedidosNormalizados
    .filter((p) => (p.montoCredito || 0) > 0 && p.estado !== 'Cancelado')
    .map((p) => {
      const vencimiento = sumarDias(p.fecha, DIAS_PLAZO_CREDITO);
      const estadoDoc = saldoPendiente === 0 ? 'Pagado' : (vencimiento < hoy ? 'Vencido' : 'Por vencer');
      return {
        id: `ORD-${p.id}`,
        fecha: p.fecha,
        vencimiento,
        monto: p.montoCredito,
        pendiente: saldoPendiente === 0 ? 0 : Math.min(p.montoCredito, saldoPendiente),
        estado: estadoDoc
      };
    });

  let acumulado = 0;
  const movimientos = [...documentos]
    .reverse()
    .map((d) => {
      acumulado += d.monto;
      return {
        id: d.id,
        tipo: 'Cargo',
        fecha: d.fecha,
        descripcion: `Compra ${d.id} (Cuenta corriente)`,
        monto: d.monto,
        saldo: acumulado
      };
    });

  const proximos = documentos
    .filter((d) => d.estado === 'Por vencer')
    .sort((a, b) => a.vencimiento.localeCompare(b.vencimiento));

  return {
    id: cuentaDB.id,
    limiteCredito,
    creditoDisponible,
    saldoPendiente,
    saldoVencido,
    saldoPorVencer,
    porcentajeUso,
    proximoVencimiento: proximos[0]
      ? { fecha: proximos[0].vencimiento, monto: proximos[0].pendiente, dias: diasEntre(hoy, proximos[0].vencimiento) }
      : null,
    documentos,
    movimientos
  };
};

/**
 * Componente de Página: PanelCliente
 *
 * Descripción: Módulo "Mis Pedidos" conectado a la API REST de Spring Boot
 * (/api/v1/pedidos/cliente/:email y /api/v1/cuentas-corrientes/cliente/:email).
 */
const PanelCliente = ({ usuarioActivo }) => {
  const [usuario, setUsuario] = useState(() => usuarioActivo || leerSesion());
  const [vistaActiva, setVistaActiva] = useState('curso');
  const [filtro, setFiltro] = useState('todos');

  const [pedidos, setPedidos] = useState([]);
  const [cuenta, setCuenta] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    setUsuario(usuarioActivo || leerSesion());
  }, [usuarioActivo]);

  const cargarDatos = useCallback(async () => {
    if (!usuario?.email) {
      setCargando(false);
      return;
    }

    setCargando(true);
    try {
      const { data: pedidosDB } = await PedidoService.obtenerPorCliente(usuario.email);
      const pedidosNorm = (pedidosDB || [])
        .map(normalizarPedido)
        .sort((a, b) => (b.id || 0) - (a.id || 0));
      setPedidos(pedidosNorm);

      try {
        const { data: cuentaDB } = await CuentaCorrienteService.obtenerPorCliente(usuario.email);
        setCuenta(construirResumenCuenta(cuentaDB, pedidosNorm));
      } catch {
        setCuenta(null); // El cliente aún no tiene cuenta corriente asignada en H2
      }
    } catch (error) {
      console.error('Error al cargar pedidos del cliente:', error);
    } finally {
      setCargando(false);
    }
  }, [usuario]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  // Registra el abono en Spring Boot y recarga los saldos desde H2
  const handleAbonar = async (monto) => {
    if (!cuenta?.id) return;
    await CuentaCorrienteService.abonar(cuenta.id, monto);
    await cargarDatos();
  };

  if (!usuario) {
    return (
      <div className="container my-4">
        <div className="alert alert-warning text-center py-4 shadow-sm">
          <h5>Debes iniciar sesión para ver tus pedidos</h5>
          <Link to="/login" className="btn btn-warning fw-bold mt-2">Ir a Iniciar Sesión</Link>
        </div>
      </div>
    );
  }

  const pedidosEnCurso = pedidos.filter(esPedidoEnCurso);

  const pedidosHistorial = pedidos.filter((p) => {
    if (filtro === 'todos') return true;
    if (filtro === 'curso') return esPedidoEnCurso(p);
    return p.estado === filtro;
  });

  const clasePestana = (vista) =>
    `nav-link fw-bold py-3 ${vistaActiva === vista ? 'active text-success border-success border-bottom-0' : 'text-secondary'}`;

  return (
    <div className="container my-4">
      <div className="mb-4">
        <h2 className="fw-bold text-dark mb-1"><i className="bi bi-bag-check me-2"></i>Mis Pedidos</h2>
        <p className="text-muted mb-0">Hola, {usuario.nombre}. Aquí puedes seguir tus compras y revisar tu cuenta corriente.</p>
      </div>

      <ul className="nav nav-tabs nav-fill mb-4 border-bottom border-2">
        <li className="nav-item">
          <button className={clasePestana('curso')} onClick={() => setVistaActiva('curso')}>
            <i className="bi bi-truck me-2"></i>En curso
            {pedidosEnCurso.length > 0 && <span className="badge bg-warning text-dark ms-2">{pedidosEnCurso.length}</span>}
          </button>
        </li>
        <li className="nav-item">
          <button className={clasePestana('historial')} onClick={() => setVistaActiva('historial')}>
            <i className="bi bi-clock-history me-2"></i>Historial
          </button>
        </li>
        <li className="nav-item">
          <button className={clasePestana('cuenta')} onClick={() => setVistaActiva('cuenta')}>
            <i className="bi bi-wallet2 me-2"></i>Cuenta corriente
          </button>
        </li>
      </ul>

      {cargando ? (
        <div className="text-center py-5">
          <div className="spinner-border text-warning mb-2" role="status"></div>
          <p className="text-muted">Cargando tu información desde el servidor...</p>
        </div>
      ) : (
        <>
          {vistaActiva === 'curso' && (
            pedidosEnCurso.length === 0 ? (
              <div className="alert alert-info text-center py-4">
                <h5>No tienes pedidos en curso</h5>
                <Link to="/catalogo" className="btn btn-primary fw-bold mt-2">Ir al Catálogo</Link>
              </div>
            ) : (
              pedidosEnCurso.map((p) => <PedidoCliente key={p.id} pedido={p} lineaTiempoSiempreVisible />)
            )
          )}

          {vistaActiva === 'historial' && (
            <>
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                <span className="text-muted">{pedidosHistorial.length} pedido(s)</span>
                <select
                  className="form-select w-auto fw-bold"
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                  aria-label="Filtrar pedidos por estado"
                >
                  <option value="todos">Todos los pedidos</option>
                  <option value="curso">En curso</option>
                  <option value="Entregado">Entregados</option>
                  <option value="Cancelado">Cancelados</option>
                </select>
              </div>
              {pedidosHistorial.length === 0 ? (
                <div className="alert alert-secondary text-center">No hay pedidos para mostrar.</div>
              ) : (
                pedidosHistorial.map((p) => <PedidoCliente key={p.id} pedido={p} />)
              )}
            </>
          )}

          {vistaActiva === 'cuenta' && <CuentaCorrienteCliente cuenta={cuenta} onAbonar={handleAbonar} />}
        </>
      )}
    </div>
  );
};

export default PanelCliente;