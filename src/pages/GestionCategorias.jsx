import React, { useState, useEffect } from 'react';

/**
 * Componente de Página: GestionCategorias
 * 
 * Descripción: Módulo del panel de administración para gestionar el CRUD (Crear, Leer, Actualizar, Eliminar)
 * de las categorías de productos de la ferretería utilizando 'localStorage'.
 * 
 * Criterios Evaluados Aplicados:
 * 1. Formulario Dual Controlado (Crear/Editar): Un mismo formulario gestiona altas y modificaciones mediante la bandera 'modoEdicion'.
 * 2. Persistencia en LocalStorage: Sincroniza las operaciones CRUD con 'react_categorias' en el navegador.
 * 3. Componentes y Layout de Bootstrap: Distribución en 2 columnas (`col-md-4` para el formulario y `col-md-8` para la tabla), tarjetas (`card`), tablas dinámicas (`table table-hover`) y botones adaptativos.
 */
const GestionCategorias = () => {
  // Estado local para almacenar la lista completa de categorías
  const [categorias, setCategorias] = useState([]);
  
  // Estado booleano para alternar el formulario entre modo "Crear" (false) y modo "Editar" (true)
  const [modoEdicion, setModoEdicion] = useState(false);
  
  // Estado compuesto (objeto) para capturar los datos del formulario (id, nombre, descripcion)
  const [formulario, setFormulario] = useState({ id: '', nombre: '', descripcion: '' });

  /**
   * Hook useEffect: Se ejecuta una sola vez al cargar el componente.
   * Recupera las categorías guardadas en LocalStorage o establece un listado por defecto si no existen.
   */
  useEffect(() => {
    const catGuardadas = JSON.parse(localStorage.getItem('react_categorias')) || [
      { id: '1', nombre: 'Herramientas Manuales', descripcion: 'Martillos, destornilladores, alicates.' },
      { id: '2', nombre: 'Materiales Eléctricos', descripcion: 'Cables, enchufes, ampolletas.' }
    ];
    setCategorias(catGuardadas);
    
    // Si no existen en localStorage, las guardamos por defecto para tener datos iniciales
    if (!localStorage.getItem('react_categorias')) {
      localStorage.setItem('react_categorias', JSON.stringify(catGuardadas));
    }
  }, []);

  /**
   * Manejador de Cambios Unificado (manejarCambio):
   * Sincroniza las entradas del formulario (`nombre`, `descripcion`) con el estado `formulario`.
   */
  const manejarCambio = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  /**
   * Guardar / Actualizar Categoría:
   * Valida la presencia del nombre. Si `modoEdicion` es true, actualiza el registro coincidente con `.map()`;
   * de lo contrario, genera un nuevo ID con `Date.now().toString()` y agrega el registro al arreglo.
   */
  const guardarCategoria = (e) => {
    e.preventDefault(); // Cancela la recarga por defecto del formulario
    if (!formulario.nombre.trim()) return alert('El nombre de la categoría es obligatorio.');

    let nuevasCategorias;
    
    if (modoEdicion) {
      // Editar existente: Reemplaza el objeto coincidente manteniendo el resto de categorías
      nuevasCategorias = categorias.map(c => c.id === formulario.id ? formulario : c);
      setModoEdicion(false);
    } else {
      // Crear nueva: Genera ID único basado en timestamp y añade la categoría al arreglo
      const nuevaCategoria = { ...formulario, id: Date.now().toString() };
      nuevasCategorias = [...categorias, nuevaCategoria];
    }

    // Actualiza el estado local y persiste en LocalStorage
    setCategorias(nuevasCategorias);
    localStorage.setItem('react_categorias', JSON.stringify(nuevasCategorias));
    setFormulario({ id: '', nombre: '', descripcion: '' }); // Limpia el formulario tras guardar
  };

  /**
   * Carga los datos de una categoría en el formulario y activa la bandera `modoEdicion`.
   */
  const activarEdicion = (categoria) => {
    setModoEdicion(true);
    setFormulario(categoria);
  };

  /**
   * Elimina una categoría por su ID confirmando previamente con el usuario mediante `window.confirm()`.
   */
  const eliminarCategoria = (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta categoría?')) {
      const filtradas = categorias.filter(c => c.id !== id);
      setCategorias(filtradas);
      localStorage.setItem('react_categorias', JSON.stringify(filtradas));
    }
  };

  /**
   * Cancela la edición activa, resetea la bandera `modoEdicion` a false y vacía los campos.
   */
  const cancelarEdicion = () => {
    setModoEdicion(false);
    setFormulario({ id: '', nombre: '', descripcion: '' });
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4"><i className="bi bi-tags-fill text-success me-2"></i>Gestión de Categorías</h2>

      {/* Disposición en cuadrícula de Bootstrap: 4 columnas para Formulario y 8 columnas para la Tabla */}
      <div className="row g-4">
        {/* ============================================
            COLUMNA IZQUIERDA: FORMULARIO (Crear/Editar)
        ============================================ */}
        <div className="col-md-4">
          <div className="card shadow-sm border-0 bg-light">
            <div className="card-body">
              {/* Título dinámico según el modo activo */}
              <h5 className="card-title fw-bold mb-3">
                {modoEdicion ? 'Editar Categoría' : 'Nueva Categoría'}
              </h5>
              <form onSubmit={guardarCategoria}>
                {/* Campo Nombre */}
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Nombre</label>
                  <input 
                    type="text" 
                    name="nombre" 
                    className="form-control" 
                    value={formulario.nombre} 
                    onChange={manejarCambio} 
                    placeholder="Ej. Pinturas" 
                    required 
                  />
                </div>
                {/* Campo Descripción */}
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Descripción</label>
                  <textarea 
                    name="descripcion" 
                    className="form-control" 
                    value={formulario.descripcion} 
                    onChange={manejarCambio} 
                    placeholder="Breve detalle de los productos..." 
                    rows="3"
                  ></textarea>
                </div>
                {/* Botones de acción con clases y texto dinámico según `modoEdicion` */}
                <div className="d-grid gap-2">
                  <button type="submit" className={`btn ${modoEdicion ? 'btn-warning' : 'btn-success'}`}>
                    {modoEdicion ? 'Actualizar Categoría' : 'Guardar Categoría'}
                  </button>
                  {/* Botón de cancelar visible únicamente en modo edición */}
                  {modoEdicion && (
                    <button type="button" className="btn btn-outline-secondary" onClick={cancelarEdicion}>
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* ============================================
            COLUMNA DERECHA: TABLA DE CATEGORÍAS
        ============================================ */}
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Nombre</th>
                      <th>Descripción</th>
                      <th className="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Renderizado Condicional: Mensaje alternativo si la lista está vacía */}
                    {categorias.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="text-center py-4 text-muted">No hay categorías registradas.</td>
                      </tr>
                    ) : (
                      /* Mapeo del arreglo de categorías para renderizar cada fila */
                      categorias.map(cat => (
                        <tr key={cat.id}>
                          <td className="fw-bold">{cat.nombre}</td>
                          <td className="text-muted small">{cat.descripcion}</td>
                          <td className="text-center align-middle">
                            <div className="d-flex justify-content-center gap-2">
                              {/* Botón Editar: Carga la categoría en el formulario */}
                              <button className="btn btn-sm btn-outline-primary" onClick={() => activarEdicion(cat)}>
                                <i className="bi bi-pencil-square"></i>
                              </button>
                              {/* Botón Eliminar: Quita la categoría del estado y LocalStorage */}
                              <button className="btn btn-sm btn-outline-danger" onClick={() => eliminarCategoria(cat.id)}>
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
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
      </div>
    </div>
  );
};

export default GestionCategorias;