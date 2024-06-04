let ws = new WebSocket("ws://127.0.0.1:3200");

let preview = document.getElementById("preview");
let userId = document.getElementById("userId").innerText;

let baseContents = "console.log(\"This is base contents for the file\");";

require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.27.0/min/vs' } });

require(['vs/editor/editor.main'], function () {
    monaco.editor.defineTheme('vs-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {}
    });

    var editor = monaco.editor.create(document.getElementById('editor-container'), {
        value: baseContents,
        language: 'typescript',
        theme: 'vs-dark'
    });

    monaco.editor.lanugages.typescript.addExtraLibs(`
        declare function dot(x:number, y:number): void;
    `)

    editor.onDidChangeModelContent((e) => {
        preview.src = preview.src + "";
        let JSONData = { user: userId, fileContents: editor.getValue().split("\n") };
        ws.send(JSON.stringify(JSONData));
    })

    ws.onmessage = (e) => {
        let json = JSON.parse(e.data);
        if (json.reload) preview.src = preview.src + "";
        if (json.resume) {
            let content = json.content;
            let model = monaco.editor.createModel(content.join("\n"), "typescript");
            editor.setModel(model);
        }
    }
    
    ws.onopen = () => {
        ws.send(JSON.stringify({"resume": true, "userId": userId}));
    }
    
});