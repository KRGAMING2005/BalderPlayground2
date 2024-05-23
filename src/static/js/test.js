let increase = document.getElementById("increase");
let decrease = document.getElementById("decrease");
let editor = document.getElementById("editor-container");

// Ensure a default width if not already set
if (!editor.style.width) {
    editor.style.width = "50dvw"; // Default width
}

increase.onclick = (_e) => {
    let currentWidth = parseInt(editor.style.width, 10);
    if (isNaN(currentWidth)) {
        currentWidth = 100; // Default width if parsing failed
    }
    currentWidth += 5;
    editor.style.width = currentWidth + "px";
    console.log(editor.style.width);
}

decrease.onclick = (_e) => {
    let currentWidth = parseInt(editor.style.width, 10);
    if (isNaN(currentWidth)) {
        currentWidth = 100; // Default width if parsing failed
    }
    currentWidth -= 5;
    editor.style.width = currentWidth + "px";
    console.log(editor.style.width);
}
