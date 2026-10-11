import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { inicializarBaseDeDatos } from './data/database';
import Navbar from './components/Navbar';
import Catalogo from './pages/Catalogo';
import Carrito from './pages/Carrito';
import PagoExitoso from './pages/PagoExitoso';
import PanelAdmin from './pages/PanelAdmin';
import FormularioProducto from './pages/FormularioProducto';
import DetalleProducto from './pages/DetalleProducto';
import EditarProducto from './pages/EditarProducto';

function App() {
  const [cantCarrito, setCantCarrito] = useState(0);

  const actualizarContador = () => {
    const carritoGuardado = JSON.parse(localStorage.getItem('react_carrito')) || [];
    setCantCarrito(carritoGuardado.length);
  };

  useEffect(() => {
    inicializarBaseDeDatos();
    actualizarContador();
  }, []);

  return (
    <BrowserRouter>
      <Navbar cantidadCarrito={cantCarrito} />
      
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Catalogo onActualizarCarrito={actualizarContador} />} />
          <Route path="/carrito" element={<Carrito onActualizarCarrito={actualizarContador} />} />
          <Route path="/pago-exitoso" element={<PagoExitoso />} />
          <Route path="/admin" element={<PanelAdmin />} />
          <Route path="/admin/nuevo" element={<FormularioProducto />} />
          <Route path="/detalle/:id" element={<DetalleProducto onActualizarCarrito={actualizarContador} />} />
          <Route path="/admin/editar/:id" element={<EditarProducto />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;