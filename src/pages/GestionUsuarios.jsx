import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import UsuarioService from '../services/UsuarioService';
import PedidoService from '../services/PedidoService';
import CuentaCorrienteService from '../services/CuentaCorrienteService';
import { DIAS_PLAZO_CREDITO } from '../data/database';
import { hoyISO, sumarDias, diasEntre } from '../utils/fechas';
import CuentaCorrienteCliente from '../components/CuentaCorrienteCliente';

// Construye el resumen visual que espera <CuentaCorrienteCliente /> a partir de la BD H2
const construirResumenCuenta = (cuentaDB, pedidosCliente) => {
  if (!cuentaDB) return null;

  const hoy = hoyISO();
  const creditoDisponible = cuentaDB.creditoDisponible || 0;
  const saldoPendiente = cuentaDB.saldoPendiente || 0;
  const saldoVencido = cuentaDB.saldoVencido || 0;
  const limiteCredito = creditoDisponible + saldoPendiente;
  const saldoPorVencer = Math.max(0, saldoPendiente - saldoVencido);
  const porcentajeUso = limiteCredito > 0 ? Math.min(100, Math.round((saldoPendiente / limiteCredito) * 100)) : 0;

  const documentos = (pedidosCliente || [])
    .filter((p) => (p.montoCredito || 0) > 0 && p.estado !== 'Cancelado')
    .map((p) => {
      const fecha = p.fechaCreacion ? p.fechaCreacion.split('T')[0] : hoy;
      const vencimiento = sumarDias(fecha, DIAS_PLAZO_CREDITO);
      const estadoDoc = saldoPendiente === 0 ? 'Pagado' : (vencimiento < hoy ? 'Vencido' : 'Por vencer');
      return {
        id: `ORD-${p.id}`,
        fecha,
        vencimiento,
        monto: p.montoCredito,
        pendiente: saldoPendiente === 0 ? 0 : Math.min(p.montoCredito, saldoPendiente),
        estado: estadoDoc
      };
    });

  let acumulado = 0;
  const movimientos = [...documentos].reverse().map((d) => {
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
 * Componente de Página: GestionUsuarios
 *
 * Descripción: Módulo administrativo conectado a Spring Boot (/api/v1/usuarios,
 * /api/v1/pedidos y /api/v1/cuentas-corrientes) para gestionar cuentas, roles,
 * estados, historiales de compra y cuentas corrientes.
 */
const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [vistaActual, setVistaActual] = useState('lista');
  const [usuarioActivo, setUsuarioActivo] = useState(null);
  const [comprasUsuario, setComprasUsuario] = useState([]);
  const [busquedaUsuario, setBusquedaUsuario] = useState('');
  const [cuentaSeleccionada, setCuentaSeleccionada] = useState(null);
  const [modalCuentaAbierto, setModalCuentaAbierto] = useState(false);
  const [cargando, setCargando] = useState(true);

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    try {
      const [resUsers, resPedidos] = await Promise.all([
        UsuarioService.obtenerTodos(),
        PedidoService.obtenerTodos()
      ]);
      setUsuarios(resUsers.data || []);
      setPedidos(resPedidos.data || []);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  // --- CUENTA CORRIENTE ---
  const abrirEstadoCuenta = async (user) => {
    setUsuarioActivo(user);
    setModalCuentaAbierto(true);
    try {
      const { data: cuentaDB } = await CuentaCorrienteService.obtenerPorCliente(user.email);
      const pedidosCliente = pedidos.filter(
        (p) => (p.email || '').toLowerCase() === (user.email || '').toLowerCase()
      );
      setCuentaSeleccionada(construirResumenCuenta(cuentaDB, pedidosCliente));
    } catch {
      setCuentaSeleccionada(null);
    }
  };

  const manejarAbonoAdmin = async (monto) => {
    if (!cuentaSeleccionada?.id) return;
    await CuentaCorrienteService.abonar(cuentaSeleccionada.id, monto);
    await abrirEstadoCuenta(usuarioActivo);
  };

  const manejarHabilitarCuenta = async () => {
    if (!usuarioActivo?.id) return;
    try {
      await CuentaCorrienteService.guardar({
        usuario: { id: usuarioActivo.id },
        creditoDisponible: 300000,
        saldoPendiente: 0,
        saldoVencido: 0
      });
      await abrirEstadoCuenta(usuarioActivo);
    } catch {
      alert('No se pudo habilitar la cuenta corriente.');
    }
  };

  const cerrarEstadoCuenta = () => {
    setModalCuentaAbierto(false);
    setCuentaSeleccionada(null);
  };

  const usuariosFiltrados = usuarios.filter(
    (usr) =>
      (usr.nombre || '').toLowerCase().includes(busquedaUsuario.toLowerCase()) ||
      (usr.email || '').toLowerCase().includes(busquedaUsuario.toLowerCase())
  );

  // --- EDITAR ---
  const abrirEdicion = (user) => {
    setUsuarioActivo({ ...user });
    setVistaActual('editar');
  };

  const manejarCambioEdicion = (e) => {
    setUsuarioActivo({ ...usuarioActivo, [e.target.name]: e.target.value });
  };

  const guardarEdicion = async (e) => {
    e.preventDefault();
    try {
      const { data: actualizado } = await UsuarioService.actualizar(usuarioActivo.id, {
        nombre: usuarioActivo.nombre,
        email: usuarioActivo.email,
        rol: usuarioActivo.rol,
        activo: usuarioActivo.activo
      });
      setUsuarios((prev) => prev.map((u) => (u.id === actualizado.id ? actualizado : u)));
      alert('Usuario actualizado con éxito');
      setVistaActual('lista');
    } catch {
      alert('No se pudo actualizar el usuario en el servidor.');
    }
  };

  // --- HISTORIAL ---
  const verHistorial = (user) => {
    setUsuarioActivo(user);
    const compras = pedidos.filter(
      (p) => (p.email || '').toLowerCase() === (user.email || '').toLowerCase()
    );
    setComprasUsuario(compras);
    setVistaActual('historial');
  };

  // --- ACTIVAR / BLOQUEAR Y ELIMINAR ---
  const handleCambiarEstadoUsuario = async (usr) => {
    const nuevoActivo = usr.activo === false;
    try {
      const { data: actualizado } = await UsuarioService.cambiarEstadoActivo(usr.id, nuevoActivo);
      setUsuarios((prev) => prev.map((u) => (u.id === usr.id ? actualizado : u)));
    } catch {
      alert('No se pudo cambiar el estado del usuario.');
    }
  };

  const handleEliminarUsuario = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar a este usuario?')) {
      try {
        await UsuarioService.eliminar(id);
        setUsuarios((prev) => prev.filter((u) => u.id !== id));
      } catch {
        alert('No se pudo eliminar el usuario (puede tener pedidos o cuenta corriente asociada).');
      }
    }
  };

  if (cargando) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-dark mb-2" role="status"></div>
        <p className="text-muted">Cargando usuarios desde el servidor...</p>
      </div>
    );
  }

  return (
    <div className="w-100">
      {/* VISTA 1: TABLA PRINCIPAL */}
      {vistaActual === 'lista' && (
        <div className="card shadow-sm border-0">
          <div className="card-header bg-dark text-white py-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h5 className="fw-bold mb-0"><i className="bi bi-people-fill me-2"></i>Cuentas de Usuario</h5>
            <div className="d-flex gap-2">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Buscar usuario o correo..."
                value={busquedaUsuario}
                onChange={(e) => setBusquedaUsuario(e.target.value)}
                style={{ width: '220px' }}
              />
              <Link to="/admin/usuario/nuevo" className="btn btn-sm btn-light fw-bold">
                <i className="bi bi-person-plus-fill me-1"></i> Nuevo
              </Link>
            </div>
          </div>

          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosFiltrados.length === 0 ? (
                    <tr><td colSpan="6" className="text-center py-4">No se encontraron usuarios</td></tr>
                  ) : (
                    usuariosFiltrados.map((usr) => {
                      const estaActivo = usr.activo !== false;
                      return (
                        <tr key={usr.id}>
                          <td className="fw-bold text-muted">USR-{usr.id}</td>
                          <td className="fw-bold">{usr.nombre}</td>
                          <td>{usr.email}</td>
                          <td>
                            <span className={`badge ${usr.rol === 'Administrador' ? 'bg-danger' : usr.rol === 'Vendedor' ? 'bg-success' : 'bg-secondary'}`}>
                              {usr.rol || 'Cliente'}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${estaActivo ? 'bg-success' : 'bg-danger'}`}>
                              {estaActivo ? 'Activo' : 'Bloqueado'}
                            </span>
                          </td>
                          <td className="text-center">
                            <div className="btn-group btn-group-sm">
                              <button className="btn btn-outline-dark" onClick={() => abrirEstadoCuenta(usr)} title="Ver Estado de Cuenta">
                                <i className="bi bi-wallet2"></i>
                              </button>
                              <button className="btn btn-outline-info" onClick={() => verHistorial(usr)} title="Ver Historial">
                                <i className="bi bi-clock-history"></i>
                              </button>
                              <button className="btn btn-outline-primary" onClick={() => abrirEdicion(usr)} title="Editar">
                                <i className="bi bi-pencil-square"></i>
                              </button>
                              <button
                                className={`btn ${estaActivo ? 'btn-outline-warning' : 'btn-outline-success'}`}
                                onClick={() => handleCambiarEstadoUsuario(usr)}
                                title={estaActivo ? 'Bloquear usuario' : 'Activar usuario'}
                              >
                                <i className={`bi ${estaActivo ? 'bi-lock-fill' : 'bi-unlock-fill'}`}></i>
                              </button>
                              <button className="btn btn-outline-danger" onClick={() => handleEliminarUsuario(usr.id)} title="Eliminar cuenta">
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VISTA 2: EDITAR USUARIO */}
      {vistaActual === 'editar' && usuarioActivo && (
        <div className="card shadow-sm border-0 bg-light mx-auto" style={{ maxWidth: '600px' }}>
          <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center py-3">
            <h5 className="mb-0 fw-bold">Editar Usuario</h5>
            <button className="btn btn-sm btn-outline-light" onClick={() => setVistaActual('lista')}>Volver</button>
          </div>
          <div className="card-body p-4">
            <form onSubmit={guardarEdicion}>
              <div className="mb-3">
                <label className="form-label text-muted small fw-bold">Nombre Completo</label>
                <input type="text" className="form-control" name="nombre" value={usuarioActivo.nombre} onChange={manejarCambioEdicion} required />
              </div>
              <div className="mb-3">
                <label className="form-label text-muted small fw-bold">Correo Electrónico</label>
                <input type="email" className="form-control text-muted" name="email" value={usuarioActivo.email} readOnly />
              </div>
              <div className="mb-4">
                <label className="form-label text-muted small fw-bold">Rol del Usuario</label>
                <select className="form-select" name="rol" value={usuarioActivo.rol || 'Cliente'} onChange={manejarCambioEdicion}>
                  <option value="Cliente">Cliente</option>
                  <option value="Vendedor">Vendedor</option>
                  <option value="Administrador">Administrador</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary w-100 fw-bold">Guardar Cambios</button>
            </form>
          </div>
        </div>
      )}

      {/* VISTA 3: HISTORIAL DE COMPRAS */}
      {vistaActual === 'historial' && usuarioActivo && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="fw-bold">Historial de {usuarioActivo.nombre}</h4>
            <button className="btn btn-sm btn-dark" onClick={() => setVistaActual('lista')}>
              <i className="bi bi-arrow-left me-1"></i>Volver a la lista
            </button>
          </div>
          <div className="alert alert-secondary small">
            Email: <strong>{usuarioActivo.email}</strong>
          </div>

          {comprasUsuario.length === 0 ? (
            <div className="text-center py-5 bg-light rounded border">
              <i className="bi bi-bag-x text-muted" style={{ fontSize: '3rem' }}></i>
              <p className="text-muted mt-3">Este usuario no tiene compras registradas.</p>
            </div>
          ) : (
            <div className="row g-3">
              {comprasUsuario.map((compra) => (
                <div className="col-md-6" key={compra.id}>
                  <div className="card shadow-sm border-0 h-100">
                    <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                      <span className="small fw-bold">Orden #ORD-{compra.id}</span>
                      <span className={`badge ${compra.estado === 'Entregado' ? 'bg-success' : 'bg-warning text-dark'}`}>
                        {compra.estado || 'Pendiente'}
                      </span>
                    </div>
                    <div className="card-body">
                      <p className="small text-muted mb-2">
                        <i className="bi bi-geo-alt me-1"></i> {compra.direccion || 'Retiro en tienda'}
                      </p>
                      <hr className="my-2" />
                      <ul className="list-unstyled mb-3 small">
                        {(compra.items || []).map((item, i) => {
                          const nombre = item.producto?.nombre || item.nombre || 'Producto';
                          const precio = item.precioUnitario ?? item.producto?.precio ?? item.precio ?? 0;
                          return (
                            <li key={item.id || i} className="d-flex justify-content-between mb-1">
                              <span>{item.cantidad}x {nombre}</span>
                              <span className="text-muted">${(precio * item.cantidad).toLocaleString('es-CL')}</span>
                            </li>
                          );
                        })}
                      </ul>
                      <h6 className="fw-bold d-flex justify-content-between text-danger mb-0">
                        Total Pagado: <span>${(compra.total || 0).toLocaleString('es-CL')}</span>
                      </h6>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VISTA 4: MODAL DE ESTADO DE CUENTA */}
      {modalCuentaAbierto && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1040 }}></div>
          <div className="modal fade show d-block" tabIndex="-1" style={{ zIndex: 1050 }}>
            <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content shadow">
                <div className="modal-header bg-dark text-white">
                  <h5 className="modal-title fw-bold">
                    <i className="bi bi-wallet2 me-2"></i>
                    Estado de Cuenta: {usuarioActivo?.nombre}
                  </h5>
                  <button type="button" className="btn-close btn-close-white" onClick={cerrarEstadoCuenta}></button>
                </div>

                <div className="modal-body bg-light p-4">
                  <CuentaCorrienteCliente
                    cuenta={cuentaSeleccionada}
                    onAbonar={manejarAbonoAdmin}
                    onHabilitarCuenta={manejarHabilitarCuenta}
                  />
                </div>

                <div className="modal-footer bg-white">
                  <button type="button" className="btn btn-secondary" onClick={cerrarEstadoCuenta}>
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GestionUsuarios;