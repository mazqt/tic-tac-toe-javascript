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

  return {
    getBoard,
    addMark
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

  let player1;
  let player2;
  let currentPlayer;

  player1 = Player("Jesper", "X")
  gameBoard.addMark(4, player1.mark)
  console.log(player1)

  let render = function() {
    let HTMLboard = document.getElementById("board")
    gameBoard.getBoard().forEach((mark, index) => {
      let box = _createBox(mark, index);
      HTMLboard.appendChild(box);
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
    render
  };

})()

displayController.render()
