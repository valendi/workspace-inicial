function setProductId(id) {
    localStorage.setItem("selectedProductID", id);
  }

document.addEventListener("DOMContentLoaded", function () {
    var todosProductos = [];
    
    let minPriceInput = document.getElementById("minPrecio");
    let maxPriceInput = document.getElementById("maxPrecio");
    let filterBtn = document.getElementById("filterBtn");
    let sortAscBtn = document.getElementById("sortAsc");
    let sortDescBtn = document.getElementById("sortDesc");
    let sortByCountBtn = document.getElementById("sortByCount");
    let searchInput = document.getElementById("searchInput");
    var mostrarDatos = (productos, terminoBusqueda = "", filtroPrecio = {}) => {
        let htmlContent = "";

        let productosFiltrados = filtrarProductos(productos, terminoBusqueda);

        // Filtrado por precio
        if (filtroPrecio.min || filtroPrecio.max) {
            const min = filtroPrecio.min || 0;
            const max = filtroPrecio.max || Infinity;
            productosFiltrados = productosFiltrados.filter(producto => producto.cost >= min && producto.cost <= max);
        }

        for (let i = 0; i < productosFiltrados.length; i++) {
            let productoFiltrado = productosFiltrados[i];
            htmlContent += `
                  <div id="divJS">
                  <a id="imgProduct" href="product-info.html" onclick="setProductId('${productoFiltrado.id}')">
                      <img class="imagenProduct" src="${productoFiltrado.image}" alt="imagen del producto"/>
                      </a>
                  <div id="divTexto">
                      <p id="nombre"> ${productoFiltrado.name} </p>
                      <p id="descripcion"> ${productoFiltrado.description} </p>
                      <br>
                      <p id="precio"> Precio: $${productoFiltrado.cost} </p>
                      <p id="vendidos"> Unid. Vendidas: + ${productoFiltrado.soldCount} </p>
                      </div>
                  </div>
                  `;
          }

        let contenedor = document.getElementById("divContenedor");
    if (contenedor) {
      contenedor.innerHTML = htmlContent;
    } else {
      console.error("El contenedor no se encontró en el DOM.");
    }
  };

    //Funcion de filtrado
  function filtrarProductos(productos, terminoBusqueda) {
    return productos.filter((producto) => {
      return (
        producto.name.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
        producto.description
          .toLowerCase()
          .includes(terminoBusqueda.toLowerCase())
      );
    });
  }

    // Función para ordenar productos
    const ordenarProductos = (productos, criterio) => {
        let productosOrdenados = [...productos]; // Crear copia de los productos para ordenarlos

        if (criterio === 'sortAsc') {
            productosOrdenados.sort((a, b) => a.cost - b.cost); // Orden ascendente por precio
        } else if (criterio === 'sortDesc') {
            productosOrdenados.sort((a, b) => b.cost - a.cost); // Orden descendente por precio
        } else if (criterio === 'sortByCount') {
            productosOrdenados.sort((a, b) => b.soldCount - a.soldCount); // Orden descendente por unidades vendidas
        }

        return productosOrdenados;
    };

    const catID = localStorage.getItem("catID");
  if (catID) {
    const BASE_URL = "https://japceibal.github.io/emercado-api/cats_products/";
    const DATA_AUTOS = `${BASE_URL}${catID}.json`;

    fetch(DATA_AUTOS)
      .then((response) => response.json())
      .then((data) => {
        console.log("Datos crudos de la API:", data);
        todosProductos = data.products;
        mostrarDatos(todosProductos); //Mostramos todos los productos inicialmente
      })
      .catch((error) => {
        console.error("Error al obtener los datos", error);
      });
  } else {
    console.error(
      "No se encontró el identificador de categoría en el almacenamiento local."
    );
  }

  // Búsqueda en tiempo real con filtro de precio
    searchInput.addEventListener("input", () => {
        const minPrecio = parseFloat(minPriceInput.value) || 0;
        const maxPrecio = parseFloat(maxPriceInput.value) || Infinity;
        mostrarDatos(todosProductos, searchInput.value, { min: minPrecio, max: maxPrecio });
    });

    // Filtrar por rango de precio cuando se hace clic en el botón "Filtrar"
    filterBtn.addEventListener("click", () => {
        const minPrecio = parseFloat(minPriceInput.value) || 0;
        const maxPrecio = parseFloat(maxPriceInput.value) || Infinity;
        mostrarDatos(todosProductos, searchInput.value, { min: minPrecio, max: maxPrecio });
    });

    // Ordenar productos
    document.querySelectorAll('input[name="options"]').forEach(input => {
        input.addEventListener("change", () => {
            const criterio = input.id;
            const productosOrdenados = ordenarProductos(todosProductos, criterio);
            const minPrecio = parseFloat(minPriceInput.value) || 0;
            const maxPrecio = parseFloat(maxPriceInput.value) || Infinity;
            mostrarDatos(productosOrdenados, searchInput.value, { min: minPrecio, max: maxPrecio }); // Mantener búsqueda y filtro de precios
        });
    });
});