import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ProductoService from '../services/ProductoService';

/**
 * Componente de Página: FormularioProducto
 *
 * Descripción: Registra un nuevo producto en la base de datos H2 mediante
 * POST /api/v1/productos y redirige según el rol activo.
 */
const FormularioProducto = () => {
  const navigate = useNavigate();

  const [producto, setProducto] = useState({
    codigo: '',
    nombre: '',
    categoria: 'Herramientas Manuales',
    precio: '',
    stock: '',
    stockMinimo: 5,
    imagen: '',
    descripcion: ''
  });
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setProducto({
      ...producto,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setGuardando(true);

    const nuevoProducto = {
      codigo: producto.codigo.trim() || `PROD-${Date.now().toString().slice(-4)}`,
      nombre: producto.nombre.trim(),
      categoria: producto.categoria,
      precio: Number(producto.precio),
      stock: Number(producto.stock),
      stockMinimo: Number(producto.stockMinimo) || 5,
      imagen: producto.imagen.trim(),
      descripcion: producto.descripcion.trim()
    };

    try {
      await ProductoService.crear(nuevoProducto);

      const usuarioActivo = JSON.parse(localStorage.getItem('react_usuario_activo'));
      if (usuarioActivo?.rol === 'Vendedor') {
        navigate('/vendedor');
      } else {
        navigate('/admin');
      }
    } catch (err) {
      console.error('Error al crear producto:', err);
      setError('No se pudo guardar el producto en el servidor.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card shadow-sm border-0 mt-3">
          <div className="card-header bg-dark text-white p-3">
            <h5 className="mb-0 fw-bold"><i className="bi bi-box-seam me-2"></i>Agregar Nuevo Producto</h5>
          </div>

          <div className="card-body p-4">
            {error && <div className="alert alert-danger py-2">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col-md-4">
                  <label className="form-label fw-bold">Código</label>
                  <input
                    type="text"
                    className="form-control"
                    name="codigo"
                    value={producto.codigo}
                    onChange={handleChange}
                    placeholder="Ej. HER-010"
                  />
                </div>
                <div className="col-md-8">
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
              </div>

              <div className="row mb-3">
                <div className="col-md-4">
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
                <div className="col-md-2">
                  <label className="form-label fw-bold">Stock Mín.</label>
                  <input
                    type="number"
                    className="form-control"
                    name="stockMinimo"
                    value={producto.stockMinimo}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">URL o Ruta de la Imagen</label>
                <input
                  type="text"
                  className="form-control"
                  name="imagen"
                  value={producto.imagen}
                  onChange={handleChange}
                  placeholder="/llave_ajustable.jpg o https://ejemplo.com/imagen.jpg"
                />
              </div>

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

              <div className="d-flex justify-content-end gap-2">
                <Link to="/admin" className="btn btn-secondary">Cancelar</Link>
                <button type="submit" className="btn btn-dark fw-bold" disabled={guardando}>
                  {guardando ? 'Guardando...' : 'Guardar Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormularioProducto;