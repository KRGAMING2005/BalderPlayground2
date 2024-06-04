/**
* BalderJS
* version 7.2.1 (2024-04-26)
* Mattias Steinwall
* Baldergymnasiet, Skellefteå, Sweden
*/
//
// Canvas
//
/**
 * The canvas element. Fills the available space on the screen.
 * @example
 * Change the background color:
 * ```
 * canvas.style.backgroundColor = "purple"
 * ```
 * @example
 * Move focus to the canvas:
 * ```
 * canvas.focus()
 * ```
 */
const canvas = document.getElementById("canvas");
/**
 * The canvas 2D rendering context. Makes it possible to draw and manipulate
 * graphics on the `canvas`.
 * @example
 * Draw a filled yellow half-ellipse:
 * ```
 * ctx.ellipse(100, 100, 100, 50, radians(45), 0, radians(180))
 * ctx.fillStyle = "yellow"
 * ctx.fill()
 * ```
 */
const ctx = canvas.getContext("2d");
/**
 * Returns the width, in pixels, of the canvas. See also `H`.
 * @example
 * Draw a circle in the middle of the canvas:
 * ```
 * circle(W / 2, H / 2, 100)
 * ```
 * @example
 * Draw a line from the top left corner to the bottom right corner of the canvas.
 * ```
 * line(0, 0, W, H)
 * ```
 */
let W;
/**
 * Returns the height, in pixels, of the canvas. See also `W`.
 * @example
 * Draw a circle in the middle of the canvas:
 * ```
 * circle(W / 2, H / 2, 100)
 * ```
 * @example
 * Draw a line from the top left corner to the bottom right corner of the canvas.
 * ```
 * line(0, 0, W, H)
 * ```
 */
let H;
const _color = getComputedStyle(document.body).color; // 7.2
/**
 * Draws a circle on the canvas with center in (`x`, `y`).
 * @example
 * Draw a filled circle with default color (`black`):
 * ```
 * circle(100, 50, 50)
 * ```
 * @example
 * Draw a filled red circle:
 * ```
 * circle(100, 50, 50, "red")
 * ```
 * @example
 * Draw a blue circle with a line width of 5 pixels:
 * ```
 * circle(100, 50, 50, "blue", 5)
 * ```
 */
function circle(x, y, radius, color = _color, lineWidth) {
    ctx.beginPath();
    ctx.ellipse(x, y, radius, radius, 0, 0, 2 * Math.PI);
    if (lineWidth != null) {
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;
        ctx.stroke();
    }
    else {
        ctx.fillStyle = color;
        ctx.fill();
    }
}
/**
 * Clears the canvas.
 * @example
 * Clear the canvas:
 * ```
 * clear()
 * ```
 * @example
 * Clear a rectangular part of the canvas with upper left corner in (`100`, `50`):
 * ```
 * clear(100, 50, 400, 300)
 * ```
 */
function clear(x = 0, y = 0, width = W, height = H) {
    ctx.clearRect(x, y, width, height);
}
/**
 * Fills the canvas with given color.
 * @example
 * ```
 * fill("blue")
 * ```
*/
function fill(color = _color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, W, H);
}
/**
 * Gets color information, as a 4-tuple, for given pixel.
 * Values `r`(ed), `g`(reen), `b`(lue) and `a`(lpha) are all in the interval 0 to 255.
 * @example
 * ```
 * circle(50, 100, 30, randomItem("red", "green", "blue"))
 * let pixel = getPixel(50, 100)
 * text("r: " + pixel[0], 0)
 * text("g: " + pixel[1], 100)
 * text("b: " + pixel[2], 200)
 * text("a: " + pixel[3], 300)
 * ```
*/
function getPixel(x, y) {
    return Array.from(ctx.getImageData(x, y, 1, 1).data);
}
const _images = {};
function _loadImage(path) {
    return new Promise((resolve, reject) => {
        if (_images[path] === undefined) {
            _images[path] = new Image();
            _images[path].src = path;
            _images[path].addEventListener("load", () => resolve());
            _images[path].addEventListener("error", () => reject(new Error(`'${path}' can not be loaded`)));
        }
        else if (_images[path].complete) {
            resolve();
        }
        else {
            _images[path].addEventListener("load", () => resolve());
        }
    });
}
/**
 * Draws an image on the canvas, with (`x`, `y`) in the upper left corner.
 * @example
 * Draw an image with its intrinsic (own) size:
 * ```
 * image("assets/chess/black_bishop.png", 100, 100)
 * ```
 * @example
 * Draw an image with given size:
 * ```
 * image("assets/chess/black_bishop.png", 200, 100, 30, 40)
 * ```
 * @example
 * Wait for the image to be drawn before executing next line:
 * ```
 * await image("assets/chess/black_bishop.png", 200, 100, 30, 40)
 * line(200, 100, 230, 140, "red")
 * ```
 */
async function image(path, x = 0, y = 0, width, height) {
    await _loadImage(path);
    if (width && height) {
        ctx.drawImage(_images[path], x, y, width, height);
    }
    else {
        ctx.drawImage(_images[path], x, y);
    }
}
/**
 * Draws a polygon on the canvas with edges in the `points`-array.
 * @example
 * Draw a red diamond shape:
 * ```
 * polygon([[100, 100], [140, 160], [100, 220], [60, 160]], "red")
 * ```
 */
function polygon(points, color = _color, lineWidth) {
    ctx.beginPath();
    ctx.moveTo(...points[0]);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(...points[i]);
    }
    ctx.closePath();
    if (lineWidth != null) {
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;
        ctx.stroke();
    }
    else {
        ctx.fillStyle = color;
        ctx.fill();
    }
}
/**
 * Draws a line on the canvas between (`x1`, `y1`) and (`x2`, `y2`).
 * @example
 * Draw two thick blue lines across the canvas:
 * ```
 * line(0, 0, W, H, "blue", 20)
 * line(0, H, W, 0, "blue", 20)
 * ```
 */
function line(x1, y1, x2, y2, color = _color, lineWidth = 1) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
}
/**
 * Draws a rectangle on the canvas with upper left corner in (`x`, `y`).
 */
function rectangle(x, y, width, height, color = _color, lineWidth) {
    if (lineWidth != null) {
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;
        ctx.strokeRect(x, y, width, height);
    }
    else {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, width, height);
    }
}
/**
 * Draws `value` as a string on the canvas. The baseline is set by `y`.
 * Default font is `24px Consolas`.
 * @example
 * Draw 'Hello world!' with the lower left corner in (`100`, `50`):
 * ```
 * text("Hello world!", 100, 50, 36, "red")
 * ```
 * @example
 * Draw 'abcd' right-aligned to the right:
 * ```
 * text("abcd", [W, "right"])
 * ```
 * @example
 * Draw 'abcd' center-aligned to the middle:
 * ```
 * text("abcd", [W / 2, "center"])
 * ```
 */
function text(value, // 7.2
x = 0, y = 24, font = 24, color = _color, lineWidth) {
    ctx.font = (typeof font == "number") ? font + "px consolas,monospace" : font;
    const _text = String(value);
    if (typeof x != "number") {
        const w = ctx.measureText(_text).width;
        switch (x[1]) {
            case "left":
                x = x[0];
                break;
            case "center":
                x = x[0] - w / 2;
                break;
            case "right":
                x = x[0] - w;
                break;
        }
    }
    if (lineWidth != null) {
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;
        ctx.strokeText(_text, x, y);
    }
    else {
        ctx.fillStyle = color;
        ctx.fillText(_text, x, y);
    }
}
/**
 * Draws a triangle on the canvas with corners in (`x1`, `y1`), (`x2`, `y2`) and (`x3`, `y3`).
 * @example
 * Draw a triangle with corners in (`100`, `50`), (`200`, `50`) and (`200`, `150`).
 * ```
 * triangle(100, 50, 200, 50, 200, 150)
 * ```
 * @example
 * Draw a red rectangle:
 * ```
 * triangle(100, 150, 200, 150, 200, 250, "red")
 * ```
 * @example
 * Draw a blue triangle with line width 2:
 * ```
 * triangle(100, 250, 200, 250, 200, 350, "blue", 2)
 * ```
 */
function triangle(x1, y1, x2, y2, x3, y3, color = _color, lineWidth) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();
    if (lineWidth != null) {
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;
        ctx.stroke();
    }
    else {
        ctx.fillStyle = color;
        ctx.fill();
    }
}
/**
 * An object for keyboard input.
 *
 * @example
 * ```
 * setUpdate(() => {
 *     clear()
 *     if (keyboard.w) {
 *         text("key W")
 *     }
 * })
 * ```
 * @example
 * ```
 * setUpdate(() => {
 *     if (keyboard.r) {
 *         fill("red")
 *     }
 * })
 * ```
 */
const keyboard = {
    /**
     * Returns true if any key is pressed.
     * @example
     * setUpdate(() => {
     *     clear()
     *     if (keyboard.pressed) {
     *         text("Any key pressed!")
     *     }
     * })
    */
    get pressed() { return Object.keys(_keys).some(value => _keys[value] === true); },
    /**
     * Returns the standard value for the latest key pressed. It is not affected by the  keyboard layout.
      * @example
      * setUpdate(() => {
      *     clear()
      *     text(keyboard.keyName)
      * })
      */
    get keyName() { return _keyName; },
    /**
     * Returns the state of all keys.
     */
    get keys() { return _keys; },
    get enter() { return !!_keys["Enter"]; }, set enter(value) { _keys["Enter"] = value; },
    get space() { return !!_keys["Space"]; }, set space(value) { _keys["Space"] = value; },
    get left() { return !!_keys["ArrowLeft"]; }, set left(value) { _keys["ArrowLeft"] = value; },
    get up() { return !!_keys["ArrowUp"]; }, set up(value) { _keys["ArrowUp"] = value; },
    get right() { return !!_keys["ArrowRight"]; }, set right(value) { _keys["ArrowRight"] = value; },
    get down() { return !!_keys["ArrowDown"]; }, set down(value) { _keys["ArrowDown"] = value; },
    get a() { return !!_keys["KeyA"]; }, set a(value) { _keys["KeyA"] = value; },
    get b() { return !!_keys["KeyB"]; }, set b(value) { _keys["KeyB"] = value; },
    get c() { return !!_keys["KeyC"]; }, set c(value) { _keys["KeyC"] = value; },
    get d() { return !!_keys["KeyD"]; }, set d(value) { _keys["KeyD"] = value; },
    get e() { return !!_keys["KeyE"]; }, set e(value) { _keys["KeyE"] = value; },
    get f() { return !!_keys["KeyF"]; }, set f(value) { _keys["KeyF"] = value; },
    get g() { return !!_keys["KeyG"]; }, set g(value) { _keys["KeyG"] = value; },
    get h() { return !!_keys["KeyH"]; }, set h(value) { _keys["KeyH"] = value; },
    get i() { return !!_keys["KeyI"]; }, set i(value) { _keys["KeyI"] = value; },
    get j() { return !!_keys["KeyJ"]; }, set j(value) { _keys["KeyJ"] = value; },
    get k() { return !!_keys["KeyK"]; }, set k(value) { _keys["KeyK"] = value; },
    get l() { return !!_keys["KeyL"]; }, set l(value) { _keys["KeyL"] = value; },
    get m() { return !!_keys["KeyM"]; }, set m(value) { _keys["KeyM"] = value; },
    get n() { return !!_keys["KeyN"]; }, set n(value) { _keys["KeyN"] = value; },
    get o() { return !!_keys["KeyO"]; }, set o(value) { _keys["KeyO"] = value; },
    get p() { return !!_keys["KeyP"]; }, set p(value) { _keys["KeyP"] = value; },
    get q() { return !!_keys["KeyQ"]; }, set q(value) { _keys["KeyQ"] = value; },
    get r() { return !!_keys["KeyR"]; }, set r(value) { _keys["KeyR"] = value; },
    get s() { return !!_keys["KeyS"]; }, set s(value) { _keys["KeyS"] = value; },
    get t() { return !!_keys["KeyT"]; }, set t(value) { _keys["KeyT"] = value; },
    get u() { return !!_keys["KeyU"]; }, set u(value) { _keys["KeyU"] = value; },
    get v() { return !!_keys["KeyV"]; }, set v(value) { _keys["KeyV"] = value; },
    get w() { return !!_keys["KeyW"]; }, set w(value) { _keys["KeyW"] = value; },
    get x() { return !!_keys["KeyX"]; }, set x(value) { _keys["KeyX"] = value; },
    get y() { return !!_keys["KeyY"]; }, set y(value) { _keys["KeyY"] = value; },
    get z() { return !!_keys["KeyZ"]; }, set z(value) { _keys["KeyZ"] = value; }
};
let _keyName;
let _keys = {};
canvas.addEventListener("keydown", event => {
    event.preventDefault();
    if (_keys[event.code] !== false) {
        _keys[event.code] = true;
        _keyName = event.code;
    }
});
canvas.addEventListener("keyup", event => {
    _keys[event.code] = null;
});
/**
 * An object for input from mouse or other pointing device.
 */
const mouse = {
    get x() { return _mouseX; },
    get y() { return _mouseY; },
    get over() { return _mouseOver; },
    get left() { return !!_buttons[0]; }, set left(value) { _buttons[0] = value; },
    get right() { return !!_buttons[2]; }, set right(value) { _buttons[2] = value; },
    /**
     * Returns the state of all buttons.
     */
    get buttons() { return _buttons; }
};
let _mouseX;
let _mouseY;
let _mouseOver;
let _buttons = [];
canvas.addEventListener("mousedown", event => {
    event.preventDefault();
    canvas.focus();
    if (_buttons[event.button] !== false) {
        _buttons[event.button] = true;
    }
});
canvas.addEventListener("mouseup", event => {
    _buttons[event.button] = null;
});
canvas.addEventListener("mousemove", event => {
    const rect = canvas.getBoundingClientRect();
    _mouseX = event.clientX - rect.left;
    _mouseY = event.clientY - rect.top;
    _mouseOver = true;
});
canvas.addEventListener("mouseout", () => {
    _mouseOver = false;
    _buttons = []; // ?
});
canvas.addEventListener("contextmenu", event => {
    event.preventDefault();
});
canvas.addEventListener("wheel", event => {
    event.preventDefault();
});
/**
 * An object for input from touch screen.
 */
const touchscreen = {
    get x() { return _touches.length > 0 ? _touches[0].x : null; },
    get y() { return _touches.length > 0 ? _touches[0].y : null; },
    get touches() {
        return _touches;
    },
    get touched() { return _touches.length > 0; }
};
let _touches = [];
function _touchHandler(event) {
    event.preventDefault();
    canvas.focus();
    const rect = canvas.getBoundingClientRect();
    _touches = [];
    for (let i = 0; i < event.touches.length; i++) {
        _touches[i] = {
            x: event.touches[i].clientX - rect.left,
            y: event.touches[i].clientY - rect.top,
            identifier: event.touches[i].identifier
        };
    }
}
canvas.addEventListener("touchstart", _touchHandler);
canvas.addEventListener("touchend", _touchHandler);
canvas.addEventListener("touchmove", _touchHandler);
class Cell {
    row;
    column;
    x;
    y;
    width;
    height;
    _textColor;
    _color = null;
    _image = null;
    _text = null;
    _custom = null;
    /**
     * Additional info about this cell.
     */
    tag;
    constructor(row, column, x, y, width, height, _textColor) {
        this.row = row;
        this.column = column;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this._textColor = _textColor;
    }
    get color() {
        return this._color;
    }
    set color(value) {
        this._color = value;
        this.draw();
    }
    get image() {
        return this._image;
    }
    set image(value) {
        this._image = value;
        this.draw();
    }
    get text() {
        return this._text;
    }
    set text(value) {
        if (value == null) {
            this._text = null;
        }
        else if (typeof value == "string") {
            this._text = value;
        }
        else {
            [this._text, this._textColor] = value;
        }
        this.draw();
    }
    get textColor() {
        return this._textColor;
    }
    get custom() {
        return this._custom;
    }
    set custom(value) {
        this._custom = value;
        this.draw();
    }
    async draw() {
        clear(this.x, this.y, this.width, this.height);
        if (this._color) {
            rectangle(this.x + 0.5, this.y + 0.5, this.width - 1, this.height - 1, this._color);
        }
        if (this._image) {
            await image(this._image, this.x, this.y, this.width, this.height);
        }
        if (this._text) {
            text(this._text, [this.x + this.width / 2, "center"], this.y + this.height * 0.8, this.height, this._textColor);
        }
        if (this._custom) {
            this._custom(this);
        }
    }
}
class Grid {
    rows;
    columns;
    x;
    y;
    width;
    height;
    color;
    lineWidth;
    activatable = true;
    _activeCell = null;
    cells = [];
    cellWidth;
    cellHeight;
    constructor(rows, columns, x = 0, y = 0, width = W - x, height = H - y, color = _color, lineWidth = 1) {
        this.rows = rows;
        this.columns = columns;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.lineWidth = lineWidth;
        this.cellWidth = (width - (columns + 1) * lineWidth) / columns;
        this.cellHeight = (height - (rows + 1) * lineWidth) / rows;
        for (let i = 0; i < rows; i++) {
            this.cells[i] = [];
            for (let j = 0; j < columns; j++) {
                this.cells[i][j] = new Cell(i, j, x + j * (this.cellWidth + lineWidth) + lineWidth, y + i * (this.cellHeight + lineWidth) + lineWidth, this.cellWidth, this.cellHeight, color);
            }
        }
        this.draw();
    }
    /**
     * Returns cell at position [`rowIndex`][`columnIndex`].
     */
    cell(rowIndex, columnIndex) {
        return this.cells[rowIndex][columnIndex];
    }
    /**
     * Applies the `callback`-function to each cell.
     */
    forEach(callback) {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                callback(this.cells[i][j]);
            }
        }
    }
    /**
     * Returns `true` if a cell was either clicked or touched. Otherwise `false`.
     */
    get activated() {
        const m = mouse.buttons[0] || mouse.buttons[2]; // 7.1.1
        if (m || touchscreen.touched) {
            if (this.activatable) {
                let x = touchscreen.x;
                let y = touchscreen.y;
                if (m) {
                    x = mouse.x;
                    y = mouse.y;
                }
                this._activeCell = this.cellFromPoint(x, y);
                this.activatable = false;
                return !!this._activeCell;
            }
            else {
                return false;
            }
        }
        this.activatable = true;
        return false;
    }
    /**
     * Returns the active cell, possibly `null`.
     */
    get activeCell() {
        return this._activeCell;
    }
    /**
     * Returns the cell containing (`x`, `y`), possibly `null`.
     */
    cellFromPoint(x, y) {
        if ((x - this.x - this.lineWidth + this.cellWidth + this.lineWidth) % (this.cellWidth + this.lineWidth) < this.cellWidth &&
            (y - this.y - this.lineWidth + this.cellHeight + this.lineWidth) % (this.cellHeight + this.lineWidth) < this.cellHeight) {
            const column = Math.floor((x - this.x) / (this.cellWidth + this.lineWidth));
            const row = Math.floor((y - this.y) / (this.cellHeight + this.lineWidth));
            if (column >= 0 && column < this.columns && row >= 0 && row < this.rows) {
                return this.cells[row][column];
            }
        }
        return null;
    }
    /**
     * Draws this grid.
     */
    draw() {
        if (this.color) {
            rectangle(this.x, this.y, this.width, this.height, this.color);
        }
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                this.cells[i][j].draw();
            }
        }
    }
}
class Hitbox {
    x;
    y;
    width;
    height;
    tag;
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    /**
     * Returns `true` if this hitbox intersects `other` hibox.
     */
    intersects(other) {
        return (this.x + this.width > other.x &&
            this.x < other.x + other.width &&
            this.y + this.height > other.y &&
            this.y < other.y + other.height);
    }
    /**
     * Returns `true` if this hitbox contains (`x`, `y`).
     */
    contains(x, y) {
        return (this.x + this.width > x &&
            this.x <= x &&
            this.y + this.height > y &&
            this.y <= y);
    }
    drawOutline(color = _color) {
        rectangle(this.x, this.y, this.width, this.height, color, 1);
    }
}
class Sprite extends Hitbox {
    spritesheetPath;
    rows;
    columns;
    index = 0;
    remainingTime;
    _frames;
    _finished = false;
    _framesPerSecond; // 7.2
    /**
     * Set to `false` if sprite shouldn't loop.
     */
    loop = true; // 7.2.1
    constructor(spritesheetPath, rows, columns) {
        super(0, 0, 0, 0);
        this.spritesheetPath = spritesheetPath;
        this.rows = rows;
        this.columns = columns;
        this._frames = array(rows * columns, i => i);
        this.framesPerSecond = 12;
    }
    // 7.2
    set frames(value) {
        if (value.length != this._frames.length || value.some((v, i) => v != this._frames[i]))
            this.index = 0;
        this._frames = value;
    }
    // 7.2.1
    set framesPerSecond(value) {
        this._framesPerSecond = value;
        this.remainingTime = 1000 / value;
    }
    get framesPerSecond() {
        return this._framesPerSecond;
    }
    // 7.2.1
    get finished() {
        return this._finished;
    }
    // 7.2.1
    get frame() {
        return this._frames[this.index];
    }
    async update() {
        this.remainingTime -= DT;
        if (this.remainingTime < 0) {
            if (this.index >= this._frames.length - 1) {
                if (this.loop) {
                    this.index = 0;
                }
                else {
                    this._finished = true;
                }
            }
            else {
                this.index++;
            }
            this.remainingTime += 1000 / this._framesPerSecond;
        }
        await this.draw();
    }
    async draw() {
        await _loadImage(this.spritesheetPath);
        const frameWidth = _images[this.spritesheetPath].width / this.columns;
        const frameHeight = _images[this.spritesheetPath].height / this.rows;
        if (this.width == 0)
            this.width = frameWidth;
        if (this.height == 0)
            this.height = frameHeight;
        const sx = frameWidth * (this._frames[this.index] % this.columns);
        const sy = frameHeight * Math.floor(this._frames[this.index] / this.columns);
        ctx.drawImage(_images[this.spritesheetPath], sx, sy, frameWidth, frameHeight, this.x, this.y, this.width, this.height);
    }
    async getImages() {
        await _loadImage(this.spritesheetPath);
        const _frameCanvas = document.createElement("canvas");
        const _frameCtx = _frameCanvas.getContext("2d");
        const frameWidth = _frameCanvas.width = _images[this.spritesheetPath].width / this.columns;
        const frameHeight = _frameCanvas.height = _images[this.spritesheetPath].height / this.rows;
        const paths = [];
        for (const frame of this._frames) {
            const sx = frameWidth * (frame % this.columns);
            const sy = frameHeight * Math.floor(frame / this.columns);
            _frameCtx.clearRect(0, 0, frameWidth, frameHeight);
            _frameCtx.drawImage(_images[this.spritesheetPath], sx, sy, frameWidth, frameHeight, 0, 0, frameWidth, frameHeight);
            paths.push(_frameCanvas.toDataURL("image/png"));
        }
        return paths;
    }
}
class Turtle {
    x;
    y;
    heading;
    container = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    turtle = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    points = [];
    _color = _color;
    _size = 1;
    /**
     * The delay, in milliseconds, between changes in state (movements and rotations).
     */
    delay = 100;
    /**
     * Create a turtle.
     *
     * @example
     * Creates a turtle in the middle of the canvas, headed east (default settings):
     * ```
     * let t = new Turtle()
     * ```
     * @example
     * Creates a turtle at (`100`, `200`), headed north:
     * ```
     * let t = new Turtle(100, 200, -90)
     * ```
     *
     */
    constructor(x = W / 2, y = H / 2, heading = 0) {
        this.x = x;
        this.y = y;
        this.heading = heading;
        document.body.appendChild(this.container);
        this.container.appendChild(this.turtle);
        this.container.setAttribute("width", "20");
        this.container.setAttribute("height", "20");
        this.container.style.position = "absolute";
        // this.turtle.setAttribute("points", "0,0 10,10, 0,20");      // ?
        this.turtle.setAttribute("fill", this._color); // ?
        this.turtle.setAttribute("stroke", this._color);
        this.turtle.setAttribute("stroke-width", "1");
        this.move();
        this.turn();
    }
    /**
     * The state of the turtle as a 3-tuple.
     *
     * @example
     * Get the position and heading of turtle `t`:
     * ```
     * let [x, y, heading] = t.state
     * ```
     * @example
     * Place turtle `t` at (`100`, `200`) headed south:
     * ```
     * t.state = [100, 200, 90]
     * ```
    */
    get state() {
        return [this.x, this.y, this.heading];
    }
    set state(value) {
        [this.x, this.y, this.heading] = value;
        this.move();
        this.turn();
    }
    /**
     * The color of this turtle. Used when drawing and filling.
     */
    get color() {
        return this._color;
    }
    set color(value) {
        this._color = value;
        this.turtle.setAttribute("fill", this._color);
    }
    get size() {
        return this._size;
    }
    set size(value) {
        this._size = value;
        this.container.setAttribute("width", String(20 * this._size));
        this.container.setAttribute("height", String(20 * this._size));
        this.turn();
    }
    move() {
        const style = getComputedStyle(canvas);
        const offsetLeft = canvas.offsetLeft + parseFloat(style.borderLeftWidth) + parseFloat(style.paddingLeft);
        const offsetTop = canvas.offsetTop + parseFloat(style.borderTopWidth) + parseFloat(style.paddingTop);
        this.container.style.left = (offsetLeft + this.x - 10 * this._size) + "px";
        this.container.style.top = (offsetTop + this.y - 10 * this._size) + "px";
        if (this.points.length > 0) {
            this.points.push([this.x, this.y]);
        }
    }
    turn() {
        const [x0, y0] = [10 * this._size, 10 * this._size];
        const [x1, y1] = pointFromPolar(10 * this._size, this.heading + 150, x0, y0);
        const [x2, y2] = pointFromPolar(6 * this._size, this.heading + 180, x0, y0);
        const [x3, y3] = pointFromPolar(10 * this._size, this.heading - 150, x0, y0);
        this.turtle.setAttribute("points", `${x0},${y0} ${x1},${y1} ${x2},${y2} ${x3},${y3}`);
    }
    /**
     * Move this turtle `length` pixels in the direction it is headed.
     * If `trace` is false moves without drawing.
     */
    async forward(length, trace = true) {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        this.x += Math.cos(radians(this.heading)) * length;
        this.y += Math.sin(radians(this.heading)) * length;
        if (trace) {
            ctx.lineTo(this.x, this.y);
            ctx.strokeStyle = this.color;
            ctx.lineWidth = this.size;
            ctx.stroke();
        }
        else {
            ctx.moveTo(this.x, this.y);
        }
        this.move();
        await sleep(this.delay);
    }
    /**
     * Move this turtle `length` pixels in the direction opposite it is headed.
     * If `trace` is false moves without drawing.
     */
    async backward(length, trace = true) {
        this.forward(-length, trace);
    }
    /**
     * Turn this turtle `degAngle` degrees clockwise.
     */
    async right(degAngle = 90) {
        this.heading += degAngle;
        this.turn();
        await sleep(this.delay);
    }
    /**
     * Turn this turtle `degAngle` degrees counterclockwise.
     */
    async left(degAngle = 90) {
        await this.right(-degAngle);
    }
    hide() {
        this.container.style.display = "none";
    }
    beginFill() {
        this.points = [[this.x, this.y]];
    }
    endFill() {
        polygon(this.points, this._color);
        this.points = [];
    }
}
//
// Updates
//
let DT;
let _update = () => { };
let _timestamp0;
function _updateHandler(timestamp) {
    DT = timestamp - _timestamp0;
    _timestamp0 = timestamp;
    _update();
    requestAnimationFrame(_updateHandler);
}
requestAnimationFrame(timestamp => _timestamp0 = timestamp);
requestAnimationFrame(_updateHandler);
/**
 * Runs the `update`-function once for every screen update.
 * @example
 * Draw a circle at random postiton each update:
 * ```
 * setUpdate(() => {
 *     circle(randomInt(W), randomInt(H), 10)
 * })
 * ```
 * @example
 * Count the number of updates between two space pressings.
 * ```
 * text("Press space twice.")
 * setUpdate(() => {
 *     if (keyboard.space) {
 *         keyboard.space = false
 *         let n = 0
 *
 *         setUpdate(() => {
 *             clear()
 *             n++
 *             text(n)
 *
 *             if (keyboard.space) {
 *                 setUpdate()
 *             }
 *         })
 *     }
 * })
 * ```
 */
function setUpdate(update = () => { }) {
    canvas.focus(); // 7.1.1
    _update = update;
}
function array(length, value = null) {
    return Array.from({ length: length }, (_, i) => typeof value == "function" ? value(i) : value); // 7.1
}
function array2D(rows, columns, value = null) {
    return Array.from({ length: rows }, (_, i) => Array.from({ length: columns }, (_, j) => typeof value == "function" ? value(i, j) : value)); // 7.1
}
let _audioContext;
const _audioList = [];
/**
 * Plays a beep. A user interaction is mandatory.
 * @example
 * Beeps for two seconds:
 * ```
 * let f = +await read("Frequency (Hz): ")
 * beep(f, 2000)
 * ```
 */
function beep(frequency = 800, msDuration = 200, volume = 1) {
    if (!_audioContext)
        _audioContext = new AudioContext();
    return new Promise(resolve => {
        let audioItem = _audioList.find(item => item[0].frequency.value == frequency);
        if (!audioItem) {
            const oscillator = _audioContext.createOscillator();
            const gain = _audioContext.createGain();
            oscillator.connect(gain);
            oscillator.type = "square";
            gain.connect(_audioContext.destination);
            oscillator.frequency.value = frequency;
            oscillator.start();
            audioItem = [oscillator, gain];
            _audioList.push(audioItem);
            oscillator.onended = () => {
                _audioList.splice(_audioList.indexOf(audioItem), 1);
                resolve();
            };
        }
        audioItem[1].gain.value = volume;
        audioItem[0].stop(_audioContext.currentTime + msDuration * 0.001);
    });
}
/**
 * Returns the character corresponding to character code `charCode`.
 * @example
 * ```
 * write(char(65))      // A
 * ```
 */
function char(charCode) {
    return String.fromCodePoint(charCode);
}
/**
 * Returns the character code corresponding to character `char`.
 * @example
 * ```
 * write(charCode("A"))      // 65
 * ```
*/
function charCode(char) {
    return char.codePointAt(0);
}
/**
 * Returns `radAngle`, an angle in radians, to degrees.
 * @example
 * ```
 * write(degrees(Math.PI))      // 180
 * ```
 */
function degrees(radAngle) {
    return radAngle * 180 / Math.PI;
}
/**
 *  Returns the distance between (`x1`, `y1`) and (`x2`, `y2`).
 */
function distance(x1, y1, x2, y2) {
    return Math.hypot(x2 - x1, y2 - y1);
}
/**
 * Returns the point with polar coordinates (`radius`, `degAngle`).
 */
function pointFromPolar(radius, degAngle, x0 = 0, y0 = 0) {
    const a = radians(degAngle);
    return [x0 + Math.cos(a) * radius, y0 + Math.sin(a) * radius];
}
/**
 * Returns `degAngle`, an angle in degrees, to radians.
 * @example
 * ```
 * write(radians(180))      // 3.141592653589793
 * ```
 */
function radians(degAngle) {
    return degAngle * Math.PI / 180;
}
function randomInt(m, n) {
    return Math.floor(n != null ? m + Math.random() * (n - m + 1) : Math.random() * m);
}
/**
 * Returns a random item from `items`, the argument list.
 * @example
 * A random color:
 * ```
 * let color = randomItem("red", "green", "blue")
 * ```
 */
function randomItem(...items) {
    return items[randomInt(items.length)];
}
/**
 * Returns a RGBA color.
 * Values `r`(ed), `g`(reen) and `b`(lue) are integers in the interval 0 to 255.
 * Value `a`(lpha) is between `0` and `1`.
 */
function rgba(r, g, b, a = 1) {
    return `rgba(${r}, ${g}, ${b}, ${a})`;
}
/**
 * Shuffles `array` in place.
 */
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = randomInt(i + 1);
        [array[i], array[j]] = [array[j], array[i]];
    }
}
/**
 * Pauses the execution för `msDuration` ms.
 * @example
 * Show a green screen after 3 seconds:
 * ```
 * fill("red")
 * await sleep(3000)
 * fill("green")
 * ```
 */
function sleep(msDuration) {
    return new Promise(resolve => setTimeout(() => resolve(), msDuration));
}
class Vector {
    x;
    y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    static fromPolar(length, angle) {
        return new Vector(Math.cos(angle) * length, Math.sin(angle) * length);
    }
    get length() {
        return Math.hypot(this.x, this.y);
    }
    set length(value) {
        const angle = this.angle;
        this.x = value * Math.cos(angle);
        this.y = value * Math.sin(angle);
    }
    get angle() {
        return Math.atan2(this.y, this.x);
    }
    set angle(value) {
        const length = this.length;
        this.x = length * Math.cos(value);
        this.y = length * Math.sin(value);
    }
    clone() {
        return new Vector(this.x, this.y);
    }
    normalize() {
        const angle = this.angle;
        this.x = Math.cos(angle);
        this.y = Math.sin(angle);
    }
    toNormalized() {
        const angle = this.angle;
        return new Vector(Math.cos(angle), Math.sin(angle));
    }
    add(v) {
        this.x += v.x;
        this.y += v.y;
    }
    toAdded(v) {
        return new Vector(this.x + v.x, this.y + v.y);
    }
    subtract(v) {
        this.x -= v.x;
        this.y -= v.y;
    }
    toSubtracted(v) {
        return new Vector(this.x - v.x, this.y - v.y);
    }
    multiply(v) {
        this.x *= v.x;
        this.y *= v.y;
    }
    toMultiplied(v) {
        return new Vector(this.x * v.x, this.y * v.y);
    }
    divide(v) {
        this.x /= v.x;
        this.y /= v.y;
    }
    toDivided(v) {
        return new Vector(this.x / v.x, this.y / v.y);
    }
    scale(s) {
        this.x *= s;
        this.y *= s;
    }
    toScaled(s) {
        return new Vector(this.x * s, this.y * s);
    }
    distanceTo(v) {
        return Math.hypot(this.x - v.x, this.y - v.y);
    }
    directionTo(v) {
        const angle = Math.atan2(v.y - this.y, v.x - this.x);
        return new Vector(Math.cos(angle), Math.sin(angle));
    }
    dot(v) {
        return this.x * v.x + this.y * v.y;
    }
    toString() {
        return `(${this.x}, ${this.y})`;
    }
}
//
// I/O
//
const io = document.getElementById("io");
const _params = new URL(location.href).searchParams;
const _iParam = _params.get("i"); // input
let _inputLines = [];
let _inputLineIndex = 0;
let _output$;
let _outputValue = "";
if (_iParam != null) {
    _inputLines = decodeURIComponent(_iParam).split("\n");
}
// if (_params.get("dark") != null) {  // ?
//     document.body.style.backgroundColor = "#121212";
//     document.body.style.color = "white";
// }
/**
 * Writes the `prompt`, and waits for user input. Hides the canvas.
 * @example
 * ```
 * let name = await read("Your name? ")
 * ```
 */
function read(prompt = "") {
    ui.style.flex = ""; // 7.1
    const input$ = element("div", prompt, io);
    input$.className = "input";
    _output$ = null;
    return new Promise((resolve) => {
        if (_inputLines[_inputLineIndex] != null) {
            element("b", _inputLines[_inputLineIndex], input$);
            resolve(_inputLines[_inputLineIndex++]);
        }
        else {
            const value$ = element("b", input$);
            value$.contentEditable = "true";
            value$.focus();
            input$.onclick = () => value$.focus();
            value$.onkeydown = event => {
                if (event.code == "Enter") {
                    event.preventDefault();
                    value$.contentEditable = "false";
                    _inputLines[_inputLineIndex] = value$.textContent;
                    resolve(_inputLines[_inputLineIndex++]);
                }
            };
        }
    });
}
/**
 * Writes `value` to the screen. No new line if second argument, `newline`, is `false`. Hides the canvas.
 *
 * @example
 * ```
 * write("On row 1.")
 * write("On row 2.")
 * ```
 * @example
 * ```
 * write("On row 1. ", false)
 * write("Also on row 1.")
 * ```
 * @example
 * ```
 * write()  // Line break
 * ```
 */
function write(value, newLine = true) {
    if (!_output$) {
        ui.style.flex = ""; // 7.1
        _output$ = element("div", io);
        _output$.className = "output";
    }
    // 7.1
    if (arguments.length > 0) {
        if (typeof value == "object" && ((value != null && Object.getPrototypeOf(value) === Object.prototype) || Array.isArray(value))) {
            value = JSON.stringify(value);
        }
        else {
            value = String(value);
        }
        if (newLine)
            value = value.trimEnd() + "\n";
    }
    else {
        value = "\n";
    }
    _output$.textContent += value;
    _outputValue += value;
}
/**
 * @deprecated Use `write` instead.
 *
 * Writes `value`, converted to JSON-format, to the screen. Hides the canvas.
 */
function writeJSON(value) {
    write(JSON.stringify(value));
}
/**
 * Clears the `io`-element (containg user input/output).
 */
function clearIO() {
    io.innerHTML = "";
    _output$ = null;
    canvas.style.display = "none"; // 7.1
    if (ui.hasChildNodes())
        ui.style.flex = "1"; // 7.1    
}
window.addEventListener("load", () => {
    const oParam = _params.get("o"); // output
    if (oParam != null) {
        const resp$ = element("p", io);
        resp$.className = "output";
        resp$.style.color = "black";
        const oValue = decodeURIComponent(oParam);
        _outputValue = _outputValue.trimEnd();
        if (_outputValue == oValue) {
            resp$.style.backgroundColor = "palegreen";
            resp$.textContent = _outputValue;
        }
        else {
            let offset = 0;
            while (_outputValue[offset] == oValue[offset]) {
                offset++;
            }
            // 7.1
            let correct = oValue.slice(0, offset);
            let incorrect = oValue.slice(offset) + " ".repeat(Math.max(0, _outputValue.length - oValue.length));
            resp$.innerHTML = `<span style="background-color: palegreen">${correct}</span>`;
            resp$.innerHTML += `<span style="background-color: lightsalmon">${incorrect}</span>`;
        }
    }
    const testParam = _params.get("test");
    if (testParam != null) {
        let test$ = element("div", document.body);
        element("button", "from: program", element("p", test$)).onclick = () => {
            _params.set("i", encodeURIComponent(_inputLines?.join("\n")));
            _params.set("o", encodeURIComponent(_outputValue.trimEnd()));
            _params.delete("test");
            window.open(window.location.origin + "?" + _params, "_blank");
        };
        let testInput$ = element("textarea", "input:", test$);
        testInput$.rows = 4;
        element("input:file", test$).oninput = (e) => {
            const fr = new FileReader();
            fr.onload = (e) => {
                testInput$.value = e.target.result;
            };
            fr.readAsText(e.target.files[0]);
        };
        let testOutput$ = element("textarea", "output:", test$);
        testOutput$.rows = 4;
        element("input:file", test$).oninput = (e) => {
            const fr = new FileReader();
            fr.onload = (e) => {
                testOutput$.value = e.target.result.trimEnd();
            };
            fr.readAsText(e.target.files[0]);
        };
        element("button", "from: text", element("p", test$)).onclick = () => {
            _params.set("i", encodeURIComponent(testInput$.value));
            _params.set("o", encodeURIComponent(testOutput$.value.trimEnd()));
            _params.delete("test");
            window.open(window.location.origin + "?" + _params, "_blank");
        };
    }
});
//
// UI
//
const ui = document.getElementById("ui");
/**
 * Shows the canvas and recalculates width (`W`) and height (`H`).
 */
function resetCanvas() {
    canvas.style.display = null;
    ui.style.flex = ""; // 7.1
    canvas.width = W = parseInt(getComputedStyle(canvas).width);
    canvas.height = H = parseInt(getComputedStyle(canvas).height);
    ctx.lineCap = "round"; // 7.2
    canvas.focus(); // 7.1
}
canvas.tabIndex = 0;
resetCanvas();
function element(tagName, arg1, arg2, arg3) {
    let elt;
    let classes = [];
    if (Array.isArray(arg1)) {
        classes = arg1.slice(1);
        arg1 = arg1[0];
    }
    if (typeof arg1 == "string") {
        if (["input", "meter", "output", "progress", "select", "textarea"].includes(tagName.split(":")[0])) {
            const label$ = element("label", arg2, arg3);
            element("span", arg1, label$);
            let position = ["input:checkbox", "input:radio"].includes(tagName) ? "right" : "top";
            let display = "block";
            for (const c of classes) {
                if (["top", "right", "bottom", "left"].includes(c))
                    position = c;
                if (["block", "inline"].includes(c))
                    display = c;
            }
            label$.className = position + " " + display;
            return element(tagName, label$);
        }
        elt = document.createElement(tagName);
        if (tagName == "fieldset") {
            element("legend", arg1, elt);
        }
        else if (tagName == "details") {
            element("summary", arg1, elt);
        }
        else if (tagName == "table") {
            element("caption", arg1, elt);
        }
        else {
            elt.textContent = arg1;
        }
    }
    else {
        [arg3, arg2] = [arg2, arg1];
        if (tagName.startsWith("input:")) {
            elt = document.createElement("input");
            elt.type = tagName.slice(6);
        }
        else {
            elt = document.createElement(tagName);
        }
    }
    const parent = arg2 ?? ui;
    parent.insertBefore(elt, parent.insertBefore(document.createTextNode("\n"), arg3 ?? null));
    if (tagName == "input:radio") {
        elt.name = _getLegend(parent);
    }
    canvas.style.display = "none";
    if (!io.hasChildNodes())
        ui.style.flex = "1"; // 7.1
    return elt;
}
function _getLegend(elt) {
    if (elt instanceof HTMLBodyElement)
        return " ";
    if (elt instanceof HTMLFieldSetElement && elt.firstElementChild instanceof HTMLLegendElement)
        return elt.firstElementChild.textContent;
    return _getLegend(elt.parentElement);
}
/**
 * Gets the label for `labeledElement`.
 */
function getLabel(labeledElement) {
    return labeledElement.previousElementSibling.textContent;
}
/**
 * Sets the label for `labeledElement`.
 */
function setLabel(labeledElement, value) {
    labeledElement.previousElementSibling.textContent = value;
}
/**
 * Sets the location of `elt`.
 */
function setLocation(elt, settings) {
    if (elt.parentElement instanceof HTMLLabelElement) {
        elt = elt.parentElement;
    }
    elt.style.position = "absolute";
    for (const [key, value] of Object.entries(settings)) {
        elt.style[key] = value + (typeof value == "number" ? "px" : "");
    }
}
// 
// Error handling
//
let _errNr = 0;
const _error$ = document.createElement("output");
document.body.append(_error$);
_error$.className = "error";
window.onerror = (_event, _source, _lineno, _colno, error) => {
    _error$.value = `(#${++_errNr}) ${error}`;
    _error$.focus();
    _error$.onclick = () => {
        _error$.innerHTML = "";
    };
};
window.addEventListener("unhandledrejection", event => {
    throw event.reason;
});
//# sourceMappingURL=balder.js.map