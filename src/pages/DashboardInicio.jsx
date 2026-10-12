import React from 'react';

const DashboardInicio = ({ setVistaActiva }) => {
  const modulos = [
    { id: 'dashboard', titulo: 'Dashboard', icono: 'bi-speedometer2', desc: 'Visión general de todas las métricas y estadísticas clave del sistema.' },
    { id: 'ordenes', titulo: 'Órdenes', icono: 'bi-cart', desc: 'Gestión y seguimiento de todas las órdenes de compra realizadas.' },
    { id: 'productos', titulo: 'Productos', icono: 'bi-box', desc: 'Administrar inventario y detalles de los productos disponibles.' },
    { id: 'categorias', titulo: 'Categorías', icono: 'bi-tags', desc: 'Organizar productos en categorías para facilitar su navegación.' },
    { id: 'usuarios', titulo: 'Usuarios', icono: 'bi-people', desc: 'Gestión de cuentas de usuario y sus roles dentro del sistema.' },
    { id: 'reportes', titulo: 'Reportes', icono: 'bi-bar-chart-line', desc: 'Generación de informes detallados sobre las operaciones del sistema.' },
    { id: 'perfil', titulo: 'Perfil', icono: 'bi-person', desc: 'Administración de la información personal y configuraciones de cuenta.' },
    { id: 'tienda', titulo: 'Tienda', icono: 'bi-shop', desc: 'Visualiza tu tienda en tiempo real, visualiza los reportes de los usuarios.', esLink: true }
  ];

  return (
    <div>
      <div className="mb-4">
        <h3 className="fw-bold mb-1">Dashboard</h3>
        <p className="text-muted">Resumen de las actividades diarias</p>
      </div>

      {/* TARJETAS DE MÉTRICAS */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="card border-0 text-white p-3 h-100 shadow-sm" style={{ backgroundColor: '#0d6efd', borderRadius: '12px' }}>
            <div className="d-flex align-items-center mb-2">
              <i className="bi bi-cart3 fs-1 me-3"></i>
              <div>
                <h6 className="mb-0 fw-bold">Compras</h6>
                <h2 className="mb-0 fw-bold">1,234</h2>
              </div>
            </div>
            <p className="small mb-0 mt-2 text-center text-white-50">Probabilidad de aumento: <strong className="text-white">20%</strong></p>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card border-0 text-white p-3 h-100 shadow-sm" style={{ backgroundColor: '#198754', borderRadius: '12px' }}>
            <div className="d-flex align-items-center mb-2">
              <i className="bi bi-box-seam fs-1 me-3"></i>
              <div>
                <h6 className="mb-0 fw-bold">Productos</h6>
                <h2 className="mb-0 fw-bold">400</h2>
              </div>
            </div>
            <p className="small mb-0 mt-2 text-center text-white-50">Inventario actual: <strong className="text-white">500</strong></p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 text-white p-3 h-100 shadow-sm" style={{ backgroundColor: '#ffc107', borderRadius: '12px' }}>
            <div className="d-flex align-items-center mb-2">
              <i className="bi bi-people-fill fs-1 me-3"></i>
              <div>
                <h6 className="mb-0 fw-bold">Usuarios</h6>
                <h2 className="mb-0 fw-bold">890</h2>
              </div>
            </div>
            <p className="small mb-0 mt-2 text-center text-dark-50">Nuevos usuarios este mes: <strong className="text-dark">120</strong></p>
          </div>
        </div>
      </div>

      {/* CUADRÍCULA DE MÓDULOS */}
      <div className="row g-4">
        {modulos.map((mod) => (
          <div className="col-md-6 col-lg-3" key={mod.id}>
            <div 
              className="card h-100 border-0 shadow-sm text-center p-4 cursor-pointer text-decoration-none"
              style={{ borderRadius: '12px', cursor: 'pointer' }}
              onClick={() => {
                if (mod.esLink) {
                  window.location.href = '/';
                } else {
                  setVistaActiva(mod.id);
                }
              }}
            >
              <i className={`bi ${mod.icono} text-primary mb-3`} style={{ fontSize: '2rem' }}></i>
              <h6 className="fw-bold">{mod.titulo}</h6>
              <p className="text-muted small mb-0" style={{ fontSize: '0.8rem' }}>{mod.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardInicio;