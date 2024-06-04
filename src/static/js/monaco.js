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

    editor.onDidChangeModelContent(() => {
        preview.src = preview.src + "";
        let JSONData = { user: userId, fileContents: editor.getValue().split("\n") };
        ws.send(JSON.stringify(JSONData));
    })
    
});