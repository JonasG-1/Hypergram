const fileInput = document.getElementById("file-input");
const collapseButton = document.getElementById("collapse");
const saveButton = document.getElementById("save-button");
const sidePanel = document.getElementById("side");
let sideCollapsed = false;

const brightnessSlide = document.getElementById("brightness");
const contrastSlide = document.getElementById("contrast");
const transparentSlide = document.getElementById("transparent");
const canvas = document.getElementById("display");
let imageLoaded;

let image = new Image();
let ctx = canvas.getContext("2d");

function loadDocument() {
    updateRanges();
}

fileInput.addEventListener("change", function (event) {
    if (event.target.files) {
        let file = event.target.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function (event) {
            image.src = event.target.result;
            image.onload = function () {
                let info = document.getElementById("info");
                info.style.display = "none";
                canvas.style.display = "inline";
                canvas.width = image.width;
                canvas.height = image.height;
                ctx.drawImage(image, 0, 0);
                imageLoaded = true;
                resetRanges();
            }
        }
    }
});

saveButton.addEventListener("click", function () {
    if (imageLoaded) {
        let imageURL = canvas.toDataURL();
        let link = document.createElement('a');
        link.download = 'result.png';
        link.href = imageURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
});

brightnessSlide.addEventListener("change", function () {
    slideEvent();
});

contrastSlide.addEventListener("change", function () {
    slideEvent();
});

transparentSlide.addEventListener("change", function () {
    slideEvent();
});

function slideEvent() {
    updateRanges();
    if (imageLoaded) {
        calculateColors();
    }
}

function calculateColors() {
    let contrast = parseInt(contrastSlide.value);
    let brightness = parseInt(brightnessSlide.value);
    let transparency = parseFloat(transparentSlide.value);
    let contrastFactor = 259 * (255 + contrast) / (255 * (259 - contrast));
    ctx.drawImage(image, 0, 0);
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let pixels = imageData.data;

    for (let i = 3; i < pixels.length; i += 4) {
        for (let j = 1; j < 4; j++) {
            pixels[i-j] = truncate(contrastFactor * (pixels[i-j] - 128) + 128 + brightness);
        }
        pixels[i] *= transparency;
    }

    imageData.data = pixels;
    ctx.putImageData(imageData, 0, 0);
}

function truncate(number) {
    if (number > 255) {
        number = 255;
    } else if (number < 0) {
        number = 0;
    }
    return number;
}

function updateRanges() {
    let bright = parseInt(brightnessSlide.value);
    updateTextContent("brightness-display", bright);
    let contr = parseInt(contrastSlide.value);
    updateTextContent("contrast-display", contr);
    let transp = parseFloat(transparentSlide.value);
    updateTextContent("transparent-display", transp);
}

function resetRanges() {
    brightnessSlide.value = 0;
    contrastSlide.value = 0;
    transparentSlide.value = 1;
    updateRanges();
}

function updateTextContent(id, text) {
    const element = document.getElementById(id);
    element.textContent = text;
}

collapseButton.addEventListener("click", function () {
    let controlPanel = document.getElementById("control");
    let sidePanel = document.getElementById("side");
    if (sideCollapsed) {
        collapseButton.textContent = ">";
        sidePanel.style.minWidth = "25vw";
        controlPanel.style.display = "flex";
        sideCollapsed = false;
    } else {
        controlPanel.style.display = "none";
        collapseButton.textContent = "<";
        sidePanel.style.minWidth = "10vh";
        sideCollapsed = true;
    }
});

saveButton.addEventListener("mouseover", function () {
    sidePanel.classList.remove("restore");
    sidePanel.classList.add("animate");
});

saveButton.addEventListener("mouseout", function () {
    sidePanel.classList.remove("animate");
    sidePanel.classList.add("restore");
});

sidePanel.addEventListener("mouseleave", function () {
    sidePanel.classList.remove("restore");
});