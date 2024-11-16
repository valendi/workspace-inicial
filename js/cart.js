function showAlert(message, type = "danger", autoDismiss = true, duration = 5000) {
    // Crear el elemento de alerta
    const alertContainer = document.getElementById('alert-container');
    const alertElement = document.createElement('div');

    alertElement.className = `alert alert-${type} alert-dismissible fade show`;
    alertElement.role = "alert";
    alertElement.innerHTML = `
        <strong>${type === "success" ? "¡Éxito!" : "¡Error!"}</strong> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    // Agregar la alerta al contenedor
    alertContainer.appendChild(alertElement);

    // Configurar el autodescanso
    if (autoDismiss) {
        setTimeout(() => {
            const alert = bootstrap.Alert.getOrCreateInstance(alertElement);
            alert.close();
        }, duration);
    }
}

function showCustomAlert(heading, message, type = "success", autoDismiss = true, duration = 5000) {
    // Contenedor de las alertas
    const alertContainer = document.getElementById('alert-container');

    // Crear la alerta
    const alertElement = document.createElement('div');
    alertElement.className = `alert alert-${type} alert-dismissible fade show`;
    alertElement.role = "alert";
    alertElement.innerHTML = `
        <h4 class="alert-heading">${heading}</h4>
        <p>${message}</p>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    // Agregar la alerta al contenedor
    alertContainer.appendChild(alertElement);

    // Cierre automático si se especifica
    if (autoDismiss) {
        setTimeout(() => {
            const alert = bootstrap.Alert.getOrCreateInstance(alertElement);
            alert.close();
        }, duration);
    }
}



function actualizarBadgeCarrito() {
    const itemsCarrito = JSON.parse(localStorage.getItem("itemsCarrito")) || [];
    const totalProductos = itemsCarrito.reduce((total, item) => total + item.quantity, 0);
    document.getElementById("cart-badge").innerText = totalProductos;
}

function formateoPrecioUruguayo(value) {
    return new Intl.NumberFormat("es-UY", {
        style: "currency",
        currency: "UYU",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}

function verificarUsuarioLogueado() {
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
}

function configurarCerradoSesion() {
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
}

function validacionesPaso1(event) {
    event.preventDefault();

    const cantidadProductos = JSON.parse(localStorage.getItem("itemsCarrito")) || [];
    if (cantidadProductos.length === 0 || cantidadProductos.some((producto) => producto.cantidad <= 0)) {
        showAlert("Debe agregar productos al carrito y asegurarse de que la cantidad sea mayor a 0.");
        return;
    }

    location.href = "cart-paso-2.html";
}

function validacionesPaso2(event) {
    event.preventDefault();

    // Recuperamos los valores previos de localStorage
    const storedData = JSON.parse(localStorage.getItem("formData")) || {};
    const selectEnvio = document.querySelectorAll('input[name="envio"]');
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
            const envioSeleccionado = document.querySelector('input[name="envioPremium"]:checked');
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
        showAlert("Debe seleccionar un tipo de envío.");
        return;
    }

    // 3. Validar que el departamento esté seleccionado
    const departamentoSeleccionado = selectDepartamento.value;
    if (departamentoSeleccionado === "" || departamentoSeleccionado === "Seleccione una opcion...") {
        showAlert("Debe seleccionar un departamento.");
        return;
    }

    // 4. Validar que los campos de dirección estén completos
    const localidad = inputLocalidad.value.trim();
    const calle = inputCalle.value.trim();
    const esquinaValue = inputEsquina.value.trim();

    // Validación de Localidad
    if (!localidad) {
        showAlert("Debe completar el campo Localidad.");
        return;
    }

    // Validación de Calle y Número: Verificar que el campo contenga texto y al menos un número
    const regexCalleNumero = /[A-Za-z\s]+[0-9]+/; // Al menos un número en la calle
    if (!calle || !regexCalleNumero.test(calle)) {
        showAlert('Debe completar el campo Calle y número con un formato válido (ejemplo: "Calle Falsa 123").');
        return;
    }

    // Validación de Esquina
    if (esquinaValue === "") {
        showAlert("Debe completar el campo Esquina.");
        return;
    }

    // Si todas las validaciones son correctas, redirigir al pago
    location.href = "cart-paso-3.html"; // Redirigir a la página de pago;
}

function validacionesPaso3(event) {
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
            showAlert("Debe completar todos los campos de la tarjeta de crédito.");
            return;
        }

        // Validación del correo electrónico (debe contener '@')
        if (!/\S+@\S+\.\S+/.test(correoElectronico)) {
            showAlert("El correo electrónico debe tener el formato adecuado (ejemplo@dominio.com).");
            return;
        }

        // Validación de número de tarjeta (16 dígitos numéricos)
        if (!/^\d{16}$/.test(informacionTarjeta.replace(/\s+/g, ""))) {
            showAlert("El número de tarjeta debe contener 16 dígitos numéricos.");
            return;
        }

        // Validación de fecha de vencimiento (MM/AA)
        // Los primeros dos dígitos (MM) deben estar entre 01 y 12
        // Los últimos dos dígitos (AA) deben ser cualquier número entre 00 y 99
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(fechaVencimiento)) {
            showAlert("La fecha de vencimiento debe tener el formato MM/AA (mes entre 01 y 12, año de 2 dígitos).");
            return;
        }

        // Validación de CVC (3 dígitos sin espacios y solo números)
        if (!/^\d{3}$/.test(cvc)) {
            showAlert("El CVC debe contener exactamente 3 dígitos numéricos, sin espacios.");
            return;
        }

        // Si todo es válido, procesar la compra
        showCustomAlert(
            "¡Éxito!",
            "Excelente, tu compra ha sido realizada con éxito. Esperamos que disfrutes mucho y agradecemos la confianza en nosotros.",
            "success"
        );

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

        showCustomAlert(
            "¡Éxito!",
            "Excelente solo queda un paso más. Por favor, realiza el pago mediante transferencia y envíanos el comprobante para disfrutar pronto de tu compra.",
            "success"
        );
    }
}

function cargaDatosPaso1() {

    // Calcular el total y actualizar texto en HTML
    const costoSubtotalProductosElemento = parseFloat(localStorage.getItem("costoSubtotal"));
    const costoTotalElemento = document.getElementById("costoTotal");

    recalcularTotal();  // Llamar a una función para calcular el total correctamente
}

function recalcularTotal() {
    const costoSubtotalProductos = parseFloat(localStorage.getItem("costoSubtotal")) || 0;
    const costoEnvio = parseFloat(localStorage.getItem("costoEnvio")) || 0;

    const costoTotal = costoSubtotalProductos + costoEnvio;
    localStorage.setItem("costoTotal", costoTotal);

    const costoTotalElemento = document.getElementById("costoTotal");
    if (costoTotalElemento) {
        costoTotalElemento.innerText = `Total: ${formateoPrecioUruguayo(costoTotal)}`;
    }
}



function calcularCostoEnvio() {
    const envioPremium = document.getElementById("envioPremium");
    const envioExpress = document.getElementById("envioExpress");
    const envioStandard = document.getElementById("envioStandard");

    // Recuperar valor previo de localStorage si ya existe
    let costoEnvio = parseFloat(localStorage.getItem("costoEnvio")) || 0;

    // Verificar si hay selección de envío activa
    if (envioPremium && envioPremium.checked) {
        costoEnvio = parseFloat(localStorage.getItem("costoSubtotal")) * 0.15;
    } else if (envioExpress && envioExpress.checked) {
        costoEnvio = parseFloat(localStorage.getItem("costoSubtotal")) * 0.07;
    } else if (envioStandard && envioStandard.checked) {
        costoEnvio = parseFloat(localStorage.getItem("costoSubtotal")) * 0.05;
    }

    // Actualizar el valor en localStorage y retornarlo
    localStorage.setItem("costoEnvio", costoEnvio);
    return costoEnvio;
}

function cargaDatosPaso2() {
    const itemsCarritoContenedor = document.getElementById("productosCarrito");
    const carritoVacioElemento = document.getElementById("carritoVacio");
    const costoSubtotalElemento = document.getElementById("subtotal");

    // Obtiene los items del carrito desde localStorage
    const itemsCarrito = JSON.parse(localStorage.getItem("itemsCarrito")) || [];
    let subtotal = 0;

    // Verifica si hay productos en el carrito
    if (itemsCarrito.length === 0) {
        carritoVacioElemento.style.display = "block";
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

            productDiv.innerHTML = `<img id='imgcart' width=25% height=25% src='${item.image}' alt='${item.name}' />
                <h5 id='namecart'>${item.name}</h5>
                <p id='pricecart'>Precio: ${formateoPrecioUruguayo(itemPrice)}</p>
                <p>
                    Cantidad: 
                    <input type='number' class='quantity-input' value='${itemQuantity}' min='1' data-price='${itemPrice}' />
                </p>
                <p id='subtotal-${item.id}'>Subtotal: ${formateoPrecioUruguayo(itemSubtotal)}</p>
                <button class='remove-button' data-id='${item.id}'>Eliminar</button>
                <hr>`;
            itemsCarritoContenedor.appendChild(productDiv);

            subtotal += itemSubtotal;

            // Agregar evento para actualizar subtotal al cambiar la cantidad
            const quantityInput = productDiv.querySelector(".quantity-input");
            quantityInput.addEventListener("input", (event) => {
                const newQuantity = parseInt(event.target.value);
                const price = parseFloat(event.target.dataset.price);
                const newSubtotal = price * newQuantity;
                document.getElementById(`subtotal-${item.id}`).innerText = `Subtotal: ${formateoPrecioUruguayo(newSubtotal)}`;

                // Actualizar la cantidad en el localStorage
                item.quantity = newQuantity;
                localStorage.setItem("itemsCarrito", JSON.stringify(itemsCarrito));

                // Recalcular el subtotal total
                subtotal = 0; // Reiniciar subtotal
                document.querySelectorAll(".quantity-input").forEach((input) => {
                    subtotal += parseFloat(input.dataset.price) * parseInt(input.value);
                });

                costoSubtotalElemento.innerText = `Subtotal: ${formateoPrecioUruguayo(subtotal)}`;
                localStorage.setItem("costoSubtotal", subtotal);
                recalculoEnvioPaso2(); // Recalcular el costo de envío
                recalcularTotal(); // Recalcular el total (incluyendo el costo de envío)
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
        carritoVacioElemento.style.display = "none"; // Oculta el mensaje de carrito vacío si hay productos en el mismo
        costoSubtotalElemento.innerText = `Subtotal: ${formateoPrecioUruguayo(subtotal)}`; // Muestra el subtotal
    }

    // Guardar subtotal
    localStorage.setItem("costoSubtotal", subtotal);

    // Recalcular el total después de los cambios
    recalcularTotal(); // Llamada para calcular el total correctamente

    // Evento para escuchar el cambio en la selección de tipo de envío
    const radioButtonsEnvio = document.querySelectorAll('input[name="envio"]');
    radioButtonsEnvio.forEach((radio) => {
        radio.addEventListener("change", () => {
            recalculoEnvioPaso2(); // Recalcular el costo de envío al cambiar la selección
            recalcularTotal(); // Recalcular el total después de cambiar el envío
        });
    });
}

function recalculoEnvioPaso2() {
    if (document.getElementById("botonPaso2") != null) {
        const costoEnvio = calcularCostoEnvio();
        const costoEnvioElemento = document.getElementById("costoEnvio");

        costoEnvioElemento.textContent = `Envío: ${formateoPrecioUruguayo(costoEnvio)}`;
        recalcularTotal(); // Actualizar el total con el costo de envío
    }
}


function cargaDatosPaso3() {
    if (document.getElementById("botonPaso3") != null) {
        const metodoPagoTarjeta = document.getElementById("metodoPagoTarjeta");
        const metodoPagoTransferencia = document.getElementById("metodoPagoTransferencia");
        const formularioTarjeta = document.getElementById("formularioTarjeta");
        const formularioTransferencia = document.getElementById("formularioTransferencia");

        // Mostrar u ocultar formularios de métodos de pago
        metodoPagoTarjeta.addEventListener("change", () => {
            formularioTarjeta.style.display = metodoPagoTarjeta.checked ? "block" : "none";
            formularioTransferencia.style.display = !metodoPagoTarjeta.checked ? "block" : "none";
        });

        metodoPagoTransferencia.addEventListener("change", () => {
            formularioTarjeta.style.display = !metodoPagoTransferencia.checked ? "block" : "none";
            formularioTransferencia.style.display = metodoPagoTransferencia.checked ? "block" : "none";
        });

        if (metodoPagoTransferencia.checked) {
            formularioTarjeta.style.display = "none";
            formularioTransferencia.style.display = "block";
        }

        // Recuperar y mostrar el costo de envío almacenado
        const costoEnvio = parseFloat(localStorage.getItem("costoEnvio")) || 0;
        const costoEnvioElemento = document.getElementById("costoEnvio");
        costoEnvioElemento.innerText = `Envío: ${formateoPrecioUruguayo(costoEnvio)}`;

        // Mostrar el costo total
        const costoTotal = parseFloat(localStorage.getItem("costoTotal")) || 0;
        const costoTotalElemento = document.getElementById("costoTotal");
        costoTotalElemento.innerText = `Total: ${formateoPrecioUruguayo(costoTotal)}`;

        // Escuchar cambios en cantidades y recalcular el total
        const quantityInputs = document.querySelectorAll(".quantity-input");
        quantityInputs.forEach((input) => {
            input.addEventListener("input", () => {
                recalcularTotal(); // Recalcular el total dinámicamente
            });
        });
    }
}




document.addEventListener("DOMContentLoaded", () => {
    // Verificaciones de carga de pagina
    verificarUsuarioLogueado();
    configurarCerradoSesion();
    actualizarBadgeCarrito();

    // Carga de Datos del paso previo
    cargaDatosPaso1()
    cargaDatosPaso2();
    cargaDatosPaso3();

    // Validaciones de botones de Pasos del Carrito
    // Para cada botonPasoX llama a una funcion validacionesPasoX que tienen sus correspondientes validaciones
    document.getElementById("botonPaso1")?.addEventListener("click", validacionesPaso1);
    document.getElementById("botonPaso2")?.addEventListener("click", validacionesPaso2);
    document.getElementById("botonPaso3")?.addEventListener("click", validacionesPaso3);

    // Recalculos de precio de envio al seleccionar tipo de envio
    document.getElementById("envioPremium")?.addEventListener("change", recalculoEnvioPaso2);
    document.getElementById("envioExpress")?.addEventListener("change", recalculoEnvioPaso2);
    document.getElementById("envioStandard")?.addEventListener("change", recalculoEnvioPaso2);

});
