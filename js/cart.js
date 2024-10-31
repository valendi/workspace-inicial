  // Función para formatear el precio al formato uruguayo
function formatPrice(value) {
    return new Intl.NumberFormat('es-UY', {
        style: 'currency',
        currency: 'UYU',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

// Verificar si el usuario está autenticado
let usuario = JSON.parse(localStorage.getItem("usuario"));
if (!usuario) {
    location.href = "login.html"; // Redirige al login si no hay usuario autenticado
} else {
    // Mostrar el nombre del usuario en la barra de navegación
    const displayUsernameElement = document.getElementById("displayUsername");
    if (displayUsernameElement) {
        displayUsernameElement.innerText = usuario.email;
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
}

// Verificación de items en el local storage para agregarlos al carrito
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
        carritoVacio.style.display = 'block';
    } else {
        itemsCarrito.forEach(item => {
            const productDiv = document.createElement('div');
            productDiv.className = 'product-item';
            const itemPrice = parseFloat(item.price);
            const itemQuantity = parseInt(item.quantity);
            const itemSubtotal = itemPrice * itemQuantity;

            productDiv.innerHTML = `
                <hr>
                <img id='imgcart' width=25% height=25% src='${item.image}' alt='${item.name}' />
                <h5 id='namecart'>${item.name}</h5>
                <p id='pricecart'>Precio: ${formatPrice(itemPrice)}</p>
                <p>
                    Cantidad: 
                    <input type='number' class='quantity-input' value='${itemQuantity}' min='1' data-price='${itemPrice}' />
                </p>
                <p id='subtotal-${item.id}'>Subtotal: ${formatPrice(itemSubtotal)}</p>
                <button class='remove-button' data-id='${item.id}'>Eliminar</button>
                <hr>
            `;
            itemsCarritoContenedor.appendChild(productDiv);

            subtotal += itemSubtotal; 

            // Agregar evento para actualizar subtotal al cambiar la cantidad
            const quantityInput = productDiv.querySelector('.quantity-input');
            quantityInput.addEventListener('input', (event) => {
                const newQuantity = parseInt(event.target.value);
                const price = parseFloat(event.target.dataset.price);
                const newSubtotal = price * newQuantity;
                document.getElementById(`subtotal-${item.id}`).innerText = `Subtotal: ${formatPrice(newSubtotal)}`;

                // Recalcular el subtotal total
                subtotal = 0; // Reiniciar subtotal
                document.querySelectorAll('.quantity-input').forEach(input => {
                    subtotal += parseFloat(input.dataset.price) * parseInt(input.value);
                });

                subtotalPrecio.innerText = `Subtotal: ${formatPrice(subtotal)}`;
                totalPrecio.innerText = `Total: ${formatPrice(subtotal)}`; // Ajustar total si es necesario
            });

            // Agregar evento para eliminar producto
            const removeButton = productDiv.querySelector('.remove-button');
            removeButton.addEventListener('click', () => {
                // Eliminar el producto del carrito
                const updatedCarrito = itemsCarrito.filter(cartItem => cartItem.id !== item.id);
                localStorage.setItem('itemsCarrito', JSON.stringify(updatedCarrito));
                location.reload(); // Recargar la página para mostrar el carrito actualizado
            });
        });
        carritoVacio.style.display = 'none'; // Oculta el mensaje de carrito vacío si hay productos en el mismo
        subtotalPrecio.innerText = `Subtotal: ${formatPrice(subtotal)}`; // Muestra el subtotal
        totalPrecio.innerText = `Total: ${formatPrice(subtotal)}`; // Al ser ficticio el precio del envío, el total es igual al subtotal
    }
});
document.addEventListener("DOMContentLoaded", function () {
actualizarBadgeCarrito();

function actualizarBadgeCarrito() {
    const itemsCarrito = JSON.parse(localStorage.getItem("itemsCarrito")) || [];
    const totalProductos = itemsCarrito.reduce((total, item) => total + item.quantity, 0);
    document.getElementById("cart-badge").innerText = totalProductos;
}
});