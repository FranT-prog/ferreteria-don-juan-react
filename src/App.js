import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Importación de componentes globales de maquetación (Navbar y Footer)
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

// Importación de componentes y submódulos para la administración (Back-Office)
import PanelAdmin from './pages/PanelAdmin';
import FormularioProducto from './pages/FormularioProducto';
import EditarProducto from './pages/EditarProducto';
import FormularioUsuario from './pages/FormularioUsuario';

// Importación de componentes para el rol de Vendedor
import PanelVendedor from './pages/PanelVendedor';
import DetallePedido from './pages/DetallePedido';

/**
 * Componente Raíz de la Aplicación: App
 * 
 * Descripción: Orquestador principal de enrutamiento (React Router SPA), estado global
 * de autenticación de usuarios y contador persistente del carro de compras.
 * 
 * Criterios Evaluados Aplicados:
 * 1. Enrutamiento en SPA (`BrowserRouter`, `Routes`, `Route`): Configuración centralizada de rutas públicas y protegidas.
 * 2. Protección de Rutas por Roles (Rutas Privadas con Guardias de Navegación): Uso de renderizado condicional con `<Navigate to="/login" />` para restringir accesos según `usuarioActivo.rol`.
 * 3. Manejo de Estado Global y Callbacks entre Componentes: Elevación de estado (State Hoisting) para el contador del carrito y sesión activa, transmitidos a través de `props`.
 * 4. Persistencia mediante LocalStorage: Recarga automática de sesión activa y carrito al refrescar el navegador.
 */
function App() {
  // Estado global para acumular la cantidad total de productos agregados al carro de compras
  const [contadorCarrito, setContadorCarrito] = useState(0);

  // Estado global para guardar la información del usuario con sesión activa
  const [usuarioActivo, setUsuarioActivo] = useState(null);

  /**
   * Hook useEffect: Se ejecuta al iniciar la aplicación.
   * Verifica si existe un usuario logueado en LocalStorage y calcula el contador inicial del carrito.
   */
  useEffect(() => {
    const usuarioGuardado = JSON.parse(localStorage.getItem('react_usuario_activo'));
    if (usuarioGuardado) setUsuarioActivo(usuarioGuardado);
    actualizarContador();
  }, []);

  /**
   * Función Callback (actualizarContador):
   * Lee la lista de productos en el carrito desde LocalStorage y suma las cantidades con `.reduce()`.
   * Se transmite a los componentes hijos para mantener sincronizada la insignia del Navbar.
   */
  const actualizarContador = () => {
    const carritoGuardado = JSON.parse(localStorage.getItem('react_carrito')) || [];
    const total = carritoGuardado.reduce((acc, item) => acc + (item.cantidad || 1), 0);
    setContadorCarrito(total);
  };

  /**
   * Función para Cierre de Sesión (handleLogout):
   * Remueve la clave de sesión en LocalStorage y limpia el estado global `usuarioActivo`.
   */
  const handleLogout = () => {
    localStorage.removeItem('react_usuario_activo');
    setUsuarioActivo(null);
  };

  return (
    // Envoltorio principal que habilita la navegación SPA sin recarga de página
    <BrowserRouter>
      {/* Navbar Superior: Recibe el contador del carro, datos del usuario y callback de logout */}
      <Navbar 
        contadorCarrito={contadorCarrito} 
        usuarioActivo={usuarioActivo} 
        onLogout={handleLogout} 
      />
      <Routes>
        {/* ============================================
            RUTAS PÚBLICAS (Enueltas en contenedor Bootstrap)
        ============================================ */}
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

        {/* ============================================
            RUTAS PROTEGIDAS DE ADMINISTRACIÓN (Exclusivas para rol 'Administrador')
        ============================================ */}
        <Route path="/admin" element={
          usuarioActivo?.rol === 'Administrador' ? <PanelAdmin /> : <Navigate to="/login" />
        } />
        <Route path="/admin/nuevo" element={
          (usuarioActivo?.rol === 'Vendedor' || usuarioActivo?.rol === 'Administrador') 
            ? <div className="container my-4"><FormularioProducto /></div> 
            : <Navigate to="/login" />
        } />
        <Route path="/admin/editar/:id" element={
          (usuarioActivo?.rol === 'Vendedor' || usuarioActivo?.rol === 'Administrador') 
            ? <div className="container my-4"><EditarProducto /></div> 
            : <Navigate to="/login" />
        } />
        <Route path="/admin/usuario/nuevo" element={
          usuarioActivo?.rol === 'Administrador' ? <div className="container my-4"><FormularioUsuario /></div> : <Navigate to="/login" />
        } />

        {/* ============================================
            RUTAS PROTEGIDAS DEL VENDEDOR (Permite rol 'Vendedor' o 'Administrador')
        ============================================ */}
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
      {/* Pie de página estático compartido en todas las vistas */}
      <Footer /> 
    </BrowserRouter>
  );
}

export default App;