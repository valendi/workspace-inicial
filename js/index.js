document.addEventListener("DOMContentLoaded", () => {
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

    if (localStorage.getItem("loggedIn") !== "true") {
        location.href = "login.html";
    } else {
        var username = localStorage.getItem("username");
        document.getElementById("displayUsername").textContent = username ? `Cliente: ${username}` : "Invitado";
    }

    document.getElementById("cerrar").addEventListener("click", function (event) {
        event.preventDefault();
        localStorage.removeItem("username");
        localStorage.removeItem("loggedIn");
        location.href = "login.html";
    });
});
