$(document).ready(function () {

    // Variables in the global runtime
    const game = {
        level: {
            name: "easy",
            row: 10,
            column: 10,
            mine: 10,
        },
        board: [],
        mineLeft: 0,
        timer: 120,
        gameOver: false,
        colors: {
            0: "light grey",
            1: "dodgerBlue",
            2: "tomato",
            3: "black",
            4: "orange",
            5: "violet",
            6: "slateBlue",
            7: "grey",
            8: "pink",
            closedCell: "green",
        }
    }

    // DOM Events
    const boardContainer = $("#board-container");
    const mineLeftCounter = $("#mineLeft");


    function initGame() {
        // function create 2D array board
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
        game.gameOver = false;

        // function generateMines
        while (game.mineLeft < game.level.mine) {
            const randomRow = Math.floor(Math.random() * game.level.row);
            const randomColumn = Math.floor(Math.random() * game.level.column);
            if (!game.board[randomRow][randomColumn].hasMine) {
                game.board[randomRow][randomColumn].hasMine = true;
                game.board[randomRow][randomColumn].mineAround = 0;
                game.mineLeft++;
                surroundMine(randomRow, randomColumn);
            }
        }
        console.log(game.board);
        console.log(game.mineLeft);
    }

    function surroundMine(row, column) {
        addOneMine(row - 1, column - 1);
        addOneMine(row - 1, column);
        addOneMine(row - 1, column + 1);

        addOneMine(row, column - 1);
        addOneMine(row, column + 1);

        addOneMine(row + 1, column - 1);
        addOneMine(row + 1, column);
        addOneMine(row + 1, column + 1);
    }

    function addOneMine(row, column) {
        if (row >= 0 && row < game.level.row && column >= 0 && column < game.level.column) {
            if (!game.board[row][column].hasMine) {
                game.board[row][column].mineAround += 1;
            }
        }
    }

    initGame();

    function createCell() {
        for (i = 0; i < game.level.row; i++) {
            const newRow = $(`<div class="row" id="row-${i}"></div>`);
            for (y = 0; y < game.level.column; y++) {
                let newCell = "";
                if (game.board[i][y].hasMine) {
                    newCell = $(`<div class="col" id="${i}-${y}">mine</div>`);
                } else {
                    const mineAround = game.board[i][y].mineAround;
                    newCell = $(`<div class="col" id="${i}-${y}">${mineAround}</div>`);
                    newCell.css("color", game.colors[mineAround])
                }
                newCell.css("border-style", "dotted");
                newRow.append(newCell);
            }
            boardContainer.append(newRow);
        }
    }

    mineLeftCounter.html(`${game.mineLeft}`);
    createCell();

    boardContainer.on("click", function (e) {
        const getCellId = e.target.id;
        const splitId = getCellId.split("-");
        const row = splitId[0];
        const column = splitId[1];
        game.board[row][column].isOpened = true;
        console.log(game.board[row][column]);
    })

});