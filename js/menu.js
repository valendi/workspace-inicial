document.addEventListener("DOMContentLoaded", function() {
    let usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) {
        location.href = "login.html";
    } else {
        const displayUsernameElement = document.getElementById("displayUsername");
        if (displayUsernameElement) {
            displayUsernameElement.innerText = usuario.email;
            if (typeof loadUserProfile === "function") {
                loadUserProfile(usuario.email);
            }
        }
    }

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
