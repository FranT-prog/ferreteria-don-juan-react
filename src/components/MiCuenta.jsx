import React, { useState, useEffect } from 'react';
import { getCuentaCorriente, createSolicitudCredito } from '../data/database'; 
import CuentaCorrienteCliente from '../components/CuentaCorrienteCliente'; 

const MiCuenta = () => {
  const [cuenta, setCuenta] = useState(null);
  const [montoSolicitado, setMontoSolicitado] = useState('');
  const [mensaje, setMensaje] = useState('');
  
  const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));

  useEffect(() => {
    // CORRECCIÓN: Le pasamos el objeto usuarioActivo completo tal como lo pide tu database.js
    if (usuarioActivo) {
      setCuenta(getCuentaCorriente(usuarioActivo));
    }
  }, []);

  const handleSolicitarAumento = (e) => {
    e.preventDefault();
    
    // Tu database.js le asigna 300.000 por defecto a las cuentas nuevas, lo cual es genial.
    const limiteActual = cuenta.limiteCredito || 300000; 

    if (Number(montoSolicitado) <= limiteActual) {
      setMensaje('El monto solicitado debe ser mayor a tu límite actual.');
      return;
    }
    
    createSolicitudCredito(usuarioActivo.id, usuarioActivo.nombre, limiteActual, Number(montoSolicitado));
    setMensaje('Solicitud enviada al administrador con éxito.');
    setMontoSolicitado('');
  };

  if (!cuenta) return <div className="container mt-5">Cargando datos de la cuenta...</div>;

  return (
    <div className="container py-4">
      <h2 className="mb-4"><i className="bi bi-wallet2 text-primary me-2"></i> Mi Cuenta Corriente</h2>
      
      {/* TARJETA DE SOLICITUD DE AUMENTO */}
      <div className="card shadow-sm border-0 mb-4 bg-light">
        <div className="card-body d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <h6 className="fw-bold mb-1"><i className="bi bi-graph-up-arrow me-2"></i>Solicitar Aumento de Cupo</h6>
            <small className="text-muted">Tu límite actual es de ${(cuenta.limiteCredito || 300000).toLocaleString()}</small>
          </div>
          
          <form onSubmit={handleSolicitarAumento} className="d-flex gap-2 align-items-center">
            <div className="input-group">
              <span className="input-group-text">$</span>
              <input 
                type="number" 
                className="form-control" 
                placeholder="Nuevo monto deseado" 
                value={montoSolicitado}
                onChange={(e) => setMontoSolicitado(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary fw-bold">Solicitar</button>
            </div>
          </form>
        </div>
        {mensaje && <div className="alert alert-success m-3 py-2 fw-bold">{mensaje}</div>}
      </div>

      {/* COMPONENTE DE LA CUENTA CORRIENTE */}
      <CuentaCorrienteCliente cuenta={cuenta} />
    </div>
  );
};

export default MiCuenta;