let ws = new WebSocket("ws://127.0.0.1:3200");

let preview = document.getElementById("preview");
let userId = document.getElementById("userId").innerText;

let baseContents = "console.log(\"This is base contents for the file\");";

ws.onmessage = (e) => {
    let json = JSON.parse(e.data);
    if (json.reload) preview.src = preview.src + "";
    if (json.resume) {
        let content = json.content;
        editor.value = content;
    }
}

ws.onopen = (e) => {
    ws.send(JSON.stringify({"resume": true, "userId": userId}));
}