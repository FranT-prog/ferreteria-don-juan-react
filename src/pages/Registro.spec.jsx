import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Registro from './Registro';

describe('Pruebas Unitarias - Componente Registro', () => {
  
  // Prueba 1: Renderizado (Ya la teníamos)
  it('1. Debe renderizar el título "Crear Cuenta" correctamente', () => {
    render(<BrowserRouter><Registro /></BrowserRouter>);
    expect(screen.getByText('Crear Cuenta')).toBeTruthy();
  });

  // Prueba 2: Estados (State) y Eventos de cambio
  it('2. Debe actualizar el estado del input cuando el usuario escribe su nombre', () => {
    render(<BrowserRouter><Registro /></BrowserRouter>);
    const inputNombre = screen.getByPlaceholderText('Ej. Juan Pérez');
    
    // Simulamos que el usuario escribe
    fireEvent.change(inputNombre, { target: { value: 'María López' } });
    
    // Verificamos que el estado interno actualizó el valor visible
    expect(inputNombre.value).toBe('María López');
  });

  // Prueba 3: Simulación de Eventos (Click) y Validación de Estado
  it('3. Debe mostrar mensajes de error si se envía el formulario vacío', () => {
    render(<BrowserRouter><Registro /></BrowserRouter>);
    const botonSubmit = screen.getByText('Registrarse e Iniciar Sesión');
    
    // Simulamos el clic en el botón de enviar
    fireEvent.click(botonSubmit);
    
    // Verificamos que los errores de estado aparezcan en pantalla
    expect(screen.getByText('El nombre completo es obligatorio.')).toBeTruthy();
    expect(screen.getByText('El correo electrónico es obligatorio.')).toBeTruthy();
    expect(screen.getByText('La contraseña es obligatoria.')).toBeTruthy();
  });

  // Prueba 4: Validación de lógica específica (Eventos y Estado)
  it('4. Debe mostrar error si la contraseña tiene menos de 3 caracteres', () => {
    render(<BrowserRouter><Registro /></BrowserRouter>);
    const inputPassword = screen.getByPlaceholderText('Mínimo 3 caracteres');
    const botonSubmit = screen.getByText('Registrarse e Iniciar Sesión');
    
    fireEvent.change(inputPassword, { target: { value: '12' } });
    fireEvent.click(botonSubmit);
    
    expect(screen.getByText('La contraseña debe tener al menos 3 caracteres.')).toBeTruthy();
  });

});