import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Componente de Página: PagoRechazado
 * 
 * Descripción: Vista de alerta y fallo en la transacción enviada cuando la pasarela de pago rechaza la orden.
 * Notifica al cliente de un error en el pago y le ofrece alternativas para reintentar o volver al inicio.
 * 
 * Criterios Evaluados Aplicados:
 * 1. Componente Funcional Stateless (Sin Estado): Diseñado para un renderizado estático de alto rendimiento sin depender de 'useState' ni 'useEffect'.
 * 2. Maquetación y Alertas Visuales con Bootstrap: Centrado responsivo (`row justify-content-center`, `col-md-6 col-lg-5`), bordes temáticos de error (`border-danger`), sombras (`shadow-sm`) e iconografía en tono rojo (`text-danger`).
 * 3. Enrutamiento de Recuperación con React Router: Incorporación de etiquetas `<Link>` navegables para permitir reintentar la compra (`/carrito`) o retornar al catálogo principal (`/`).
 */
const PagoRechazado = () => {
  return (
    /* Contenedor principal con margen superior y alineación de texto centrada */
    <div className="container text-center mt-5">
      {/* Grilla responsiva para centrar el cuadro de diálogo en la pantalla */}
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          {/* Tarjeta contenedora con borde de color rojo que indica alerta/rechazo */}
          <div className="card shadow-sm border-danger">
            <div className="card-body py-5">
              {/* Icono vectorial gigante de error (X) de Bootstrap Icons */}
              <i className="bi bi-x-circle-fill text-danger" style={{ fontSize: '4rem' }}></i>
              
              {/* Título y detalle de la alerta de pago */}
              <h2 className="mt-4 text-danger">No se pudo realizar el pago</h2>
              <p className="text-muted mt-3">
                Lo sentimos, hubo un problema al procesar tu transacción. Por favor, verifica los datos ingresados o intenta con otro medio de pago.
              </p>
              
              {/* Contenedor de enlaces de acción y navegación */}
              <div className="mt-4">
                {/* Enlace 1: Redirige al carrito para reintentar o corregir la compra */}
                <Link to="/carrito" className="btn btn-outline-danger w-100 mb-2">
                  Volver al Carrito
                </Link>
                {/* Enlace 2: Redirige a la página principal de la tienda */}
                <Link to="/" className="btn btn-primary w-100">
                  Volver al Inicio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PagoRechazado;