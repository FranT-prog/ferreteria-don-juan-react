import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

/**
 * Componente de Página: FormularioProducto
 * 
 * Descripción: Permite registrar y agregar un nuevo producto al catálogo de la ferretería.
 * Genera un ID automático secuencial ('PROD-001'), guarda los datos en 'localStorage' y redirige según el rol.
 * 
 * Criterios Evaluados Aplicados:
 * 1. Formulario Controlado y Manejo de Estado (useState): Administra el objeto compuesto `producto` sincronizando cada input mediante `onChange`.
 * 2. Manipulación de Datos en JS (LocalStorage & JSON): Lee la colección existente, calcula el nuevo ID secuencial y guarda los cambios parseados a JSON.
 * 3. Componentes y Controles de Bootstrap: Tarjeta contenedora (`card`), layout de cuadrícula (`row`, `col-md-*`), controles estilizados (`form-control`, `form-select`) y botones.
 */
const FormularioProducto = () => {
  // Hook useNavigate para redirección programática tras guardar el registro
  const navigate = useNavigate();

  // Estado compuesto (objeto) para capturar los datos ingresados en el formulario de creación
  const [producto, setProducto] = useState({
    nombre: '',
    categoria: 'Herramientas Manuales',
    precio: '',
    stock: '',
    imagen: '',
    descripcion: '' // Nuevo campo de ficha técnica
  });

  /**
   * Manejador de Cambios Unificado (handleChange):
   * Utiliza la sintaxis de propiedades computadas `[e.target.name]` para actualizar dinámicamente
   * únicamente la clave correspondiente del objeto 'producto'.
   */
  const handleChange = (e) => {
    setProducto({
      ...producto,
      [e.target.name]: e.target.value
    });
  };

  /**
   * Manejador del Envío del Formulario (handleSubmit):
   * Intercepta el evento Submit, genera una clave ID secuencial (`PROD-XXX`),
   * convierte precio y stock a valores numéricos, agrega el ítem a 'localStorage' y redirige según el rol.
   */
  const handleSubmit = (e) => {
    e.preventDefault(); // Detiene la recarga por defecto del formulario HTML

    // Obtención de la lista previa de productos o inicialización con arreglo vacío
    const productosGuardados = JSON.parse(localStorage.getItem('react_productos')) || [];
    
    // Generación de ID dinámico secuencial formateado a 3 dígitos (Ej: PROD-006)
    const nuevoId = `PROD-${String(productosGuardados.length + 1).padStart(3, '0')}`;

    // Construcción del nuevo objeto asegurando el tipo numérico para precio y stock
    const nuevoProducto = {
      ...producto,
      id: nuevoId,
      precio: Number(producto.precio),
      stock: Number(producto.stock)
    };

    // Agrega el nuevo producto al arreglo y lo almacena en LocalStorage
    productosGuardados.push(nuevoProducto);
    localStorage.setItem('react_productos', JSON.stringify(productosGuardados));

    // Redireccionar según la ruta de origen o rol activo del usuario
    const usuarioActivo = JSON.parse(localStorage.getItem('react_usuario_activo'));
    if (usuarioActivo?.rol === 'Vendedor') {
      navigate('/vendedor');
    } else {
      navigate('/admin');
    }
  };

  return (
    /* Layout de cuadrícula responsivo centrado con Bootstrap */
    <div className="row justify-content-center">
      <div className="col-md-8">
        {/* Tarjeta contenedora sin bordes y con sombra suave */}
        <div className="card shadow-sm border-0 mt-3">
          {/* Cabecera de la tarjeta con estilo oscuro e icono */}
          <div className="card-header bg-dark text-white p-3">
            <h5 className="mb-0 fw-bold"><i className="bi bi-box-seam me-2"></i>Agregar Nuevo Producto</h5>
          </div>
          
          <div className="card-body p-4">
            {/* Formulario conectado a la función handleSubmit */}
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
                  placeholder="Ej. Taladro Percutor 750W"
                />
              </div>

              {/* Fila de Categoría, Precio y Stock Inicial */}
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
                  <label className="form-label fw-bold">Stock Inicial</label>
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
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>

              {/* CAMPO DE DESCRIPCIÓN */}
              <div className="mb-4">
                <label className="form-label fw-bold">Descripción del Producto</label>
                <textarea
                  className="form-control"
                  name="descripcion"
                  rows="4"
                  value={producto.descripcion}
                  onChange={handleChange}
                  placeholder="Especificaciones técnicas, dimensiones, usos recomendados, etc."
                  required
                ></textarea>
              </div>

              {/* Botones de Acción (Cancelar y Guardar) */}
              <div className="d-flex justify-content-end gap-2">
                <Link to="/admin" className="btn btn-secondary">Cancelar</Link>
                <button type="submit" className="btn btn-dark fw-bold">Guardar Producto</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormularioProducto;