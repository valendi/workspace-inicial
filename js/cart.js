// Función para formatear el precio al formato uruguayo
function formatPrice(value) {
    return new Intl.NumberFormat("es-UY", {
        style: "currency",
        currency: "UYU",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}

// Verificar si el usuario está autenticado
let usuario = JSON.parse(localStorage.getItem("usuario"));
if (!usuario) {
    location.href = "login.html"; // Redirige al login si no hay usuario autenticado
} else {
    // Mostrar el nombre del usuario en la barra de navegación
    const displayUsernameElement = document.getElementById("displayUsername");
    if (displayUsernameElement) {
        displayUsernameElement.innerText = usuario.email;
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
}

// Verificación de items en el local storage para agregarlos al carrito
document.addEventListener("DOMContentLoaded", () => {
    const itemsCarritoContenedor = document.getElementById("productosCarrito");
    const carritoVacio = document.getElementById("carritoVacio");
    const subtotalPrecio = document.getElementById("subTitl");
    const totalPrecio = document.getElementById("totalTitl");

    // Obtiene los items del carrito desde localStorage
    const itemsCarrito = JSON.parse(localStorage.getItem("itemsCarrito")) || [];
    let subtotal = 0;

    // Verifica si hay productos en el carrito
    if (itemsCarrito.length === 0) {
        carritoVacio.style.display = "block";
    } else {
        itemsCarrito.forEach((item) => {
            const productDiv = document.createElement("div");
            productDiv.className = "product-item";
            let itemPrice = item.price;
            const itemCurrency = item.currency;

            // Función para convertir precio de USD a UYU
            function conversionDolares() {
                return itemCurrency === "USD" ? itemPrice * 40 : itemPrice;
            }
            itemPrice = conversionDolares();

            const itemQuantity = parseInt(item.quantity);
            const itemSubtotal = itemPrice * itemQuantity;

            productDiv.innerHTML = `
                <img id='imgcart' width=25% height=25% src='${item.image}' alt='${item.name}' />
                <h5 id='namecart'>${item.name}</h5>
                <p id='pricecart'>Precio: ${formatPrice(itemPrice)}</p>
                <p>
                    Cantidad: 
                    <input type='number' class='quantity-input' value='${itemQuantity}' min='1' data-price='${itemPrice}' />
                </p>
                <p id='subtotal-${item.id}'>Subtotal: ${formatPrice(itemSubtotal)}</p>
                <button class='remove-button' data-id='${item.id}'>Eliminar</button>
                <hr>
            `;
            itemsCarritoContenedor.appendChild(productDiv);

            subtotal += itemSubtotal;

            // Agregar evento para actualizar subtotal al cambiar la cantidad
            const quantityInput = productDiv.querySelector(".quantity-input");
            quantityInput.addEventListener("input", (event) => {
                const newQuantity = parseInt(event.target.value);
                const price = parseFloat(event.target.dataset.price);
                const newSubtotal = price * newQuantity;
                document.getElementById(`subtotal-${item.id}`).innerText = `Subtotal: ${formatPrice(newSubtotal)}`;

                // Recalcular el subtotal total
                subtotal = 0; // Reiniciar subtotal
                document.querySelectorAll(".quantity-input").forEach((input) => {
                    subtotal += parseFloat(input.dataset.price) * parseInt(input.value);
                });

                subtotalPrecio.innerText = `Subtotal: ${formatPrice(subtotal)}`;
                totalPrecio.innerText = `Total: ${formatPrice(subtotal)}`; // Ajustar total si es necesario
            });

            // Agregar evento para eliminar producto
            const removeButton = productDiv.querySelector(".remove-button");
            removeButton.addEventListener("click", () => {
                // Eliminar el producto del carrito
                const updatedCarrito = itemsCarrito.filter((cartItem) => cartItem.id !== item.id);
                localStorage.setItem("itemsCarrito", JSON.stringify(updatedCarrito));
                location.reload(); // Recargar la página para mostrar el carrito actualizado
            });
        });
        carritoVacio.style.display = "none"; // Oculta el mensaje de carrito vacío si hay productos en el mismo
        subtotalPrecio.innerText = `Subtotal: ${formatPrice(subtotal)}`; // Muestra el subtotal
        totalPrecio.innerText = `Total: ${formatPrice(subtotal)}`; // Al ser ficticio el precio del envío, el total es igual al subtotal
    }
});
document.addEventListener("DOMContentLoaded", function () {
    actualizarBadgeCarrito();

    function actualizarBadgeCarrito() {
        const itemsCarrito = JSON.parse(localStorage.getItem("itemsCarrito")) || [];
        const totalProductos = itemsCarrito.reduce((total, item) => total + item.quantity, 0);
        document.getElementById("cart-badge").innerText = totalProductos;
    }
});

// VALIDACIONES DE PASOS
document.addEventListener("DOMContentLoaded", () => {
    // LOGICA DEL PASO 1
    // - Validar que la cantidad de productos sea mayor a 0
    document.getElementById("botonPaso1")?.addEventListener("click", function (event) {
        event.preventDefault();

        const cantidadProductos = JSON.parse(localStorage.getItem("itemsCarrito")) || [];
        if (cantidadProductos.length === 0 || cantidadProductos.some((producto) => producto.cantidad <= 0)) {
            alert("Debe agregar productos al carrito y asegurarse de que la cantidad sea mayor a 0.");
            return;
        }

        location.href = "cart-paso-2.html";
    });

    // LOGICA DEL PASO 2
    document.getElementById("botonPaso2")?.addEventListener("click", function (event) {
        event.preventDefault();

        // Recuperamos los valores previos de localStorage
        const storedData = JSON.parse(localStorage.getItem("formData")) || {};
        const selectEnvio = document.querySelectorAll('input[name="flexRadioDefault"]');
        const selectDepartamento = document.getElementById("inputGroupSelect01");
        const inputLocalidad = document.querySelector("input[aria-describedby='inputGroup-sizing-default']");
        const inputCalle = document.querySelectorAll("input[aria-describedby='inputGroup-sizing-default']")[1];
        const inputEsquina = document.getElementById("esquina");

        if (!inputEsquina) {
            console.error('Campo "Esquina" no encontrado');
        } else {
            console.log('Campo "Esquina" encontrado correctamente');
        }

        // Restaurar valores desde localStorage
        if (storedData.envio) {
            selectEnvio.forEach((input) => {
                if (input.value === storedData.envio) {
                    input.checked = true;
                }
            });
        }

        if (storedData.departamento) {
            selectDepartamento.value = storedData.departamento;
        }

        if (storedData.localidad) {
            inputLocalidad.value = storedData.localidad;
        }

        if (storedData.calle) {
            inputCalle.value = storedData.calle;
        }

        if (storedData.esquina) {
            inputEsquina.value = storedData.esquina;
        }

        // Guardar datos en localStorage a medida que el usuario los ingresa
        selectEnvio.forEach((input) => {
            input.addEventListener("change", () => {
                const envioSeleccionado = document.querySelector('input[name="flexRadioDefault"]:checked');
                storedData.envio = envioSeleccionado ? envioSeleccionado.value : null;
                localStorage.setItem("formData", JSON.stringify(storedData));
            });
        });

        selectDepartamento.addEventListener("change", () => {
            storedData.departamento = selectDepartamento.value;
            localStorage.setItem("formData", JSON.stringify(storedData));
        });

        inputLocalidad.addEventListener("input", () => {
            storedData.localidad = inputLocalidad.value;
            localStorage.setItem("formData", JSON.stringify(storedData));
        });

        inputCalle.addEventListener("input", () => {
            storedData.calle = inputCalle.value;
            localStorage.setItem("formData", JSON.stringify(storedData));
        });

        inputEsquina.addEventListener("input", () => {
            storedData.esquina = inputEsquina.value;
            localStorage.setItem("formData", JSON.stringify(storedData));
        });

        // 2. Validar que se haya seleccionado un tipo de envío
        const envioSeleccionado = Array.from(selectEnvio).some((input) => input.checked);
        if (!envioSeleccionado) {
            alert("Debe seleccionar un tipo de envío.");
            return;
        }

        // 3. Validar que el departamento esté seleccionado
        const departamentoSeleccionado = selectDepartamento.value;
        if (departamentoSeleccionado === "" || departamentoSeleccionado === "Seleccione una opcion...") {
            alert("Debe seleccionar un departamento.");
            return;
        }

        // 4. Validar que los campos de dirección estén completos
        const localidad = inputLocalidad.value.trim();
        const calle = inputCalle.value.trim();
        const esquinaValue = inputEsquina.value.trim();

        // Validación de Localidad
        if (!localidad) {
            alert("Debe completar el campo Localidad.");
            return;
        }

        // Validación de Calle y Número: Verificar que el campo contenga texto y al menos un número
        const regexCalleNumero = /[A-Za-z\s]+[0-9]+/; // Al menos un número en la calle
        if (!calle || !regexCalleNumero.test(calle)) {
            alert('Debe completar el campo Calle y número con un formato válido (ejemplo: "Calle Falsa 123").');
            return;
        }

        // Validación de Esquina
        if (esquinaValue === "") {
            alert("Debe completar el campo Esquina.");
            return;
        }

        // Si todas las validaciones son correctas, redirigir al pago
        location.href = "cart-paso-3.html"; // Redirigir a la página de pago
    });

    // VISUALIZACION DEL PASO 3
    if (document.getElementById("botonPaso3") != null) {
        const metodoPagoTarjeta = document.getElementById("metodoPagoTarjeta");
        const metodoPagoTransferencia = document.getElementById("metodoPagoTransferencia");
        const formularioTarjeta = document.getElementById("formularioTarjeta");
        const formularioTransferencia = document.getElementById("formularioTransferencia");

        // Mostrar el formulario de pago adecuado según el método seleccionado
        metodoPagoTarjeta.addEventListener("change", () => {
            formularioTarjeta.style.display = metodoPagoTarjeta.checked ? "block" : "none";
            formularioTransferencia.style.display = !metodoPagoTarjeta.checked ? "block" : "none";
        });

        metodoPagoTransferencia.addEventListener("change", () => {
            formularioTarjeta.style.display = !metodoPagoTransferencia.checked ? "block" : "none";
            formularioTransferencia.style.display = metodoPagoTransferencia.checked ? "block" : "none";
        });

        // Activar por defecto la transferencia (ya está en checked en el HTML)
        if (metodoPagoTransferencia.checked) {
            formularioTarjeta.style.display = "none";
            formularioTransferencia.style.display = "block";
        }
    }

    // LOGICA DEL PASO 3
    document.getElementById("botonPaso3")?.addEventListener("click", function (event) {
        event.preventDefault();

        const metodoPagoSeleccionado = document.querySelector('input[name="metodoPago"]:checked').id;

        if (metodoPagoSeleccionado === "metodoPagoTarjeta") {
            // Si se selecciona tarjeta
            const nombreTitular = document.getElementById("nombreTitular").value.trim();
            const correoElectronico = document.getElementById("correoElectronico").value.trim();
            const informacionTarjeta = document.getElementById("informacionTarjeta").value.trim();
            const fechaVencimiento = document.getElementById("fechaVencimiento").value.trim();
            const cvc = document.getElementById("cvc").value.trim();

            // Verificar que todos los campos de la tarjeta estén completos
            if (!nombreTitular || !correoElectronico || !informacionTarjeta || !fechaVencimiento || !cvc) {
                alert("Debe completar todos los campos de la tarjeta de crédito.");
                return;
            }

            // Validación del correo electrónico (debe contener '@')
            if (!/\S+@\S+\.\S+/.test(correoElectronico)) {
                alert("El correo electrónico debe tener el formato adecuado (ejemplo@dominio.com).");
                return;
            }

            // Validación de número de tarjeta (16 dígitos numéricos)
            if (!/^\d{16}$/.test(informacionTarjeta.replace(/\s+/g, ""))) {
                alert("El número de tarjeta debe contener 16 dígitos numéricos.");
                return;
            }

            // Validación de fecha de vencimiento (MM/AA)
            // Los primeros dos dígitos (MM) deben estar entre 01 y 12
            // Los últimos dos dígitos (AA) deben ser cualquier número entre 00 y 99
            if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(fechaVencimiento)) {
                alert("La fecha de vencimiento debe tener el formato MM/AA (mes entre 01 y 12, año de 2 dígitos).");
                return;
            }

            // Validación de CVC (3 dígitos sin espacios y solo números)
            if (!/^\d{3}$/.test(cvc)) {
                alert("El CVC debe contener exactamente 3 dígitos numéricos, sin espacios.");
                return;
            }

            // Si todo es válido, procesar la compra
            alert("Excelente, tu compra ha sido realizada con éxito. Esperamos que disfrutes mucho y agradecemos la confianza en nosotros.");

            console.log("Vaciar carrito...");

            // Utilizar setTimeout para diferir el vaciado del carrito
            setTimeout(() => {
                // Eliminar el carrito del localStorage
                localStorage.removeItem("itemsCarrito");
                localStorage.setItem("itemsCarrito", JSON.stringify([])); // Reiniciar el carrito

                // Limpiar los productos de la vista
                document.getElementById("productosCarrito").innerHTML = "";
                document.getElementById("carritoVacio").style.display = "block"; // Mostrar mensaje de carrito vacío

                console.log("Carrito vacío");
            }, 50); // Ejecutar después de 50ms para liberar el hilo
        } else if (metodoPagoSeleccionado === "metodoPagoTransferencia") {
            // Si se selecciona transferencia

            alert(
                "Excelente solo queda un paso más. Por favor, realiza el pago mediante transferencia y envíanos el comprobante para disfrutar pronto de tu compra."
            );
        }
    });
});

//Agregar costo de envio
document.addEventListener("DOMContentLoaded", () => {});
