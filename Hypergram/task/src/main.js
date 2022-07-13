const fileInput = document.getElementById("file-input");
const collapseButton = document.getElementById("collapse");
const saveButton = document.getElementById("save-button");
const sidePanel = document.getElementById("side");
let sideCollapsed = false;

fileInput.addEventListener("change", function (event) {
    if (event.target.files) {
        let file = event.target.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onloadend = function (event) {
            let image = new Image();
            image.src = event.target.result;
            image.onload = function () {
                let canvas = document.getElementById("display");
                let ctx = canvas.getContext("2d");
                let info = document.getElementById("info");
                info.style.display = "none";
                canvas.style.display = "inline";
                canvas.width = image.width;
                canvas.height = image.height;
                ctx.drawImage(image, 0, 0,);
            }
        }
    }
});

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



