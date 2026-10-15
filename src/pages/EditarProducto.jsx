import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

/**
 * Componente de Página: EditarProducto
 * 
 * Descripción: Permite modificar los datos de un producto existente (nombre, categoría, precio, stock, imagen, descripción)
 * cargándolo desde 'localStorage' según su ID dinámico y guardando la actualización.
 * 
 * Criterios Evaluados Aplicados:
 * 1. Enrutamiento Dinámico (useParams & useNavigate): Recupera el ID del producto a editar desde la URL y redirige según el rol del usuario ('Administrador' o 'Vendedor').
 * 2. Formulario Controlado y Manejo de Estado (useState): Gestiona un objeto de formulario multinivel (`producto`) sincronizado con los inputs mediante `onChange`.
 * 3. Componentes y Formularios de Bootstrap: Uso de la tarjeta contenedora (`card`), controles de entrada (`form-control`, `form-select`), layout de cuadrícula (`row`, `col-md-*`) y botones de acción.
 */
const EditarProducto = () => {
  // Hook useParams para capturar el ID dinámico del producto enviado en la URL (:id)
  const { id } = useParams();
  
  // Hook useNavigate para redirecciones programáticas
  const navigate = useNavigate();

  // Estado compuesto (objeto) para almacenar las propiedades del producto a editar
  const [producto, setProducto] = useState({
    nombre: '',
    categoria: 'Herramientas Manuales',
    precio: '',
    stock: '',
    imagen: '',
    descripcion: ''
  });

  /**
   * Hook useEffect: Se ejecuta al cargar la página o cambiar la ID / navegación.
   * Busca el producto en 'localStorage' por su ID. Si lo encuentra, llena el estado; de lo contrario, redirige al panel administrativo.
   */
  useEffect(() => {
    const productosGuardados = JSON.parse(localStorage.getItem('react_productos')) || [];
    const prodEncontrado = productosGuardados.find(p => p.id === id);

    if (prodEncontrado) {
      setProducto({
        ...prodEncontrado,
        descripcion: prodEncontrado.descripcion || ''
      });
    } else {
      // Si el producto no existe, redirige por seguridad al panel de administración
      navigate('/admin');
    }
  }, [id, navigate]);

  /**
   * Manejador de Cambios Unificado (handleChange):
   * Actualiza dinámicamente la propiedad correspondiente dentro del objeto 'producto' usando el nombre del input.
   */
  const handleChange = (e) => {
    setProducto({
      ...producto,
      [e.target.name]: e.target.value
    });
  };

  /**
   * Manejador del Envío del Formulario (handleSubmit):
   * Procesa la actualización del registro en 'localStorage' asegurando el casteado de tipos numéricos (precio, stock)
   * y redirige al panel según el rol del usuario autenticado.
   */
  const handleSubmit = (e) => {
    e.preventDefault(); // Detiene la recarga de página por defecto

    const productosGuardados = JSON.parse(localStorage.getItem('react_productos')) || [];
    
    // Mapea el arreglo sustituyendo únicamente el objeto que coincide con el ID
    const productosActualizados = productosGuardados.map(p =>
      p.id === id
        ? {
            ...producto,
            precio: Number(producto.precio),
            stock: Number(producto.stock)
          }
        : p
    );

    // Persiste los datos actualizados en LocalStorage
    localStorage.setItem('react_productos', JSON.stringify(productosActualizados));

    // Verifica el rol del usuario activo para determinar la ruta de retorno
    const usuarioActivo = JSON.parse(localStorage.getItem('react_usuario_activo'));
    if (usuarioActivo?.rol === 'Vendedor') {
      navigate('/vendedor');
    } else {
      navigate('/admin');
    }
  };

  return (
    /* Contenedor responsivo centrado de Bootstrap */
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card shadow-sm border-0 mt-3">
          {/* Cabecera con título e icono de edición */}
          <div className="card-header bg-primary text-white p-3">
            <h5 className="mb-0 fw-bold"><i className="bi bi-pencil-square me-2"></i>Editar Producto ({id})</h5>
          </div>
          
          <div className="card-body p-4">
            {/* Formulario vinculado al evento onSubmit */}
            <form onSubmit={handleSubmit}>
              {/* Campo Nombre del Producto */}
              <div className="mb-3">
                <label className="form-label fw-bold">Nombre del Producto</label>
                <input
                  type="text"
                  className="form-control"
                  name="nombre"
                  value={producto.nombre}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Fila de Categoría, Precio y Stock */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-bold">Categoría</label>
                  <select
                    className="form-select"
                    name="categoria"
                    value={producto.categoria}
                    onChange={handleChange}
                  >
                    <option value="Herramientas Manuales">Herramientas Manuales</option>
                    <option value="Herramientas Eléctricas">Herramientas Eléctricas</option>
                    <option value="Materiales de Construcción">Materiales de Construcción</option>
                    <option value="Fijaciones y Adhesivos">Fijaciones y Adhesivos</option>
                    <option value="Gasfitería y Electricidad">Gasfitería y Electricidad</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-bold">Precio ($ CLP)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="precio"
                    value={producto.precio}
                    onChange={handleChange}
                    required
                    min="0"
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-bold">Stock</label>
                  <input
                    type="number"
                    className="form-control"
                    name="stock"
                    value={producto.stock}
                    onChange={handleChange}
                    required
                    min="0"
                  />
                </div>
              </div>

              {/* Campo URL de la Imagen */}
              <div className="mb-3">
                <label className="form-label fw-bold">URL de la Imagen</label>
                <input
                  type="url"
                  className="form-control"
                  name="imagen"
                  value={producto.imagen}
                  onChange={handleChange}
                />
              </div>

              {/* Campo Área de Texto para la Descripción */}
              <div className="mb-4">
                <label className="form-label fw-bold">Descripción del Producto</label>
                <textarea
                  className="form-control"
                  name="descripcion"
                  rows="4"
                  value={producto.descripcion}
                  onChange={handleChange}
                  placeholder="Especificaciones técnicas y detalles generales."
                  required
                ></textarea>
              </div>

              {/* Botones de Cancelar y Guardar */}
              <div className="d-flex justify-content-end gap-2">
                <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary">Cancelar</button>
                <button type="submit" className="btn btn-primary fw-bold">Guardar Cambios</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditarProducto;