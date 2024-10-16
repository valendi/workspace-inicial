document.addEventListener("DOMContentLoaded", function() {
    console.log("JavaScript cargado correctamente.");

    var loginContainer = document.querySelector('.login-container');

    if (!loginContainer) {
        console.log("El contenedor de inicio de sesión no se encontró. Saliendo del script.");
        return;
    }

    var loginForm = document.getElementById("loginForm");

    var userMessageDiv = document.createElement('div');
    userMessageDiv.style.display = 'none';
    userMessageDiv.style.textAlign = 'center';
    userMessageDiv.style.marginTop = '20px';
    userMessageDiv.style.color = '#007bff';
    userMessageDiv.style.fontSize = '1.2rem';

    loginContainer.appendChild(userMessageDiv);
    console.log("Div para mensaje agregado al DOM.");

    if (localStorage.getItem("loggedIn") === "true") {
        console.log("Usuario ya ha iniciado sesión.");
        userMessageDiv.innerText = "¡Ya has iniciado sesión! Serás redirigido al inicio...";
        userMessageDiv.style.display = 'block';

        // Redirigir después de mostrar el mensaje
        setTimeout(function() {
            window.location.href = "index.html";
        }, 2000); // Esperar 2 segundos antes de redirigir
    }

    if (loginForm) {
        loginForm.addEventListener("submit", function(event) {
            event.preventDefault();

            var email = document.getElementById("email").value; // Cambia "username" por "email"
            var password = document.getElementById("password").value;

            if (email && password) {
                console.log("Formulario enviado con email y password.");

                const usuario = {
                    email: email,
                };
                localStorage.setItem("usuario", JSON.stringify(usuario));
                localStorage.setItem("loggedIn", "true");

                // Mostrar mensaje de inicio de sesión exitoso
                alert("¡Inicio de sesión exitoso! Serás redirigido al inicio...");

                // Redirigir después de un breve momento
                setTimeout(function() {
                    window.location.href = "index.html"; // Redirigir a index.html
                }, 2000); // Esperar 2 segundos antes de redirigir
            } else {
                console.log("Faltan datos en el formulario.");
                alert("Por favor, ingresa correo electrónico y contraseña.");
            }
        });
    } else {
        console.log("No se encontró el formulario de inicio de sesión.");
    }
});