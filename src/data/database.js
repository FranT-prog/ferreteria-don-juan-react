// src/data/database.js

// Lista inicial de productos
export const productosIniciales = [
   // ============================================================
    // HERRAMIENTAS MANUALES
    // ============================================================
    {
        id: "LLA-001",
        nombre: "Llave Ajustable",
        precio: 8490,
        stock: 10,
        categoria: "Herramientas Manuales",
        imagen: "https://via.placeholder.com/400x400/0d6efd/ffffff?text=Llave+Ajustable"
    },
    {
        id: "CIN-001",
        nombre: "Cinta Métrica",
        precio: 4990,
        stock: 20,
        categoria: "Herramientas Manuales",
        imagen: "https://via.placeholder.com/400x400/ffc107/000000?text=Cinta+Metrica"
    },
    {
        id: "NIV-001",
        nombre: "Nivel de Burbuja",
        precio: 6990,
        stock: 12,
        categoria: "Herramientas Manuales",
        imagen: "https://via.placeholder.com/400x400/198754/ffffff?text=Nivel+de+Burbuja"
    },
    {
        id: "DES-001",
        nombre: "Set de Destornilladores",
        precio: 12990,
        stock: 8,
        categoria: "Herramientas Manuales",
        imagen: "https://via.placeholder.com/400x400/0dcaf0/000000?text=Destornilladores"
    },
    {
        id: "TIJ-001",
        nombre: "Tijeras de Corte",
        precio: 9990,
        stock: 6,
        categoria: "Herramientas Manuales",
        imagen: "https://via.placeholder.com/400x400/6c757d/ffffff?text=Tijeras+de+Corte"
    },
    // ============================================================
    // MATERIALES DE CONSTRUCCIÓN
    // ============================================================
    {
        id: "MAT-001",
        nombre: "Cemento 25kg",
        precio: 7990,
        stock: 50,
        categoria: "Materiales de Construcción",
        imagen: "https://via.placeholder.com/400x400/6c757d/ffffff?text=Cemento+25kg"
    },
    {
        id: "MAT-002",
        nombre: "Arena Fina (saco)",
        precio: 3990,
        stock: 30,
        categoria: "Materiales de Construcción",
        imagen: "https://via.placeholder.com/400x400/d4a373/ffffff?text=Arena+Fina"
    },
    {
        id: "MAT-003",
        nombre: "Ladrillo Príncipe",
        precio: 350,
        stock: 500,
        categoria: "Materiales de Construcción",
        imagen: "https://via.placeholder.com/400x400/a0522d/ffffff?text=Ladrillo"
    }
];//agregue esto primero

// Función para inicializar la base de datos en localStorage
export const inicializarBaseDeDatos = () => {
    const productos = localStorage.getItem('react_productos');
    if (!productos) {
        localStorage.setItem('react_productos', JSON.stringify(productosIniciales));
    }
    
};

// Función para forzar la reinicialización (útil para desarrollo)
export const reiniciarBaseDeDatos = () => {
    localStorage.setItem('react_productos', JSON.stringify(productosIniciales));
    localStorage.removeItem('react_carrito');
    console.log('Base de datos reiniciada');
};