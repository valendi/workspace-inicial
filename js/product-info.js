document.addEventListener("DOMContentLoaded", function () {
    //constante product id con local storage
    const productID = localStorage.getItem("selectedProductID");
  
    if (productID) {
      fetch(`https://japceibal.github.io/emercado-api/products/${productID}.json`)
        .then((response) => response.json())
        .then((product) => {
          document.getElementById("product-name").textContent = product.name;
          document.getElementById("product-description").textContent = product.description;
          document.getElementById("category-name").textContent = product.category;
          document.getElementById("sold-quantity").textContent =
            product.soldCount;
  
          const imagesContainer = document.getElementById("product-images");
          imagesContainer.innerHTML = "";
          product.images.forEach((imageUrl) => {
            const img = document.createElement("img");
            img.src = imageUrl;
            img.classList.add("img-fluid");
            imagesContainer.appendChild(img);
          });
        })
        .catch((error) => console.error("Error fetching product data: ", error));
    } else {
      console.error("No product id found");
    }
  });