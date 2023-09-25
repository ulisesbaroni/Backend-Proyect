//agrego el producto al carrito

const addToCartButtons = document.getElementsByClassName("add-to-cart-button");
Array.from(addToCartButtons).forEach((button) => {
  button.addEventListener("click", async (event) => {
    const productId = event.target.id;
    const data = {
      productId: productId,
    };
    fetch("/api/products/addProduct", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "success") {
          Swal.fire({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2000,
            title: `Producto agregado al carrito!`,
            icon: "success",
          });
        } else {
          Swal.fire({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2000,
            title: `No puedes agregar tus propios productos!`,
            icon: "error",
          });
        }
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  });
});