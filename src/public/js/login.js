const form = document.getElementById("loginForm");

console.log(document.cookie);

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));
  const response = await fetch("/api/sessions/login", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const responseData = await response.json();
  console.log(responseData);
  if (responseData.status === "success") {
    Swal.fire({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      title: `Logueado!`,
      icon: "success",
    });
    if (responseData.payload.role === "admin") {
      window.location.replace("/manager");
    } else if (responseData.payload.role === "premium") {
      window.location.replace("/manager");
    } else {
      window.location.replace("/");
    }
  } else {
    Swal.fire({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      title: `Usuario o clave incorrectos`,
      icon: "error",
    });
  }
});
