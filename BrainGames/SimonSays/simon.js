// Game Configuration
const config = {
    difficulties: {
        easy: { speed: 1500, flashDuration: 200 },
        medium: { speed: 1000, flashDuration: 150 },
        hard: { speed: 600, flashDuration: 100 }
    },
    timedMode: {
        initialTime: 30,
        timePerLevel: 5
    }
};

// Game State
const gameState = {
    gameSequence: [],
    playerSequence: [],
    buttonColours: ["red", "blue", "green", "yellow"],
    gameStarted: false,
    level: 0,
    highScore: localStorage.getItem("highScore") || 0,
    currentDifficulty: 'easy',
    isTimedMode: false,
    timeLeft: config.timedMode.initialTime,
    timer: null
};

// DOM Elements
const elements = {
    modeSelection: document.getElementById("mode-selection"),
    gameScreen: document.getElementById("game-screen"),
    gameStatus: document.getElementById("game-status"),
    levelDisplay: document.getElementById("level-display"),
    timerDisplay: document.getElementById("timer-display"),
    highScoreDisplay: document.getElementById("high-score"),
    easyBtn: document.getElementById("easy-btn"),
    mediumBtn: document.getElementById("medium-btn"),
    hardBtn: document.getElementById("hard-btn"),
    classicModeBtn: document.getElementById("classic-mode"),
    timedModeBtn: document.getElementById("timed-mode"),
    buttons: document.querySelectorAll(".btn")
};

// Initialize the game
function init() {
    // Set up mode selection
    elements.classicModeBtn.addEventListener("click", () => selectMode(false));
    elements.timedModeBtn.addEventListener("click", () => selectMode(true));
    
    // Set up difficulty buttons
    elements.easyBtn.addEventListener("click", () => setDifficulty("easy"));
    elements.mediumBtn.addEventListener("click", () => setDifficulty("medium"));
    elements.hardBtn.addEventListener("click", () => setDifficulty("hard"));
    
    // Set up game buttons
    elements.buttons.forEach(button => {
        button.addEventListener("click", handleButtonClick);
    });
    
    // Set up keyboard start
    document.addEventListener("keypress", startGame);
    
    // Initialize high score display
    elements.highScoreDisplay.textContent = `High Score: ${gameState.highScore}`;
}

// Mode selection
function selectMode(isTimed) {
    gameState.isTimedMode = isTimed;
    elements.modeSelection.classList.add("hidden");
    elements.gameScreen.classList.remove("hidden");
    
    if (isTimed) {
        elements.timerDisplay.classList.remove("hidden");
    }
}

// Difficulty selection
function setDifficulty(difficulty) {
    gameState.currentDifficulty = difficulty;
    document.querySelectorAll(".difficulty-btn").forEach(btn => btn.classList.remove("active"));
    document.getElementById(`${difficulty}-btn`).classList.add("active");
}

// Start the game
function startGame() {
    if (!gameState.gameStarted) {
        resetGame();
        gameState.gameStarted = true;
        elements.levelDisplay.textContent = `Level: ${gameState.level}`;
        if (gameState.isTimedMode) {
            startTimer();
        }
        nextSequence();
    }
}

// Reset game state
function resetGame() {
    gameState.gameSequence = [];
    gameState.playerSequence = [];
    gameState.level = 0;
    gameState.gameStarted = false;
    if (gameState.isTimedMode) {
        gameState.timeLeft = config.timedMode.initialTime;
        clearInterval(gameState.timer);
    }
}

// Timer functions
function startTimer() {
    gameState.timeLeft = config.timedMode.initialTime;
    updateTimerDisplay();
    clearInterval(gameState.timer);
    
    gameState.timer = setInterval(() => {
        gameState.timeLeft--;
        updateTimerDisplay();
        
        if (gameState.timeLeft <= 0) {
            gameOver();
        }
    }, 1000);
}

function addTime() {
    if (gameState.isTimedMode) {
        gameState.timeLeft += config.timedMode.timePerLevel;
        updateTimerDisplay();
    }
}

function updateTimerDisplay() {
    elements.timerDisplay.textContent = `Time Left: ${gameState.timeLeft}`;
    if (gameState.timeLeft <= 10) {
        elements.timerDisplay.classList.add("timed-flash");
    } else {
        elements.timerDisplay.classList.remove("timed-flash");
    }
}

// Game logic
function nextSequence() {
    gameState.playerSequence = [];
    gameState.level++;
    elements.levelDisplay.textContent = `Level: ${gameState.level}`;
    if (gameState.isTimedMode) {
        addTime();
    }

    const speed = config.difficulties[gameState.currentDifficulty].speed;
    
    let randomNumber = Math.floor(Math.random() * 4);
    let randomChosenColour = gameState.buttonColours[randomNumber];
    gameState.gameSequence.push(randomChosenColour);

    // Show sequence with appropriate speed
    let i = 0;
    const showNextInSequence = () => {
        if (i < gameState.gameSequence.length) {
            const color = gameState.gameSequence[i];
            const button = document.querySelector(`#${color}`);
            btnFlash(button);
            i++;
            setTimeout(showNextInSequence, speed);
        }
    };
    
    showNextInSequence();
}

function btnFlash(btn) {
    const duration = config.difficulties[gameState.currentDifficulty].flashDuration;
    btn.classList.add("flash");
    setTimeout(() => {
        btn.classList.remove("flash");
    }, duration);
}

function handleButtonClick() {
    if (!gameState.gameStarted) return;
    
    const clickedColour = this.id;
    gameState.playerSequence.push(clickedColour);
    btnFlash(this);
    checkAnswer(gameState.playerSequence.length - 1);
}

function checkAnswer(currentLevel) {
    if (gameState.playerSequence[currentLevel] === gameState.gameSequence[currentLevel]) {
        if (gameState.playerSequence.length === gameState.gameSequence.length) {
            setTimeout(() => nextSequence(), 1000);
        }
    } else {
        gameOver();
    }
}

function gameOver() {
    updateHighScore();
    showGameOver();
    resetGame();
    elements.highScoreDisplay.textContent = `High Score: ${gameState.highScore}`;
}

function updateHighScore() {
    if (gameState.level > gameState.highScore) {
        gameState.highScore = gameState.level;
        localStorage.setItem("highScore", gameState.highScore);
    }
}

function showGameOver() {
    elements.gameStatus.textContent = "Game Over! Press Any Key to Restart";
    document.body.classList.add("game-over");
    setTimeout(() => {
        document.body.classList.remove("game-over");
    }, 200);
}

// Initialize the game when the page loads
window.onload = init;