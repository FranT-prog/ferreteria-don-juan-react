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
import ReportesProductos from './pages/ReportesProductos';
import PerfilUsuario from './pages/PerfilUsuario';

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
      <Routes>
        {/* Rutas Públicas (con container) */}
        <Route path="/" element={<div className="container my-4"><Home /></div>} />
        <Route path="/catalogo" element={<div className="container my-4"><Catalogo onActualizarCarrito={actualizarContador} /></div>} />
        <Route path="/contacto" element={<div className="container my-4"><Contacto /></div>} />
        <Route path="/nosotros" element={<div className="container my-4"><Nosotros /></div>} />
        <Route path="/blog" element={<div className="container my-4"><Blog /></div>} />
        <Route path="/carrito" element={<div className="container my-4"><Carrito onActualizarCarrito={actualizarContador} /></div>} />
        <Route path="/pago-exitoso" element={<div className="container my-4"><PagoExitoso /></div>} />
        <Route path="/detalle/:id" element={<div className="container my-4"><DetalleProducto onActualizarCarrito={actualizarContador} /></div>} />
        <Route path="/login" element={<div className="container my-4"><Login onLoginSuccess={setUsuarioActivo} /></div>} />
        <Route path="/registro" element={<div className="container my-4"><Registro /></div>} />
        <Route path="/categorias" element={<div className="container my-4"><Categorias /></div>} />
        <Route path="/categoria/:categoria" element={<div className="container my-4"><CategoriaDetalle /></div>} />
        <Route path="/ofertas" element={<div className="container my-4"><Ofertas /></div>} />
        <Route path="/pago-rechazado" element={<div className="container my-4"><PagoRechazado /></div>} />
        <Route path="/admin/reportes-productos" element={<div className="container my-4"><ReportesProductos /></div>} />
        <Route path="/perfil" element={<PerfilUsuario usuarioActivo={usuarioActivo} />} />

        {/* Rutas de Administración (SIN container, ocupan toda la pantalla) */}
        <Route path="/admin" element={
          usuarioActivo?.rol === 'Administrador' ? <PanelAdmin /> : <Navigate to="/login" />
        } />
        <Route path="/admin/nuevo" element={
          usuarioActivo?.rol === 'Administrador' ? <div className="container my-4"><FormularioProducto /></div> : <Navigate to="/login" />
        } />
        <Route path="/admin/editar/:id" element={
          usuarioActivo?.rol === 'Administrador' ? <div className="container my-4"><EditarProducto /></div> : <Navigate to="/login" />
        } />
        <Route path="/admin/usuario/nuevo" element={
          usuarioActivo?.rol === 'Administrador' ? <div className="container my-4"><FormularioUsuario /></div> : <Navigate to="/login" />
        } />

        {/* Rutas del Vendedor */}
        <Route path="/vendedor" element={
          (usuarioActivo?.rol === 'Vendedor' || usuarioActivo?.rol === 'Administrador') 
            ? <div className="container my-4"><PanelVendedor /></div> 
            : <Navigate to="/login" />
        } />
        <Route path="/vendedor/pedido/:id" element={
          (usuarioActivo?.rol === 'Vendedor' || usuarioActivo?.rol === 'Administrador') 
            ? <div className="container my-4"><DetallePedido /></div> 
            : <Navigate to="/login" />
        } />
      </Routes>
      <Footer /> 
    </BrowserRouter>
  );
}

export default App;