import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import DetallePedido from './DetallePedido';

/**
 * ARCHIVO DE PRUEBAS UNITARIAS: DetallePedido.spec.jsx
 * 
 * Descripción: Suite de pruebas unitarias para validar la lógica, renderizado en el DOM,
 * reactividad al cambio de estado y manipulación de eventos del componente <DetallePedido />.
 * 
 * Herramientas Utilizadas:
 * - React Testing Library (RTL): Para renderizar componentes en un DOM virtual (screen) y simular interacciones del usuario (fireEvent).
 * - MemoryRouter (React Router): Para simular navegación y rutas dinámicas en memoria sin necesidad de un navegador real.
 * - LocalStorage Mocking: Aislamiento del entorno de prueba limpiando la memoria antes de cada ejecución.
 */
describe('Pruebas Unitarias - Componente DetallePedido', () => {
  
  /**
   * Hook beforeEach: Se ejecuta obligatoriamente ANTES de cada prueba unitaria individual.
   * Garantiza la independencia del test limpiando el almacenamiento LocalStorage.
   */
  beforeEach(() => {
    // Limpiamos la memoria antes de cada prueba para que no interfieran entre sí
    localStorage.clear();
  });

  /**
   * Prueba 5: Renderizado y Redirección
   * Valida que si el ID del pedido solicitado no existe en la base de datos,
   * el componente activa la redirección por defecto al panel del vendedor.
   */
  it('5. Debe redirigir al panel del vendedor si el pedido no existe', () => {
    let testLocation;
    
    // Renderizado virtual simulando una URL con un ID inexistente (/pedido/999)
    render(
      <MemoryRouter initialEntries={['/pedido/999']}>
        <Routes>
          <Route path="/pedido/:id" element={<DetallePedido />} />
          {/* Componente ficticio (Dummy) para capturar la ruta hacia donde redirige 'useNavigate' */}
          <Route path="/vendedor" element={
            <div ref={() => { testLocation = '/vendedor'; }}>Panel Vendedor Dummy</div>
          } />
        </Routes>
      </MemoryRouter>
    );
    
    // Verificamos que el componente intentó redirigir a /vendedor al no hallar el pedido
    expect(testLocation).toBe('/vendedor');
  });

  /**
   * Prueba 6: Renderizado (Carga exitosa de datos en el DOM)
   * Valida que cuando el pedido sí existe en LocalStorage, el componente
   * dibuja correctamente en el DOM el título de la orden y el nombre del cliente.
   */
  it('6. Debe renderizar los datos del pedido correctamente si se encuentra en la base de datos', () => {
    // Simulamos un pedido guardado previamente en LocalStorage (Mock Data)
    localStorage.setItem('react_pedidos', JSON.stringify([
      { id: '123', cliente: 'Juanito Pérez', estado: 'Pendiente', total: 5000, items: [] }
    ]));
    
    // Renderizado en MemoryRouter apuntando al ID existente '/pedido/123'
    render(
      <MemoryRouter initialEntries={['/pedido/123']}>
        <Routes>
          <Route path="/pedido/:id" element={<DetallePedido />} />
        </Routes>
      </MemoryRouter>
    );
    
    // Aserciones en el DOM: Verifican que el texto esperado exista en la pantalla virtual
    expect(screen.getByText('Gestión del Pedido: 123')).toBeTruthy();
    expect(screen.getByText(/Juanito Pérez/i)).toBeTruthy();
  });

  /**
   * Prueba 7: Propiedades (Props/Estado dinámico según el Rol Administrador)
   * Valida que al tener un usuario con el rol 'Administrador',
   * la interfaz muestre el botón específico de retorno hacia el Panel de Administración.
   */
  it('7. Propiedades: Debe mostrar el botón "Volver a Panel de Administración" si recibe el rol Admin', () => {
    // Mock de sesión activa como Administrador
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

    // Aserción: Comprueba la existencia del texto del botón para Administrador
    expect(screen.getByText(/Volver a Panel de Administración/i)).toBeTruthy();
  });

  /**
   * Prueba 8: Propiedades (Props/Estado dinámico según el Rol Vendedor)
   * Valida que al tener un usuario con el rol 'Vendedor',
   * el texto del botón se adapte dinámicamente indicando "Volver a Panel del Vendedor".
   */
  it('8. Propiedades: Debe mostrar el botón "Volver a Panel del Vendedor" si recibe el rol Vendedor', () => {
    // Mock de sesión activa como Vendedor
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

    // Aserción: Comprueba la existencia del texto del botón para Vendedor
    expect(screen.getByText(/Volver a Panel del Vendedor/i)).toBeTruthy();
  });

  /**
   * Prueba 9: Estado Inicial (State)
   * Valida que el menú desplegable (`<select>`) se inicialice correctamente
   * seleccionando el valor que venía guardado en la base de datos ('Pendiente').
   */
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

    // Búsqueda del elemento <select> en el DOM por su rol accesible 'combobox'
    const select = screen.getByRole('combobox');
    expect(select.value).toBe('Pendiente');
  });

  /**
   * Prueba 10: Simulación de Eventos y Manipulación del DOM (fireEvent)
   * Simula la acción física de un usuario cambiando el valor del menú desplegable de 'Pendiente' a 'Despachado',
   * verificando que el evento 'change' actualiza el valor del elemento del DOM correctamente.
   */
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
    
    // Simulamos la interacción del usuario disparando un evento de cambio sobre el select
    fireEvent.change(select, { target: { value: 'Despachado' } });
    
    // Verificamos que el cambio se aplicó en el estado del componente y en el DOM
    expect(select.value).toBe('Despachado');
  });

});