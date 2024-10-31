document.addEventListener("DOMContentLoaded", function () {
  const productID = localStorage.getItem("selectedProductID");
  if (productID) {
    fetch(`https://japceibal.github.io/emercado-api/products/${productID}.json`)
      .then((response) => response.json())
      .then((product) => {
        document.getElementById("product-name").textContent = product.name;
        document.getElementById("product-description").textContent = product.description;
        document.getElementById("category-name").textContent = product.category;
        document.getElementById("sold-quantity").textContent = product.soldCount;

        const carouselContainer = document.getElementById("carousel-images");
        carouselContainer.innerHTML = "";
        if (product.images && product.images.length > 0) {
          product.images.forEach((imageUrl, index) => {
            const carouselItem = document.createElement("div");
            carouselItem.classList.add("carousel-item");
            if (index === 0) {
              carouselItem.classList.add("active");
            }
            const img = document.createElement("img");
            img.src = imageUrl;
            img.classList.add("d-block", "w-100");
            carouselItem.appendChild(img);
            carouselContainer.appendChild(carouselItem);
          });
        }
      })
      .catch((error) => console.error("Error fetching product data: ", error));
  } else {
    console.error("No product id found");
  }
});

// Productos relacionados
document.addEventListener("DOMContentLoaded", function () {
  const productID = localStorage.getItem("selectedProductID");
  fetch(`https://japceibal.github.io/emercado-api/products/${productID}.json`)
    .then((response) => response.json())
    .then((data) => {
      const productosRelacionados = data.relatedProducts;
      const contenedorProductosRelacionados = document.getElementById('productos-relacionados');
      productosRelacionados.forEach((product) => {
        const tarjetaProducto = document.createElement("div");
        tarjetaProducto.classList.add("card");

        const imagenProducto = document.createElement("img");
        imagenProducto.classList.add("card-img-top");
        imagenProducto.src = product.image;
        imagenProducto.alt = product.name;

        const cuerpoTarjeta = document.createElement("div");
        cuerpoTarjeta.classList.add("card-body");

        const tituloProducto = document.createElement("h5");
        tituloProducto.textContent = product.name;
        tituloProducto.classList.add("card-title");

        const enlaceProductoRelacionado = document.createElement("a");
        enlaceProductoRelacionado.href = "product-info.html";
        enlaceProductoRelacionado.addEventListener("click", function () {
          localStorage.setItem("selectedProductID", product.id);
        });

        enlaceProductoRelacionado.appendChild(imagenProducto);
        cuerpoTarjeta.appendChild(tituloProducto);
        tarjetaProducto.appendChild(enlaceProductoRelacionado);
        tarjetaProducto.appendChild(cuerpoTarjeta);
        contenedorProductosRelacionados.appendChild(tarjetaProducto);
      });
    })
    .catch((error) => console.error("Hubo un problema con la solicitud:", error));
});

// Código de calificaciones
const productID = localStorage.getItem("selectedProductID");
let apiCommentsURL = `https://japceibal.github.io/emercado-api/products_comments/${productID}.json`;

const chequeoVentana = window.location.pathname.endsWith("product-info.html");

if (chequeoVentana === true) {
  fetch(apiCommentsURL)
    .then((response) => response.json())
    .then(data => {
      localStorage.setItem("comments", JSON.stringify(data));
    })
    .catch(error => {
      console.error('Error al cargar los datos', error);
    })
    .finally(mostrarComentarios);
} else {
  mostrarComentarios(true);
}

function generarEstrellas(score) {
  const maxStars = 5;
  let estrellasHTML = '';
  for (let i = 1; i <= maxStars; i++) {
    if (i <= score) {
      estrellasHTML += '<span class="fa fa-star checked"></span>';
    } else {
      estrellasHTML += '<span class="far fa-star"></span>';
    }
  }
  return estrellasHTML;
}

function mostrarComentarios(mostrarTodos = false) {
  let comments = JSON.parse(localStorage.getItem("comments")) || [];
  let listaComentarios = document.getElementById('calif-container');

  listaComentarios.innerHTML = "";
  if (mostrarTodos === false) {
    comments = comments.slice(0, 2);
  }

  comments.forEach(comment => {
    let commentDiv = document.createElement('div');
    commentDiv.classList.add('container');

    let userFechaRow = document.createElement('div');
    userFechaRow.classList.add('row');

    let usuario = document.createElement('div');
    usuario.classList.add('col-6', 'order-1', 'text-start');
    usuario.textContent = `${comment.user}`;

    let fecha = document.createElement('div');
    fecha.classList.add('col-6', 'order-2', 'text-muted', 'text-start');
    fecha.textContent = `${new Date(comment.dateTime).toLocaleDateString()}`;

    userFechaRow.appendChild(usuario);
    userFechaRow.appendChild(fecha);

    let calificacionComentarioRow = document.createElement('div');
    calificacionComentarioRow.classList.add('row');

    let calificacion = document.createElement('div');
    calificacion.classList.add('col-6', 'order-1');
    calificacion.innerHTML = `${generarEstrellas(comment.score)}`;

    let comentario = document.createElement('div');
    comentario.classList.add('col-6', 'text-muted', 'order-2');
    comentario.textContent = `${comment.description}`;

    calificacionComentarioRow.appendChild(calificacion);
    calificacionComentarioRow.appendChild(comentario);

    commentDiv.appendChild(userFechaRow);
    commentDiv.appendChild(calificacionComentarioRow);

    listaComentarios.appendChild(commentDiv);
  });
}

const stars = document.querySelectorAll("#star-rating i");
const submitButton = document.getElementById("submit-button");
const commentBox = document.getElementById("comment-box");

stars.forEach(star => {
  star.addEventListener("click", function () {
    stars.forEach(s => {
      s.classList.remove('fas');
      s.classList.add('far');
    });
    const selectedValue = parseInt(this.getAttribute("data-value"));
    for (let i = 0; i < selectedValue; i++) {
      stars[i].classList.remove('far');
      stars[i].classList.add('fas');
    }
  });
});

submitButton.addEventListener("click", function () {
  const score = Array.from(stars).filter(star => star.classList.contains('fas')).length;

  const newComment = {
    score: score,
    user: `${localStorage.getItem("usuario") ? JSON.parse(localStorage.getItem("usuario")).email : "Anónimo"}`,
    dateTime: new Date().toISOString(),
    description: commentBox.value
  };

  const existingComments = JSON.parse(localStorage.getItem("comments")) || [];
  existingComments.unshift(newComment);
  localStorage.setItem("comments", JSON.stringify(existingComments));
  mostrarComentarios();
});

function verMasComentarios() {
  window.location.href = 'comentarios_completos.html';
}

// Funcionalidad del botón "Comprar"
const buyButton = document.getElementById("buy-button");
buyButton.addEventListener("click", function () {
  const productID = localStorage.getItem("selectedProductID");
  fetch(`https://japceibal.github.io/emercado-api/products/${productID}.json`)
    .then(response => response.json())
    .then(product => {
      const productInfo = {
        id: product.id,
        name: product.name,
        price: product.cost,
        description: product.description,
        category: product.category,
        image: product.images[0],
        quantity: 1 // Modifica las cantidades agregadas del mismo producto al carrito
      };

      // Obtiene los productos del carrito actual
      let itemsCarrito = JSON.parse(localStorage.getItem("itemsCarrito")) || [];

      // Verifica si el producto ya está en el carrito
      const productoExistente = itemsCarrito.find(item => item.id === productInfo.id);
      if (productoExistente) {

        // Si ya existe, aumenta la cantidad
        productoExistente.quantity += 1;
      } else {
        
        // Si no existe, agregar el nuevo producto
        itemsCarrito.push(productInfo);
      }

      // Guarda el carrito actualizado en localStorage
      localStorage.setItem("itemsCarrito", JSON.stringify(itemsCarrito));
      window.location.href = "cart.html"; // Redirige al carrito
    })
    .catch(error => console.error("Error al cargar los datos del producto: ", error));
});

// Verificación de autenticación
let usuario = JSON.parse(localStorage.getItem("usuario"));
if (!usuario) {
  location.href = "login.html";
} else {
  const displayUsernameElement = document.getElementById("displayUsername");
  if (displayUsernameElement) {
    document.getElementById("displayUsername").innerText = usuario.email;
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
}

// Dark mode
const toggle = document.getElementById('darkModeToggle');
const body = document.body;

const darkModePreference = localStorage.getItem('darkMode');

if (darkModePreference === 'enabled') {
  body.classList.add('dark-mode');
  toggle.checked = true; 
}

toggle.addEventListener('change', () => {
  body.classList.toggle('dark-mode');

  if (body.classList.contains('dark-mode')) {
    localStorage.setItem('darkMode', 'enabled');
  } else {
    localStorage.setItem('darkMode', 'disabled');
  }
});
document.addEventListener("DOMContentLoaded", function () {
  actualizarBadgeCarrito();
  
  function actualizarBadgeCarrito() {
      const itemsCarrito = JSON.parse(localStorage.getItem("itemsCarrito")) || [];
      const totalProductos = itemsCarrito.reduce((total, item) => total + item.quantity, 0);
      document.getElementById("cart-badge").innerText = totalProductos;
  }
  
    // Llamar a la función después de agregar productos al carrito
  buyButton.addEventListener("click", function () {
      actualizarBadgeCarrito();
  });
  });