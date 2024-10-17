let usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) {
        location.href = "login.html";
    } else {
        document.getElementById("displayUsername").innerText = usuario.email;
        loadUserProfile(usuario.email);
    }

    // Evento para cerrar sesión
    document.getElementById("cerrar").addEventListener("click", function (event) {
        event.preventDefault();
        localStorage.removeItem("usuario");
        localStorage.removeItem("loggedIn");
        location.href = "login.html";
    });

    // Código para el modo noche
    const modoNocheSwitch = document.getElementById("darkModeToggle");
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("night-mode");
        modoNocheSwitch.checked = true;
    }

    modoNocheSwitch.addEventListener("change", function() {
        document.body.classList.toggle("night-mode", modoNocheSwitch.checked);
        localStorage.setItem("darkMode", modoNocheSwitch.checked ? "enabled" : "disabled");
    });

    function loadUserProfile(email) {
        // Cargar la información del perfil del usuario desde localStorage
        const userProfile = JSON.parse(localStorage.getItem("userProfile")) || {};

        // Mostrar los datos guardados
        document.getElementById("email").value = email;
        document.getElementById("name").value = userProfile.nombre || '';
        document.getElementById("secondName").value = userProfile.segundoNombre || '';
        document.getElementById("lastname").value = userProfile.apellido || '';
        document.getElementById("secondLastname").value = userProfile.segundoApellido || '';
        document.getElementById("phone").value = userProfile.telefono || '';

        // Cargar la imagen de perfil
        const savedProfilePic = localStorage.getItem("userProfilePic");
        document.getElementById("profilePicPreview").src = savedProfilePic ? savedProfilePic : 'https://via.placeholder.com/150'; // Imagen por defecto
    }

    const fileInput = document.getElementById("profilePic");
    if (fileInput) {
        fileInput.addEventListener("change", function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById("profilePicPreview").src = e.target.result;
                    // Guardar la imagen en localStorage
                    localStorage.setItem("userProfilePic", e.target.result);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    const form = document.getElementById("profileForm");
    if (form) {
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
    }

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
    }


