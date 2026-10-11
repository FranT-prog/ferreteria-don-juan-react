import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import DetallePedido from './DetallePedido';

describe('Pruebas Unitarias - Componente DetallePedido', () => {
  
  beforeEach(() => {
    // Limpiamos la memoria antes de cada prueba para que no interfieran entre sí
    localStorage.clear();
  });

  // Prueba 5: Renderizado y Redirección
  it('5. Debe redirigir al panel del vendedor si el pedido no existe', () => {
    let testLocation;
    
    render(
      <MemoryRouter initialEntries={['/pedido/999']}>
        <Routes>
          <Route path="/pedido/:id" element={<DetallePedido />} />
          <Route path="/vendedor" element={
            <div ref={() => { testLocation = '/vendedor'; }}>Panel Vendedor Dummy</div>
          } />
        </Routes>
      </MemoryRouter>
    );
    
    // Verificamos que el componente intentó redirigir a /vendedor al no hallar el pedido
    expect(testLocation).toBe('/vendedor');
  });

  // Prueba 6: Renderizado (Carga exitosa de datos)
  it('6. Debe renderizar los datos del pedido correctamente si se encuentra en la base de datos', () => {
    // Simulamos un pedido guardado
    localStorage.setItem('react_pedidos', JSON.stringify([
      { id: '123', cliente: 'Juanito Pérez', estado: 'Pendiente', total: 5000, items: [] }
    ]));
    
    render(
      <MemoryRouter initialEntries={['/pedido/123']}>
        <Routes>
          <Route path="/pedido/:id" element={<DetallePedido />} />
        </Routes>
      </MemoryRouter>
    );
    
    expect(screen.getByText('Gestión del Pedido: 123')).toBeTruthy();
    expect(screen.getByText(/Juanito Pérez/i)).toBeTruthy();
  });

  // Prueba 7: Propiedades (Props dinámicas según el Rol)
  it('7. Propiedades: Debe mostrar el botón "Volver a Panel de Administración" si recibe el rol Admin', () => {
    localStorage.setItem('react_usuario_activo', JSON.stringify({ rol: 'Administrador' }));
    localStorage.setItem('react_pedidos', JSON.stringify([
      { id: '123', cliente: 'Juanito Pérez', estado: 'Pendiente', total: 5000, items: [] }
    ]));

    render(
      <MemoryRouter initialEntries={['/pedido/123']}>
        <Routes>
          <Route path="/pedido/:id" element={<DetallePedido />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Volver a Panel de Administración/i)).toBeTruthy();
  });

  // Prueba 8: Propiedades (Props dinámicas según el Rol)
  it('8. Propiedades: Debe mostrar el botón "Volver a Panel del Vendedor" si recibe el rol Vendedor', () => {
    localStorage.setItem('react_usuario_activo', JSON.stringify({ rol: 'Vendedor' }));
    localStorage.setItem('react_pedidos', JSON.stringify([
      { id: '123', cliente: 'Juanito Pérez', estado: 'Pendiente', total: 5000, items: [] }
    ]));

    render(
      <MemoryRouter initialEntries={['/pedido/123']}>
        <Routes>
          <Route path="/pedido/:id" element={<DetallePedido />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Volver a Panel del Vendedor/i)).toBeTruthy();
  });

  // Prueba 9: Estado (State)
  it('9. Estado: Debe inicializar el select de estado con el valor guardado (Pendiente)', () => {
    localStorage.setItem('react_pedidos', JSON.stringify([
      { id: '123', cliente: 'Juanito Pérez', estado: 'Pendiente', total: 5000, items: [] }
    ]));

    render(
      <MemoryRouter initialEntries={['/pedido/123']}>
        <Routes>
          <Route path="/pedido/:id" element={<DetallePedido />} />
        </Routes>
      </MemoryRouter>
    );

    // Buscamos el elemento <select>
    const select = screen.getByRole('combobox');
    expect(select.value).toBe('Pendiente');
  });

  // Prueba 10: Simulación de Eventos (Change)
  it('10. Eventos: Debe permitir cambiar el estado del pedido simulando el evento del usuario', () => {
    localStorage.setItem('react_pedidos', JSON.stringify([
      { id: '123', cliente: 'Juanito Pérez', estado: 'Pendiente', total: 5000, items: [] }
    ]));

    render(
      <MemoryRouter initialEntries={['/pedido/123']}>
        <Routes>
          <Route path="/pedido/:id" element={<DetallePedido />} />
        </Routes>
      </MemoryRouter>
    );

    const select = screen.getByRole('combobox');
    
    // Simulamos que el usuario cambia la opción del menú desplegable
    fireEvent.change(select, { target: { value: 'Despachado' } });
    
    // Verificamos que el cambio se aplicó en el estado
    expect(select.value).toBe('Despachado');
  });

});