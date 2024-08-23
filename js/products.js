document.addEventListener("DOMContentLoaded", function() {

    let DATA_autos = "https://japceibal.github.io/emercado-api/cats_products/101.json" // url que contiene los datos a mostrar
    
    let contenedor = document.getElementById("divContenedor");
    
    const mostrarDatos = (data) => {
        console.log(data);
        for (let i = 0; i < data.products.length; i++) {
            contenedor.innerHTML +=
            `
            <div id="divJS">
            <p id="imagen">
            <img src= "${data.products[i].image}" alt= "imagen del producto" height=300px width=450px border=2px/>
            </p>
            <p id="nombre"> ${data.products[i].name} </p>
            <p id="descripcion"> ${data.products[i].description} </p>
            <br>
            <p id="precio"> Precio: $${data.products[i].cost} </p>
            <p id="vendidos"> Unid. Vendidas: + ${data.products[i].soldCount} </p>
            </div>
            `;
        }
    };
    
    fetch(DATA_autos)
        .then((response) => response.json())
        .then((data) => {
            mostrarDatos(data);
        })
        .catch((error) => {
            console.error("Error al obtener los datos", error);
         });
        });