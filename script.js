const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector("#statusText");
const restartBtn = document.querySelector("#restartBtn");

// Tt les alignements pr gagner
const winConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let options = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X"; // Premier joueur
let running = false;

// Sons
let polySynth = new Tone.PolySynth(Tone.Synth, {
  oscillator: { type: "fatsawtooth", count: 3, spread: 10 },
  envelope: {
    attack: 0.01,
    decay: 0.1,
    sustain: 0.5,
    release: 0.1,
    attackCurve: "exponential",
  },
});
polySynth.toDestination();

function initializeGame() {
  cells.forEach((cell) => cell.addEventListener("click", cellClicked)); // écouter la case cliquée
  restartBtn.addEventListener("click", restartGame); // bouton restart
  statusText.textContent = `${currentPlayer}'s turn`; // c’est au joueur de jouer
  running = true;
}

initializeGame();

function cellClicked() {
  const cellIndex = this.getAttribute("cellIndex");

  if (options[cellIndex] !== "" || !running) return;

  updateCell(this, cellIndex);
  checkWinner();
}

function updateCell(cell, index) {
  options[index] = currentPlayer;
  cell.textContent = currentPlayer;

  if (currentPlayer === "X") {
    const colors = ["#ff0000ff", "#fff700ff", "#ff9900ff"];
    cell.style.color = colors[Math.floor(Math.random() * colors.length)];
  } else {
    const colors = ["#a600ffff", "#00fff7ff", "#0015ffff"];
    cell.style.color = colors[Math.floor(Math.random() * colors.length)];
  }

  // Sons
  Tone.start();
  const octave = currentPlayer === "X" ? 4 : 5;
  const note = cell.dataset.note + octave;
  polySynth.triggerAttackRelease(note, "8n");
}

function checkWinner() {
  let roundWon = false;

  for (let condition of winConditions) {
    const [a, b, c] = condition;
    if (options[a] === "" || options[b] === "" || options[c] === "") continue;
    if (options[a] === options[b] && options[b] === options[c]) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    statusText.textContent = `${currentPlayer} wins!`;
    running = false;
  } else if (!options.includes("")) {
    statusText.textContent = "Draw!";
    running = false;
  } else {
    changePlayer(); // chznge de joueur que si ca gagne pas
  }
}

function changePlayer() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.textContent = `${currentPlayer}'s turn`;
}

function restartGame() {
  currentPlayer = "X";
  options = ["", "", "", "", "", "", "", "", ""];
  statusText.textContent = `${currentPlayer}'s turn`;
  cells.forEach((cell) => {
    cell.textContent = "";
    cell.style.backgroundColor = "#0e4f30";
    cell.style.borderColor = "white";
  });
  running = true;
}
