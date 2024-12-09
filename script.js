var origBoard;
const huPlayer = "O";
const aiPlayer = "X";
const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2],
];

const cells = document.querySelectorAll(".cell");
startGame();

// Function to start the game
function startGame() {
  document.querySelector(".endgame").style.display = "none";
  origBoard = Array.from(Array(9).keys());
  for (let i = 0; i < cells.length; i++) {
    cells[i].innerText = "";
    cells[i].style.removeProperty("background-color");
    cells[i].addEventListener("click", turnClick, false);
  }
}

// Function to handle player turns
function turnClick(square) {
  if (typeof origBoard[square.target.id] == "number") {
    turn(square.target.id, huPlayer); // Handles player's move
    if (!checkTie()) turn(bestSpot(), aiPlayer); // AI's move
  }
}

// Function to update the board
function turn(squareId, player) {
  origBoard[squareId] = player;
  document.getElementById(squareId).innerText = player;
  let gameWon = checkWin(origBoard, player);
  if (gameWon) gameOver(gameWon);
}

// Function to check for a win
function checkWin(board, player) {
  let plays = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []);
  let gameWon = null;
  for (let [index, win] of winCombos.entries()) {
    if (win.every((elem) => plays.indexOf(elem) > -1)) {
      gameWon = { index: index, player: player };
      break;
    }
  }
  return gameWon;
}

// Function to handle game over
function gameOver(gameWon) {
  for (let index of winCombos[gameWon.index]) {
    document.getElementById(index).style.backgroundColor =
      gameWon.player == huPlayer ? "blue" : "red";
  }
  for (let i = 0; i < cells.length; i++) {
    cells[i].removeEventListener("click", turnClick, false);
  }
  declareWinner(gameWon.player == huPlayer ? "You Win!" : "You Lose.");
}

// Function to declare the winner
function declareWinner(who) {
  document.querySelector(".endgame").style.display = "block";
  document.querySelector(".endgame .text").innerText = who;
}

// Function to get empty squares
function emptySquares() {
  return origBoard.filter((s) => typeof s == "number");
}

// Function to determine AI's move
function bestSpot() {
  return minimax(origBoard, aiPlayer).index;
}

// Function to check for a tie
function checkTie() {
  if (emptySquares().length == 0) {
    for (let i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = "green";
      cells[i].removeEventListener("click", turnClick, false);
    }
    declareWinner("Tie Game!");
    return true;
  }
  return false;
}

//Defining the minimax algorithm
function minimax(newBoard, player) {
  var availSpots = emptySquares(newBoard);

  if (checkWin(newBoard, player)) {
    return { score: -10 };
  } else if (checkWin(newBoard, aiPlayer)) {
    return { score: 20 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }

  var moves = [];
  for (var i = 0; i < availSpots.length; i++) {
    var move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;

    if (player == aiPlayer) {
      var result = minimax(newBoard, huPlayer);
      move.score = result.score;
    } else {
      var result = minimax(newBoard, aiPlayer);
      move.score = result.score;
    }

    newBoard[availSpots[i]] = move.index;

    moves.push(move);
  }

  var bestMove;
  if (player === aiPlayer) {
    var bestScore = -10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    var bestScore = 10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}
