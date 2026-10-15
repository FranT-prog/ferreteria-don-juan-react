import React, { useState } from 'react';

/**
 * Componente de Página: Blog
 * 
 * Descripción: Página que muestra noticias, guías técnicas y consejos del rubro.
 * Criterios Evaluados Aplicados:
 * 1. Manejo de Estado (useState): Controla el filtro de categorías y el artículo seleccionado para la vista detallada (Modal).
 * 2. Componentes de Bootstrap: Grilla responsiva (`row row-cols-1 row-cols-md-3`), Tarjetas (`card`), Insignias (`badge`) y Modal de Bootstrap para vista flotante.
 * 3. Renderizado Dinámico: Uso de `.map()` y `.filter()` para renderizar y filtrar listas de noticias/artículos en tiempo real.
 */
const Blog = () => {
  // Estado local para almacenar la categoría seleccionada en los botones de filtro
  const [categoriaSel, setCategoriaSel] = useState('Todas');
  
  // Estado local para almacenar el objeto del artículo seleccionado y desplegar el Modal de lectura (o null si está cerrado)
  const [articuloActivo, setArticuloActivo] = useState(null);

  // Arreglo de datos dinámicos simulando la colección de artículos/noticias
  const articulos = [
    {
      id: 1,
      titulo: '5 Consejos para elegir el taladro ideal según tu proyecto',
      categoria: 'Herramientas Eléctricas',
      fecha: '08 de Octubre, 2026',
      autor: 'Equipo Técnico Los Maestros',
      resumen: 'Inalámbrico o con cable, percutor o atornillador. Descubre las características clave que debes evaluar antes de comprar tu próximo taladro.',
      imagen: 'https://markemstore.com/cdn/shop/collections/taladros-y-accesorios-426825.png?v=1748530744',
      contenido: `
        Elegir el taladro adecuado marca la diferencia entre un trabajo limpio y uno frustrante. Aquí te resumimos las claves:
        
        1. Potencia y Voltaje: Para trabajos ligeros en casa, 12V a 18V son suficientes. Si trabajas sobre hormigón o estructuras metálicas pesadas, busca opciones de 20V o con cable superior a 750W.
        2. Función Percutora: Es indispensable si vas a perforar paredes de ladrillo o concreto.
        3. Autonomía de Batería: Prefiere baterías de Ion-Litio de al menos 2.0 Ah para evitar interrupciones en jornadas largas.
      `
    },
    {
      id: 2,
      titulo: 'Guía de Mantenimiento Preventivo para Herramientas Manuales',
      categoria: 'Mantenimiento',
      fecha: '02 de Octubre, 2026',
      autor: 'Carlos Vendedor',
      resumen: 'Aprende a limpiar, lubricar y almacenar tus herramientas de mano para prevenir el óxido y alargar su vida útil por años.',
      imagen: 'https://caele.cl/wp-content/uploads/2026/04/Mantenimiento-de-herramientas-importancia-y-consejos.webp',
      contenido: `
        El óxido es el peor enemigo de tus alicates, llaves y martillos. Sigue estos pasos tras cada jornada:
        
        - Limpieza básica: Retira el polvo y restos de obra con un paño seco.
        - Capa protectora: Aplica una fina capa de aceite multiuso (WD-40 o similar) sobre las superficies metálicas.
        - Almacenamiento: Guarda tus herramientas en cajas herméticas o tableros protegidos de la humedad ambiental.
      `
    },
    {
      id: 3,
      titulo: 'Cómo preparar la mezcla de cemento perfecta paso a paso',
      categoria: 'Construcción',
      fecha: '25 de Septiembre, 2026',
      autor: 'Ing. Fernando Tapia',
      resumen: 'Aprende las proporciones exactas de agua, arena y cemento para lograr un fraguado resistente y sin grietas.',
      imagen: 'https://www.cementosinka.com.pe/wp-content/uploads/2023/09/CEMENTO-INKA-4-Tipos-de-mezclas-hechas-de-cemento.jpg',
      contenido: `
        Una mala dosificación puede comprometer la estructura de tu radier o muro.
        
        Proporción estándar (1:2:3):
        - 1 medida de Cemento Melón
        - 2 medidas de Arena fina o gruesa
        - 3 medidas de Grava o gravilla
        
        Agrega agua de forma progresiva hasta obtener una consistencia maleable pero no pastosa.
      `
    }
  ];

  // Evaluación lógica del filtro: Si es 'Todas' retorna el arreglo completo, de lo contrario filtra por categoría
  const articulosFiltrados = categoriaSel === 'Todas' 
    ? articulos 
    : articulos.filter(a => a.categoria === categoriaSel);

  return (
    /* Contenedor responsivo principal con padding vertical */
    <div className="container py-2">
      {/* Encabezado del Blog estilizado con alerta/banner de Bootstrap */}
      <div className="bg-success text-white p-4 rounded-3 shadow-sm mb-4 text-center">
        <h1 className="fw-bold mb-2"><i className="bi bi-journal-text me-2"></i>Blog y Tips para Maestros</h1>
        <p className="text-white-50 mb-0">Guías técnicas, recomendaciones de uso y trucos para tus proyectos de construcción.</p>
      </div>

      {/* Botones de Filtro por Categoría con renderizado dinámico e interacción de estado */}
      <div className="d-flex justify-content-center gap-2 mb-4 flex-wrap">
        {['Todas', 'Herramientas Eléctricas', 'Mantenimiento', 'Construcción'].map((cat, idx) => (
          <button
            key={idx}
            /* Alterna las clases de Bootstrap según el estado 'categoriaSel' */
            className={`btn btn-sm fw-bold ${categoriaSel === cat ? 'btn-success' : 'btn-outline-secondary'}`}
            /* Modifica el estado al hacer clic */
            onClick={() => setCategoriaSel(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Rejilla/Grid de Bootstrap para mostrar las tarjetas de los artículos (1 columna en móvil, 3 en escritorio) */}
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {articulosFiltrados.map((item) => (
          <div className="col d-flex align-items-stretch" key={item.id}>
            {/* Componente Card de Bootstrap */}
            <div className="card h-100 shadow-sm border-0">
              <img src={item.imagen} className="card-img-top" alt={item.titulo} style={{ height: '200px', objectFit: 'cover' }} />
              <div className="card-body d-flex flex-column">
                <span className="badge bg-success align-self-start mb-2">{item.categoria}</span>
                <h5 className="card-title fw-bold text-dark">{item.titulo}</h5>
                <p className="card-text text-muted small mb-3">{item.resumen}</p>
                <div className="mt-auto border-top pt-3 d-flex justify-content-between align-items-center">
                  <small className="text-muted"><i className="bi bi-calendar3 me-1"></i>{item.fecha}</small>
                  {/* Evento onClick para guardar el artículo en el estado 'articuloActivo' y desplegar el Modal */}
                  <button 
                    className="btn btn-outline-success btn-sm fw-bold"
                    onClick={() => setArticuloActivo(item)}
                  >
                    Leer Más
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Renderizado Condicional del Modal: Solo se muestra en el DOM si 'articuloActivo' no es null */}
      {articuloActivo && (
        <div className="modal show d-block tab-index-1 bg-dark bg-opacity-50" style={{ backdropFilter: 'blur(3px)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              {/* Encabezado del Modal */}
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title fw-bold">{articuloActivo.titulo}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setArticuloActivo(null)}></button>
              </div>
              {/* Cuerpo del Modal con datos dinámicos del objeto guardado en el estado */}
              <div className="modal-body p-4">
                <div className="d-flex justify-content-between text-muted small mb-3">
                  <span><strong>Autor:</strong> {articuloActivo.autor}</span>
                  <span><strong>Fecha:</strong> {articuloActivo.fecha}</span>
                </div>
                <img src={articuloActivo.imagen} className="img-fluid rounded mb-3 w-100" style={{ maxHeight: '300px', objectFit: 'cover' }} alt="Banner" />
                <div className="lh-lg text-secondary" style={{ whiteSpace: 'pre-line' }}>
                  {articuloActivo.contenido}
                </div>
              </div>
              {/* Pie del Modal con botón para cerrar reseteando el estado a null */}
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setArticuloActivo(null)}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;