document.addEventListener("DOMContentLoaded", () => {
    // Eventos para redirigir a las categorías
    document.getElementById("autos").addEventListener("click", function () {
        localStorage.setItem("catID", 101);
        window.location.href = "products.html";
    });

    document.getElementById("juguetes").addEventListener("click", function () {
        localStorage.setItem("catID", 102);
        window.location.href = "products.html";
    });

    document.getElementById("muebles").addEventListener("click", function () {
        localStorage.setItem("catID", 103);
        window.location.href = "products.html";
    });

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
});

document.addEventListener("DOMContentLoaded", function () {
    actualizarBadgeCarrito();
    
    function actualizarBadgeCarrito() {
        const itemsCarrito = JSON.parse(localStorage.getItem("itemsCarrito")) || [];
        const totalProductos = itemsCarrito.reduce((total, item) => total + item.quantity, 0);
        document.getElementById("cart-badge").innerText = totalProductos;
    }
    
      // Llamar a la función después de agregar productos al carrito
    buyButton.addEventListener("click", function () {
        actualizarBadgeCarrito();
    });
    });