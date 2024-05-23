let ws = new WebSocket("ws://127.0.0.1:3200");

let button = document.getElementById("send");
let messageInput = document.getElementById("message");

button.onclick = (_e) => {
    console.log("Button has been clicked.");
    ws.send(messageInput.value);
}

