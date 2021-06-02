//The gameboard itself will be kept inside of an array. I can use an IIFE bound to a variable for this since there'll just be one gameboard. This also lets me limit the ways of interacting with it to the functions I expose in the returned object.

const gameBoard = (function() {

  let board = [
    "_", "_", "_",
    "_", "_", "_",
    "_", "_", "_"
  ];

  const addMark = function(coordinate, mark) {
    board[coordinate] = mark;
  }

  const getBoard = function() {
    return board;
  }

  const hasSomeoneWon = function() {
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

const Player = (name, mark) => {

  return {
    name,
    mark
  };
}

const displayController = (function() {

  let boxes;
  let player1;
  let player2 = Player("HAL", "O");
  let currentPlayer
  let won = false;
  let pvp = true;

  const _createBoard = function() {
    boxes = []
    gameBoard.getBoard().forEach((mark, index) => {
      let box = _createBox(mark, index);
      _addEventListenersToBoxes(box, index);
      boxes.push(box);
    })
  }

  const _renderBoard = function() {
    const info = document.getElementById("info");
    if (won) {
      info.innerHTML = "";
      let congratsMessage = document.createElement("h1");
      congratsMessage.innerText = currentPlayer.name + " has won!";
      info.appendChild(congratsMessage);
      const button = _createRestartButton();
      info.appendChild(button);
    } else if (_boardFull()) {
      info.innerHTML = "";
      let drawMessage = document.createElement("h1");
      drawMessage.innerText = "It's a draw!";
      info.appendChild(drawMessage);
      const button = _createRestartButton();
      info.appendChild(button);
    } else {
      info.innerText = "It is " + currentPlayer.name + "'s turn"
      const HTMLboard = document.getElementById("board")
      boxes.forEach((box) => {
        HTMLboard.appendChild(box);
      })
    }
  }

  const addEventListenersToPlayerChoice = function() {
    const pvpbutton = document.getElementById("pvpbutton");
    const pvaibutton = document.getElementById("pvaibutton");
    _playerButtonEvent(pvpbutton);
    _playerButtonEvent(pvaibutton);
  }

  const _boardFull = function() {
    let count = 9
    const board = gameBoard.getBoard();
    board.forEach((box) => {
      if (box != "_") {
        count --;
      }
    })
    if (count == 0) {
      return true;
    } else {
      return false
    }
  }

  const _createRestartButton = function() {
    const template = document.getElementById("playagain");
    const button = template.content.getElementById("playagainbutton");
    button.addEventListener("click", function() {
      location.reload();
    })
    return button;
  }

  const _playerButtonEvent = function(button) {
    if (button.id == "pvpbutton") {
      button.addEventListener("click", function () {
        const template = document.getElementById("pvp");
        const form = template.content.getElementById("players")
        const playerchoices = document.getElementById("playerchoices");
        playerchoices.replaceChildren(form);
        _addStartButtonEvent();
      });
    } else {
      button.addEventListener("click", function () {
        pvp = false;
        const template = document.getElementById("pvai");
        const form = template.content.getElementById("players")
        const playerchoices = document.getElementById("playerchoices");
        playerchoices.replaceChildren(form);
        _addStartButtonEvent();
      });
    }
  }

  const _addStartButtonEvent = function() {
    const playerForm = document.getElementById("players");
    playerForm.addEventListener("submit", function(event) {
      event.preventDefault();
      const formData = new FormData(this);
      if (pvp) {
        const form = document.getElementById("playerchoices");
        form.style.display = "none";
        player1 = Player(formData.get("player1"), "X");
        player2 = Player(formData.get("player2"), "O");
        currentPlayer = player1;
        _createBoard();
        _renderBoard();
      } else {
        const form = document.getElementById("playerchoices");
        form.style.display = "none";
        player1 = Player(formData.get("player1"), "X");
        currentPlayer = player1;
        _createBoard();
        _renderBoard();
      }
    })
  }

  const _addEventListenersToBoxes = function(box, index) {
    box.addEventListener("click", _boxEvent.bind(null, box, index));
  }

  const _createBox = function(mark, index) {
    let box = document.createElement("div");
    box.innerText = mark;
    box.classList.add("box");
    box.setAttribute("id", index);
    return box;
  }

  const _boxEvent = function(box, index) {
    if (pvp) {
      if (gameBoard.getBoard()[index] == "_" && won == false) {
        gameBoard.addMark(index, currentPlayer.mark);
        box.innerText = currentPlayer.mark;
        if (gameBoard.hasSomeoneWon()) {
          won = true;
          _renderBoard();
        } else {
          _swapPlayer();
          _renderBoard();
        }
      }
    } else {
      if (gameBoard.getBoard()[index] == "_" && won == false) {
        gameBoard.addMark(index, currentPlayer.mark);
        box.innerText = currentPlayer.mark;
        if (gameBoard.hasSomeoneWon()) {
          won = true;
          _renderBoard();
        } else {
          _swapPlayer();
          _renderBoard();
          _aiTurn();
          _swapPlayer();
          _renderBoard();
        }
      }
    }
  }

  const _aiTurn = function() {
    const index = Math.floor(Math.random() * 9);
    if (gameBoard.getBoard()[index] == "_") {
      gameBoard.addMark(index, currentPlayer.mark);
      boxes[index].innerText = currentPlayer.mark;
    } else {
      _aiTurn();
    }
  }

  const _swapPlayer = function() {
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
