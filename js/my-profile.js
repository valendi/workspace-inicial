document.addEventListener("DOMContentLoaded", () => {
    let usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) {
        location.href = "login.html"; 
    } else {
        document.getElementById("displayUsername").innerText = "Cliente: " + usuario.email;
        loadUserProfile(usuario.email); 
    }

    function loadUserProfile(email) {
        document.getElementById("email").value = email;
        document.getElementById("name").value = ''; 
        document.getElementById("secondName").value = '';
        document.getElementById("lastname").value = ''; 
        document.getElementById("secondLastname").value = '';
        document.getElementById("phone").value = '';
        document.getElementById("profilePicPreview").src = 'https://via.placeholder.com/150'; // Imagen por defecto
    }

    const fileInput = document.getElementById("profilePic");
    fileInput.addEventListener("change", function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById("profilePicPreview").src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    const form = document.getElementById("profileForm");
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const nombre = document.getElementById("name").value.trim();
        const apellido = document.getElementById("lastname").value.trim();
        const email = document.getElementById("email").value.trim();
        const telefono = document.getElementById("phone").value.trim();

        if (!nombre || !apellido || !telefono) {
            alert("Por favor, completa todos los campos obligatorios.");
            return;
        }

        let fotoPerfil = document.getElementById("profilePicPreview").src;
        saveUserProfile(fotoPerfil);
    });

    function saveUserProfile(fotoPerfil) {
        const userProfile = {
            nombre: document.getElementById("name").value.trim(),
            segundoNombre: document.getElementById("secondName").value,
            apellido: document.getElementById("lastname").value.trim(),
            segundoApellido: document.getElementById("secondLastname").value,
            email: document.getElementById("email").value,
            telefono: document.getElementById("phone").value,
            fotoPerfil: fotoPerfil
        };
        console.log("Guardando usuario en localStorage:", userProfile);
        localStorage.setItem("userProfile", JSON.stringify(userProfile));
        alert("Datos guardados correctamente!");
    }

    const modoNocheSwitch = document.getElementById("darkModeToggle");
    modoNocheSwitch.addEventListener("change", function() {
        document.body.classList.toggle("night-mode", modoNocheSwitch.checked);
    });

    document.getElementById("cerrar").addEventListener("click", function () {
        localStorage.removeItem("usuario");
        localStorage.removeItem("contraseña");
        localStorage.removeItem("userProfile");
        location.href = "login.html"; 
    });
});
