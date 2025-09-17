const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector("#statusText");
const restartBtn = document.querySelector("#restartBtn");

const chalkGroup1 = document.querySelectorAll(".chalkGroup1 .chalk"); // Craies X
const chalkGroup2 = document.querySelectorAll(".chalkGroup2 .chalk"); // Craies O

// Combinaisons gagnantes
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

let options = Array(9).fill("");
let currentPlayer = "X";
let running = false;

let currentXColor, currentOColor;
let activeChalkX, activeChalkO;

// Son
const polySynth = new Tone.PolySynth(Tone.Synth, {
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

// Fonction pour initialiser les craies par défaut
function setDefaultChalks() {
  const chalk1 = document.querySelector(".chalk1");
  const chalk10 = document.querySelector(".chalk10");

  if (activeChalkX) activeChalkX.classList.remove("chalk-active");
  if (activeChalkO) activeChalkO.classList.remove("chalk-active");

  chalk1.classList.add("chalk-active");
  chalk10.classList.add("chalk-active");

  activeChalkX = chalk1;
  activeChalkO = chalk10;

  currentXColor = window.getComputedStyle(chalk1).backgroundColor;
  currentOColor = window.getComputedStyle(chalk10).backgroundColor;
}

// Fonction pour mettre des couleurs aléatoires sur les textes
function setRandomTextColors() {
  const allChalks = [...chalkGroup1, ...chalkGroup2];
  const getRandomColor = () => {
    const chalk = allChalks[Math.floor(Math.random() * allChalks.length)];
    return window.getComputedStyle(chalk).backgroundColor;
  };

  document.querySelector(".bonjour").style.color = getRandomColor();
  document.querySelector(".hello").style.color = getRandomColor();
}

// Initialisation du jeu
function initializeGame() {
  cells.forEach((cell) => cell.addEventListener("click", cellClicked));
  restartBtn.addEventListener("click", restartGame);

  running = true;
  currentPlayer = "X";
  statusText.textContent = `${currentPlayer}'s turn`;

  chalkGroup1.forEach((chalk) =>
    chalk.addEventListener("click", () => selectChalk(chalk, "X"))
  );
  chalkGroup2.forEach((chalk) =>
    chalk.addEventListener("click", () => selectChalk(chalk, "O"))
  );

  setDefaultChalks();
  setRandomTextColors(); // couleurs aléatoires au départ
}

// Clic sur cellule
function cellClicked() {
  const index = this.getAttribute("cellIndex");
  if (options[index] !== "" || !running) return;

  options[index] = currentPlayer;
  this.textContent = currentPlayer;
  this.style.color = currentPlayer === "X" ? currentXColor : currentOColor;

  Tone.start();
  const octave = currentPlayer === "X" ? 4 : 5;
  polySynth.triggerAttackRelease(this.dataset.note + octave, "8n");

  checkWinner();
}

// Vérification victoire
function checkWinner() {
  let roundWon = winConditions.some(
    ([a, b, c]) =>
      options[a] && options[a] === options[b] && options[a] === options[c]
  );

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

// Changement de joueur
function changePlayer() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.textContent = `${currentPlayer}'s turn`;
}

// Redémarrer le jeu
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

  setDefaultChalks();
  setRandomTextColors(); // couleurs aléatoires après restart
}

// Sélection craie
function selectChalk(chalk, player) {
  const color = window.getComputedStyle(chalk).backgroundColor;

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

window.addEventListener("DOMContentLoaded", initializeGame);
