import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PedidoService from '../services/PedidoService';
import CuentaCorrienteService from '../services/CuentaCorrienteService';
import { hoyISO } from '../utils/fechas';
import { DIRECCION_TIENDA, HORARIO_ATENCION, calcularFechaRetiro, formatearFechaLarga } from '../utils/tienda';

const METODOS_CONTADO = [
  { valor: 'Transferencia', titulo: 'Transferencia', icono: 'bi-bank', detalle: 'Transferencia bancaria' },
  { valor: 'Efectivo', titulo: 'Efectivo', icono: 'bi-cash-coin', detalle: '' }
];

/**
 * Componente de Página: Carrito
 *
 * Descripción: Gestiona el resumen de compras, validación de datos de entrega,
 * consulta de cuenta corriente y creación del pedido en el backend Spring Boot
 * (/api/v1/pedidos), el cual descuenta el stock y actualiza la cuenta corriente en H2.
 */
const Carrito = ({ onActualizarCarrito }) => {
  const [carrito, setCarrito] = useState([]);
  const [datosCliente, setDatosCliente] = useState({
    nombre: '',
    rut: '',
    email: '',
    direccion: ''
  });

  const [errores, setErrores] = useState({});
  const [errorServidor, setErrorServidor] = useState('');
  const [procesando, setProcesando] = useState(false);

  const [tipoEntrega, setTipoEntrega] = useState('Despacho');
  const [metodoContado, setMetodoContado] = useState('Transferencia');
  const [usarCuenta, setUsarCuenta] = useState(false);
  const [montoCuenta, setMontoCuenta] = useState('');
  const [cuenta, setCuenta] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem('react_carrito')) || [];
    setCarrito(carritoGuardado);

    const usuarioActivo = JSON.parse(localStorage.getItem('react_usuario_activo'));
    if (usuarioActivo) {
      setDatosCliente(prev => ({
        ...prev,
        nombre: usuarioActivo.nombre || '',
        email: usuarioActivo.email || ''
      }));

      // Consultar la cuenta corriente real desde Spring Boot
      if (usuarioActivo.email) {
        CuentaCorrienteService.obtenerPorCliente(usuarioActivo.email)
          .then(({ data }) => setCuenta(data))
          .catch(() => setCuenta(null)); // Si el usuario no tiene cuenta corriente, queda en null
      }
    }
  }, []);

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setDatosCliente({ ...datosCliente, [name]: value });

    if (errores[name]) {
      setErrores({ ...errores, [name]: '' });
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!datosCliente.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre completo es obligatorio.';
    }

    const rutLimpio = datosCliente.rut.replace(/[^0-9kK]/g, '');
    if (!rutLimpio) {
      nuevosErrores.rut = 'El RUT es obligatorio.';
    } else if (rutLimpio.length < 8 || rutLimpio.length > 9) {
      nuevosErrores.rut = 'El RUT debe tener entre 8 y 9 caracteres (Ej: 123456789 o 18765432K).';
    }

    const regexEmailDominio = /^[a-zA-Z0-9._%+-]+@(gmail\.com|losmaestros\.cl)$/i;
    if (!datosCliente.email.trim()) {
      nuevosErrores.email = 'El correo electrónico es obligatorio.';
    } else if (!regexEmailDominio.test(datosCliente.email.trim())) {
      nuevosErrores.email = 'El correo debe terminar en @gmail.com o @losmaestros.cl.';
    }

    if (tipoEntrega === 'Despacho' && !datosCliente.direccion.trim()) {
      nuevosErrores.direccion = 'La dirección de despacho es obligatoria.';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const eliminarDelCarrito = (id) => {
    const nuevoCarrito = carrito.filter(item => String(item.id) !== String(id));
    setCarrito(nuevoCarrito);
    localStorage.setItem('react_carrito', JSON.stringify(nuevoCarrito));
    if (onActualizarCarrito) onActualizarCarrito();
  };

  const cambiarCantidad = (idProducto, cambio) => {
    const nuevoCarrito = carrito.map(item => {
      if (String(item.id) === String(idProducto)) {
        const nuevaCantidad = (item.cantidad || 1) + cambio;
        if (nuevaCantidad >= 1 && nuevaCantidad <= item.stock) {
          return { ...item, cantidad: nuevaCantidad };
        }
      }
      return item;
    });

    setCarrito(nuevoCarrito);
    localStorage.setItem('react_carrito', JSON.stringify(nuevoCarrito));
    if (onActualizarCarrito) onActualizarCarrito();
  };

  const calcularTotal = () => {
    return carrito.reduce((total, item) => total + (item.precio * (item.cantidad || 1)), 0);
  };

  const total = calcularTotal();
  const esRetiro = tipoEntrega === 'Retiro';
  const fechaRetiro = calcularFechaRetiro(hoyISO());

  const motivoSinCuenta = !cuenta
    ? 'Inicia sesión con una cuenta que posea línea de crédito habilitada.'
    : (cuenta.saldoVencido || 0) > 0
      ? 'Tienes saldo vencido en tu cuenta corriente.'
      : (cuenta.creditoDisponible || 0) <= 0
        ? 'No tienes crédito disponible.'
        : '';
  const puedeUsarCuenta = motivoSinCuenta === '';

  const maxCuenta = puedeUsarCuenta ? Math.min(total, cuenta.creditoDisponible) : 0;
  const montoACuenta = usarCuenta ? Math.min(Math.max(parseInt(montoCuenta, 10) || 0, 0), maxCuenta) : 0;
  const montoContado = total - montoACuenta;

  const procesarCompraFinal = async (e) => {
    e.preventDefault();
    setErrorServidor('');

    if (carrito.length === 0) return;
    if (!validarFormulario()) return;

    if (usarCuenta) {
      const pedidoMonto = parseInt(montoCuenta, 10) || 0;
      if (!puedeUsarCuenta) {
        setErrores({ formaPago: motivoSinCuenta });
        return;
      }
      if (pedidoMonto <= 0) {
        setErrores({ formaPago: 'Ingresa cuánto quieres pagar con tu cuenta corriente.' });
        return;
      }
      if (pedidoMonto > maxCuenta) {
        setErrores({ formaPago: `Con tu cuenta corriente puedes pagar hasta $${maxCuenta.toLocaleString('es-CL')} en esta compra.` });
        return;
      }
    }

    const pagoAprobado =
      montoContado === 0 ||
      window.confirm(
        `Simulación de pago (${metodoContado}: $${montoContado.toLocaleString('es-CL')}):\n[Aceptar] = Pago Exitoso\n[Cancelar] = Pago Rechazado`
      );

    if (!pagoAprobado) {
      navigate('/pago-rechazado');
      return;
    }

    const usuarioSesion = JSON.parse(localStorage.getItem('react_usuario_activo'));
    const pagos = [];
    if (montoACuenta > 0) pagos.push({ metodo: 'Cuenta corriente', monto: montoACuenta });
    if (montoContado > 0) pagos.push({ metodo: metodoContado, monto: montoContado });
    const formaPago = pagos.length > 1 ? `Mixto (${metodoContado} + Cuenta corriente)` : pagos[0].metodo;

    // Estructura compatible con Pedido.java y DetallePedido.java en Spring Boot
    const nuevoPedido = {
      usuario: usuarioSesion?.id ? { id: usuarioSesion.id } : null,
      formaPago,
      montoCredito: montoACuenta,
      cliente: datosCliente.nombre.trim(),
      rut: datosCliente.rut.trim(),
      email: datosCliente.email.trim().toLowerCase(),
      tipoEntrega: esRetiro ? 'Retiro en tienda' : 'Despacho a domicilio',
      direccion: esRetiro ? '' : datosCliente.direccion.trim(),
      fechaEntrega: esRetiro ? fechaRetiro : '',
      total: calcularTotal(),
      estado: 'Pendiente',
      items: carrito.map(item => ({
        cantidad: item.cantidad || 1,
        precioUnitario: item.precio,
        producto: { id: item.id }
      }))
    };

    try {
      setProcesando(true);
      const { data: pedidoCreado } = await PedidoService.crear(nuevoPedido);

      localStorage.removeItem('react_carrito');
      if (onActualizarCarrito) onActualizarCarrito();

      navigate('/pago-exitoso', { state: { tipoEntrega, fechaRetiro, pedido: pedidoCreado } });
    } catch (err) {
      const mensaje = err.response?.data?.mensaje || 'No se pudo procesar el pedido en el servidor.';
      setErrorServidor(mensaje);
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="container py-2">
      <h2 className="fw-bold text-dark mb-4">
        <i className="bi bi-cart3 me-2"></i>Tu Carrito de Compras
      </h2>

      {errorServidor && (
        <div className="alert alert-danger shadow-sm mb-3">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>{errorServidor}
        </div>
      )}

      {carrito.length === 0 ? (
        <div className="alert alert-info shadow-sm py-4 text-center">
          <h5>Tu carrito está vacío</h5>
          <p className="mb-3 text-muted">Aún no has agregado productos a tu orden.</p>
          <Link to="/catalogo" className="btn btn-primary fw-bold">
            <i className="bi bi-arrow-left me-2"></i>Volver al Catálogo
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-lg-7">
            <ul className="list-group mb-3 shadow-sm border-0">
              {carrito.map(item => (
                <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center p-3">
                  <div className="d-flex gap-3 align-items-center">
                    <img
                      src={item.imagen || 'https://via.placeholder.com/60'}
                      alt={item.nombre}
                      style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px' }}
                    />
                    <div>
                      <h6 className="my-0 fw-bold">{item.nombre}</h6>
                      <small className="text-muted d-block">Cód: {item.codigo || item.id}</small>
                      <div className="d-flex align-items-center mt-1">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary px-2 py-0 fs-6"
                          onClick={() => cambiarCantidad(item.id, -1)}
                          disabled={(item.cantidad || 1) <= 1}
                        >
                          -
                        </button>

                        <span className="mx-3 fw-bold">{item.cantidad || 1}</span>

                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary px-2 py-0 fs-6"
                          onClick={() => cambiarCantidad(item.id, 1)}
                          disabled={(item.cantidad || 1) >= item.stock}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <span className="text-danger fw-bold fs-5">
                      ${((item.precio) * (item.cantidad || 1)).toLocaleString('es-CL')}
                    </span>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => eliminarDelCarrito(item.id)}
                      title="Eliminar del carrito"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-lg-5">
            <div className="card shadow-sm border-0 bg-light">
              <div className="card-body p-4">
                <h5 className="card-title fw-bold mb-3 text-dark">
                  <i className="bi bi-person-lines-fill me-2"></i>Datos de Entrega
                </h5>

                <form onSubmit={procesarCompraFinal} noValidate>
                  <div className="mb-3">
                    <label className="form-label fw-bold small text-muted">Nombre Completo</label>
                    <input
                      type="text"
                      className={`form-control ${errores.nombre ? 'is-invalid' : ''}`}
                      name="nombre"
                      value={datosCliente.nombre}
                      onChange={handleChangeInput}
                      placeholder="Ej. Juan Pérez"
                    />
                    {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-muted">RUT</label>
                      <input
                        type="text"
                        className={`form-control ${errores.rut ? 'is-invalid' : ''}`}
                        name="rut"
                        value={datosCliente.rut}
                        onChange={handleChangeInput}
                        placeholder="123456789"
                      />
                      {errores.rut && <div className="invalid-feedback">{errores.rut}</div>}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-muted">Correo Electrónico</label>
                      <input
                        type="email"
                        className={`form-control ${errores.email ? 'is-invalid' : ''}`}
                        name="email"
                        value={datosCliente.email}
                        onChange={handleChangeInput}
                        placeholder="juan@gmail.com"
                      />
                      {errores.email && <div className="invalid-feedback">{errores.email}</div>}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold small text-muted">Tipo de entrega</label>
                    <div className="d-flex gap-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          id="entrega-despacho"
                          name="tipoEntrega"
                          checked={!esRetiro}
                          onChange={() => setTipoEntrega('Despacho')}
                        />
                        <label className="form-check-label" htmlFor="entrega-despacho">
                          <i className="bi bi-truck me-1"></i>Despacho a domicilio
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          id="entrega-retiro"
                          name="tipoEntrega"
                          checked={esRetiro}
                          onChange={() => {
                            setTipoEntrega('Retiro');
                            setErrores({ ...errores, direccion: '' });
                          }}
                        />
                        <label className="form-check-label" htmlFor="entrega-retiro">
                          <i className="bi bi-shop me-1"></i>Retiro en tienda
                        </label>
                      </div>
                    </div>
                  </div>

                  {esRetiro ? (
                    <div className="alert alert-success small mb-4">
                      <div><strong>Retiras en:</strong> {DIRECCION_TIENDA}</div>
                      <div><strong>Fecha de retiro (la asigna la tienda):</strong> desde el {formatearFechaLarga(fechaRetiro)}</div>
                      <div><strong>Horario:</strong> {HORARIO_ATENCION}</div>
                    </div>
                  ) : (
                    <div className="mb-4">
                      <label className="form-label fw-bold small text-muted">Dirección de Despacho</label>
                      <input
                        type="text"
                        className={`form-control ${errores.direccion ? 'is-invalid' : ''}`}
                        name="direccion"
                        value={datosCliente.direccion}
                        onChange={handleChangeInput}
                        placeholder="Av. Concha y Toro #1234, Puente Alto"
                      />
                      {errores.direccion && <div className="invalid-feedback">{errores.direccion}</div>}
                    </div>
                  )}

                  <div className="mb-4">
                    <label className="form-label fw-bold small text-muted">Forma de pago</label>

                    <div className={`border rounded-3 p-3 mb-2 ${usarCuenta ? 'border-success bg-white' : ''}`}>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="usar-cuenta"
                          checked={usarCuenta}
                          disabled={!puedeUsarCuenta}
                          onChange={(e) => {
                            setUsarCuenta(e.target.checked);
                            setMontoCuenta(e.target.checked ? String(maxCuenta) : '');
                            setErrores({ ...errores, formaPago: '' });
                          }}
                        />
                        <label className="form-check-label w-100" htmlFor="usar-cuenta">
                          <i className="bi bi-credit-card-2-front me-2"></i><strong>Pagar con mi cuenta corriente</strong>
                          <small className="text-muted d-block">
                            {puedeUsarCuenta
                              ? 'Usa tu crédito disponible (vence a 30 días).'
                              : motivoSinCuenta}
                          </small>
                        </label>
                      </div>

                      {usarCuenta && puedeUsarCuenta && (
                        <div className="mt-3">
                          <label className="form-label small fw-bold text-muted mb-1">Monto a pagar con mi cuenta</label>
                          <div className="input-group">
                            <span className="input-group-text">$</span>
                            <input
                              type="number"
                              min="1"
                              max={maxCuenta}
                              className="form-control"
                              value={montoCuenta}
                              onChange={(e) => { setMontoCuenta(e.target.value); setErrores({ ...errores, formaPago: '' }); }}
                            />
                            <button type="button" className="btn btn-outline-success" onClick={() => setMontoCuenta(String(maxCuenta))}>
                              Usar máximo
                            </button>
                          </div>
                          <small className="text-muted">Máximo para esta compra: ${maxCuenta.toLocaleString('es-CL')}</small>
                        </div>
                      )}
                    </div>

                    {montoContado > 0 ? (
                      <div className="border rounded-3 p-3 mb-2">
                        <div className="fw-bold small mb-2">
                          {montoACuenta > 0 ? `El resto ($${montoContado.toLocaleString('es-CL')}) lo pagas con:` : 'Pagas con:'}
                        </div>
                        {METODOS_CONTADO.map((op) => (
                          <div key={op.valor} className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="metodoContado"
                              id={`contado-${op.valor}`}
                              checked={metodoContado === op.valor}
                              onChange={() => setMetodoContado(op.valor)}
                            />
                            <label className="form-check-label" htmlFor={`contado-${op.valor}`}>
                              <i className={`bi ${op.icono} me-1`}></i>{op.titulo}
                            </label>
                          </div>
                        ))}
                        {METODOS_CONTADO.find((op) => op.valor === metodoContado).detalle && (
                          <small className="text-muted d-block mt-1">
                            {METODOS_CONTADO.find((op) => op.valor === metodoContado).detalle}
                          </small>
                        )}
                      </div>
                    ) : (
                      <div className="text-success small fw-bold mb-2">
                        <i className="bi bi-check-circle me-1"></i>Toda la compra se paga con tu cuenta corriente.
                      </div>
                    )}
                    {errores.formaPago && <div className="text-danger small">{errores.formaPago}</div>}
                  </div>

                  <hr />

                  {cuenta && (
                    <div className="border rounded-3 bg-white p-3 mb-3">
                      <div className="fw-bold small text-muted mb-2">
                        <i className="bi bi-wallet2 me-1"></i>Tu cuenta corriente
                      </div>
                      <div className="d-flex justify-content-between small">
                        <span>Crédito disponible</span>
                        <strong className="text-success">${(cuenta.creditoDisponible || 0).toLocaleString('es-CL')}</strong>
                      </div>
                      <div className="d-flex justify-content-between small">
                        <span>Saldo pendiente</span>
                        <strong className={(cuenta.saldoPendiente || 0) > 0 ? 'text-danger' : ''}>
                          ${(cuenta.saldoPendiente || 0).toLocaleString('es-CL')}
                        </strong>
                      </div>
                      {(cuenta.saldoVencido || 0) > 0 && (
                        <div className="d-flex justify-content-between small">
                          <span>Saldo vencido</span>
                          <strong className="text-danger">${cuenta.saldoVencido.toLocaleString('es-CL')}</strong>
                        </div>
                      )}
                      {montoACuenta > 0 && (
                        <div className="border-top mt-2 pt-2 small">
                          <div className="d-flex justify-content-between">
                            <span>Con cuenta corriente</span>
                            <strong>${montoACuenta.toLocaleString('es-CL')}</strong>
                          </div>
                          {montoContado > 0 && (
                            <div className="d-flex justify-content-between">
                              <span>Con {metodoContado.toLowerCase()}</span>
                              <strong>${montoContado.toLocaleString('es-CL')}</strong>
                            </div>
                          )}
                          <div className="d-flex justify-content-between text-muted">
                            <span>Disponible en tu cuenta después de comprar</span>
                            <span>${(cuenta.creditoDisponible - montoACuenta).toLocaleString('es-CL')}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <span className="fs-5 fw-bold text-secondary">Total a Pagar:</span>
                    <strong className="fs-3 text-danger">${calcularTotal().toLocaleString('es-CL')}</strong>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-success w-100"
                    disabled={procesando}
                  >
                    {procesando ? 'Procesando pedido...' : 'Finalizar Compra'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Carrito;