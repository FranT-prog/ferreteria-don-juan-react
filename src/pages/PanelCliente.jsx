import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getPedidosDeCliente, getCuentaCorriente, createAbono } from '../data/database';
import { esPedidoEnCurso } from '../utils/pedidos';
import PedidoCliente from '../components/PedidoCliente';
import CuentaCorrienteCliente from '../components/CuentaCorrienteCliente';

// Lee la sesión guardada en LocalStorage (respaldo por si la prop todavía no llegó desde App.js)
const leerSesion = () => JSON.parse(localStorage.getItem('react_usuario_activo'));

/**
 * Componente de Página: PanelCliente
 *
 * Descripción: Módulo "Mis Pedidos" para el rol 'Cliente'. Reúne en pestañas:
 *  1. Pedidos en curso (fecha de pedido, fecha de entrega, detalle y línea de tiempo).
 *  2. Historial de todas las compras con su detalle (con filtro por estado).
 *  3. Cuenta corriente (saldo, saldo pendiente, crédito disponible, abonos, documentos y movimientos).
 *
 * Props Recibidas:
 * @param {Object|null} usuarioActivo - Usuario con sesión iniciada (viene del estado global de App.js).
 *
 * Criterios Evaluados Aplicados:
 * 1. Control de Navegación por Pestañas (estado `vistaActiva`), igual que en PanelVendedor.
 * 2. Comunicación de Componentes mediante Props y Callbacks: pasa cada pedido a <PedidoCliente />,
 *    y a <CuentaCorrienteCliente /> la cuenta y la función `onAbonar`.
 * 3. Integración con la capa de datos (`database.js`) y optimización con useMemo para no recalcular en cada render.
 * 4. Renderizado condicional: mensaje de "inicia sesión" y estados vacíos.
 */
const PanelCliente = ({ usuarioActivo }) => {
  // Usuario autenticado: prioriza la prop y, si no existe, usa la sesión de LocalStorage
  const [usuario, setUsuario] = useState(() => usuarioActivo || leerSesion());

  // Pestaña activa: 'curso' | 'historial' | 'cuenta'
  const [vistaActiva, setVistaActiva] = useState('curso');

  // Filtro del historial: 'todos' | 'curso' | 'Entregado' | 'Cancelado'
  const [filtro, setFiltro] = useState('todos');

  // Mantiene sincronizado el usuario cuando cambia la prop (ej. inicio o cierre de sesión)
  useEffect(() => {
    setUsuario(usuarioActivo || leerSesion());
  }, [usuarioActivo]);

  // Pedidos del cliente: se recalculan solo cuando cambia el usuario
  const pedidos = useMemo(() => getPedidosDeCliente(usuario), [usuario]);

  // La cuenta corriente vive en un estado para poder refrescarla después de cada abono
  const [cuenta, setCuenta] = useState(() => (usuario ? getCuentaCorriente(usuario) : null));

  // Recalcula la cuenta cuando cambia el usuario
  useEffect(() => {
    setCuenta(usuario ? getCuentaCorriente(usuario) : null);
  }, [usuario]);

  /**
   * Callback enviado a <CuentaCorrienteCliente />: registra el abono en la base de datos
   * y vuelve a calcular la cuenta para que los saldos se actualicen al instante.
   */
  const handleAbonar = (monto, metodo) => {
    createAbono(usuario.id, monto, metodo);
    setCuenta(getCuentaCorriente(usuario));
  };

  // Sin sesión iniciada: se invita a ingresar
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

  // Aplica el filtro seleccionado al historial
  const pedidosHistorial = pedidos.filter((p) => {
    if (filtro === 'todos') return true;
    if (filtro === 'curso') return esPedidoEnCurso(p);
    return p.estado === filtro;
  });

  // Clase de cada pestaña (activa o inactiva), mismo estilo que PanelVendedor
  const clasePestana = (vista) =>
    `nav-link fw-bold py-3 ${vistaActiva === vista ? 'active text-success border-success border-bottom-0' : 'text-secondary'}`;

  return (
    <div className="container my-4">
      <div className="mb-4">
        <h2 className="fw-bold text-dark mb-1"><i className="bi bi-bag-check me-2"></i>Mis Pedidos</h2>
        <p className="text-muted mb-0">Hola, {usuario.nombre}. Aquí puedes seguir tus compras y revisar tu cuenta corriente.</p>
      </div>

      {/* Pestañas de navegación interna */}
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

      {/* PESTAÑA 1: Pedidos en curso */}
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

      {/* PESTAÑA 2: Historial completo con filtro */}
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

      {/* PESTAÑA 3: Cuenta corriente (con la función para registrar abonos) */}
      {vistaActiva === 'cuenta' && <CuentaCorrienteCliente cuenta={cuenta} onAbonar={handleAbonar} />}
    </div>
  );
};

export default PanelCliente;