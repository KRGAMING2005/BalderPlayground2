let preview = document.getElementById("preview");
let userId = document.getElementById("userId").innerText;

require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.27.0/min/vs' } });

require(['vs/editor/editor.main'], function () {
    monaco.editor.defineTheme('vs-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {}
    });

    var editor = monaco.editor.create(document.getElementById('editor-container'), {
        value: 'console.log("Hello World");',
        language: 'typescript',
        theme: 'vs-dark'
    });

    editor.onDidChangeModelContent((e) => {
        preview.src = preview.src + "";
        let JSONData = { user: userId, fileContents: editor.getValue().split("\n") };
        ws.send(JSON.stringify(JSONData));
    })
    
});