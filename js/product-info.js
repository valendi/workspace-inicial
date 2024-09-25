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