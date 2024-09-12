document.addEventListener("DOMContentLoaded", function () {
    var todosProductos = [];
    
    let minPriceInput = document.getElementById("minPrecio");
    let maxPriceInput = document.getElementById("maxPrecio");
    let filterBtn = document.getElementById("filterBtn");
    let sortAscBtn = document.getElementById("sortAsc");
    let sortDescBtn = document.getElementById("sortDesc");
    let sortByCountBtn = document.getElementById("sortByCount");
    
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

    function filtrarProductos(productos, terminoBusqueda) {
        return productos.filter(producto => {
            return producto.name.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
                producto.description.toLowerCase().includes(terminoBusqueda.toLowerCase());
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
            .then(response => response.json())
            .then(data => {
                todosProductos = data.products;
                mostrarDatos(todosProductos); // Mostrar todos los productos inicialmente
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

    // Filtrar por rango de precio
    filterBtn.addEventListener("click", () => {
        const minPrecio = parseFloat(minPriceInput.value) || 0;
        const maxPrecio = parseFloat(maxPriceInput.value) || Infinity;
        mostrarDatos(todosProductos, input.value, { min: minPrecio, max: maxPrecio });
    });

    document.querySelectorAll('input[name="options"]').forEach(input => {
        input.addEventListener("change", () => {
            const criterio = input.id;
            const productosOrdenados = ordenarProductos(todosProductos, criterio);
            mostrarDatos(productosOrdenados, document.getElementById("searchInput").value); // Mantener el filtro de búsqueda
        });
    });
});