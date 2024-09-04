document.addEventListener("DOMContentLoaded", function() {
    const catID = localStorage.getItem("catID");

    if (catID) {
        const BASE_URL = "https://japceibal.github.io/emercado-api/cats_products/";
        const DATA_AUTOS = `${BASE_URL}${catID}.json`;

        let contenedor = document.getElementById("divContenedor");

        const mostrarDatos = (data) => {
            console.log(data);
            let htmlContent = "";
            for (let i = 0; i < data.products.length; i++) {
                htmlContent += `
                <div id="divJS">
                    <p id="imagen">
                        <img src="${data.products[i].image}" alt="imagen del producto" height="300px" width="450px" border="2px"/>
                    </p>
                    <p id="nombre"> ${data.products[i].name} </p>
                    <p id="descripcion"> ${data.products[i].description} </p>
                    <br>
                    <p id="precio"> Precio: $${data.products[i].cost} </p>
                    <p id="vendidos"> Unid. Vendidas: + ${data.products[i].soldCount} </p>
                </div>
                `;
            }
            contenedor.innerHTML = htmlContent;
        };

        fetch(DATA_AUTOS)
            .then(response => response.json())
            .then(data => {
                mostrarDatos(data);
            })
            .catch(error => {
                console.error("Error al obtener los datos", error);
            });
    } else {
        console.error("No se encontró el identificador de categoría en el almacenamiento local.");
    }
});


