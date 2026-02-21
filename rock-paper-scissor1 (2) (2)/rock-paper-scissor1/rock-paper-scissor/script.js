document.addEventListener("DOMContentLoaded", () => {

  // ===== ELEMENTS =====
  const buttons = document.querySelectorAll(".btn");
  const resultEl = document.getElementById("result");
  const movesEl = document.getElementById("moves");
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
  const moveEmojis = {
    rock: "👊",
    paper: "✋",
    scissors: "✌️"
  };

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

  function displayMoves(playerMove, computerMove) {
    movesEl.innerHTML = `
      <div class="move-item">
        <div>${moveEmojis[playerMove]}</div>
        <div class="move-label">You</div>
      </div>
      <div class="vs">vs</div>
      <div class="move-item">
        <div>${moveEmojis[computerMove]}</div>
        <div class="move-label">Computer</div>
      </div>
    `;
  }

  function clearMoves() {
    movesEl.innerHTML = '';
  }

  function updateLeaderboard() {
    leaderboardEl.innerHTML = `
      <li>🔥 Best Win Streak: <strong>${bestStreak}</strong></li>
    `;
  }

  function animateScore() {
    playerScoreEl.parentElement.style.animation = 'none';
    setTimeout(() => {
      playerScoreEl.parentElement.style.animation = 'popIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    }, 10);
  }

  // ===== GAME LOGIC =====
  function play(playerMove) {
    const computerMove = getComputerMove(playerMove);

    let result = "";
    let resultMessage = "";

    // Display moves
    displayMoves(playerMove, computerMove);

    // Disable buttons during result display
    buttons.forEach(btn => btn.disabled = true);

    // Determine result after a short delay for animation effect
    setTimeout(() => {
      if (playerMove === computerMove) {
        result = "tie";
        resultMessage = "🤝 It's a Tie!";
        streak = 0;
      }
      else if (
        (playerMove === "rock" && computerMove === "scissors") ||
        (playerMove === "paper" && computerMove === "rock") ||
        (playerMove === "scissors" && computerMove === "paper")
      ) {
        result = "win";
        resultMessage = "🎉 You Win!";
        playerScore++;
        streak++;
        animateScore();
      }
      else {
        result = "lose";
        resultMessage = "😢 You Lose!";
        computerScore++;
        streak = 0;
        animateScore();
      }

      resultEl.textContent = resultMessage;
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

      // Re-enable buttons
      buttons.forEach(btn => btn.disabled = false);
    }, 600);
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
  clearMoves();

});
