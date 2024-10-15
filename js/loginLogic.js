document.addEventListener("DOMContentLoaded", function () {
  var loginForm = document.getElementById("loginForm");
  if (loginForm) {
      loginForm.addEventListener("submit", function (event) {
          event.preventDefault();

          var username = document.getElementById("username").value;
          var password = document.getElementById("password").value;

          if (username && password) {
              const usuario = {
                  email: username, 

              };
              localStorage.setItem("usuario", JSON.stringify(usuario));
              localStorage.setItem("loggedIn", "true"); 
              window.location.href = "index.html";
          } else {
              alert("Por favor, ingresa usuario y contraseña.");
          }
      });
  }
});