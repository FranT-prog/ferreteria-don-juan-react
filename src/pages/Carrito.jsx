import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPedido } from '../data/database';

/**
 * Componente de Página: Carrito
 * 
 * Descripción: Gestiona el resumen de compras, la validación de datos de despacho,
 * la simulación de pago, el descuento de stock y la creación de la orden de compra.
 * 
 * Props Recibidas (Paso de Parámetros):
 * @param {Function} onActualizarCarrito - Callback para notificar al Navbar que refresque el contador global del carrito.
 * 
 * Criterios Evaluados Aplicados:
 * 1. Manejo de Estado (useState) y Efectos (useEffect): Carga datos iniciales desde 'localStorage' al montar el componente.
 * 2. Componentes y Formularios de Bootstrap: Uso de 'list-group', tarjetas de resumen ('card'), campos de entrada estilizados ('form-control') y clases de validación dinámica ('is-invalid', 'invalid-feedback').
 * 3. Procesamiento de Pedidos y Stock: Manipulación del arreglo de productos en 'localStorage' y llamada a 'createPedido()' de la base de datos.
 */
const Carrito = ({ onActualizarCarrito }) => {
  // Estado local para almacenar la lista de productos agregados al carrito
  const [carrito, setCarrito] = useState([]);

  // Estado local para capturar el formulario con la información del cliente
  const [datosCliente, setDatosCliente] = useState({
    nombre: '',
    rut: '',
    email: '',
    direccion: ''
  });

  // Estado local para almacenar los mensajes de error del formulario
  const [errores, setErrores] = useState({});

  // Hook de React Router para navegación programática (redirección tras compra o rechazo)
  const navigate = useNavigate();

  /**
   * Hook useEffect: Se ejecuta una única vez cuando el componente se monta en el DOM.
   * Recupera la información del carrito y del usuario autenticado guardados en 'localStorage'.
   */
  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem('react_carrito')) || [];
    setCarrito(carritoGuardado);

    // Precarga el nombre y correo si hay una sesión activa de usuario
    const usuarioActivo = JSON.parse(localStorage.getItem('react_usuario_activo'));
    if (usuarioActivo) {
      setDatosCliente(prev => ({
        ...prev,
        nombre: usuarioActivo.nombre || '',
        email: usuarioActivo.email || ''
      }));
    }
  }, []);

  /**
   * Manejador de cambios en los inputs del formulario:
   * Sincroniza la entrada del usuario con el estado 'datosCliente' y limpia el error activo del campo.
   */
  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setDatosCliente({ ...datosCliente, [name]: value });

    if (errores[name]) {
      setErrores({ ...errores, [name]: '' });
    }
  };

  /**
   * Función de Validación de Formulario:
   * Valida presencia de datos, formato de RUT y dominio de correo permitido (@gmail.com o @losmaestros.cl).
   * @returns {boolean} True si no existen errores de validación, False en caso contrario.
   */
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

  /**
   * Elimina un producto específico del carrito por su ID y actualiza el almacenamiento local.
   */
  const eliminarDelCarrito = (id) => {
    const nuevoCarrito = carrito.filter(item => item.id !== id);
    setCarrito(nuevoCarrito);
    localStorage.setItem('react_carrito', JSON.stringify(nuevoCarrito));
    if (onActualizarCarrito) onActualizarCarrito();
  };

  /**
   * Utiliza la función de arreglo 'reduce()' para calcular la suma acumulada de los totales.
   * @returns {number} Monto total a pagar.
   */
  const calcularTotal = () => {
    return carrito.reduce((total, item) => total + (item.precio * (item.cantidad || 1)), 0);
  };

  /**
   * Función Unificada de Procesamiento de Compra:
   * Previenen la recarga de página, valida campos, simula la pasarela de pago, descuenta el stock de productos,
   * registra la orden mediante createPedido() y redirige según el resultado.
   */
  const procesarCompraFinal = (e) => {
    e.preventDefault(); // Detiene la recarga por defecto del formulario HTML

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

      // Descuento automático de stock en el inventario general
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
      
      {/* Renderizado Condicional: Si el carrito está vacío muestra un mensaje informativo */}
      {carrito.length === 0 ? (
        <div className="alert alert-info shadow-sm py-4 text-center">
          <h5>Tu carrito está vacío</h5>
          <p className="mb-3 text-muted">Aún no has agregado productos a tu orden.</p>
          <Link to="/catalogo" className="btn btn-primary fw-bold">
            <i className="bi bi-arrow-left me-2"></i>Volver al Catálogo
          </Link>
        </div>
      ) : (
        /* Cuadrícula de 2 columnas en pantallas grandes (Items del carrito a la izquierda, formulario a la derecha) */
        <div className="row g-4">
          <div className="col-lg-7">
            {/* Lista de productos usando 'list-group' de Bootstrap */}
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
            {/* Tarjeta con el Formulario de Datos de Despacho */}
            <div className="card shadow-sm border-0 bg-light">
              <div className="card-body p-4">
                <h5 className="card-title fw-bold mb-3 text-dark">
                  <i className="bi bi-person-lines-fill me-2"></i>Datos de Despacho
                </h5>
                
                {/* Formulario conectado a la función unificada 'procesarCompraFinal' */}
                <form onSubmit={procesarCompraFinal} noValidate>
                  
                  {/* Campo Nombre Completo */}
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
                    {/* Campo RUT */}
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

                    {/* Campo Correo Electrónico */}
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

                  {/* Campo Dirección */}
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

                  {/* Cálculo del Total */}
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <span className="fs-5 fw-bold text-secondary">Total a Pagar:</span>
                    <strong className="fs-3 text-danger">${calcularTotal().toLocaleString()}</strong>
                  </div>

                  {/* Botón Submit para procesar el pedido */}
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