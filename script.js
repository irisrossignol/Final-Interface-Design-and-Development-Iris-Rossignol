const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector("#statusText");
const restartBtn = document.querySelector("#restartBtn");

const chalkGroup1 = document.querySelectorAll(".chalkGroup1 .chalk"); // Craies X
const chalkGroup2 = document.querySelectorAll(".chalkGroup2 .chalk"); // Craies O

// Alignements gagnants
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
let currentPlayer = "X";
let running = false;

let currentXColor = "#ff0000"; // couleur par défaut X
let currentOColor = "#0015ff"; // couleur par défaut O
let activeChalkX = null;
let activeChalkO = null;

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

// Initialisation du jeu
function initializeGame() {
  cells.forEach((cell) => cell.addEventListener("click", cellClicked));
  restartBtn.addEventListener("click", restartGame);
  statusText.textContent = `${currentPlayer}'s turn`;
  running = true;

  // Événement craies
  chalkGroup1.forEach((chalk) =>
    chalk.addEventListener("click", () => selectChalk(chalk, "X"))
  );
  chalkGroup2.forEach((chalk) =>
    chalk.addEventListener("click", () => selectChalk(chalk, "O"))
  );
}
initializeGame();

// Gestion clic sur cellule
function cellClicked() {
  const index = this.getAttribute("cellIndex");
  if (options[index] !== "" || !running) return;

  options[index] = currentPlayer;
  this.textContent = currentPlayer;
  this.style.color = currentPlayer === "X" ? currentXColor : currentOColor;

  // Son
  Tone.start();
  const octave = currentPlayer === "X" ? 4 : 5;
  polySynth.triggerAttackRelease(this.dataset.note + octave, "8n");

  checkWinner();
}

// Vérification victoire
function checkWinner() {
  let roundWon = false;
  for (let cond of winConditions) {
    const [a, b, c] = cond;
    if (options[a] && options[a] === options[b] && options[a] === options[c]) {
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
    changePlayer();
  }
}

function changePlayer() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.textContent = `${currentPlayer}'s turn`;
}

function restartGame() {
  options.fill("");
  cells.forEach((cell) => {
    cell.textContent = "";
    cell.style.color = "";
    cell.style.backgroundColor = "#0e4f30";
    cell.style.borderColor = "white";
  });
  running = true;
  currentPlayer = "X";
  statusText.textContent = `${currentPlayer}'s turn`;

  // Reset craies
  if (activeChalkX) activeChalkX.classList.remove("chalk-active");
  if (activeChalkO) activeChalkO.classList.remove("chalk-active");
  activeChalkX = null;
  activeChalkO = null;
}

// Gestion sélection craie
function selectChalk(chalk, player) {
  const color = window.getComputedStyle(chalk).backgroundColor; // récupère la vraie couleur

  if (player === "X") {
    if (activeChalkX && activeChalkX !== chalk)
      activeChalkX.classList.remove("chalk-active");
    chalk.classList.add("chalk-active");
    activeChalkX = chalk;
    currentXColor = color;
  } else {
    if (activeChalkO && activeChalkO !== chalk)
      activeChalkO.classList.remove("chalk-active");
    chalk.classList.add("chalk-active");
    activeChalkO = chalk;
    currentOColor = color;
  }
}

// Initialiser les craies actives par défaut
window.addEventListener("DOMContentLoaded", () => {
  // Craie rouge gauche (chalk1)
  const chalk1 = document.querySelector(".chalk1");
  chalk1.classList.add("chalk-active");
  activeChalkX = chalk1;
  currentXColor = window.getComputedStyle(chalk1).backgroundColor;

  // Craie rouge droite (chalk10)
  const chalk10 = document.querySelector(".chalk10");
  chalk10.classList.add("chalk-active");
  activeChalkO = chalk10;
  currentOColor = window.getComputedStyle(chalk10).backgroundColor;
});
