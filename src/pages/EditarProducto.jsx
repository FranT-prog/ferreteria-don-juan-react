import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const EditarProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState({
    nombre: '',
    categoria: 'Herramientas Manuales',
    precio: '',
    stock: '',
    imagen: '',
    descripcion: ''
  });

  useEffect(() => {
    const productosGuardados = JSON.parse(localStorage.getItem('react_productos')) || [];
    const prodEncontrado = productosGuardados.find(p => p.id === id);

    if (prodEncontrado) {
      setProducto({
        ...prodEncontrado,
        descripcion: prodEncontrado.descripcion || ''
      });
    } else {
      navigate('/admin');
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    setProducto({
      ...producto,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const productosGuardados = JSON.parse(localStorage.getItem('react_productos')) || [];
    const productosActualizados = productosGuardados.map(p =>
      p.id === id
        ? {
            ...producto,
            precio: Number(producto.precio),
            stock: Number(producto.stock)
          }
        : p
    );

    localStorage.setItem('react_productos', JSON.stringify(productosActualizados));

    const usuarioActivo = JSON.parse(localStorage.getItem('react_usuario_activo'));
    if (usuarioActivo?.rol === 'Vendedor') {
      navigate('/vendedor');
    } else {
      navigate('/admin');
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card shadow-sm border-0 mt-3">
          <div className="card-header bg-primary text-white p-3">
            <h5 className="mb-0 fw-bold"><i className="bi bi-pencil-square me-2"></i>Editar Producto ({id})</h5>
          </div>
          <div className="card-body p-4">
            <form onSubmit={handleSubmit}>
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

              {/* CAMPO DE DESCRIPCIÓN */}
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