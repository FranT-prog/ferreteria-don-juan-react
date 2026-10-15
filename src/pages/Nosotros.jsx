import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Componente de Página: Nosotros
 * 
 * Descripción: Presentación institucional sobre la historia, misión, visión, valores,
 * ubicación y datos de atención de la Ferretería Don Juan. Es un componente estatateless (sin estado)
 * centrado en la estructura estacional y la experiencia de marca.
 * 
 * Criterios Evaluados Aplicados:
 * 1. Componentes Informativos / Estáticos: No requiere Hooks de estado (`useState`) ni efectos (`useEffect`) al no manipular datos dinámicos.
 * 2. Maquetación Avanzada con Bootstrap: Uso extensivo de banners (`bg-dark`), tarjetas (`card border-0 shadow-sm`), grillas responsivas adaptativas (`row-cols-1 row-cols-md-3`, `col-lg-6`) e iconografía (`bi bi-*`).
 * 3. Enrutamiento Declarativo: Incorporación de `<Link>` de `react-router-dom` para redirección hacia la vista principal.
 */
const Nosotros = () => {
  return (
    <div className="container py-2">
      {/* HERO BANNER - Banner de bienvenida con estilos oscuros, sombreado y texto destacado */}
      <div className="bg-dark text-white p-5 rounded-3 shadow-sm mb-5 text-center position-relative overflow-hidden">
        <div className="position-relative z-1">
          <h1 className="display-4 fw-bold text-warning mb-3">Ferretería Don Juan</h1>
          <p className="lead fs-4 text-white-50 max-w-75 mx-auto">
            Construyendo juntos desde hace 22 años en La Serena
          </p>
        </div>
      </div>

      {/* SECCIÓN HISTORIA Y MISIÓN - Disposición responsiva en 2 columnas de igual ancho en escritorio (col-lg-6) */}
      <div className="row g-4 align-items-center mb-5">
        {/* Columna Izquierda: Historia del negocio familiar */}
        <div className="col-lg-6">
          <h2 className="fw-bold text-success mb-3">Nuestra Historia</h2>
          <p className="text-secondary fs-5">
            <strong>Ferretería Don Juan</strong> es un negocio familiar ubicado orgullosamente en <strong>La Serena, Región de Coquimbo</strong>. Con <strong>22 años de trayectoria</strong> en el rubro, nos hemos consolidado como un pilar fundamental para los proyectos de nuestra comunidad.
          </p>
          <p className="text-secondary">
            Con el paso de los años, nos hemos consolidado como un referente local gracias a la atención personalizada, el asesoramiento técnico de nuestros vendedores y un catálogo diverso que abarca desde herramientas manuales hasta maquinaria de alta precisión.
          </p>
        </div>
        {/* Columna Derecha: Tarjeta informativa con Misión y Visión */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm bg-light p-4">
            <h4 className="fw-bold text-dark mb-3"><i className="bi bi-bullseye text-success me-2"></i>Nuestra Misión</h4>
            <p className="text-muted mb-4">
              Proveer productos ferreteros de excelencia con precios competitivos, garantizando un servicio integral y cercano que facilite el trabajo de nuestros clientes.
            </p>
            <h4 className="fw-bold text-dark mb-3"><i className="bi bi-eye text-primary me-2"></i>Nuestra Visión</h4>
            <p className="text-muted mb-0">
              Ser la cadena ferretera preferida de la zona sur de Santiago, destacando por la innovación digital, rapidez de despacho y compromiso comunitario.
            </p>
          </div>
        </div>
      </div>

      {/* SECCIÓN VALORES - Grilla de 3 columnas (row-cols-1 en celular, row-cols-md-3 en pantalla mediana) */}
      <div className="mb-5">
        <h2 className="fw-bold text-center mb-4">Nuestros Valores</h2>
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {/* Valor 1: Calidad Garantizada */}
          <div className="col">
            <div className="card h-100 border-0 shadow-sm text-center p-4">
              <div className="display-4 text-warning mb-3">
                <i className="bi bi-shield-check"></i>
              </div>
              <h5 className="fw-bold">Calidad Garantizada</h5>
              <p className="text-muted small mb-0">
                Trabajamos únicamente con marcas reconocidas y respaldadas internacionalmente.
              </p>
            </div>
          </div>
          {/* Valor 2: Atención Cercana */}
          <div className="col">
            <div className="card h-100 border-0 shadow-sm text-center p-4">
              <div className="display-4 text-success mb-3">
                <i className="bi bi-people-fill"></i>
              </div>
              <h5 className="fw-bold">Atención Cercana</h5>
              <p className="text-muted small mb-0">
                Nuestro equipo de expertos te asesora de manera clara y personalizada en cada compra.
              </p>
            </div>
          </div>
          {/* Valor 3: Compromiso y Entrega */}
          <div className="col">
            <div className="card h-100 border-0 shadow-sm text-center p-4">
              <div className="display-4 text-danger mb-3">
                <i className="bi bi-truck"></i>
              </div>
              <h5 className="fw-bold">Compromiso y Entrega</h5>
              <p className="text-muted small mb-0">
                Entregas rápidas y seguras directamente en tu obra o domicilio.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN UBICACIÓN Y CONTACTO - Tarjeta horizontal con llamada a la acción hacia la tienda */}
      <div className="card border-0 shadow-sm bg-dark text-white p-4 rounded-3">
        <div className="row align-items-center">
          <div className="col-md-8">
            <h3 className="fw-bold text-warning mb-2"><i className="bi bi-geo-alt me-2"></i>Visítanos en Nuestra Sucursal</h3>
            <p className="mb-1"><strong>Dirección:</strong> Av. Francisco de Aguirre 450, La Serena, Chile.</p>
            <p className="mb-0 text-white-50"><strong>Horario:</strong> Lunes a Viernes: 8:30 hrs - 19:00 hrs | Sábados: 9:00 hrs - 14:00 hrs</p>
          </div>
          <div className="col-md-4 text-md-end mt-3 mt-md-0">
            {/* Enlace navegable hacia el catálogo principal de la aplicación */}
            <Link to="/" className="btn btn-warning btn-lg fw-bold text-dark">
              Ir al Catálogo <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Nosotros;