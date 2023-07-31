const socket = io({
  autoConnect: false,
});

let user;

const chatBox = document.getElementById("chatBox");

Swal.fire({
  title: "identificate",
  text: "para acceder al chat coloca tu username",
  icon: "question",
  input: "text",
  inputValidator: (value) => {
    return !value && "necesitas registrarte antes de ingresar";
  },
  allowOutsideClick: false,
  allowEscapeKey: false,
}).then((result) => {
  user = result.value;
  socket.connect();
  socket.emit("authenticated", user);
});

chatBox.addEventListener("keyup", (evt) => {
  if (evt.key === "Enter") {
    if (chatBox.value.trim().length > 0) {
      socket.emit("message", { user, message: chatBox.value.trim() });
    }
  }
});

const sendButton = document.getElementById("sendButton");
sendButton.addEventListener("click", () => {
  if (chatBox.value.trim().length > 0) {
    socket.emit("message", { user, message: chatBox.value.trim() });
  }
});

socket.on("logs", (data) => {
  const logs = document.getElementById("logs");
  let message = "";
  data.forEach((log) => {
    message += `${log.user} dice: ${log.message}<br/>`;
  });
  logs.innerHTML = message;
});

socket.on("newUserConnected", (data) => {
  if (!user) return;
  Swal.fire({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    title: `${data} se unio al chat`,
    icon: "success",
  });
});
