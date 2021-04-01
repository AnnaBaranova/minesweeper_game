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
            3: "blue",
            4: "orange",
            5: "violet",
            6: "slateBlue",
            7: "grey",
            8: "pink",
            "closedCell": "green",
        }
    }

    // DOM selectors
    const $boardContainer = $("#board-container");
    const $mineLeftCounter = $("#mineLeft");
    const $restartGame = $("#restart-game");


    function initGame() {
        // function create 2D array board
        game.board = [];
        game.mineLeft = 0;
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



    function renderBoard() {
        $mineLeftCounter.html(`${game.mineLeft}`);
        $boardContainer.html("");
        for (i = 0; i < game.level.row; i++) {
            const newRow = $(`<div class="row" id="row-${i}"></div>`);
            for (y = 0; y < game.level.column; y++) {
                let newCell = "";
                if (game.board[i][y].isOpened) {
                    if (game.board[i][y].hasMine) {
                        newCell = $(`<div class="col" id="${i}-${y}">mine</div>`);
                        newCell.css("background-color", "pink");
                    } else {
                        const mineAround = game.board[i][y].mineAround;
                        newCell = $(`<div class="col" id="${i}-${y}">${mineAround}</div>`);
                        newCell.css("color", game.colors[mineAround])
                    }
                } else {
                    if (game.gameOver && game.board[i][y].hasMine) {
                        newCell = $(`<div class="col" id="${i}-${y}">mine</div>`);
                        newCell.css("background-color", "pink");
                    } else {
                        // const mineAround = game.board[i][y].mineAround;
                        newCell = $(`<div class="col" id="${i}-${y}"></div>`);
                        newCell.css("background-color", game.colors["closedCell"]);
                        if (game.board[i][y].hasFlag) {
                            newCell = $(`<div class="col" id="${i}-${y}">Flag</div>`);
                            newCell.css("background-color", game.colors["closedCell"]);
                        }
                    }
                }
                newCell.css("border-style", "dotted");
                newRow.append(newCell);
            }
            $boardContainer.append(newRow);
        }
    }
    $boardContainer.contextmenu(function() {
        return false;
    });

    $boardContainer.mousedown(function (e) {
        e.preventDefault();
        if (!game.gameOver) {
            const getCellId = e.target.id;
            const splitId = getCellId.split("-");
            const row = parseInt(splitId[0]);
            const column = parseInt(splitId[1]);

            if (e.which === 1) {
                clearCellsAround(row, column);
                checkWinner(row, column);
                renderBoard();
            } else if (e.which === 3) {
                if (!game.board[row][column].hasFlag) {
                    game.board[row][column].hasFlag = true;
                    game.mineLeft -= 1;
                } else {
                    game.board[row][column].hasFlag = false;
                    game.mineLeft += 1;
                }
                renderBoard();
            }
        }
        // if (e.which === 1) {
        //     if (!game.gameOver) {
        //         const getCellId = e.target.id;
        //         const splitId = getCellId.split("-");
        //         const row = parseInt(splitId[0]);
        //         const column = parseInt(splitId[1]);

        //         clearCellsAround(row, column);
        //         checkWinner(row, column);
        //         renderBoard();
        //     }
        // } else if (e.which === 3) {
        //     console.log (e.target)
        //     if (!game.gameOver) {
        //         const getCellId = e.target.id;
        //         const splitId = getCellId.split("-");
        //         const row = parseInt(splitId[0]);
        //         const column = parseInt(splitId[1]);

        //         game.board[row][column].hasFlag = true;
        //         console.log(game.board[row][column])
        //         game.mineLeft -= 1;
        //         renderBoard();
        //     }
        // }

    })

    $restartGame.on("click", function () {
        console.log(game);
        initGame();
        renderBoard();
    })


    function clearCellsAround(clickedrow, clickedcolumn) {
        const cellAround = [];
        cellAround.push({ row: clickedrow, column: clickedcolumn });
        console.log(cellAround.length)
        while (cellAround.length > 0) {
            const clickedCell = cellAround.pop();
            if (clickedCell.row >= 0 && clickedCell.row < game.level.row && clickedCell.column >= 0 && clickedCell.column < game.level.column) {
                if (!game.board[clickedCell.row][clickedCell.column].isOpened) {
                    game.board[clickedCell.row][clickedCell.column].isOpened = true;
                    if (game.board[clickedCell.row][clickedCell.column].mineAround === 0 && !game.board[clickedCell.row][clickedCell.column].hasMine) {

                        cellAround.push({ row: clickedCell.row - 1, column: clickedCell.column - 1 });
                        cellAround.push({ row: clickedCell.row - 1, column: clickedCell.column });
                        cellAround.push({ row: clickedCell.row - 1, column: clickedCell.column + 1 });
                        cellAround.push({ row: clickedCell.row, column: clickedCell.column - 1 });
                        cellAround.push({ row: clickedCell.row, column: clickedCell.column + 1 });
                        cellAround.push({ row: clickedCell.row + 1, column: clickedCell.column - 1 });
                        cellAround.push({ row: clickedCell.row + 1, column: clickedCell.column });
                        cellAround.push({ row: clickedCell.row + 1, column: clickedCell.column + 1 });

                    }
                }
            }
        }
    }
    function checkWinner(row, column) {
        if (game.board[row][column].hasMine) {
            alert("Mineeeeeeee!!!!!!")
            game.gameOver = true;
        } else {
            if (checkAllOpen()) {
                game.gameOver = true;
                alert("OOOOOOK you win")
            }
        }

    }

    function checkAllOpen() {
        for (i = 0; i < game.level.row; i++) {
            for (y = 0; y < game.level.column; y++) {
                if (!game.board[i][y].isOpened && !game.board[i][y].hasMine) {
                    return false;
                }
            }
        }
        return true;
    }

    initGame();
    renderBoard();
});