import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPedido } from '../data/database';

const Carrito = ({ onActualizarCarrito }) => {
  const [carrito, setCarrito] = useState([]);
  const [datosCliente, setDatosCliente] = useState({
    nombre: '',
    rut: '',
    email: '',
    direccion: ''
  });

  const [errores, setErrores] = useState({});
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

    if (!datosCliente.direccion.trim()) {
      nuevosErrores.direccion = 'La dirección de despacho es obligatoria.';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const eliminarDelCarrito = (id) => {
    const nuevoCarrito = carrito.filter(item => item.id !== id);
    setCarrito(nuevoCarrito);
    localStorage.setItem('react_carrito', JSON.stringify(nuevoCarrito));
    if (onActualizarCarrito) onActualizarCarrito();
  };

  const calcularTotal = () => {
    return carrito.reduce((total, item) => total + (item.precio * (item.cantidad || 1)), 0);
  };

  // ESTA ES LA FUNCIÓN UNIFICADA
  const procesarCompraFinal = (e) => {
    e.preventDefault(); // Detenemos la recarga

    if (carrito.length === 0) return;

    // 1. Validamos el formulario
    if (!validarFormulario()) {
      return; // Si hay errores, nos detenemos aquí y mostramos las alertas rojas
    }

    // 2. Si pasa las validaciones, mostramos la ventanita de simulación
    const pagoAprobado = window.confirm("Simulación de pago:\n[Aceptar] = Pago Exitoso\n[Cancelar] = Pago Rechazado");

    if (pagoAprobado) {
      // 3. LÓGICA DE ÉXITO: Creamos el pedido y descontamos stock
      const nuevoPedido = {
        cliente: datosCliente.nombre.trim(),
        rut: datosCliente.rut.trim(),
        email: datosCliente.email.trim(),
        direccion: datosCliente.direccion.trim(),
        total: calcularTotal(),
        estado: 'Pendiente',
        items: carrito.map(item => ({
          id: item.id,
          nombre: item.nombre,
          precio: item.precio,
          cantidad: item.cantidad || 1
        }))
      };

      let productos = JSON.parse(localStorage.getItem('react_productos')) || [];
      carrito.forEach(item => {
        productos = productos.map(p =>
          p.id === item.id
            ? { ...p, stock: Math.max(0, p.stock - (item.cantidad || 1)) }
            : p
        );
      });
      
      localStorage.setItem('react_productos', JSON.stringify(productos));
      createPedido(nuevoPedido);
      localStorage.removeItem('react_carrito');
      if (onActualizarCarrito) onActualizarCarrito();

      // Navegamos al éxito
      navigate('/pago-exitoso'); 
    } else {
      // 4. LÓGICA DE RECHAZO: Navegamos a la vista de error (sin crear pedido ni vaciar carrito)
      navigate('/pago-rechazado');
    }
  };

  return (
    <div className="container py-2">
      <h2 className="fw-bold text-dark mb-4">
        <i className="bi bi-cart3 me-2"></i>Tu Carrito de Compras
      </h2>
      
      {carrito.length === 0 ? (
        <div className="alert alert-info shadow-sm py-4 text-center">
          <h5>Tu carrito está vacío</h5>
          <p className="mb-3 text-muted">Aún no has agregado productos a tu orden.</p>
          <Link to="/" className="btn btn-primary fw-bold">
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
                      <small className="text-muted d-block">Cód: {item.id}</small>
                      <small className="badge bg-light text-dark border">
                        Cantidad: {item.cantidad || 1}
                      </small>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <span className="text-danger fw-bold fs-5">
                      ${((item.precio) * (item.cantidad || 1)).toLocaleString()}
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
                  <i className="bi bi-person-lines-fill me-2"></i>Datos de Despacho
                </h5>
                
                {/* AQUI CONECTAMOS EL FORMULARIO CON LA FUNCIÓN UNIFICADA */}
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

                  <hr />

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <span className="fs-5 fw-bold text-secondary">Total a Pagar:</span>
                    <strong className="fs-3 text-danger">${calcularTotal().toLocaleString()}</strong>
                  </div>

                  {/* EL BOTÓN AHORA ES TIPO SUBMIT Y NO TIENE ONCLICK */}
                  <button 
                    type="submit"
                    className="btn btn-success w-100" 
                  >
                    Finalizar Compra
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