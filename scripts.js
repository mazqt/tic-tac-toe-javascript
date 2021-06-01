//The gameboard itself will be kept inside of an array. I can use an IIFE bound to a variable for this since there'll just be one gameboard. This also lets me limit the ways of interacting with it to the functions I expose in the returned object.

let gameBoard = (function() {

  let board = [
    "_", "_", "_",
    "_", "_", "_",
    "_", "_", "_"
  ];

  let addMark = function(coordinate, mark) {
    board[coordinate] = mark;
  }

  let getBoard = function() {
    return board;
  }

  let hasSomeoneWon = function() {
    if (board[0] == board[1] && board[1] == board[2] && board[0] != "_") {
      return true;
    } else if (board[0] == board[3] && board[3] == board[6] && board[0] != "_") {
      return true;
    } else if (board[6] == board[7] && board[7] == board[8] && board[6] != "_") {
      return true;
    } else if (board[2] == board[5] && board[5] == board[8] && board[2] != "_") {
      return true;
    } else if (board[1] == board[4] && board[4] == board[7] && board[1] != "_") {
      return true;
    } else if (board[3] == board[4] && board[4] == board[5] && board[3] != "_") {
      return true;
    } else if (board[0] == board[4] && board[4] == board[8] && board[0] != "_") {
      return true;
    } else if (board[2] == board[4] && board[4] == board[6] && board[2] != "_") {
      return true;
    } else { return false ;}
  }

  return {
    getBoard,
    addMark,
    hasSomeoneWon
  };

})();

//The players will be made with factory functions, since it's good practice for when you're creating multiple copies of an object.

let Player = (name, mark) => {

  return {
    name,
    mark
  };
}

//A function to execute the game logic itself and communicate with the DOM to display things will also be necessary. This can also be made as a module, just like the gameboard.

let displayController = (function() {

  let boxes;
  let player1 = Player("Jesper", "X");
  let player2 = Player("Cheazy", "O");
  let currentPlayer = player1;

  let createBoard = function() {
    boxes = []
    //let HTMLboard = document.getElementById("board")
    gameBoard.getBoard().forEach((mark, index) => {
      let box = _createBox(mark, index);
      _addEventListeners(box, index);
      boxes.push(box);
      //HTMLboard.appendChild(box);
    })
  }

  let renderBoard = function() {
    let HTMLboard = document.getElementById("board")
    boxes.forEach((box) => {
      HTMLboard.appendChild(box);
    })
  }

  let _addEventListeners = function(box, index) {
    //Add eventlisteners that look at the current player, and adds a mark on the slot corresponding to the box when clicked. It also has to swap current player, and re-run renderBoard. Maybe I should break out the function for displaying the board and creating the boxes, so I store them separately?
    box.addEventListener("click", function() {
      if (box.innerText == "_") {
        gameBoard.addMark(index, currentPlayer.mark);
        if (currentPlayer == player1) {
          currentPlayer = player2;
        } else {
          currentPlayer = player1;
        };
        console.log(gameBoard.getBoard());
        console.log(gameBoard.hasSomeoneWon());
      }
    })
  }

  let _createBox = function(mark, index) {
    let box = document.createElement("div");
    box.innerText = mark;
    box.classList.add("box");
    box.setAttribute("id", index);
    return box;
  }

  return {
    createBoard,
    renderBoard
  };

})()

displayController.createBoard();
displayController.renderBoard();
