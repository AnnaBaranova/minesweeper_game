const game = {
    level: {
        name: easy,
        row: 10,
        column: 10,
        mine:5,
    },
    board: [],
    mineLeft:0,
    timer: 120,
    gameOver: false,
    colors: {
        0: "white",
        1: "blue",
        2: "red",
        3: "black",
        closedCell: "green",
    }
}


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