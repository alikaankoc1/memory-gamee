/* --- JavaScript burada --- */
const emojis = ["🐶", "🐱", "🦊", "🐼", "🐸", "🐵", "🐤", "🦁"];
const gameBoard = document.getElementById("game-board");
const statusText = document.getElementById("status");
const scoreDisplay = document.getElementById("score");
const loginScreen = document.getElementById("login-screen");
const gameScreen = document.getElementById("game-screen");
const congratsScreen = document.getElementById("congrats-screen");
const welcomeMsg = document.getElementById("welcome-msg");
const winnerNameSpan = document.getElementById("winner-name");
const playerNameInput = document.getElementById("player-name");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matches = 0;
let score = 0;
let playerName = "";

// Başlatma
startBtn.addEventListener("click", () => {
  const name = playerNameInput.value.trim();
  if (name.length < 2) {
    alert("Lütfen en az 2 karakterlik kullanıcı adı giriniz.");
    return;
  }
  playerName = name;
  welcomeMsg.innerText = `Hoşgeldin, ${playerName}!`;
  loginScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  initGame();
});

// Tekrar oynama
restartBtn.addEventListener("click", () => {
  congratsScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  resetGame();
});

function initGame() {
  gameBoard.innerHTML = "";
  matches = 0;
  score = 0;
  updateScore();
  statusText.innerText = "Eşleşmeleri bul!";
  firstCard = null;
  secondCard = null;
  lockBoard = false;

  const cards = [...emojis, ...emojis];
  cards.sort(() => 0.5 - Math.random());

  cards.forEach((emoji) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.emoji = emoji;
    card.innerText = "";
    card.addEventListener("click", flipCard);
    gameBoard.appendChild(card);
  });
}

function flipCard() {
  if (
    lockBoard ||
    this.classList.contains("flipped") ||
    this.classList.contains("matched")
  )
    return;

  this.classList.add("flipped");
  this.innerText = this.dataset.emoji;

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  lockBoard = true;

  checkMatch();
}

function checkMatch() {
  if (firstCard.dataset.emoji === secondCard.dataset.emoji) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    matches++;
    increaseScore(10);

    if (matches === emojis.length) {
      setTimeout(() => {
        gameScreen.classList.add("hidden");
        winnerNameSpan.innerText = playerName;
        congratsScreen.classList.remove("hidden");
        playConfetti();
      }, 2000);
    } else {
      statusText.innerText = `Eşleşme! Bulunan çift sayısı: ${matches}`;
    }
    resetTurn();
  } else {
    decreaseScore(2);
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      firstCard.innerText = "";
      secondCard.innerText = "";
      resetTurn();
    }, 1500); // biraz yavaş açılması için süre artırıldı
  }
}

function resetTurn() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

function increaseScore(points) {
  score += points;
  updateScore();
}

function decreaseScore(points) {
  score -= points; // artık negatif olabilir
  updateScore();
}

function updateScore() {
  scoreDisplay.innerText = `Puan: ${score}`;
}

function resetGame() {
  initGame();
  statusText.innerText = "Eşleşmeleri bul!";
}

function playConfetti() {
  let count = 0;
  const confettiInterval = setInterval(() => {
    if (count > 30) {
      clearInterval(confettiInterval);
      return;
    }
    const emoji = document.createElement("div");
    emoji.innerText = "🎉";
    emoji.style.position = "fixed";
    emoji.style.left = Math.random() * window.innerWidth + "px";
    emoji.style.top = "-50px";
    emoji.style.fontSize = "2rem";
    emoji.style.opacity = "0.8";
    emoji.style.userSelect = "none";
    emoji.style.transition = "top 2s ease-out, opacity 2s ease-out";
    document.body.appendChild(emoji);
    setTimeout(() => {
      emoji.style.top = window.innerHeight + 50 + "px";
      emoji.style.opacity = "0";
    }, 10);
    setTimeout(() => {
      document.body.removeChild(emoji);
    }, 2100);
    count++;
  }, 100);
}
