document.addEventListener("DOMContentLoaded", () => {

  // ===== ELEMENTS =====
  const buttons = document.querySelectorAll(".game button");
  const resultEl = document.getElementById("result");
  const playerScoreEl = document.getElementById("playerScore");
  const computerScoreEl = document.getElementById("computerScore");
  const streakEl = document.getElementById("streak");
  const leaderboardEl = document.getElementById("leaderboard");

  const difficultySelect = document.getElementById("difficulty");
  const themeSelect = document.getElementById("theme");

  // Sounds
  const winSound = document.getElementById("winSound");
  const loseSound = document.getElementById("loseSound");
  const tieSound = document.getElementById("tieSound");

  // ===== STATE =====
  let playerScore = 0;
  let computerScore = 0;
  let streak = 0;

  let bestStreak = localStorage.getItem("bestStreak") || 0;

  const moves = ["rock", "paper", "scissors"];

  // ===== HELPER FUNCTIONS =====

  function playSound(result) {
    if (result === "win") winSound.play();
    else if (result === "lose") loseSound.play();
    else tieSound.play();
  }

  function getCounterMove(playerMove) {
    if (playerMove === "rock") return "paper";
    if (playerMove === "paper") return "scissors";
    return "rock";
  }

  function getComputerMove(playerMove) {
    const difficulty = difficultySelect.value;

    if (difficulty === "easy") {
      return randomMove();
    }

    if (difficulty === "normal") {
      return Math.random() < 0.5 ? randomMove() : getCounterMove(playerMove);
    }

    // hard
    return Math.random() < 0.8 ? getCounterMove(playerMove) : randomMove();
  }

  function randomMove() {
    return moves[Math.floor(Math.random() * moves.length)];
  }

  function updateLeaderboard() {
    leaderboardEl.innerHTML = `
      <li>🔥 Best Win Streak: ${bestStreak}</li>
    `;
  }

  // ===== GAME LOGIC =====
  function play(playerMove) {
    const computerMove = getComputerMove(playerMove);

    let result = "";

    if (playerMove === computerMove) {
      result = "tie";
      resultEl.textContent = "🤝 It's a Tie!";
      streak = 0;
    }
    else if (
      (playerMove === "rock" && computerMove === "scissors") ||
      (playerMove === "paper" && computerMove === "rock") ||
      (playerMove === "scissors" && computerMove === "paper")
    ) {
      result = "win";
      resultEl.textContent = "🎉 You Win!";
      playerScore++;
      streak++;
    }
    else {
      result = "lose";
      resultEl.textContent = "😢 You Lose!";
      computerScore++;
      streak = 0;
    }

    playSound(result);

    // Update best streak
    if (streak > bestStreak) {
      bestStreak = streak;
      localStorage.setItem("bestStreak", bestStreak);
      updateLeaderboard();
    }

    // Update UI
    playerScoreEl.textContent = playerScore;
    computerScoreEl.textContent = computerScore;
    streakEl.textContent = streak;
  }

  // ===== EVENTS =====
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      play(btn.dataset.move);
    });
  });

  themeSelect.addEventListener("change", () => {
    document.body.className = themeSelect.value;
  });

  // ===== INIT =====
  updateLeaderboard();

});
