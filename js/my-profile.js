// Verifica si el usuario está logueado
let usuario = JSON.parse(localStorage.getItem("usuario"));
if (!usuario) {
    location.href = "login.html";
} else {
    document.getElementById("displayUsername").innerText = usuario.email;
    loadUserProfile(usuario.email);
}

// Evento para cerrar sesión
document.getElementById("cerrar").addEventListener("click", (event) => {
    event.preventDefault();
    localStorage.removeItem("usuario");
    localStorage.removeItem("loggedIn");
    location.href = "login.html";
});

// Modo noche
const modoNocheSwitch = document.getElementById("darkModeToggle");
if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("night-mode");
    modoNocheSwitch.checked = true;
}

modoNocheSwitch.addEventListener("change", () => {
    const isChecked = modoNocheSwitch.checked;
    document.body.classList.toggle("night-mode", isChecked);
    localStorage.setItem("darkMode", isChecked ? "enabled" : "disabled");
});

// Cargar perfil de usuario
function loadUserProfile(email) {
    const userProfile = JSON.parse(localStorage.getItem("userProfile")) || {};
    document.getElementById("email").value = email;
    document.getElementById("name").value = userProfile.nombre || '';
    document.getElementById("secondName").value = userProfile.segundoNombre || '';
    document.getElementById("lastname").value = userProfile.apellido || '';
    document.getElementById("secondLastname").value = userProfile.segundoApellido || '';
    document.getElementById("phone").value = userProfile.telefono || '';
    document.getElementById("profilePicPreview").src = userProfile.fotoPerfil || 'https://via.placeholder.com/150';
}

// Cargar imagen de perfil
document.getElementById("uploadProfilePic").addEventListener("click", () => {
    document.getElementById("profilePic").click(); // Simular clic en el input de archivo
});

document.getElementById("profilePic").addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                // Intentar guardar la imagen en localStorage
                localStorage.setItem("tempProfilePic", e.target.result);
                document.getElementById("profilePicPreview").src = e.target.result;
                alert("Imagen de perfil cargada. Haz clic en 'Guardar Cambios' para guardar.");
            } catch (error) {
                // Capturar el error si el espacio es excedido
                if (error.name === "QuotaExceededError") {
                    alert("La imagen es demasiado grande para guardarse. Por favor, intenta con una imagen más pequeña.");
                } else {
                    console.error("Error al guardar la imagen:", error);
                }
            }
        };
        reader.readAsDataURL(file);
    }
});

// Manejar envío del formulario
document.getElementById("profileForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const nombre = document.getElementById("name").value.trim();
    const apellido = document.getElementById("lastname").value.trim();
    const telefono = document.getElementById("phone").value.trim();

    if (!nombre || !apellido || !telefono) {
        alert("Por favor, completa todos los campos obligatorios.");
        return;
    }

    // Obtener la imagen de perfil temporalmente guardada
    const fotoPerfil = localStorage.getItem("tempProfilePic") || document.getElementById("profilePicPreview").src;
    saveUserProfile(fotoPerfil);
});

// Guardar perfil de usuario
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
    // Guardar foto de perfil en localStorage
    localStorage.setItem("userProfilePic", fotoPerfil);
    alert("Perfil guardado exitosamente.");
}

// Eliminar foto de perfil
document.getElementById("removeProfilePic").addEventListener("click", function () {
    // Restablecer la vista previa de la imagen a la imagen por defecto
    document.getElementById("profilePicPreview").src = 'https://via.placeholder.com/150'; 
    // Limpiar el input de archivo
    document.getElementById("profilePic").value = "";
    // Eliminar la foto de perfil del localStorage
    localStorage.removeItem("tempProfilePic");
    localStorage.removeItem("userProfilePic");
    alert("Foto de perfil eliminada.");  
});
document.addEventListener("DOMContentLoaded", function () {
    actualizarBadgeCarrito();
    
    function actualizarBadgeCarrito() {
        const itemsCarrito = JSON.parse(localStorage.getItem("itemsCarrito")) || [];
        const totalProductos = itemsCarrito.reduce((total, item) => total + item.quantity, 0);
        document.getElementById("cart-badge").innerText = totalProductos;
    }
    });