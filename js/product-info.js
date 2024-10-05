// Escucha el evento 'DOMContentLoaded', que asegura que el DOM esté completamente cargado antes de ejecutar el código.
document.addEventListener("DOMContentLoaded", function () {
  // Obtiene el 'productID' guardado en el localStorage, que identifica el producto seleccionado.
  const productID = localStorage.getItem("selectedProductID");
// Verifica si se ha encontrado un 'productID' en el localStorage. 
  if (productID) {
    // Realiza una solicitud fetch para obtener los datos del producto desde la API, usando el 'productID'.
    fetch(`https://japceibal.github.io/emercado-api/products/${productID}.json`)
      .then((response) => response.json()) // Convierte la respuesta en formato JSON.
      .then((product) => { // Una vez obtenidos los datos del producto:
        // Actualiza el contenido de varios elementos en la página con la información del producto.
        document.getElementById("product-name").textContent = product.name;
        document.getElementById("product-description").textContent = product.description;
        document.getElementById("category-name").textContent = product.category;
        document.getElementById("sold-quantity").textContent =
          product.soldCount; 
        const carouselContainer = document.getElementById("carousel-images"); // Insercion dinamica de imagenes en el container con ID carousel-images
        carouselContainer.innerHTML = ""; // Limpia el contenido del contenedor del carrusel antes de añadir nuevas imágenes (para evitar duplicados).
        // Itera sobre el array de imágenes del producto.
      if (product.images && product.images.length > 0){
        product.images.forEach((imageUrl, index) => {
          // Crea un nuevo elemento 'div' para cada imagen del carrusel.
          const carouselItem = document.createElement("div");
          // Añade la clase 'carousel-item', que es necesaria para los elementos del carrusel en Bootstrap.
          carouselItem.classList.add("carousel-item");
          // Si el índice es 0, es decir, la primera imagen, añade también la clase 'active' (el primer item debe ser active segun Bootstra)
          if(index===0){
            carouselItem.classList.add("active");
          }
          // Crea un nuevo elemento 'img' y le asigna el 'src' con la URL de la imagen.
          var img = document.createElement("img");
          img.src= imageUrl;
          // Añade las clases 'd-block' y 'w-100' al elemento 'img'.
          // 'd-block' asegura que la imagen se comporte como un bloque (block-level element),
          // y 'w-100' hace que la imagen ocupe todo el ancho disponible dentro del carrusel.
          img.classList.add("d-block", "w-100");
          // Añade la imagen al 'div' que representa el 'carousel-item'.
          carouselItem.appendChild(img);
          // Añade el 'carousel-item' al contenedor del carrusel ('carousel-inner').
          carouselContainer.appendChild(carouselItem);
        });
      } else {
        console.error("No se encontraron imágenes en el producto");
      }
    })
      // Captura cualquier error que ocurra durante la solicitud fetch o al procesar los datos.
      .catch((error) => console.error("Error fetching product data: ", error));
  } else {
    // Si no se encuentra el 'productID' en el localStorage, se muestra un mensaje de error en la consola.
    console.error("No product id found");
  }
});

//Codigo de productos relacionados
document.addEventListener("DOMContentLoaded", function () {
  // Obtiene el 'productID' guardado en el localStorage, que identifica el producto seleccionado.
  const productID = localStorage.getItem("selectedProductID");
  fetch(`https://japceibal.github.io/emercado-api/products/${productID}.json`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Accediendo a los productos relacionados
      const productosRelacionados = data.relatedProducts;
      console.log("Productos relacionados:", productosRelacionados);
      const contenedorProductosRelacionados = document.getElementById('productos-relacionados');
      productosRelacionados.forEach((product) => { //Iterando sobre los productos relacionados
        
        //Crear un div contenedor para la tarjeta de cada uno de los productos
        const tarjetaProducto = document.createElement("div");
        tarjetaProducto.classList.add("card"); //Agregar clase card para que sea una tarjeta de bootstrap

        //Crear elemento para que contenga la imagen de cada uno de los productos
        const imagenProducto = document.createElement("img");
        imagenProducto.classList.add("card-img-top"); //Agregar clase card img top para estilo de bootstrap
        imagenProducto.src = product.image;
        imagenProducto.alt = product.name;

        // Crear el cuerpo de la tarjeta
        const cuerpoTarjeta = document.createElement("div");
        cuerpoTarjeta.classList.add("card-body"); //Clase bootrap al cuerpo de la tarjeta
        
        //Crear el elemento para que contenga el titulo de cada uno de los productos
        const tituloProducto = document.createElement("h5");
        tituloProducto.textContent = product.name;
        tituloProducto.classList.add("card-title"); //Clase para el titulo con bootstrap

        //Crear enlace para redireccionar la imagen
        const enlaceProductoRelacionado = document.createElement("a");
        enlaceProductoRelacionado.href = "product-info.html"
        
        //Agregar un evento click al enlace para guardar el id del producto en el local storage
        enlaceProductoRelacionado.addEventListener("click", function(){
          localStorage.setItem("selectedProductID", product.id);
        });

        //Insertar la imagen dentro del enlace
        enlaceProductoRelacionado.appendChild(imagenProducto)
        
        // Añadir el título al cuerpo de la tarjeta
        cuerpoTarjeta.appendChild(tituloProducto);

        // Añadir el cuerpo de la tarjeta y el enlace al contenedor principal de la tarjeta
        tarjetaProducto.appendChild(enlaceProductoRelacionado);
        tarjetaProducto.appendChild(cuerpoTarjeta);

        // Añadir la tarjeta completa al contenedor principal del grupo de tarjetas
        contenedorProductosRelacionados.appendChild(tarjetaProducto);
      })
    })
    .catch((error) => {
      console.error("Hubo un problema con la solicitud:", error);
    });
});


//Codigo de calificaciones

const productID = localStorage.getItem("selectedProductID");

let apiCommentsURL = `https://japceibal.github.io/emercado-api/products_comments/${productID}.json`;

const chequeoVentana = window.location.pathname.endsWith("product-info.html");

if (chequeoVentana===true){
fetch(apiCommentsURL)
.then((response) => response.json())
.then(data =>{
  localStorage.setItem("comments", JSON.stringify(data));
})
.catch(error =>{
console.error('Error al cargar los datos', error);
})
.finally(mostrarComentarios);
} else {
  mostrarComentarios(true);
}

function generarEstrellas(score) {
  const maxStars = 5; // Número máximo de estrellas
  let estrellasHTML = '';

  for (let i = 1; i <= maxStars; i++) {
    if (i <= score) {
      estrellasHTML += '<span class="fa fa-star checked"></span>'; // Estrella llena
    } else {
      estrellasHTML += '<span class="far fa-star"></span>'; // Estrella vacía
    }
  }

  return estrellasHTML;
}

function mostrarComentarios(mostrarTodos=false) {
let comments = JSON.parse(localStorage.getItem("comments")) || [];
let listaComentarios = document.getElementById('calif-container');

listaComentarios.innerHTML = ""
if (mostrarTodos===false) {
  comments = comments.slice(0,2);
}

comments.forEach(comment => {
  let commentDiv = document.createElement('div');
  commentDiv.classList.add('container');

  // Crear una fila para Usuario y Fecha
  let userFechaRow = document.createElement('div');
  userFechaRow.classList.add('row');

  let usuario = document.createElement('div');
  usuario.classList.add('col-6', 'order-1', 'text-start'); // Usuario a la derecha
  usuario.textContent = `${comment.user}`;
  
  let fecha = document.createElement('div');
  fecha.classList.add('col-6', 'order-2', 'text-muted', 'text-start'); // Fecha a la izquierda
  fecha.textContent = `${new Date(comment.dateTime).toLocaleDateString()}`;

  // Añadir usuario y fecha a la misma fila
  userFechaRow.appendChild(usuario);
  userFechaRow.appendChild(fecha);

  // Crear una fila para Calificación y Comentario
  let calificacionComentarioRow = document.createElement('div');
  calificacionComentarioRow.classList.add('row');

  let calificacion = document.createElement('div');
  calificacion.classList.add('col-6', 'order-1');
  calificacion.innerHTML = `${generarEstrellas(comment.score)}`;

  let comentario = document.createElement('div');
  comentario.classList.add('col-6', 'text-muted', 'order-2');
  comentario.textContent = `${comment.description}`;

  // Añadir calificación y comentario a la misma fila
  calificacionComentarioRow.appendChild(calificacion);
  calificacionComentarioRow.appendChild(comentario);

  // Añadir ambas filas al div principal
  commentDiv.appendChild(userFechaRow);
  commentDiv.appendChild(calificacionComentarioRow);

  // Añadir el comentario al contenedor de comentarios
  listaComentarios.appendChild(commentDiv);
});
}

const stars = document.querySelectorAll("#star-rating i");
const submitButton = document.getElementById("submit-button");
const commentBox = document.getElementById("comment-box");
stars.forEach(star => {
star.addEventListener("click", function () {
  stars.forEach(s => { s.classList.remove('fas');
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
  user: `${localStorage.getItem("username")}`,
  dateTime: new Date().toISOString(),
  description: commentBox.value
};

const existingComments = JSON.parse(localStorage.getItem("comments")) || [];
existingComments.unshift(newComment);
localStorage.setItem("comments", JSON.stringify(existingComments));
mostrarComentarios();
});

function verMasComentarios() {
  // Redirigir a la página de comentarios completos
  window.location.href = 'comentarios_completos.html';
}