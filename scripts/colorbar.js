//GRADIENT VARIABLES
//Constants
var barWidthFraction = 0.0725

//Variable data
var bar_pos = 0
var drawFixedTop = true
var drawFixedBottom = true

//Canvas
var bar_canvas
var bar_ctx

//Image
var bar_img = new Image()
bar_img.src = 'assets/components/colorbars/rainbow.png'

window.onload = function () {
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
        drawFixedTop = drawFixedBottom = true
    }
}

window.onresize = function () {
    width = window.innerWidth * barWidthFraction
    height = map_canvas.height
    bar_canvas.width = width*window.devicePixelRatio;
    bar_canvas.height = height*window.devicePixelRatio;
    bar_canvas.style.width = width + "px";
    bar_canvas.style.height = height + "px";

    drawBar()
    drawDash()
}

//GRADIENT BAR CODE
//Ratios
var gradientScale = 0.95 //Possible values => (0,1] (smallest,largest]
var dashScale = 0.95 //Possible values => (.5,((1-gradientScale)/2)+gradientScale)] (smallest,largest]
var yScale = ((1 - gradientScale) / 2)

//Sets spacing for colorbar, gaps, dash, and text - Make sure fractions add up to 1
var gradFractionalWidth = 9 / 36
var dashFractionalWidth = 2 / 36
var gapFractionalWidth = 2 / 36 //x2 when adding up to 1
var textFractionalWidth = 22 / 36

//Scaled value range
var minVal = 100; //TODO: Switch minVal and maxVal in code
var maxVal = 0;

function barPos() {
    return Math.round(event.clientY - bar_canvas.getBoundingClientRect().top)*window.devicePixelRatio
}

interact('#gbar') //TODO: Mobile compatibility (Tap instead of hover)
    .on('tap', function (event) {})

function drawBar() {
    x = 0
    y = bar_canvas.height * yScale
    w = bar_canvas.width * gradFractionalWidth
    h = bar_canvas.height * gradientScale

    //Saves contexts and rounds borders
    bar_ctx.save()
    roundedImage(x, y, w, h, radius = 10)
    bar_ctx.clip()

    //Draws gradient bar and restores borders
    bar_ctx.drawImage(bar_img, x, y, w, h)
    bar_ctx.restore()

    resetText()
}

function resetText() {
    var startX = bar_canvas.width * gradFractionalWidth //End of colorbar (start of erase rect)
    var endX = bar_canvas.width //End of canvas (end of erase rect)

    bar_ctx.clearRect(startX, 0, endX, bar_canvas.height) //Clears region

    bar_ctx.fillStyle = "#1C3942" //Sets fill color for text
    bar_ctx.font = "1.25em neue-haas-grotesk-text" //TODO: Set single variable for font, scale with window.devicePixelRatio

    //Sets variables for fixed-points
    x = bar_canvas.width * (gradFractionalWidth + gapFractionalWidth) //TODO: Better variable names here
    y = bar_canvas.height * (1 - dashScale)
    w = bar_canvas.width * dashFractionalWidth
    bY = bar_canvas.height * dashScale - 1

    tX = bar_canvas.width * (1 - textFractionalWidth)

    if (drawFixedTop) {
        //Draws Min-Val Fixed Point
        bar_ctx.fillRect(x, y, w, 2)
        bar_ctx.fillText(minVal + "° C", tX, y + 8)
    }

    if (drawFixedBottom) {
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
        drawFixedBottom = drawFixedTop = true
        bar_ctx.fillRect(dashX, drawPos, bar_canvas.width * dashFractionalWidth, 2)

        bar_ctx.fillStyle = "#1C3942" //Sets fill for text
        bar_ctx.fillText(displayPos + "°", textX, drawPos + 9)
    } else if (barPos() - y0 >= 0) { //Keeps top-most dash going upwards past dashScale
        drawFixedTop = false
        drawFixedBottom = true
        bar_ctx.fillRect(dashX, drawPos, bar_canvas.width * dashFractionalWidth, 2)

        bar_ctx.fillStyle = "#1C3942" //Sets fill for text
        bar_ctx.fillText(displayPos + "°", textX, drawPos + 9)
    } else if (barPos() + bar_canvas.height * dashScale - 1 <= 0) { //Keeps bottom-most dash going downwards past dashScale
        alert("obama")
        drawFixedBottom = false
        drawFixedTop = true
        bar_ctx.fillRect(dashX, drawPos, bar_canvas.width * dashFractionalWidth, 2)

        bar_ctx.fillStyle = "#1C3942" //Sets fill for text
        bar_ctx.fillText(displayPos + "°", textX, drawPos + 9)
    }
    document.querySelector(".bar").textContent = "Bar: " + barPos()
}

function roundedImage(x, y, width, height, radius) { //Shoutout to the stackoverflow bois for this method
    bar_ctx.beginPath();
    bar_ctx.moveTo(x + radius, y);
    bar_ctx.lineTo(x + width - radius, y);
    bar_ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    bar_ctx.lineTo(x + width, y + height - radius);
    bar_ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    bar_ctx.lineTo(x + radius, y + height);
    bar_ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    bar_ctx.lineTo(x, y + radius);
    bar_ctx.quadraticCurveTo(x, y, x + radius, y);
    bar_ctx.closePath();
}