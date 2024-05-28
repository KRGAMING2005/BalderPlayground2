let ws = new WebSocket("ws://127.0.0.1:3200");

let preview = document.getElementById("preview");

ws.onmessage = (e) => {
    console.log(e.data);
    if (e.data.reload) preview.src = preview.src + "";
}