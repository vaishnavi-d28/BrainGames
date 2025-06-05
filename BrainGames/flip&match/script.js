document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const movesDisplay = document.getElementById('moves');
    const pairsDisplay = document.getElementById('pairs');
    const totalPairsDisplay = document.getElementById('total-pairs');
    const restartBtn = document.getElementById('restart-btn');
    const easyBtn = document.getElementById('easy-btn');
    const mediumBtn = document.getElementById('medium-btn');
    const hardBtn = document.getElementById('hard-btn');
    
    const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let moves = 0;
    let canFlip = true;
    let allCards = [];
    let currentDifficulty = 'medium'; // Default difficulty
    
    // Difficulty configurations
    const difficulties = {
        easy: { rows: 2, cols: 4, pairs: 4 },
        medium: { rows: 3, cols: 4, pairs: 6 },
        hard: { rows: 4, cols: 4, pairs: 8 }
    };
    
    // Initialize the game
    function initGame(difficulty) {
        currentDifficulty = difficulty;
        gameBoard.innerHTML = '';
        flippedCards = [];
        matchedPairs = 0;
        moves = 0;
        canFlip = false;
        allCards = [];
        
        // Update active difficulty button
        document.querySelectorAll('[id$="-btn"]').forEach(btn => {
            btn.classList.remove('difficulty-active');
        });
        document.getElementById(`${difficulty}-btn`).classList.add('difficulty-active');
        
        // Set up game based on difficulty
        const config = difficulties[difficulty];
        const neededEmojis = emojis.slice(0, config.pairs);
        cards = [...neededEmojis, ...neededEmojis];
        totalPairsDisplay.textContent = config.pairs;
        pairsDisplay.textContent = `${matchedPairs}/${config.pairs}`;
        movesDisplay.textContent = moves;
        
        // Set grid layout
        gameBoard.className = `grid gap-3 grid-cols-${config.cols}`;
        gameBoard.style.gridTemplateRows = `repeat(${config.rows}, minmax(0, 1fr))`;
        
        // Shuffle cards
        shuffleCards();
        
        // Create card elements
        cards.forEach((emoji, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.index = index;
            card.dataset.emoji = emoji;
            
            card.innerHTML = `
                <div class="card-inner">
                    <div class="card-front">${emoji}</div>
                    <div class="card-back"></div>
                </div>
            `;
            
            card.addEventListener('click', flipCard);
            gameBoard.appendChild(card);
            allCards.push(card);
        });
        
        // Show all cards for 4 seconds at the start
        showAllCards();
    }
    
    // Show all cards temporarily at game start
    function showAllCards() {
        allCards.forEach(card => {
            card.classList.add('flipped');
        });
        
        setTimeout(() => {
            allCards.forEach(card => {
                card.classList.remove('flipped');
            });
            canFlip = true;
        }, 4000);
    }
    
    // Shuffle the cards using Fisher-Yates algorithm
    function shuffleCards() {
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
    }
    
    // Flip a card
    function flipCard() {
        if (!canFlip || this.classList.contains('flipped') || flippedCards.length >= 2) {
            return;
        }
        
        this.classList.add('flipped');
        flippedCards.push(this);
        
        if (flippedCards.length === 2) {
            moves++;
            movesDisplay.textContent = moves;
            checkForMatch();
        }
    }
    
    // Check if the flipped cards match
    function checkForMatch() {
        const [card1, card2] = flippedCards;
        const emoji1 = card1.dataset.emoji;
        const emoji2 = card2.dataset.emoji;
        
        if (emoji1 === emoji2) {
            card1.removeEventListener('click', flipCard);
            card2.removeEventListener('click', flipCard);
            flippedCards = [];
            matchedPairs++;
            pairsDisplay.textContent = `${matchedPairs}/${difficulties[currentDifficulty].pairs}`;
            
            if (matchedPairs === difficulties[currentDifficulty].pairs) {
                setTimeout(() => {
                    alert(`Congratulations! You won in ${moves} moves on ${currentDifficulty} difficulty!`);
                }, 500);
            }
        } else {
            canFlip = false;
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                flippedCards = [];
                canFlip = true;
            }, 1000);
        }
    }
    
    // Event listeners for difficulty buttons
    easyBtn.addEventListener('click', () => initGame('easy'));
    mediumBtn.addEventListener('click', () => initGame('medium'));
    hardBtn.addEventListener('click', () => initGame('hard'));
    
    // Restart game
    restartBtn.addEventListener('click', () => initGame(currentDifficulty));
    
    // Start the game with default difficulty
    initGame('medium');
});