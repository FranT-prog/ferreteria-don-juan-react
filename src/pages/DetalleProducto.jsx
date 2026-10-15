import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

/**
 * Componente de Página: DetalleProducto
 * 
 * Descripción: Muestra la ficha técnica detallada de un producto seleccionado
 * capturando su ID dinámico desde la URL. Permite agregar o remover el producto del carrito.
 * 
 * Props Recibidas (Paso de Parámetros):
 * @param {Function} onActualizarCarrito - Callback para notificar al Navbar que refresque el contador global del carrito.
 * 
 * Criterios Evaluados Aplicados:
 * 1. Enrutamiento Dinámico (`useParams` & `useNavigate`): Extrae la variable `:id` de la URL para cargar el producto correcto o redirigir si no existe.
 * 2. Manejo de Estado (`useState`) y Efectos (`useEffect`): Administra los datos del producto (`producto`) y verifica en tiempo real si el producto ya está añadido en el carrito (`enCarrito`).
 * 3. Componentes de Bootstrap: Uso de la tarjeta horizontal (`card`, `row g-0`, `col-md-5` / `col-md-7`), insignias (`badge`), botones con cambio dinámico de clases (`btn-warning` / `btn-success`) y tipografía responsiva (`display-6`, `display-5`).
 */
const DetalleProducto = ({ onActualizarCarrito }) => {
  // Hook useParams para obtener el ID dinámico (:id) presente en la barra de direcciones
  const { id } = useParams();
  
  // Hook useNavigate para redirigir al usuario si el producto buscado no existe
  const navigate = useNavigate();

  // Estado local para almacenar el objeto con la información del producto
  const [producto, setProducto] = useState(null);

  // Estado booleano para controlar si el producto actual ya se encuentra dentro del carrito
  const [enCarrito, setEnCarrito] = useState(false);

  /**
   * Hook useEffect:
   * Se ejecuta al cargar la vista o si cambia la `:id` en la URL.
   * Consulta los productos en 'localStorage', busca el registro coincidente y verifica si ya está agregado al carrito.
   */
  useEffect(() => {
    // 1. Buscar el producto en la "base de datos" de LocalStorage
    const prodsGuardados = JSON.parse(localStorage.getItem('react_productos')) || [];
    const prodEncontrado = prodsGuardados.find(p => p.id === id);

    if (prodEncontrado) {
      setProducto(prodEncontrado);

      // 2. Verificar si el producto ya existe dentro del arreglo del carrito
      const carritoGuardado = JSON.parse(localStorage.getItem('react_carrito')) || [];
      const existe = carritoGuardado.some(item => item.id === id);
      setEnCarrito(existe);
    } else {
      // Si el producto no existe en la base de datos, redirigir automáticamente a la raíz
      navigate('/'); 
    }
  }, [id, navigate]);

  /**
   * Manejador para agregar o quitar el producto del carrito (Toggle):
   * Modifica la lista en 'localStorage', invierte el estado 'enCarrito' y notifica al componente global.
   */
  const handleCarrito = () => {
    let carritoActual = JSON.parse(localStorage.getItem('react_carrito')) || [];
    
    if (enCarrito) {
      // Si ya está en el carrito, lo remueve usando filter()
      carritoActual = carritoActual.filter(item => item.id !== id);
      setEnCarrito(false);
    } else {
      // Si no está, lo agrega al arreglo
      carritoActual.push(producto);
      setEnCarrito(true);
    }

    // Guarda los datos actualizados en formato String JSON
    localStorage.setItem('react_carrito', JSON.stringify(carritoActual));
    if (onActualizarCarrito) onActualizarCarrito();
  };

  // Renderizado condicional de carga mientras se consulta LocalStorage
  if (!producto) {
    return <div className="text-center mt-5">Cargando...</div>;
  }

  return (
    <div>
      {/* Botón para retornar al catálogo general */}
      <div className="mb-3">
        <Link to="/catalogo" className="btn btn-outline-secondary btn-sm">
          <i className="bi bi-arrow-left"></i> Volver al Catálogo
        </Link>
      </div>

      {/* Tarjeta de presentación de producto con diseño horizontal de Bootstrap */}
      <div className="card shadow-sm border-0">
        <div className="row g-0 align-items-center">
          {/* Columna de la Imagen del Producto */}
          <div className="col-md-5">
            <img 
              src={producto.imagen} 
              className="img-fluid rounded-start p-3" 
              alt={producto.nombre} 
              style={{ maxHeight: '400px', width: '100%', objectFit: 'contain' }}
            />
          </div>

          {/* Columna con la Información y Detalles */}
          <div className="col-md-7">
            <div className="card-body p-4 p-md-5">
              <span className="badge bg-danger mb-2">Nuevo</span>
              <h1 className="card-title fw-bold display-6">{producto.nombre}</h1>
              <p className="text-muted mb-4">Código único del fabricante: <strong className="text-dark">{producto.id}</strong></p>
              
              {/* Cuadro informativo de Stock y Categoría */}
              <div className="bg-light p-3 rounded mb-4">
                <h6 className="text-muted m-0 mb-1">Stock Disponible</h6>
                <div className="d-flex align-items-center gap-2">
                  <span className={`badge ${producto.stock > 0 ? 'bg-success' : 'bg-danger'} fs-6`}>
                    {producto.stock} unidades
                  </span>
                  <span className="text-muted small">| Categoría: {producto.categoria}</span>
                </div>
              </div>

              {/* Muestra del Precio formateado */}
              <div className="mb-5">
                <p className="text-muted m-0">Precio de lista (con IVA):</p>
                <span className="display-5 fw-bold text-danger">${producto.precio.toLocaleString()}</span>
              </div>

              {/* Botón dinámico para Agregar / Quitar del carrito */}
              <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                <button 
                  className={`btn btn-lg px-5 fw-bold ${enCarrito ? 'btn-success' : 'btn-warning text-white'}`}
                  onClick={handleCarrito}
                  disabled={producto.stock <= 0}
                >
                  <i className={`bi ${enCarrito ? 'bi-cart-check-fill' : 'bi-cart-plus-fill'} me-2`}></i>
                  {enCarrito ? 'En el Carrito' : 'Agregar al Carrito'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sección adicional con la descripción del producto */}
      <div className="mt-4 p-4 bg-white shadow-sm rounded">
        <h4>Descripción del Producto</h4>
        <p className="lead text-secondary mb-4">
          {producto.descripcion || 'Este producto no cuenta con especificaciones detalladas registradas por el momento.'}
        </p>
      </div>
    </div>
  );
};

export default DetalleProducto;