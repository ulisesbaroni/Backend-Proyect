const form = document.getElementById("registerForm");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));
  Swal.fire({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    title: `Procesando...`,
    icon: "info",
    timer: 2500,
  });
  
  const response = await fetch("/api/sessions/register", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "content-type": "application/json",
    },
  });

  const resposeData = await response.json();
  if (resposeData.status === "success") {
    Swal.fire({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      title: `Usuario registrado con éxito, por favor inicia sesión!`,
      icon: "success",
    });
    setTimeout(() => {
      window.location.replace("/login");
    }, 3000);
  } else {
    Swal.fire({
      toast: false,
      position: "center",
      showConfirmButton: false,
      timer: 4000,
      title: `ERROR`,
      text: "Ocurrio un error con el registro, verifica que el correo sea válido y la contraseña cumpla con los requisitos!",
      icon: "error",
    });
  }
});
