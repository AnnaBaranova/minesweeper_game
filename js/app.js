$(document).ready(function () {
   
     // Variables in the global runtime
    const game = {
    level: {
        name: "easy",
        row: 10,
        column: 10,
        mine: 5,
    },
    board: [],
    mineLeft: 0,
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

  // DOM Events
const boardContainer = $("#board-container")


function initGame (){
    for (i = 0; i < game.level.row; i++) {
        const newRow = [];
        for (y = 0; y < game.level.column; y++) {
            const cell = {
                isOpened: false,
                hasMine: false,
                hasFlag: false,
                mineAround: 0,
            }
            newRow.push(cell)
            
        }
        game.board.push(newRow);
    }
    console.log (game.board);
}

initGame();

function createCell() {
    for (i = 0; i < game.level.row; i++) {
        const newRow = $(`<div class="row" id="row-${i}"></div>`);
        for (y = 0; y < game.level.column; y++) {
            const newCell = $(`<div class="col" id="${i}-${y}">col</div>`);
            newRow.append(newCell);
        }
        boardContainer.append(newRow);
    }
}


createCell();

});