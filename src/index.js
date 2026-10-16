/**
 * Punto de Entrada de la Aplicación: index.js
 *
 * Descripción: Primer archivo JavaScript que se ejecuta. Importa los estilos globales y
 * Bootstrap, crea la "raíz" de React sobre el elemento <div id="root"> de index.html y
 * renderiza el componente principal <App />.
 *
 * Criterios Evaluados Aplicados:
 * 1. Montaje de React en el DOM: API `ReactDOM.createRoot` y método `root.render()`.
 * 2. Integración de Bootstrap de forma local (instalado con npm, sin CDN): CSS, JS e iconos.
 * 3. Modo estricto de desarrollo (`React.StrictMode`) para detectar problemas potenciales.
 * 4. Medición de rendimiento (`reportWebVitals`) incluida por defecto en Create React App.
 */
import React from 'react';
// Cliente de React para el navegador: contiene createRoot, que conecta React con el DOM real
import ReactDOM from 'react-dom/client';
// Estilos globales propios de la aplicación (reset, tipografía, animación de tarjetas)
import './index.css';
// Componente raíz: contiene el enrutamiento, el estado del usuario y el contador del carrito
import App from './App';
// Utilidad opcional de Create React App para medir métricas de rendimiento de la página
import reportWebVitals from './reportWebVitals';

// Bootstrap (local, no CDN)
// Hoja de estilos de Bootstrap (grillas, botones, tarjetas, utilidades como mb-2 o d-flex)
import 'bootstrap/dist/css/bootstrap.min.css';
// JavaScript de Bootstrap en versión "bundle": incluye Popper, necesario para los componentes
// interactivos como el menú desplegable (dropdown) y el menú colapsable (collapse) del Navbar
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// Fuente de iconos de Bootstrap (clases bi bi-...)
import 'bootstrap-icons/font/bootstrap-icons.css';

// Crea la raíz de React sobre el elemento con id="root" del archivo public/index.html
const root = ReactDOM.createRoot(document.getElementById('root'));
// Dibuja la aplicación dentro de la raíz.
root.render(
  // StrictMode solo actúa en desarrollo: ejecuta dos veces ciertas funciones para detectar
  // efectos secundarios no deseados. No genera ningún elemento visible ni afecta producción.
  <React.StrictMode>
    {/* Componente principal de la aplicación; no recibe props, su estado vive dentro de App */}
    <App />
  </React.StrictMode>
);

// Sin argumentos no hace nada visible; si se le pasa una función (por ejemplo console.log)
// reporta las métricas de rendimiento de la página.
reportWebVitals();