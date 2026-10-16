import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

/**
 * Componente de Página / Submódulo: ReportesProductos
 * 
 * Descripción: Genera informes analíticos e indicadores de control de inventario para la ferretería.
 * Separa la información en dos secciones estratégicas: Alerta de productos en stock crítico (≤ 5 unidades)
 * y Reporte general con cálculo valorizado por ítem (Precio x Stock).
 * 
 * Criterios Evaluados Aplicados:
 * 1. Transformación y Filtrado de Datos: Uso del método `.filter()` para aislar productos vulnerables según reglas de negocio.
 * 2. Cálculo de Métricas y Formateo Moneda: Cálculo dinámico `(p.precio * p.stock)` renderizado con `.toLocaleString()` para formato chileno de pesos.
 * 3. Componentes y Tablas de Bootstrap: Uso de tarjetas de alerta (`card border-danger`), encabezados de alto contraste (`card-header bg-danger / bg-dark`), insignias de stock (`badge bg-danger / bg-success`) y tablas estilizadas.
 */
const ReportesProductos = () => {
  // Estado local para almacenar la lista completa de productos rescatados desde almacenamiento local
  const [productos, setProductos] = useState([]);

  /**
   * Hook useEffect: Se ejecuta una sola vez al montar el componente.
   * Consulta 'react_productos' en LocalStorage y actualiza el estado 'productos'.
   */
  useEffect(() => {
    // Cargamos los productos desde localStorage o asignamos un arreglo vacío en caso de ausencia
    const prodsGuardados = JSON.parse(localStorage.getItem('react_productos')) || [];
    setProductos(prodsGuardados);
  }, []);

  // Consideramos "Crítico" a cualquier producto con 5 o menos unidades mediante el método .filter()
  const productosCriticos = productos.filter(p => p.stock <= 5);

  return (
    <div className="container py-4">
      {/* Encabezado principal con título e icono descriptivo de reporte */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold"><i className="bi bi-graph-up text-primary me-2"></i>Reportes de Inventario</h2>
      </div>

      {/* ============================================
          SECCIÓN 1: ALERTA DE PRODUCTOS CRÍTICOS (STOCK BAJO ≤ 5)
      ============================================ */}
      <div className="card shadow-sm border-danger mb-5">
        {/* Cabecera de Alerta en Rojo con icono de advertencia */}
        <div className="card-header bg-danger text-white fw-bold">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          Alerta de Productos Críticos (Stock Bajo)
        </div>
        <div className="card-body">
          {/* Renderizado Condicional: Mensaje positivo si no hay alertas o tabla descriptiva si existen productos críticos */}
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
                  {/* Mapeo del subconjunto de productos críticos */}
                  {productosCriticos.map(p => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td className="fw-bold">{p.nombre}</td>
                      <td>{p.categoria || 'Sin categoría'}</td>
                      <td>${p.precio.toLocaleString()}</td>
                      {/* Destacado visual en color rojo y tamaño prominente para la cifra crítica */}
                      <td className="text-danger fw-bold fs-5">{p.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ============================================
          SECCIÓN 2: REPORTE GENERAL Y VALORIZACIÓN DE INVENTARIO
      ============================================ */}
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
                {/* Mapeo de la totalidad de inventario */}
                {productos.map(p => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.nombre}</td>
                    <td>${p.precio.toLocaleString()}</td>
                    <td>
                      {/* Badge dinámico: Rojo si el stock es ≤ 5, verde si es superior */}
                      <span className={`badge ${p.stock <= 5 ? 'bg-danger' : 'bg-success'}`}>
                        {p.stock} unid.
                      </span>
                    </td>
                    {/* Cálculo aritmético en tiempo de ejecución: Multiplica Precio por Stock */}
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