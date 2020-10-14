// 8x8 grid
function createGrid() {
    // TODO: Render 8x8 grid to be used for gameboard
    const container = document.getElementById("container");

    let text = document.createElement("h1");
    text.innerHTML = "Add grid here";

    container.appendChild(text);
}

createGrid();