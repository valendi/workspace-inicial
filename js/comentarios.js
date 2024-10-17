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