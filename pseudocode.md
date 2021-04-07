**Pseudocode**

# Minesweeper

## Define required variables:

**Object game**:

- Level is an object, what includes: name: easy, rows: number, columns:number.
- Object board. It's an array of arrays of sells.
- Object cell includes isOpened:t/f, hasMine:t/f, hasFlag:t/f, mineAround:number
- mines: number
- mineLeft: number
- timer: number
- gameOver: t/f
- object colors
- object results
- object sounds

**variable levels**


## Initialize game:

* based on a game level rows and columns, create an 2D array Board with cells. define each cell as isOpened:false, hasMine:false, hasFlag:false, mineAround:0
* define gameOver as false.
* function placeMines. generate random row index and column index. Check if hasMine is false and change it to true. update surrounding cells +1 value. Do it by mines.number
* render the board. Loop over the board elements that represent the cells on the page. Add id based on index of raw and column.
* Set the background color from the Colors.closedCell.

Wait for Player's click <br>
Set eventListener on the _board_ and on the button _Restart game_. 


## Game turn:

* Player click left mouse button on any cell on a grid:
   if a cell is open, do nothing,
   if mine on the cell - game over
	else open cell
* player click right mouse button:
	if a cell is open, do nothing,
	if the cell is close and no flag, put a flag. do not open the cell. Flag tags reduce the number of mines left on the display.
if the cell is close and has a flag, remove the flag. do not open the cell.


## Game over:

**win**

* Block grid and reveal mines, stop the timer. alert with the game result (win/lose)
* Player opened all cells without mines before time is over  =  win. Loop over Board and check cell isOpened is false, hasMine is false. return false when find the first cell meets conditions. if we reach the end of the array, Player wins.

**lose**

* Time left = 0
* Player click on the cell with mine
