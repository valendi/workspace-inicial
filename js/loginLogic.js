document.addEventListener("DOMContentLoaded", function () {
  var loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault(); 

      var username = document.getElementById("username").value;
      var password = document.getElementById("password").value;

      if (username && password) {
        localStorage.setItem("username", username);
        localStorage.setItem("loggedIn", "true");
        window.location.href = "index.html";
      } else {
        alert("Por favor, ingresa usuario y contraseña.");
      }
    });
  }
});
