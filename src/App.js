import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importación de componentes
import Navbar from './components/Navbar';
import Catalogo from './pages/Catalogo';
import Carrito from './pages/Carrito';
import PagoExitoso from './pages/PagoExitoso';
import PanelAdmin from './pages/PanelAdmin';
import FormularioProducto from './pages/FormularioProducto';
import EditarProducto from './pages/EditarProducto';
import DetalleProducto from './pages/DetalleProducto';

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

  return (
    <BrowserRouter>
      <Navbar contadorCarrito={contadorCarrito} />
      <div className="container my-4">
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<Catalogo onActualizarCarrito={actualizarContador} />} />
          <Route path="/carrito" element={<Carrito onActualizarCarrito={actualizarContador} />} />
          <Route path="/pago-exitoso" element={<PagoExitoso />} />
          <Route path="/detalle/:id" element={<DetalleProducto onActualizarCarrito={actualizarContador} />} />

          {/* Rutas de Administración */}
          <Route path="/admin" element={<PanelAdmin />} />
          <Route path="/admin/nuevo" element={<FormularioProducto />} />
          <Route path="/admin/editar/:id" element={<EditarProducto />} />

          {/* Rutas del Vendedor */}
          <Route path="/vendedor" element={<PanelVendedor />} />
          <Route path="/vendedor/pedido/:id" element={<DetallePedido />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;