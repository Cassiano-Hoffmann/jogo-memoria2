const board = document.getElementById("board");
const timeEl = document.getElementById("time");
const scoreEl = document.getElementById("score");
const resetBtn = document.getElementById("reset-btn");

const icons = ["💎", "🚀", "🎮", "🐉", "🌈", "🧩", "🔥", "⚡"];
let cards = [...icons, ...icons];
let flippedCards = [];
let matchedCards = [];
let score = 0;
let seconds = 0;
let timerInterval;

// ===== Iniciar Jogo =====
function startGame() {
  board.innerHTML = "";
  cards.sort(() => 0.5 - Math.random());
  cards.forEach(icon => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <div class="front">?</div>
      <div class="back">${icon}</div>
    `;
    board.appendChild(card);
    card.addEventListener("click", () => flipCard(card, icon));
  });

  score = 0;
  matchedCards = [];
  seconds = 0;
  updateUI();
  clearInterval(timerInterval);
  timerInterval = setInterval(updateTime, 1000);
}

function updateTime() {
  seconds++;
  const min = String(Math.floor(seconds / 60)).padStart(2, "0");
  const sec = String(seconds % 60).padStart(2, "0");
  timeEl.textContent = `${min}:${sec}`;
}

function updateUI() {
  scoreEl.textContent = score;
}

function flipCard(card, icon) {
  if (flippedCards.length === 2 || card.classList.contains("flip")) return;

  card.classList.add("flip");
  flippedCards.push({ card, icon });

  if (flippedCards.length === 2) {
    checkMatch();
  }
}

function checkMatch() {
  const [first, second] = flippedCards;
  if (first.icon === second.icon) {
    matchedCards.push(first, second);
    score += 10;
    flippedCards = [];
    updateUI();

    if (matchedCards.length === cards.length) {
      clearInterval(timerInterval);
      setTimeout(() => {
        alert(`🏆 Parabéns! Você venceu com ${score} pontos em ${timeEl.textContent}!`);
        saveScore(score, timeEl.textContent);
      }, 500);
    }
  } else {
    setTimeout(() => {
      first.card.classList.remove("flip");
      second.card.classList.remove("flip");
      flippedCards = [];
    }, 800);
  }
}

// ===== Ranking LocalStorage =====
function saveScore(points, time) {
  const scores = JSON.parse(localStorage.getItem("memoryverse_scores")) || [];
  scores.push({ points, time, date: new Date().toLocaleString() });
  localStorage.setItem("memoryverse_scores", JSON.stringify(scores));
}

// ===== Reiniciar =====
resetBtn.addEventListener("click", startGame);

// ===== Iniciar automaticamente =====
startGame();