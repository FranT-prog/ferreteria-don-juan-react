import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const EditarProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [producto, setProducto] = useState({
    nombre: '',
    precio: '',
    stock: '',
    categoria: '',
    imagen: ''
  });

  useEffect(() => {
    // 1. Buscar el producto a editar
    const prodsGuardados = JSON.parse(localStorage.getItem('react_productos')) || [];
    const prodEncontrado = prodsGuardados.find(p => p.id === id);

    if (prodEncontrado) {
      // 2. Rellenar el formulario con los datos actuales
      setProducto({
        nombre: prodEncontrado.nombre,
        precio: prodEncontrado.precio,
        stock: prodEncontrado.stock,
        categoria: prodEncontrado.categoria,
        imagen: prodEncontrado.imagen
      });
    } else {
      navigate('/admin'); // Si no existe, lo devolvems al panel
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto({
      ...producto,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const prodsGuardados = JSON.parse(localStorage.getItem('react_productos')) || [];
    
    // 3. Buscar el índice del producto que estamos editando y actualizarlo
    const index = prodsGuardados.findIndex(p => p.id === id);
    if (index !== -1) {
      prodsGuardados[index] = {
        id: id, // Mantenemos su código original
        nombre: producto.nombre,
        precio: parseInt(producto.precio),
        stock: parseInt(producto.stock),
        categoria: producto.categoria,
        imagen: producto.imagen
      };
      
      // 4. Guardar los cambios y volver al panel
      localStorage.setItem('react_productos', JSON.stringify(prodsGuardados));
      navigate('/admin');
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card shadow-sm border-0 mt-3">
          <div className="card-header bg-primary text-white fw-bold">
            <i className="bi bi-pencil-square me-2"></i> Editando Producto: {id}
          </div>
          <div className="card-body p-4">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-bold">Nombre del Producto</label>
                <input type="text" className="form-control" name="nombre" value={producto.nombre} onChange={handleChange} required />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Precio ($)</label>
                  <input type="number" className="form-control" name="precio" value={producto.precio} onChange={handleChange} required min="1" />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Stock Actual</label>
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
                <input type="text" className="form-control" name="imagen" value={producto.imagen} onChange={handleChange} />
              </div>

              <div className="d-flex justify-content-end gap-2">
                <Link to="/admin" className="btn btn-secondary">Cancelar</Link>
                <button type="submit" className="btn btn-primary fw-bold">Actualizar Producto</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditarProducto;