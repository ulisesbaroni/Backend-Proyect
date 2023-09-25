const premiumHandler = async (type) => {
    console.log(type);
    const data = { type: type };
    fetch("/api/users/premium", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.status === "success") {
          Swal.fire({
            toast: false,
            position: "center",
            showConfirmButton: false,
            timer: 3000,
            title: `Cambiaste tu role! a ${JSON.stringify(data.type)}
            Tu role cambiara la próxima vez que inicies sesión!`,
            icon: "success",
          });
        }
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };