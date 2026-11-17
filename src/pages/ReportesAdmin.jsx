import React, { useState, useEffect } from 'react';
import { getPedidos } from '../data/database';

/**
 * Componente de Página / Submódulo: ReportesProductos
 * 
 * Descripción: Genera informes analíticos e indicadores de control de inventario y ventas.
 */

// ============================================
// FUNCIONES DE CÁLCULO (Fuera del componente)
// ============================================

// 1. Calcular los productos más vendidos
const obtenerProductosMasVendidos = (pedidos) => {
  const ventasPorProducto = {};

  pedidos.forEach(pedido => {
    // Filtrar solo pedidos completados o enviados (opcional, ajusta según tus estados)
    if (pedido.estado !== 'Cancelado') {
      pedido.items.forEach(item => {
        if (ventasPorProducto[item.nombre]) {
          ventasPorProducto[item.nombre] += item.cantidad;
        } else {
          ventasPorProducto[item.nombre] = item.cantidad;
        }
      });
    }
  });

  // Convertir el objeto a un arreglo, ordenar de mayor a menor y tomar los primeros 5
  return Object.entries(ventasPorProducto)
    .map(([nombre, cantidad]) => ({ nombre, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 5);
};

// 2. Calcular los clientes que más compran (por monto total gastado)
const obtenerMejoresClientes = (pedidos) => {
  const comprasPorCliente = {};

  pedidos.forEach(pedido => {
    if (pedido.estado !== 'Cancelado') {
      if (comprasPorCliente[pedido.cliente]) {
        comprasPorCliente[pedido.cliente] += pedido.total;
      } else {
        comprasPorCliente[pedido.cliente] = pedido.total;
      }
    }
  });

  // Convertir a arreglo, ordenar por total gastado y tomar los primeros 5
  return Object.entries(comprasPorCliente)
    .map(([cliente, total]) => ({ cliente, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);
};


// ============================================
// COMPONENTE PRINCIPAL
// ============================================
const ReportesProductos = () => {
  // Estados
  const [productos, setProductos] = useState([]);
  const [topProductos, setTopProductos] = useState([]);
  const [topClientes, setTopClientes] = useState([]);

  useEffect(() => {
    // 1. Cargamos los productos
    const prodsGuardados = JSON.parse(localStorage.getItem('react_productos')) || [];
    setProductos(prodsGuardados);

    // 2. Cargamos los pedidos y calculamos los tops
    const todosLosPedidos = getPedidos();
    setTopProductos(obtenerProductosMasVendidos(todosLosPedidos));
    setTopClientes(obtenerMejoresClientes(todosLosPedidos));
  }, []);

  const productosCriticos = productos.filter(p => p.stock <= 5);

  return (
    <div className="container py-4">
      {/* Encabezado principal */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold"><i className="bi bi-graph-up text-primary me-2"></i>Reportes de Administración</h2>
      </div>

      {/* ============================================
          SECCIÓN NUEVA: TOP VENTAS Y MEJORES CLIENTES
      ============================================ */}
      <div className="row mb-5">
        {/* Tabla de Productos Más Vendidos */}
        <div className="col-md-6 mb-4 mb-md-0">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-success text-white fw-bold">
              <i className="bi bi-trophy-fill me-2"></i>Top 5 Productos Más Vendidos
            </div>
            <div className="card-body p-0">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Producto</th>
                    <th className="text-end">Unidades Vendidas</th>
                  </tr>
                </thead>
                <tbody>
                  {topProductos.map((prod, index) => (
                    <tr key={index}>
                      <td>{prod.nombre}</td>
                      <td className="text-end fw-bold">{prod.cantidad}</td>
                    </tr>
                  ))}
                  {topProductos.length === 0 && (
                    <tr><td colSpan="2" className="text-center py-3">No hay datos de ventas.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Tabla de Mejores Clientes */}
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-primary text-white fw-bold">
              <i className="bi bi-star-fill me-2"></i>Top 5 Mejores Clientes
            </div>
            <div className="card-body p-0">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Cliente</th>
                    <th className="text-end">Total Gastado</th>
                  </tr>
                </thead>
                <tbody>
                  {topClientes.map((cliente, index) => (
                    <tr key={index}>
                      <td>{cliente.cliente}</td>
                      <td className="text-end fw-bold">
                        ${cliente.total.toLocaleString('es-CL')}
                      </td>
                    </tr>
                  ))}
                  {topClientes.length === 0 && (
                    <tr><td colSpan="2" className="text-center py-3">No hay datos de clientes.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================
          SECCIÓN ORIGINAL 1: ALERTA DE PRODUCTOS CRÍTICOS (STOCK BAJO ≤ 5)
      ============================================ */}
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
              <table className="table table-hover align-middle mb-0">
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

      {/* ============================================
          SECCIÓN ORIGINAL 2: REPORTE GENERAL Y VALORIZACIÓN
      ============================================ */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-dark text-white fw-bold">
          <i className="bi bi-box-seam me-2"></i>
          Reporte General de Productos (Valorizado)
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped align-middle mb-0">
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