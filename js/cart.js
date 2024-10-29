  // Verificar si el usuario está autenticado
let usuario = JSON.parse(localStorage.getItem("usuario"));
if (!usuario) {
        location.href = "login.html"; // Redirige al login si no hay usuario autenticado
} else {
        // Mostrar el nombre del usuario en la barra de navegación
const displayUsernameElement = document.getElementById("displayUsername");
if (displayUsernameElement) {
    document.getElementById("displayUsername").innerText = usuario.email;
    if (typeof loadUserProfile === "function") {
    loadUserProfile(usuario.email);
        }
    }
}

    // Configurar evento para cerrar sesión
const cerrarSesionButton = document.getElementById("cerrar");
if (cerrarSesionButton) {
    cerrarSesionButton.addEventListener("click", function (event) {
        event.preventDefault();
        localStorage.removeItem("usuario");
        localStorage.removeItem("loggedIn");
        location.href = "login.html";
    });
} else {
    console.warn("El botón de cerrar sesión ('cerrar') no se encontró en el DOM.");
};

// Verificación de items en el local storage para agregarlos al carrito //

document.addEventListener('DOMContentLoaded', () => {
    const itemsCarritoContenedor = document.getElementById('productosCarrito');
    const carritoVacio = document.getElementById('carritoVacio');
    const subtotalPrecio = document.getElementById('subTitl');
    const totalPrecio = document.getElementById('totalTitl');

    // Obtiene los items del carrito desde localStorage
    const itemsCarrito = JSON.parse(localStorage.getItem('itemsCarrito')) || [];

    let subtotal = 0;

    // Verifica si hay productos en el carrito
    if (itemsCarrito.length === 0) {
        // Si el carrito está vacío, muestra el mensaje:
        carritoVacio.style.display = 'block';
    } else {
        // Si hay productos, los muestra en el carrito
        itemsCarrito.forEach(item => {
            const productDiv = document.createElement('div');
            productDiv.className = 'product-item';
            productDiv.innerHTML =
            `
                <hr>
                <h5>${item.name}</h5>
                <p>Precio: $${item.price}</p>
                <p>Cantidad: ${item.quantity}</p>
                <hr>
            `;
            itemsCarritoContenedor.appendChild(productDiv);

        // Calcula el subtotal
            subtotal += item.price * item.quantity; // Suma precio x cantidad

        });
        carritoVacio.style.display = 'none'; // Oculta el mensaje de carrito vacío si hay productos en el mismo
    
        // Actualiza el subtotal y total en el resumen
        subtotalPrecio.innerText = `Subtotal:
        
        $ ${subtotal}`; // Muestra el subtotal
        
        totalPrecio.innerText = `Total:
        
        $ ${subtotal}`; // Al ser ficticio el precio del envío, el total es igual al subtotal

    }
});
