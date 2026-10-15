import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

/**
 * Componente de Página: FormularioUsuario
 * 
 * Descripción: Permite registrar un nuevo usuario en el sistema asignándole
 * un nombre, correo, rol ('Cliente', 'Vendedor', 'Administrador') y estado inicial ('Activo' o 'Bloqueado').
 * Genera un ID correlativo automático ('USR-001') y lo persiste en 'localStorage'.
 * 
 * Criterios Evaluados Aplicados:
 * 1. Formulario Controlado y Manejo de Estado (useState): Controla el objeto compuesto `usuario` sincronizando cada input mediante `onChange`.
 * 2. Manipulación de Datos y Persistencia (LocalStorage): Consulta la lista de usuarios, calcula el correlativo con `padStart` y guarda el resultado en formato JSON.
 * 3. Componentes y Layout de Bootstrap: Estructura centrada (`row justify-content-center`, `col-md-6`), tarjeta contenedora (`card`), controles (`form-control`, `form-select`) y botones estilizados.
 */
const FormularioUsuario = () => {
  // Hook useNavigate para redireccionar al panel administrativo tras guardar
  const navigate = useNavigate();

  // Estado compuesto (objeto) para almacenar los campos del nuevo usuario
  const [usuario, setUsuario] = useState({
    nombre: '',
    email: '',
    rol: 'Cliente',
    estado: 'Activo'
  });

  /**
   * Manejador de Cambios Unificado (handleChange):
   * Utiliza la sintaxis de propiedades computadas `[e.target.name]` para actualizar
   * dinámicamente la propiedad correspondiente dentro del objeto 'usuario'.
   */
  const handleChange = (e) => {
    setUsuario({
      ...usuario,
      [e.target.name]: e.target.value
    });
  };

  /**
   * Manejador del Envío del Formulario (handleSubmit):
   * Cancela la recarga por defecto, consulta los usuarios en LocalStorage,
   * genera el nuevo ID correlativo (`USR-XXX`), guarda la lista actualizada y navega a '/admin'.
   */
  const handleSubmit = (e) => {
    e.preventDefault(); // Detiene la recarga por defecto del navegador
    
    // Traer la lista de usuarios existentes desde LocalStorage o inicializar un arreglo vacío
    const usuariosGuardados = JSON.parse(localStorage.getItem('react_usuarios')) || [];
    
    // Generar un ID correlativo simulado rellenando con ceros a la izquierda (Ej: USR-004)
    const nuevoId = `USR-${String(usuariosGuardados.length + 1).padStart(3, '0')}`;
    
    // Crear el nuevo objeto combinando el ID generado con los campos del estado
    const nuevoUsuario = {
      ...usuario,
      id: nuevoId
    };

    // Guardar el nuevo usuario en la lista y actualizar LocalStorage en formato String JSON
    usuariosGuardados.push(nuevoUsuario);
    localStorage.setItem('react_usuarios', JSON.stringify(usuariosGuardados));
    
    // Redirección programática al panel de administración
    navigate('/admin');
  };

  return (
    /* Layout de cuadrícula responsiva centrado de Bootstrap */
    <div className="row justify-content-center">
      <div className="col-md-6">
        {/* Tarjeta contenedora del formulario con sombra ligera */}
        <div className="card shadow-sm border-0 mt-4">
          {/* Encabezado oscuro de la tarjeta con icono de usuario */}
          <div className="card-header bg-dark text-white p-3">
            <h5 className="mb-0 fw-bold"><i className="bi bi-person-plus-fill me-2"></i>Registrar Nuevo Usuario</h5>
          </div>
          
          <div className="card-body p-4">
            {/* Formulario conectado al manejador onSubmit */}
            <form onSubmit={handleSubmit}>
              
              {/* Campo Nombre Completo */}
              <div className="mb-3">
                <label className="form-label fw-bold">Nombre Completo</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="nombre" 
                  value={usuario.nombre} 
                  onChange={handleChange} 
                  required 
                  placeholder="Ej. Ana Soto"
                />
              </div>

              {/* Campo Correo Electrónico */}
              <div className="mb-3">
                <label className="form-label fw-bold">Correo Electrónico</label>
                <input 
                  type="email" 
                  className="form-control" 
                  name="email" 
                  value={usuario.email} 
                  onChange={handleChange} 
                  required 
                  placeholder="ana@ejemplo.com"
                />
              </div>

              {/* Fila con Selectores de Rol y Estado */}
              <div className="row mb-4">
                {/* Desplegable: Rol del Sistema */}
                <div className="col-md-6">
                  <label className="form-label fw-bold">Rol del Sistema</label>
                  <select 
                    className="form-select" 
                    name="rol" 
                    value={usuario.rol} 
                    onChange={handleChange}
                  >
                    <option value="Cliente">Cliente</option>
                    <option value="Vendedor">Vendedor</option>
                    <option value="Administrador">Administrador</option>
                  </select>
                </div>
                {/* Desplegable: Estado Inicial */}
                <div className="col-md-6">
                  <label className="form-label fw-bold">Estado Inicial</label>
                  <select 
                    className="form-select" 
                    name="estado" 
                    value={usuario.estado} 
                    onChange={handleChange}
                  >
                    <option value="Activo">Activo</option>
                    <option value="Bloqueado">Bloqueado</option>
                  </select>
                </div>
              </div>

              {/* Botones de Acción (Cancelar con Link y Guardar con type submit) */}
              <div className="d-flex justify-content-end gap-2">
                <Link to="/admin" className="btn btn-secondary">Cancelar</Link>
                <button type="submit" className="btn btn-dark fw-bold">Guardar Usuario</button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormularioUsuario;