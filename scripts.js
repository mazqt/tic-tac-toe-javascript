//The gameboard itself will be kept inside of an array. I can use an IIFE bound to a variable for this since there'll just be one gameboard. This also lets me limit the ways of interacting with it to the functions I expose in the returned object.

let gameBoard = (function() {

  board = [
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



  let render = function() {
    let row1 = document.getElementById("row1")
    row1.innerText = gameBoard.getBoard().slice(0, 3);
    let row2 = document.getElementById("row2")
    row2.innerText = gameBoard.getBoard().slice(3, 6);
    let row3 = document.getElementById("row3")
    row3.innerText = gameBoard.getBoard().slice(6, 9);
  }

  return {
    render
  };

})()


console.log(gameBoard.getBoard());
displayController.render()
