//WORLD MAP VARIABLES
//Constants
var mapWidthFraction = 0.7
var ratio = 1.6 // Original => map_img.width / map_img.height

//Variable data
var position = {
    x: 0,
    y: 0
}
var zoom = 1
var dragging = false

//Canvas & context
var map_canvas
var map_ctx

//Images
var map_img = new Image()
map_img.src = "assets/maps/2020-04-01_500.png"

var vector_img = new Image()
// vector_img.src = "brrr.svg"

//GRADIENT VARIABLES
//Constants
var barWidthFraction = 0.075

//Variable data
var bar_pos = 0
var drawFixedPoints = true

//Canvas
var bar_canvas
var bar_ctx

//Image
var bar_img = new Image()
bar_img.src = 'assets/components/colorbars/rainbow.png'

//SHARED FUNCTIONS
//Loads and scales canvases
window.onload = function () {
    //MAP
    //Initializes canvas
    map_canvas = document.getElementById("wmap")
    map_canvas.width = window.innerWidth * mapWidthFraction
    map_canvas.height = map_canvas.width / ratio
    map_canvas.onselectstart = function () {
        return false
    }
    
    //Creates graphical context
    map_ctx = map_canvas.getContext("2d")
    map_ctx.imageSmoothingEnabled = false
    map_ctx.mozImageSmoothingEnabled = false;
    map_ctx.webkitImageSmoothingEnabled = false;
    map_ctx.scale(zoom, zoom)   

    redraw()

    //Canvas hover listener
    map_canvas.onmousemove = function (event) {
        mapPos(event)
    }
    map_canvas.onmousedown = function (event) {
        dragging = true
        console.log(dragging)
    }
    map_canvas.onmouseup = function (event) {
        dragging = false
    }

    //BAR
    //Initializes canvas
    width = window.innerWidth * barWidthFraction
    height = map_canvas.height
    bar_canvas = document.getElementById("gbar")
    bar_canvas.width = width*window.devicePixelRatio
    bar_canvas.height = height*window.devicePixelRatio
    bar_canvas.style.width = width + "px";
    bar_canvas.style.height = height + "px";

    bar_canvas.onselectstart = function () {
        return false
    }

    //Creates graphical context
    bar_ctx = bar_canvas.getContext("2d")
    // bar_ctx.scale(1.25,1.25)
    drawBar()

    //Bar hover listeners
    bar_canvas.onmousemove = function (event) {
        drawDash()
    }
    bar_canvas.onmouseout = function (event) {
        resetText()
        drawFixedPoints = true
    }
}

function fixDPI() {
    var dpi = window.devicePixelRatio;
    css_h = +getComputedStyle(bar_canvas).getPropertyValue("height").slice(0, -2);
    css_w = +getComputedStyle(bar_canvas).getPropertyValue("width").slice(0, -2);
    // bar_canvas.setAttribute('height', css_h * dpi);
    bar_canvas.setAttribute('width', css_w * dpi);
}

//Resizes canvases to scale w/ screen 
window.onresize = function () {
    map_canvas.width = window.innerWidth * mapWidthFraction
    map_canvas.height = (map_canvas.width) / ratio

    // bar_canvas.width = window.innerWidth * barWidthFraction
    // bar_canvas.height = map_canvas.height

    width = window.innerWidth * barWidthFraction
    height = map_canvas.height
    bar_canvas.width = width*window.devicePixelRatio;
    bar_canvas.height = height*window.devicePixelRatio;
    bar_canvas.style.width = width + "px";
    bar_canvas.style.height = height + "px";

    redraw()
    drawBar()
    drawDash()
}


//WORLD MAP CODE
function boundsCheck() {
    scaledWidth = zoom > 1 ? 2 * map_canvas.width * (1 - (1 / zoom)) : map_canvas.width
    scaledHeight = 2 * map_canvas.height * (1 - (1 / zoom))

    document.querySelector(".coordx").textContent = "ScrollX: " + Math.floor(position.x)
    document.querySelector(".coordy").textContent = "ScrollY: " + Math.floor(position.y)

    if (position.x <= -map_canvas.width)
        position.x = 0
    if (position.y <= 0)
        position.y = 0
    if (position.x >= scaledWidth)
        position.x = -map_canvas.width
    if (position.y + scaledHeight / 2 >= scaledHeight)
        position.y = scaledHeight / 2
}

function redraw() {
    boundsCheck()

    map_ctx.setTransform(1, 0, 0, 1, 0, 0);
    map_ctx.scale(zoom, zoom)
    map_ctx.clearRect(0, 0, map_canvas.width, map_canvas.height)

    map_ctx.drawImage(map_img, -position.x - map_canvas.width, -position.y, map_canvas.width, map_canvas.height)
    map_ctx.drawImage(map_img, -position.x, -position.y, map_canvas.width, map_canvas.height)
    map_ctx.drawImage(map_img, -position.x + map_canvas.width, -position.y, map_canvas.width, map_canvas.height)

    // map_ctx.drawImage(vector_img,-position.x-map_canvas.width,-position.y,map_canvas.width+1,map_canvas.height)
    // map_ctx.drawImage(vector_img,-position.x,-position.y,map_canvas.width+1,map_canvas.height)
    // map_ctx.drawImage(vector_img,-position.x+map_canvas.width,-position.y,map_canvas.width+1,map_canvas.height)
}

function mapPos(event) {
    mouseX = Math.round((event.x - map_canvas.getBoundingClientRect().left + (position.x * zoom)) * (1 / zoom))

    document.querySelector(".width").textContent = "W: " + map_canvas.width
    if (mouseX >= 0 && mouseX < map_canvas.width)
        document.querySelector(".mx").textContent = "MouseX: " + mouseX
    else if (mouseX < 0)
        document.querySelector(".mx").textContent = "MouseX: " + (mouseX + map_canvas.width)
    else if (mouseX >= map_canvas.width)
        document.querySelector(".mx").textContent = "MouseX: " + (mouseX - map_canvas.width)

    document.querySelector(".height").textContent = "W: " + map_canvas.height
    mouseY = Math.round((event.y - map_canvas.getBoundingClientRect().top + (position.y *zoom)) * (1 / zoom))
    document.querySelector(".my").textContent = "MouseY: " + mouseY
}

//Drag and tap event handling for map (Uses interact.js)
interact('#wmap')
    .draggable({
        inertia: true,
        dragend: redraw,
        onmove(event) {
            //Updates position to drag (scaled by zoom) and redraws canvas from position
            position.x -= event.dx / zoom
            position.y -= event.dy / zoom
            redraw()
        },
        cursorChecker() {
            // don't set a cursor for drag actions
            return true
        }
    })
    .on('tap', function (e) {
        mapPos(e) //Listens for tap event on map and p
    })


//GRADIENT BAR CODE
//Ratios
var gradientScale = 0.95 //Possible values => (0,1]
var dashScale = 0.95 //Possible values => (.5,((1-gradientScale)/2)+gradientScale)]
var yScale = ((1 - gradientScale) / 2)

var gradFractionalWidth = 10 / 36
var dashFractionalWidth = 2 / 36
var gapFractionalWidth = 1 / 36
var textFractionalWidth = 22 / 36

//Scaled value range
var minVal = 0;
var maxVal = 100;

function barPos() {
    return Math.round(event.clientY - bar_canvas.getBoundingClientRect().top)*window.devicePixelRatio
}

interact('#gbar')
    .on('tap', function (event) {})

function drawBar() {
    bar_ctx.drawImage(bar_img, 0, bar_canvas.height * yScale, bar_canvas.width * gradFractionalWidth, bar_canvas.height * gradientScale)
    resetText()
}

function resetText() {
    var startX = bar_canvas.width * gradFractionalWidth
    var endX = bar_canvas.width

    bar_ctx.clearRect(startX, 0, endX, bar_canvas.height) //Clears Dashes & Text

    bar_ctx.fillStyle = "#1C3942" //Sets fill color for text
    bar_ctx.font = "1.25em neue-haas-grotesk-text"

    //Sets variables for fixed-points
    x = bar_canvas.width * (gradFractionalWidth + gapFractionalWidth)
    y = bar_canvas.height * (1 - dashScale)
    w = bar_canvas.width * dashFractionalWidth
    bY = bar_canvas.height * dashScale - 1

    tX = bar_canvas.width * (1 - textFractionalWidth)

    if (drawFixedPoints) {
        //Draws Min-Val Fixed Point
        bar_ctx.fillRect(x, y, w, 2)
        bar_ctx.fillText(minVal + "° C", tX, y + 8)

        //Draws Max-Val Fixed Point
        bar_ctx.fillRect(x, bY, w, 2)
        bar_ctx.fillText(maxVal + "° C", tX, bY + 8)
    }

}

function drawDash() {
    //Calculates horizontal positions for dash and text based on fractions of canvas width
    var textX = bar_canvas.width * (1 - textFractionalWidth)
    var dashX = bar_canvas.width * (gradFractionalWidth + gapFractionalWidth)

    //Sets initial position for draw to canvas
    var drawPos = barPos()
    var adjPos = Math.floor(drawPos - bar_canvas.height * (1 - dashScale)) //Y-position but dash-start is set to 0
    var y0 = Math.floor(bar_canvas.height * yScale)

    //Scales dash-points to dataset
    var steps = Math.floor(bar_canvas.height * (dashScale)) - bar_canvas.height * (1 - dashScale)
    var step_calc = (maxVal - minVal) / steps
    var displayPos = ((step_calc * adjPos + minVal).toFixed(1))

    resetText() //Clear bar for redraw

    bar_ctx.fillStyle = "#657A80" //Sets fill for dash
    bar_ctx.font = "italic 1.25em neue-haas-grotesk-text"

    var smallDashScale = dashScale - 0.03
    if (drawPos >= bar_canvas.height * (1 - smallDashScale) && drawPos <= bar_canvas.height * smallDashScale - 1) {
        drawFixedPoints = true
        bar_ctx.fillRect(dashX, drawPos, bar_canvas.width * dashFractionalWidth, 2)

        bar_ctx.fillStyle = "#1C3942" //Sets fill for text
        bar_ctx.fillText(displayPos + "°", textX, drawPos + 9)
    } else if (barPos() - y0 >= 0) { //Keeps top-most dash going upwards past dashScale
        drawFixedPoints = false
        bar_ctx.fillRect(dashX, drawPos, bar_canvas.width * dashFractionalWidth, 2)

        bar_ctx.fillStyle = "#1C3942" //Sets fill for text
        bar_ctx.fillText(displayPos + "°", textX, drawPos + 9)
    } else if (barPos() - bar_canvas.height * gradientScale - y0 <= 0) { //Keeps bottom-most dash going downwards past dashScale

    }
}