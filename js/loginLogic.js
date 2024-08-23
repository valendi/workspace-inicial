//En este archivo se establece la logica del login donde se guarda la sesion en session storage

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("loginForm")
    .addEventListener("submit", function (event) {
      event.preventDefault(); // Evita que el formulario se envíe de la manera tradicional

      var username = document.getElementById("username").value;
      var password = document.getElementById("password").value;

      if (username && password) {
        // Guarda en sessionStorage que el usuario ha iniciado sesión
        sessionStorage.setItem("loggedIn", "true");
        // Redirige a la portada
        window.location.href = "index.html";
      } else {
        alert("Por favor, ingresa usuario y contraseña.");
      }
    });

  function logout() {
    // Borra la información de la sesión
    sessionStorage.removeItem("loggedIn");
    // Redirige al login
    window.location.href = "login.html";
  }
});
