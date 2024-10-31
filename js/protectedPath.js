document.addEventListener("DOMContentLoaded", () => {
const isLoggedIn = localStorage.getItem("loggedIn") === "true";

if (!isLoggedIn) {
    window.location.href = "login.html";
} else {
    const username = localStorage.getItem("username");
    if (username) {
        document.getElementById("displayUsername").textContent = `Cliente: ${username}`;
    }
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
