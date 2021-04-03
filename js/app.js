$(document).ready(function () {

    // Variables in the global runtime
    const game = {
        level: {
            name: "",
            row: 10,
            column: 10,
            mine: 10,
            timer: "",
        },
        board: [],
        mineLeft: 0,
        gameOver: false,
        colors: {
            0: "#008080",
            1: "#000080",
            2: "#800080",
            3: "#0000FF",
            4: "#800000",
            5: "#800080",
            6: "#008080",
            7: "#008000",
            8: "#ffd700",
            "closedCell": "#008000",
        },
        interval:"",
    }

    const levels = [
        { name: "easy", row: 8, column: 8, mine: 10, timer: "0:15", },
        { name: "medium", row: 10, column: 8, mine: 20, timer: "2:00", },
        { name: "hard", row: 10, column: 10, mine: 30, timer: "2:00", },
        { name: "insane", row: 10, column: 10, mine: 30, timer: "2:00", },
    ]

    // DOM selectors
    const $boardContainer = $("#board-container");
    const $mineLeftCounter = $("#mineLeft");
    const $restartGame = $("#restart-game");
    const $gameLevel = $("#level");
    const $modal = $("#modal");
    const $result = $("#result");
    const $chooseLevel = $("#chooseGameModal");
    const $submitLevel = $("#submit");
    const $timer = $("#timer");


    function initGame() {
        // function create 2D array board
        game.board = [];
        game.mineLeft = 0;
        $chooseLevel.modal("show");
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
    }

    // function to add numbers around a cell with a mine
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
        $gameLevel.html(`${game.level.name}`);
        // $timer.html(`${game.level.timer}`);
        $boardContainer.html("");
        for (i = 0; i < game.level.row; i++) {
            const newRow = $(`<div class="row" id="row-${i}"></div>`);
            for (y = 0; y < game.level.column; y++) {
                let newCell = "";
                if (game.board[i][y].isOpened) {
                    if (game.board[i][y].hasMine) {
                        newCell = $(`<div class="col" id="${i}-${y}">mine</div>`);
                        newCell.css("background-color", "#ffd700");
                    } else {
                        const mineAround = game.board[i][y].mineAround;
                        newCell = $(`<div class="col" id="${i}-${y}">${mineAround}</div>`);
                        newCell.css({ "color": game.colors[mineAround], "background-color": "#fafad2" });
                    }
                } else {
                    if (game.gameOver && game.board[i][y].hasMine) {
                        newCell = $(`<div class="col" id="${i}-${y}">mine</div>`);
                        newCell.css("background-color", "#ffd700");
                    } else {
                        newCell = $(`<div class="col" id="${i}-${y}"></div>`);
                        newCell.css("background-color", game.colors["closedCell"]);
                        if (game.board[i][y].hasFlag) {
                            newCell = $(`<div class="col" id="${i}-${y}"><img id="${i}-${y}-img" src="img/Plants-Vs-Zombies-PNG-Clipart.png" alt="Flag" width="20" height="20"></div>`);
                            newCell.css("background-color", game.colors["closedCell"]);
                        }
                    }
                }
                newCell.css("border", "0.2px solid black");
                newRow.append(newCell);
            }
            $boardContainer.append(newRow);
        }
    }

    // Event Handlers
    function submitLevel(evt) {
        const $modalLevel = $("#input-level option:selected").val();
        for (i = 0; i < levels.length; i++) {
            if ($modalLevel === levels[i].name) {
                game.level = levels[i];
            };
        }
        initGame();
        const initGameSound = new Audio("sounds/awooga.ogg");
        initGameSound.play();
        timerCountDown();
        renderBoard();
        
    }

    function restartGame(evt) {
        initGame();
        renderBoard();
    }

    function handleMouseButtons(evt) {
        evt.preventDefault();
        if (!game.gameOver) {
            const getCellId = evt.target.id;
            const splitId = getCellId.split("-");
            const row = parseInt(splitId[0]);
            const column = parseInt(splitId[1]);

            if (evt.which === 1) {
                const gameOverSound = new Audio("sounds/bleep.ogg");
                gameOverSound.play();
                if (!game.board[row][column].hasFlag) {
                    clearCellsAround(row, column);
                    checkWinner(row, column);
                    renderBoard();
                }
            } else if (evt.which === 3) {
                if (!game.board[row][column].isOpened) {
                    if (!game.board[row][column].hasFlag) {
                        game.board[row][column].hasFlag = true;
                        game.mineLeft -= 1;
                        const gameOverSound = new Audio("sounds/chime.ogg");
                        gameOverSound.play();
                    } else {
                        game.board[row][column].hasFlag = false;
                        game.mineLeft += 1;
                        const gameOverSound = new Audio("sounds/chime.ogg");
                        gameOverSound.play();
                    }
                    renderBoard();
                }
            }
        }
    }

    // DOM Events
    $submitLevel.on("click", submitLevel);
    $boardContainer.contextmenu(function () {
        return false;
    });
    $boardContainer.mousedown(handleMouseButtons);
    $restartGame.on("click", restartGame);

    // function to clean cells around the clicked cell
    function clearCellsAround(clickedrow, clickedcolumn) {
        const cellAround = [];
        cellAround.push({ row: clickedrow, column: clickedcolumn });
        while (cellAround.length > 0) {
            const clickedCell = cellAround.pop();
            if (clickedCell.row >= 0 && clickedCell.row < game.level.row && clickedCell.column >= 0 && clickedCell.column < game.level.column) {
                if (!game.board[clickedCell.row][clickedCell.column].isOpened && !game.board[clickedCell.row][clickedCell.column].hasFlag) {
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

    // function to check a winner
    function checkWinner(row, column) {
        if (game.board[row][column].hasMine) {
            $result.html("Ohhhh, it was a MINE");
            $modal.modal("show");
            const gameOverSound = new Audio("sounds/156031__iwiploppenisse__explosion.mp3");
            gameOverSound.play();
            game.gameOver = true;
        } else {
            if (checkAllOpen()) {
                game.gameOver = true;
                $result.html("you wooooooon!!!!!!");
                $modal.modal("show");
                const gameOverSound = new Audio("sounds/bungee_scream.ogg");
                gameOverSound.play();
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

    // set timer
    function timerCountDown() {
        clearInterval(game.interval);
        let timer = game.level.timer;
        timer = timer.split(":");
        let minutes = timer[0];
        let seconds = timer[1];
        game.interval = setInterval(function () {
            seconds -= 1;
            if (seconds < 0 && minutes != 0) {
                minutes -= 1;
                seconds = 59;
            } else if (seconds < 10) {
                seconds = "0" + seconds;
            }
            if (minutes <= 0 && seconds == 0) {
                clearInterval(game.interval);
                game.gameOver=true;
                $result.html("time is over!!! you lost!!!");
                $modal.modal("show");
                const gameOverSound = new Audio("sounds/evillaugh.ogg");
                gameOverSound.play();
            }
                $timer.html(`${minutes}:${seconds}`);
        }, 1000);
    };

    initGame();
    renderBoard();
});