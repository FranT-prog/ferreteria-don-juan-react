import React, { useState, useEffect } from 'react';

const GestionCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [formulario, setFormulario] = useState({ id: '', nombre: '', descripcion: '' });

  // Cargar categorías al inicio
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

  const manejarCambio = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const guardarCategoria = (e) => {
    e.preventDefault();
    if (!formulario.nombre.trim()) return alert('El nombre de la categoría es obligatorio.');

    let nuevasCategorias;
    
    if (modoEdicion) {
      // Editar existente
      nuevasCategorias = categorias.map(c => c.id === formulario.id ? formulario : c);
      setModoEdicion(false);
    } else {
      // Crear nueva
      const nuevaCategoria = { ...formulario, id: Date.now().toString() };
      nuevasCategorias = [...categorias, nuevaCategoria];
    }

    setCategorias(nuevasCategorias);
    localStorage.setItem('react_categorias', JSON.stringify(nuevasCategorias));
    setFormulario({ id: '', nombre: '', descripcion: '' }); // Limpiar formulario
  };

  const activarEdicion = (categoria) => {
    setModoEdicion(true);
    setFormulario(categoria);
  };

  const eliminarCategoria = (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta categoría?')) {
      const filtradas = categorias.filter(c => c.id !== id);
      setCategorias(filtradas);
      localStorage.setItem('react_categorias', JSON.stringify(filtradas));
    }
  };

  const cancelarEdicion = () => {
    setModoEdicion(false);
    setFormulario({ id: '', nombre: '', descripcion: '' });
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4"><i className="bi bi-tags-fill text-success me-2"></i>Gestión de Categorías</h2>

      <div className="row g-4">
        {/* Formulario (Crear/Editar) */}
        <div className="col-md-4">
          <div className="card shadow-sm border-0 bg-light">
            <div className="card-body">
              <h5 className="card-title fw-bold mb-3">
                {modoEdicion ? 'Editar Categoría' : 'Nueva Categoría'}
              </h5>
              <form onSubmit={guardarCategoria}>
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
                <div className="d-grid gap-2">
                  <button type="submit" className={`btn ${modoEdicion ? 'btn-warning' : 'btn-success'}`}>
                    {modoEdicion ? 'Actualizar Categoría' : 'Guardar Categoría'}
                  </button>
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

        {/* Tabla de Categorías */}
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
                    {categorias.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="text-center py-4 text-muted">No hay categorías registradas.</td>
                      </tr>
                    ) : (
                      categorias.map(cat => (
                        <tr key={cat.id}>
                          <td className="fw-bold">{cat.nombre}</td>
                          <td className="text-muted small">{cat.descripcion}</td>
                          <td className="text-center align-middle">
                            <div className="d-flex justify-content-center gap-2">
                              <button className="btn btn-sm btn-outline-primary" onClick={() => activarEdicion(cat)}>
                                <i className="bi bi-pencil-square"></i>
                              </button>
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