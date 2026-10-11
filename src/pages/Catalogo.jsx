import React, { useState, useEffect } from 'react';
import ProductoCard from '../components/ProductoCard';

const Catalogo = ({ onActualizarCarrito }) => {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);

  useEffect(() => {
    // 1. Cargar productos cargados en localStorage
    const prodsGuardados = JSON.parse(localStorage.getItem('react_productos')) || [];
    setProductos(prodsGuardados);

    // 2. Cargar el carrito guardado
    const carritoGuardado = JSON.parse(localStorage.getItem('react_carrito')) || [];
    setCarrito(carritoGuardado);
  }, []);

  const handleAgregarRemover = (producto) => {
    let nuevoCarrito = [...carrito];
    const existeIndex = nuevoCarrito.findIndex(item => item.id === producto.id);

    if (existeIndex !== -1) {
      // Si ya estaba, lo quitamos
      nuevoCarrito.splice(existeIndex, 1);
    } else {
      // Si no estaba, lo agregamos
      nuevoCarrito.push(producto);
    }

    setCarrito(nuevoCarrito);
    localStorage.setItem('react_carrito', JSON.stringify(nuevoCarrito));
    
    // Notificamos al App para refrescar el contador en el Navbar
    if (onActualizarCarrito) onActualizarCarrito();
  };

  return (
    <div>
      <div className="border-start border-4 border-danger ps-3 mb-4">
        <h2 className="fw-bold text-dark">Nuestros Productos</h2>
        <p className="text-muted m-0">
          Encuentra herramientas eléctricas y manuales, materiales y artículos de ferretería general.
        </p>
      </div>

      <div className="row">
        {productos.map(prod => {
          const enCarrito = carrito.some(item => item.id === prod.id);
          return (
            <ProductoCard 
              key={prod.id} 
              producto={prod} 
              enCarrito={enCarrito} 
              onAgregarRemover={handleAgregarRemover} 
            />
          );
        })}
      </div>
    </div>
  );
};

export default Catalogo;