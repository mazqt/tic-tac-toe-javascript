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
  let player1;
  let player2 = Player("HAL", "O");
  let currentPlayer
  let won = false;
  let pvp = true;

  let _createBoard = function() {
    boxes = []
    gameBoard.getBoard().forEach((mark, index) => {
      let box = _createBox(mark, index);
      _addEventListenersToBoxes(box, index);
      boxes.push(box);
    })
  }

  let _renderBoard = function() {
    if (won) {
      let info = document.getElementById("info");
      let congratsMessage = document.createElement("h1");
      congratsMessage.innerText = currentPlayer.name + " has won!";
      info.appendChild(congratsMessage);
      let button = _createRestartButton();
      info.appendChild(button);
    } else if (_boardFull()) {
      let info = document.getElementById("info");
      let congratsMessage = document.createElement("h1");
      congratsMessage.innerText = "It's a draw!";
      info.appendChild(congratsMessage);
      let button = _createRestartButton();
      info.appendChild(button);
    } else {
      let HTMLboard = document.getElementById("board")
      boxes.forEach((box) => {
        HTMLboard.appendChild(box);
      })
    }
  }

  let addEventListenersToPlayerChoice = function() {
    let pvpbutton = document.getElementById("pvpbutton");
    let pvaibutton = document.getElementById("pvaibutton");
    _playerButtonEvent(pvpbutton);
    _playerButtonEvent(pvaibutton);
  }

  let _boardFull = function() {
    let count = 9
    let board = gameBoard.getBoard();
    board.forEach((box) => {
      if (box != "_") {
        count --;
      }
    })
    if (count == 0) {
      return true;
    } else {
      return false;
    }
  }

  let _createRestartButton = function() {
    let template = document.getElementById("playagain");
    let button = template.content.getElementById("playagainbutton");
    button.addEventListener("click", function() {
      location.reload();
    })
    return button;
  }

  let _playerButtonEvent = function(button) {
    if (button.id == "pvpbutton") {
      button.addEventListener("click", function () {
        let template = document.getElementById("pvp");
        let form = template.content.getElementById("players")
        let playerchoices = document.getElementById("playerchoices");
        playerchoices.replaceChildren(form);
        _addStartButtonEvent();
      });
    } else {
      button.addEventListener("click", function () {
        pvp = false;
        let template = document.getElementById("pvai");
        let form = template.content.getElementById("players")
        let playerchoices = document.getElementById("playerchoices");
        playerchoices.replaceChildren(form);
        _addStartButtonEvent();
      });
    }
  }

  let _addStartButtonEvent = function() {
    let playerForm = document.getElementById("players");
    playerForm.addEventListener("submit", function(event) {
      event.preventDefault();
      let formData = new FormData(this);
      if (pvp) {
        let form = document.getElementById("playerchoices");
        form.style.display = "none";
        player1 = Player(formData.get("player1"), "X");
        player2 = Player(formData.get("player2"), "O");
        currentPlayer = player1;
        _createBoard();
        _renderBoard();
      } else {
        console.log("Hi")
        let form = document.getElementById("playerchoices");
        form.style.display = "none";
        player1 = Player(formData.get("player1"), "X");
        currentPlayer = player1;
        _createBoard();
        _renderBoard();
      }
    })
  }

  let _addEventListenersToBoxes = function(box, index) {
    //Add eventlisteners that look at the current player, and adds a mark on the slot corresponding to the box when clicked. It also has to swap current player, and re-run renderBoard. Maybe I should break out the function for displaying the board and creating the boxes, so I store them separately?
    box.addEventListener("click", _boxEvent.bind(null, box, index));
  }

  let _createBox = function(mark, index) {
    let box = document.createElement("div");
    box.innerText = mark;
    box.classList.add("box");
    box.setAttribute("id", index);
    return box;
  }

  let _boxEvent = function(box, index) {
    if (pvp) {
      if (gameBoard.getBoard()[index] == "_" && won == false) {
        gameBoard.addMark(index, currentPlayer.mark);
        box.innerText = currentPlayer.mark;
        if (gameBoard.hasSomeoneWon()) {
          won = true;
        }
        _renderBoard();
        _swapPlayer();
      }
    } else {
      if (gameBoard.getBoard()[index] == "_" && won == false) {
        gameBoard.addMark(index, currentPlayer.mark);
        box.innerText = currentPlayer.mark;
        if (gameBoard.hasSomeoneWon()) {
          won = true;
          _renderBoard();
          return;
        }
        _swapPlayer();
        _aiTurn();
        _renderBoard();
        _swapPlayer();
      }
    }
  }

  let _aiTurn = function() {
    let index = Math.floor(Math.random() * 9);
    if (gameBoard.getBoard()[index] == "_") {
      gameBoard.addMark(index, currentPlayer.mark);
      boxes[index].innerText = currentPlayer.mark;
    } else {
      _aiTurn();
    }
  }

  let _swapPlayer = function() {
    if (currentPlayer == player1) {
      currentPlayer = player2;
    } else {
      currentPlayer = player1;
    };
  }

  return {
    addEventListenersToPlayerChoice
  };

})()

displayController.addEventListenersToPlayerChoice()
