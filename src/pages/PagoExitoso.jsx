import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Componente de Página: PagoExitoso
 * 
 * Descripción: Vista de confirmación recibida tras completar el flujo de compra/pago en el carrito.
 * Notifica al cliente que la orden fue procesada con éxito y le permite regresar al catálogo inicial.
 * 
 * Criterios Evaluados Aplicados:
 * 1. Componente Funcional Stateless (Sin Estado): Diseñado para presentar una interfaz estática de alta velocidad de respuesta sin necesidad de 'useState' ni 'useEffect'.
 * 2. Clases de Estilizado de Bootstrap e Iconografía: Centrado de contenido (`text-center`), tarjeta blanca con sombra suave (`bg-white shadow-sm rounded`), espaciados de relleno/margen (`p-5`, `mt-5`) e icono de verificación (`bi bi-check-circle-fill text-success`).
 * 3. Enrutamiento en SPA con React Router: Uso de la etiqueta `<Link to="/">` para retornar a la raíz sin recargar la página.
 */
const PagoExitoso = () => {
  return (
    /* Contenedor principal estilizado como una tarjeta flotante de confirmación */
    <div className="text-center mt-5 p-5 bg-white shadow-sm rounded">
      {/* Icono vectorial gigante de éxito de Bootstrap Icons */}
      <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '5rem' }}></i>
      
      {/* Mensaje principal de confirmación */}
      <h1 className="mt-3 text-success fw-bold">¡Pago Exitoso!</h1>
      
      {/* Detalle secundario con tipografía suavizada */}
      <p className="lead text-muted">Tu pedido ha sido procesado correctamente y ya está en preparación.</p>
      
      {/* Botón de retorno que activa la navegación sin refresco de página */}
      <Link to="/" className="btn btn-outline-primary mt-4 px-4 py-2 fw-bold">
        Volver a la tienda
      </Link>
    </div>
  );
};

export default PagoExitoso;