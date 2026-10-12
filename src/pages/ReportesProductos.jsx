import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ReportesProductos = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    // Cargamos los productos desde localStorage
    const prodsGuardados = JSON.parse(localStorage.getItem('react_productos')) || [];
    setProductos(prodsGuardados);
  }, []);

  // Consideramos "Crítico" a cualquier producto con 5 o menos unidades
  const productosCriticos = productos.filter(p => p.stock <= 5);

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold"><i className="bi bi-graph-up text-primary me-2"></i>Reportes de Inventario</h2>
      </div>

      {/* SECCIÓN 1: PRODUCTOS CRÍTICOS */}
      <div className="card shadow-sm border-danger mb-5">
        <div className="card-header bg-danger text-white fw-bold">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          Alerta de Productos Críticos (Stock Bajo)
        </div>
        <div className="card-body">
          {productosCriticos.length === 0 ? (
            <p className="text-success mb-0 fw-bold">¡Todo en orden! No hay productos con stock crítico.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Producto</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th className="text-danger">Stock Actual</th>
                  </tr>
                </thead>
                <tbody>
                  {productosCriticos.map(p => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td className="fw-bold">{p.nombre}</td>
                      <td>{p.categoria || 'Sin categoría'}</td>
                      <td>${p.precio.toLocaleString()}</td>
                      <td className="text-danger fw-bold fs-5">{p.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* SECCIÓN 2: REPORTE GENERAL DE PRODUCTOS */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-dark text-white fw-bold">
          <i className="bi bi-box-seam me-2"></i>
          Reporte General de Productos
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Producto</th>
                  <th>Precio Unitario</th>
                  <th>Stock Total</th>
                  <th>Valorizado (Precio x Stock)</th>
                </tr>
              </thead>
              <tbody>
                {productos.map(p => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.nombre}</td>
                    <td>${p.precio.toLocaleString()}</td>
                    <td>
                      <span className={`badge ${p.stock <= 5 ? 'bg-danger' : 'bg-success'}`}>
                        {p.stock} unid.
                      </span>
                    </td>
                    <td className="fw-bold text-secondary">
                      ${(p.precio * p.stock).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportesProductos;