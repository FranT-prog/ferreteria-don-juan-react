import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Registro from './Registro';

/**
 * Suite de Pruebas Unitarias: Componente Registro
 * 
 * Descripción: Suite de automatización de pruebas con Jest y React Testing Library para validar el comportamiento,
 * renderizado, simulación de eventos de usuario y lógica de validación de campos del formulario de registro.
 * 
 * Criterios Evaluados Aplicados:
 * 1. Pruebas de Renderizado (UI Testing): Verificación de montaje correcto de elementos visuales en el DOM virtual (JSDOM).
 * 2. Simulación de Interacción del Usuario: Uso de `fireEvent.change` para tipeo en inputs controlados y `fireEvent.click` para envíos de formulario.
 * 3. Aserciones de Validación y Estado (Jest Expectations): Confirmación de la actualización de valores en el estado (`formData`) y despliegue condicional de mensajes de error (`errores`).
 * 4. Contexto de Enrutamiento (`BrowserRouter`): Envoltorio necesario para ejecutar componentes que utilizan Hooks de navegación como `useNavigate`.
 */
describe('Pruebas Unitarias - Componente Registro', () => {
  
  /**
   * Prueba 1: Renderizado básico del componente
   * Comprueba que el componente se monte correctamente en el JSDOM y que el título principal esté presente.
   */
  it('1. Debe renderizar el título "Crear Cuenta" correctamente', () => {
    // Renderiza el componente Registro dentro de BrowserRouter para proveer el contexto de React Router
    render(<BrowserRouter><Registro /></BrowserRouter>);
    
    // Verifica mediante aserción de Jest que el texto "Crear Cuenta" exista en la interfaz visual
    expect(screen.getByText('Crear Cuenta')).toBeTruthy();
  });

  /**
   * Prueba 2: Manejo de Estado (useState) y Eventos de Cambio (`onChange`)
   * Evalúa que el estado `formData` reaccione y actualice el valor del input cuando el usuario escribe.
   */
  it('2. Debe actualizar el estado del input cuando el usuario escribe su nombre', () => {
    render(<BrowserRouter><Registro /></BrowserRouter>);
    
    // Captura el elemento input a través de su atributo placeholder
    const inputNombre = screen.getByPlaceholderText('Ej. Juan Pérez');
    
    // Simulamos la interacción de tipeo inyectando el valor sintético
    fireEvent.change(inputNombre, { target: { value: 'María López' } });
    
    // Verificamos que la propiedad 'value' del elemento refleje el valor actualizado en el estado
    expect(inputNombre.value).toBe('María López');
  });

  /**
   * Prueba 3: Simulación de Clic y Activación de Validaciones de Estado Vacío
   * Comprueba que al presionar 'Enviar' sin rellenar campos, se activen los mensajes de error en el DOM.
   */
  it('3. Debe mostrar mensajes de error si se envía el formulario vacío', () => {
    render(<BrowserRouter><Registro /></BrowserRouter>);
    
    // Busca el botón de envío por su texto visible
    const botonSubmit = screen.getByText('Registrarse e Iniciar Sesión');
    
    // Simulamos el evento de clic en el botón para detonar el handleSubmit()
    fireEvent.click(botonSubmit);
    
    // Verificamos que la lógica de validación inyecte los mensajes de error obligatorios en la pantalla
    expect(screen.getByText('El nombre completo es obligatorio.')).toBeTruthy();
    expect(screen.getByText('El correo electrónico es obligatorio.')).toBeTruthy();
    expect(screen.getByText('La contraseña es obligatoria.')).toBeTruthy();
  });

  /**
   * Prueba 4: Validación de Lógica de Negocio (Longitud Mínima de Contraseña)
   * Simula el ingreso de una contraseña inválida de 2 caracteres y confirma que aparezca la regla específica.
   */
  it('4. Debe mostrar error si la contraseña tiene menos de 3 caracteres', () => {
    render(<BrowserRouter><Registro /></BrowserRouter>);
    
    const inputPassword = screen.getByPlaceholderText('Mínimo 3 caracteres');
    const botonSubmit = screen.getByText('Registrarse e Iniciar Sesión');
    
    // Simula escribir una clave de solo 2 dígitos
    fireEvent.change(inputPassword, { target: { value: '12' } });
    
    // Presiona el botón para disparar la función 'validarFormulario'
    fireEvent.click(botonSubmit);
    
    // Verifica que el mensaje de restricción de longitud sea visible
    expect(screen.getByText('La contraseña debe tener al menos 3 caracteres.')).toBeTruthy();
  });

});