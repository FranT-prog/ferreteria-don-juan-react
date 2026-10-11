import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const FormularioProducto = () => {
  const navigate = useNavigate();
  
  // Estado para guardar los datos del formulario
  const [producto, setProducto] = useState({
    nombre: '',
    precio: '',
    stock: '',
    categoria: 'Herramientas Manuales',
    imagen: ''
  });

  // Función para actualizar el estado cuando el usuario escribe
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto({
      ...producto,
      [name]: value
    });
  };

  // Función que se ejecuta al enviar el formulario
  const handleSubmit = (e) => {
    e.preventDefault(); // Evita que la página se recargue

    // 1. Generar un ID único simple (ej: PROD-12345)
    const nuevoId = 'PROD-' + Math.floor(Math.random() * 10000);

    // 2. Crear el objeto final asegurando que precio y stock sean números
    const nuevoProducto = {
      id: nuevoId,
      nombre: producto.nombre,
      precio: parseInt(producto.precio),
      stock: parseInt(producto.stock),
      categoria: producto.categoria,
      imagen: producto.imagen || 'https://via.placeholder.com/300x200?text=Sin+Imagen'
    };

    // 3. Obtener los productos actuales, agregar el nuevo y guardar
    const productosActuales = JSON.parse(localStorage.getItem('react_productos')) || [];
    productosActuales.push(nuevoProducto);
    localStorage.setItem('react_productos', JSON.stringify(productosActuales));

    // 4. Redirigir de vuelta al panel de administrador
    navigate('/admin');
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card shadow-sm border-0 mt-3">
          <div className="card-header bg-dark text-white fw-bold">
            <i className="bi bi-box-seam me-2"></i> Agregar Nuevo Producto
          </div>
          <div className="card-body p-4">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-bold">Nombre del Producto</label>
                <input type="text" className="form-control" name="nombre" value={producto.nombre} onChange={handleChange} required placeholder="Ej: Serrucho Profesional" />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Precio ($)</label>
                  <input type="number" className="form-control" name="precio" value={producto.precio} onChange={handleChange} required min="1" />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Stock Inicial</label>
                  <input type="number" className="form-control" name="stock" value={producto.stock} onChange={handleChange} required min="0" />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Categoría</label>
                <select className="form-select" name="categoria" value={producto.categoria} onChange={handleChange}>
                  <option value="Herramientas Manuales">Herramientas Manuales</option>
                  <option value="Herramientas Eléctricas">Herramientas Eléctricas</option>
                  <option value="Materiales de Construcción">Materiales de Construcción</option>
                  <option value="Fijaciones y Adhesivos">Fijaciones y Adhesivos</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold">URL de la Imagen</label>
                <input type="text" className="form-control" name="imagen" value={producto.imagen} onChange={handleChange} placeholder="https://ejemplo.com/imagen.jpg (Opcional)" />
              </div>

              <div className="d-flex justify-content-end gap-2">
                <Link to="/admin" className="btn btn-secondary">Cancelar</Link>
                <button type="submit" className="btn btn-success fw-bold">Guardar Producto</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormularioProducto;