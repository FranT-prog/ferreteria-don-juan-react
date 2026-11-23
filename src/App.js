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
import ReportesProductos from './pages/ReportesAdmin';
import PerfilUsuario from './pages/PerfilUsuario';
import PanelCliente from './pages/PanelCliente';

import PanelAdmin from './pages/PanelAdmin';
import FormularioProducto from './pages/FormularioProducto';
import EditarProducto from './pages/EditarProducto';
import FormularioUsuario from './pages/FormularioUsuario';

import PanelVendedor from './pages/PanelVendedor';
import DetallePedido from './pages/DetallePedido';

function App() {
  const [contadorCarrito, setContadorCarrito] = useState(0);

  // Carga síncrona desde LocalStorage para mantener la sesión al recargar (F5)
  const [usuarioActivo, setUsuarioActivo] = useState(() => {
    try {
      const usuarioGuardado = localStorage.getItem('react_usuario_activo');
      return usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
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
        {/* RUTAS PÚBLICAS */}
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

        {/* RUTAS PROTEGIDAS DE USUARIO AUTENTICADO */}
        <Route path="/perfil" element={
          usuarioActivo ? <PerfilUsuario usuarioActivo={usuarioActivo} /> : <Navigate to="/login" replace />
        } />
        <Route path="/mi-cuenta" element={
          usuarioActivo ? <PanelCliente usuarioActivo={usuarioActivo} /> : <Navigate to="/login" replace />
        } />

        {/* RUTAS PROTEGIDAS DE ADMINISTRACIÓN */}
        <Route path="/admin" element={
          usuarioActivo?.rol === 'Administrador' ? <PanelAdmin /> : <Navigate to="/login" replace />
        } />
        <Route path="/admin/reportes-productos" element={
          usuarioActivo?.rol === 'Administrador'
            ? <div className="container my-4"><ReportesProductos /></div>
            : <Navigate to="/login" replace />
        } />
        <Route path="/admin/usuario/nuevo" element={
          usuarioActivo?.rol === 'Administrador'
            ? <div className="container my-4"><FormularioUsuario /></div>
            : <Navigate to="/login" replace />
        } />

        {/* RUTAS PROTEGIDAS DE VENDEDOR Y ADMINISTRADOR */}
        <Route path="/admin/nuevo" element={
          (usuarioActivo?.rol === 'Vendedor' || usuarioActivo?.rol === 'Administrador')
            ? <div className="container my-4"><FormularioProducto /></div>
            : <Navigate to="/login" replace />
        } />
        <Route path="/admin/editar/:id" element={
          (usuarioActivo?.rol === 'Vendedor' || usuarioActivo?.rol === 'Administrador')
            ? <div className="container my-4"><EditarProducto /></div>
            : <Navigate to="/login" replace />
        } />
        <Route path="/vendedor" element={
          (usuarioActivo?.rol === 'Vendedor' || usuarioActivo?.rol === 'Administrador')
            ? <div className="container my-4"><PanelVendedor /></div>
            : <Navigate to="/login" replace />
        } />
        <Route path="/vendedor/pedido/:id" element={
          (usuarioActivo?.rol === 'Vendedor' || usuarioActivo?.rol === 'Administrador')
            ? <div className="container my-4"><DetallePedido /></div>
            : <Navigate to="/login" replace />
        } />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;