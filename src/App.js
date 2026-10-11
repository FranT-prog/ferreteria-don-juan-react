import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import Categorias from './pages/Categorias';
import CategoriaDetalle from './pages/CategoriaDetalle';
import Ofertas from './pages/Ofertas';
import Footer from './components/Footer';
import Home from './pages/Home';
import Contacto from './pages/Contacto';
import Catalogo from './pages/Catalogo';
import Carrito from './pages/Carrito';
import PagoExitoso from './pages/PagoExitoso';
import DetalleProducto from './pages/DetalleProducto';
import Nosotros from './pages/Nosotros';
import Blog from './pages/Blog';
import Login from './pages/Login';
import Registro from './pages/Registro';
import PagoRechazado from './pages/PagoRechazado';

import PanelAdmin from './pages/PanelAdmin';
import FormularioProducto from './pages/FormularioProducto';
import EditarProducto from './pages/EditarProducto';
import FormularioUsuario from './pages/FormularioUsuario';

import PanelVendedor from './pages/PanelVendedor';
import DetallePedido from './pages/DetallePedido';

function App() {
  const [contadorCarrito, setContadorCarrito] = useState(0);
  const [usuarioActivo, setUsuarioActivo] = useState(null);

  useEffect(() => {
    const usuarioGuardado = JSON.parse(localStorage.getItem('react_usuario_activo'));
    if (usuarioGuardado) setUsuarioActivo(usuarioGuardado);
    actualizarContador();
  }, []);

  const actualizarContador = () => {
    const carritoGuardado = JSON.parse(localStorage.getItem('react_carrito')) || [];
    const total = carritoGuardado.reduce((acc, item) => acc + (item.cantidad || 1), 0);
    setContadorCarrito(total);
  };

  const handleLogout = () => {
    localStorage.removeItem('react_usuario_activo');
    setUsuarioActivo(null);
  };

  return (
    <BrowserRouter>
      <Navbar 
        contadorCarrito={contadorCarrito} 
        usuarioActivo={usuarioActivo} 
        onLogout={handleLogout} 
      />
      <div className="container my-4">
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo onActualizarCarrito={actualizarContador} />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/carrito" element={<Carrito onActualizarCarrito={actualizarContador} />} />
          <Route path="/pago-exitoso" element={<PagoExitoso />} />
          <Route path="/detalle/:id" element={<DetalleProducto onActualizarCarrito={actualizarContador} />} />
          <Route path="/login" element={<Login onLoginSuccess={setUsuarioActivo} />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/categoria/:categoria" element={<CategoriaDetalle />} />
          <Route path="/ofertas" element={<Ofertas />} />
          <Route path="/pago-rechazado" element={<PagoRechazado />} />

          {/* Rutas de Administración */}
          <Route path="/admin" element={
            usuarioActivo?.rol === 'Administrador' ? <PanelAdmin /> : <Navigate to="/login" />
          } />
          <Route path="/admin/nuevo" element={
            usuarioActivo?.rol === 'Administrador' ? <FormularioProducto /> : <Navigate to="/login" />
          } />
          <Route path="/admin/editar/:id" element={
            usuarioActivo?.rol === 'Administrador' ? <EditarProducto /> : <Navigate to="/login" />
          } />
          <Route path="/admin/usuario/nuevo" element={
            usuarioActivo?.rol === 'Administrador' ? <FormularioUsuario /> : <Navigate to="/login" />
          } />

          {/* Rutas del Vendedor */}
          <Route path="/vendedor" element={
            (usuarioActivo?.rol === 'Vendedor' || usuarioActivo?.rol === 'Administrador') 
              ? <PanelVendedor /> 
              : <Navigate to="/login" />
          } />
          <Route path="/vendedor/pedido/:id" element={
            (usuarioActivo?.rol === 'Vendedor' || usuarioActivo?.rol === 'Administrador') 
              ? <DetallePedido /> 
              : <Navigate to="/login" />
          } />
        </Routes>
      </div>
      <Footer /> 
    </BrowserRouter>
  );
}

export default App;