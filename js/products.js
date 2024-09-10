document.addEventListener("DOMContentLoaded", function () {
    var todosProductos = [];
    var mostrarDatos = (productos, terminoBusqueda = "") => {
        let htmlContent = "";

        // Si hay un término de búsqueda, se filtran los productos
        const productosFiltrados = filtrarProductos(productos, terminoBusqueda);

        for (let i = 0; i < productosFiltrados.length; i++) {
            let productoFiltrado = productosFiltrados[i];
            htmlContent += `
            <div id="divJS">
                <p id="imagen">
                    <img src="${productoFiltrado.image}" alt="imagen del producto" height="300px" width="450px" border="2px"/>
                </p>
                <p id="nombre"> ${productoFiltrado.name} </p>
                <p id="descripcion"> ${productoFiltrado.description} </p>
                <br>
                <p id="precio"> Precio: $${productoFiltrado.cost} </p>
                <p id="vendidos"> Unid. Vendidas: + ${productoFiltrado.soldCount} </p>
            </div>
            `;
        }
        let contenedor = document.getElementById("divContenedor");
        contenedor.innerHTML = htmlContent;
    };

    //Funcion de filtrado
    function filtrarProductos(productos, terminoBusqueda) {
        return productos.filter(producto => {
            return producto.name.toLowerCase().includes(terminoBusqueda.toLowerCase()) || producto.description.toLowerCase().includes(terminoBusqueda.toLowerCase())

        })
    }

    const catID = localStorage.getItem("catID");
    if (catID) {
        const BASE_URL = "https://japceibal.github.io/emercado-api/cats_products/";
        const DATA_AUTOS = `${BASE_URL}${catID}.json`;

        fetch(DATA_AUTOS)
            .then(response => response.json())
            .then(data => {
                console.log("Datos crudos de la API:", data);
                todosProductos = data.products;
                mostrarDatos(todosProductos); //Mostramos todos los productos inicialmente
            })
            .catch(error => {
                console.error("Error al obtener los datos", error);
            });
    } else {
        console.error("No se encontró el identificador de categoría en el almacenamiento local.");
    }

    // El siguiente codigo es la logica del input de busqueda
    const input = document.getElementById("searchInput");
    // const boton = document.getElementById("button");
    input.addEventListener("input", () => {
        mostrarDatos(todosProductos, input.value); // Usamos los productos almacenados para el filtrado
    });
});