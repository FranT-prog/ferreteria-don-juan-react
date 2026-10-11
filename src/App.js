import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { inicializarBaseDeDatos } from './data/database';

// Importación de componentes
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Contacto from './pages/Contacto';
import Catalogo from './pages/Catalogo';
import Carrito from './pages/Carrito';
import PagoExitoso from './pages/PagoExitoso';
import PanelAdmin from './pages/PanelAdmin';
import FormularioProducto from './pages/FormularioProducto';
import EditarProducto from './pages/EditarProducto';
import DetalleProducto from './pages/DetalleProducto';
import FormularioUsuario from './pages/FormularioUsuario';
import Nosotros from './pages/Nosotros';
import Blog from './pages/Blog';

// Vistas del Vendedor
import PanelVendedor from './pages/PanelVendedor';
import DetallePedido from './pages/DetallePedido';

function App() {
  const [contadorCarrito, setContadorCarrito] = useState(0);

  const actualizarContador = () => {
    const carritoGuardado = JSON.parse(localStorage.getItem('react_carrito')) || [];
    const total = carritoGuardado.reduce((acc, item) => acc + (item.cantidad || 1), 0);
    setContadorCarrito(total);
  };
    useEffect(() => {
    inicializarBaseDeDatos();
    actualizarContador();
  }, []);

  return (
    <BrowserRouter>
      <Navbar contadorCarrito={contadorCarrito} />
      <div className="container my-4">
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo onActualizarCarrito={actualizarContador} />} />
          <Route path="/carrito" element={<Carrito onActualizarCarrito={actualizarContador} />} />
          <Route path="/pago-exitoso" element={<PagoExitoso />} />
          <Route path="/detalle/:id" element={<DetalleProducto onActualizarCarrito={actualizarContador} />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/blog" element={<Blog />} />

          {/* Rutas de Administración */}
          <Route path="/admin" element={<PanelAdmin />} />
          <Route path="/admin/nuevo" element={<FormularioProducto />} />
          <Route path="/admin/editar/:id" element={<EditarProducto />} />
          <Route path="/admin/usuario/nuevo" element={<FormularioUsuario />} />

          {/* Rutas del Vendedor */}
          <Route path="/vendedor" element={<PanelVendedor />} />
          <Route path="/vendedor/pedido/:id" element={<DetallePedido />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;