const boardContainer = $("#board-container")

function createCell() {
    for (i = 0; i < 3; i++) {
        const newRow = $(`<div class="row" id="row-${i}"></div>`);
        for (y = 0; y < 3; y++) {
            const newCell = $(`<div class="col" id="${i}-${y}">col</div>`);
            newRow.append(newCell);
        }
        boardContainer.append(newRow);
    }
}

createCell();