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

//Insertar codigo de productos relacionados aqui


//---Codigo de calificaciones---

const productID = localStorage.getItem("selectedProductID");

let apiCommentsURL = `https://japceibal.github.io/emercado-api/products_comments/${productID}.json`;

fetch(apiCommentsURL)
.then((response) => response.json())
.then(data =>{
mostrarComentarios(data);
})
.catch(error =>{
console.error('Error al cargar los datos', error);
});

function mostrarComentarios(comments) {
let listaComentarios = document.getElementById('calif-container');
listaComentarios.innerHTML = '';

comments.forEach(comment => {
  let commentDiv = document.createElement('div');
  commentDiv.classList.add('comentario');

  let calificacion = document.createElement('p');
  calificacion.textContent = `Calificación: ${comment.score}`;
      
  let usuario = document.createElement('p');
    usuario.textContent = `Usuario: ${comment.user}`;

  let fecha = document.createElement('p');
    fecha.textContent = `Fecha: ${new Date(comment.dateTime).toLocaleDateString()}`;

  let comentario = document.createElement('p');
  comentario.textContent = `Comentario: ${comment.description}`;

  commentDiv.appendChild(calificacion);
  commentDiv.appendChild(usuario);
  commentDiv.appendChild(fecha);
  commentDiv.appendChild(comentario);

  listaComentarios.appendChild(commentDiv); 
});

}

const stars = document.querySelectorAll("#star-rating i");
const submitButton = document.getElementById("submit-button");
const commentBox = document.getElementById("comment-box");
stars.forEach(star => {
star.addEventListener("click", function () {
  stars.forEach(s => s.classList.remove('fas', 'far')); 
  const selectedValue = parseInt(this.getAttribute("data-value"));
  for (let i = 0; i < selectedValue; i++) {
    stars[i].classList.add('fas');
  }
});
});
function mostrarComentarios(comments) {
const listaComentarios = document.getElementById('calif-container');
comments.forEach(comment => {
  const commentDiv = document.createElement('div');
  commentDiv.classList.add('comentario');

  const calificacion = document.createElement('p');
  calificacion.textContent = `Calificación: ${comment.score}`;
    
  const usuario = document.createElement('p');
  usuario.textContent = `Usuario: ${comment.user}`;

  const fecha = document.createElement('p');
  fecha.textContent = `Fecha: ${new Date(comment.dateTime).toLocaleDateString()}`;

  const comentario = document.createElement('p');
  comentario.textContent = `Comentario: ${comment.description}`;

  commentDiv.appendChild(calificacion);
  commentDiv.appendChild(usuario);
  commentDiv.appendChild(fecha);
  commentDiv.appendChild(comentario);

  listaComentarios.appendChild(commentDiv);
});
}

submitButton.addEventListener("click", function () {
const score = Array.from(stars).filter(star => star.classList.contains('fas')).length;

const newComment = {
  score: score,
  user: "Usuario Ejemplo",
  dateTime: new Date().toISOString(),
  description: commentBox.value
};

mostrarComentarios([newComment]);
commentBox.value = '';
stars.forEach(star => star.classList.remove('fas'));
stars.forEach(star => star.classList.add('far'));
});
