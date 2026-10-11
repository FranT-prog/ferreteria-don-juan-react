// src/data/database.js

// Lista inicial de productos
export const productosIniciales = [
    {
        id: "PAL-001",
        nombre: "Pala de metal",
        precio: 3990,
        stock: 2,
        categoria: "Herramientas Manuales",
        imagen: "https://via.placeholder.com/300x200?text=Pala+de+Metal"
    },
    {
        id: "MAR-001",
        nombre: "Martillo de Carpintero",
        precio: 5990,
        stock: 15,
        categoria: "Herramientas Manuales",
        imagen: "https://via.placeholder.com/300x200?text=Martillo"
    },
    {
        id: "TAL-001",
        nombre: "Taladro Inalámbrico",
        precio: 45990,
        stock: 5,
        categoria: "Herramientas Eléctricas",
        imagen: "https://via.placeholder.com/300x200?text=Taladro"
    }
];

// Función para inicializar la base de datos en localStorage
export const inicializarBaseDeDatos = () => {
    const productos = localStorage.getItem('react_productos');
    if (!productos) {
        localStorage.setItem('react_productos', JSON.stringify(productosIniciales));
    }
};