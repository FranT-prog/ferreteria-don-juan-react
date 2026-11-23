import React, { useState } from 'react';

/**
 * Componente de Página: Contacto
 * 
 * Descripción: Formulario de contacto, información de atención al cliente
 * y mapa con la ubicación de la ferretería en La Serena.
 */
const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: ''
  });

  const [errores, setErrores] = useState([]);
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validarFormulario = (e) => {
    e.preventDefault();
    const nuevosErrores = [];

    if (!formData.nombre.trim()) {
      nuevosErrores.push('El nombre completo es obligatorio.');
    }
    if (!formData.email.trim()) {
      nuevosErrores.push('El correo electrónico es obligatorio.');
    } else if (!formData.email.includes('@') || !formData.email.includes('.')) {
      nuevosErrores.push('Ingresa un correo electrónico válido.');
    }
    if (!formData.telefono.trim()) {
      nuevosErrores.push('El teléfono de contacto es obligatorio.');
    }
    if (!formData.asunto) {
      nuevosErrores.push('Debes seleccionar un motivo.');
    }
    if (!formData.mensaje.trim()) {
      nuevosErrores.push('El mensaje o comentario es obligatorio.');
    }

    setErrores(nuevosErrores);

    if (nuevosErrores.length === 0) {
      setEnviado(true);
      setTimeout(() => {
        setFormData({
          nombre: '',
          email: '',
          telefono: '',
          asunto: '',
          mensaje: ''
        });
        setEnviado(false);
      }, 3000);
    }
  };

  const limpiarFormulario = () => {
    setFormData({
      nombre: '',
      email: '',
      telefono: '',
      asunto: '',
      mensaje: ''
    });
    setErrores([]);
    setEnviado(false);
  };

  return (
    <>
      {/* BANNER DE CONTACTO */}
      <section
        className="text-white text-center py-5 mb-5 rounded"
        style={{
          background: 'linear-gradient(135deg, #D84315 0%, #212529 100%)'
        }}
      >
        <div className="container">
          <h1 className="display-4 fw-bold mb-3">
            <i className="bi bi-envelope-fill me-2"></i>
            Contáctanos
          </h1>
          <p className="lead mb-0">
            ¿Tienes alguna consulta? Estamos aquí para ayudarte
          </p>
        </div>
      </section>

      {/* Grilla principal de 2 columnas */}
      <div className="row g-4 mb-5">
        {/* COLUMNA IZQUIERDA: FORMULARIO */}
        <div className="col-12 col-md-7">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h3 className="fw-bold mb-4">
                <i className="bi bi-chat-dots-fill text-warning me-2"></i>
                Envíanos un Mensaje
              </h3>

              <form onSubmit={validarFormulario}>
                <div className="mb-3">
                  <label className="form-label fw-bold">
                    <i className="bi bi-person-fill text-warning me-1"></i>
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Ej: Juan Pérez"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">
                    <i className="bi bi-envelope-fill text-warning me-1"></i>
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="ejemplo@correo.cl"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">
                    <i className="bi bi-telephone-fill text-warning me-1"></i>
                    Teléfono de Contacto *
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="+56 9 1234 5678"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">
                    <i className="bi bi-tag-fill text-warning me-1"></i>
                    Asunto / Motivo *
                  </label>
                  <select
                    className="form-select"
                    name="asunto"
                    value={formData.asunto}
                    onChange={handleChange}
                  >
                    <option value="">Selecciona un motivo</option>
                    <option value="consulta">Consulta de Stock General</option>
                    <option value="pedido">Estado de mi Pedido / Cotización</option>
                    <option value="cuenta">Cuenta Corriente Contratista</option>
                    <option value="reclamo">Sugerencia o Reclamo</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">
                    <i className="bi bi-chat-left-text-fill text-warning me-1"></i>
                    Mensaje o Comentario *
                  </label>
                  <textarea
                    className="form-control"
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Escribe tu mensaje aquí..."
                  ></textarea>
                </div>

                {errores.length > 0 && (
                  <div className="alert alert-danger">
                    <strong>
                      <i className="bi bi-exclamation-triangle-fill me-2"></i>
                      Corrige los siguientes errores:
                    </strong>
                    <ul className="mb-0 mt-2">
                      {errores.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {enviado && (
                  <div className="alert alert-success">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    <strong>¡Mensaje enviado con éxito!</strong> Nos pondremos en contacto contigo pronto.
                  </div>
                )}

                <div className="d-flex gap-3 flex-wrap">
                  <button type="submit" className="btn btn-warning fw-bold px-4">
                    <i className="bi bi-send-fill me-2"></i>Enviar Mensaje
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary px-4"
                    onClick={limpiarFormulario}
                  >
                    <i className="bi bi-eraser-fill me-2"></i>Limpiar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: INFORMACIÓN Y REDES */}
        <div className="col-12 col-md-5">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <h4 className="fw-bold mb-4">
                <i className="bi bi-info-circle-fill text-warning me-2"></i>
                Información de Contacto
              </h4>

              <div className="mb-3 d-flex">
                <i className="bi bi-geo-alt-fill text-warning fs-4 me-3"></i>
                <div>
                  <strong>Dirección</strong>
                  <p className="text-muted mb-0 small">
                    Av. Francisco de Aguirre 450<br />La Serena, Chile
                  </p>
                </div>
              </div>

              <div className="mb-3 d-flex">
                <i className="bi bi-telephone-fill text-warning fs-4 me-3"></i>
                <div>
                  <strong>Teléfono</strong>
                  <p className="text-muted mb-0 small">+56 9 1234 5678</p>
                </div>
              </div>

              <div className="mb-3 d-flex">
                <i className="bi bi-envelope-fill text-warning fs-4 me-3"></i>
                <div>
                  <strong>Correo</strong>
                  <p className="text-muted mb-0 small">contacto@donjuan.cl</p>
                </div>
              </div>

              <div className="mb-3 d-flex">
                <i className="bi bi-clock-fill text-warning fs-4 me-3"></i>
                <div>
                  <strong>Horarios</strong>
                  <p className="text-muted mb-0 small">
                    Lun-Vie: 8:00 - 18:30<br />
                    Sáb: 9:00 - 14:00<br />
                    Dom: Cerrado
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #D84315 0%, #fd7e14 100%)' }}>
            <div className="card-body p-4 text-white text-center">
              <h5 className="fw-bold mb-3">Síguenos</h5>
              <div className="d-flex justify-content-center gap-4 fs-2">
                <a href="#facebook" className="text-white"><i className="bi bi-facebook"></i></a>
                <a href="#instagram" className="text-white"><i className="bi bi-instagram"></i></a>
                <a href="#twitter" className="text-white"><i className="bi bi-twitter"></i></a>
                <a href="#whatsapp" className="text-white"><i className="bi bi-whatsapp"></i></a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAPA DE UBICACIÓN Y COBERTURA (Google Maps sin librerías externas) */}
      <div className="card border-0 shadow-sm mb-5">
        <div className="card-body p-4">
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
            <div>
              <h4 className="fw-bold mb-1">
                <i className="bi bi-geo-alt-fill text-warning me-2"></i>
                Nuestra Ubicación y Zona de Despacho
              </h4>
              <p className="text-muted small mb-0">
                Av. Francisco de Aguirre 450, La Serena — Despacho a domicilio en toda la conurbación La Serena / Coquimbo.
              </p>
            </div>
            <span className="badge bg-warning text-dark px-3 py-2">
              <i className="bi bi-truck me-1"></i>Despacho en La Serena
            </span>
          </div>
          <div className="ratio ratio-21x9 rounded overflow-hidden">
            <iframe
              title="Ubicación Ferretería La Serena"
              src="https://www.google.com/maps?q=Av.+Francisco+de+Aguirre+450,+La+Serena,+Chile&output=embed"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contacto;