import React, { useState, useEffect } from 'react';

const PanelAdmin = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    // Cargamos los productos desde nuestra base de datos simulada
    const prodsGuardados = JSON.parse(localStorage.getItem('react_productos')) || [];
    setProductos(prodsGuardados);
  }, []);

  const eliminarProducto = (id) => {
    if(window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      const nuevosProductos = productos.filter(prod => prod.id !== id);
      setProductos(nuevosProductos);
      localStorage.setItem('react_productos', JSON.stringify(nuevosProductos));
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center border-bottom border-warning border-3 pb-2 mb-4">
        <h2 className="fw-bold" style={{ color: '#D84315' }}>
          <i className="bi bi-gear-fill me-2"></i>Panel de Administración
        </h2>
        <button className="btn btn-warning fw-bold text-dark">
          <i className="bi bi-plus-lg me-1"></i> Nuevo Producto
        </button>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-muted">No hay productos registrados.</td>
                  </tr>
                ) : (
                  productos.map(prod => (
                    <tr key={prod.id}>
                      <td className="fw-bold text-muted">{prod.id}</td>
                      <td>
                        <img src={prod.imagen} alt={prod.nombre} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                      </td>
                      <td className="fw-bold">{prod.nombre}</td>
                      <td><span className="badge bg-secondary">{prod.categoria}</span></td>
                      <td className="text-danger fw-bold">${prod.precio.toLocaleString()}</td>
                      <td>
                        <span className={`badge ${prod.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                          {prod.stock}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-2" title="Editar">
                          <i className="bi bi-pencil-square"></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger" 
                          title="Eliminar"
                          onClick={() => eliminarProducto(prod.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PanelAdmin;