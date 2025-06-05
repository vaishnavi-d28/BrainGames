document.addEventListener('DOMContentLoaded', () => {
    const reactionBox = document.getElementById('reaction-box');
    const instruction = document.getElementById('instruction');
    const resultText = document.getElementById('result');
    const lastTimeDisplay = document.getElementById('last-time');
    const bestTimeDisplay = document.getElementById('best-time');
    const worstTimeDisplay = document.getElementById('worst-time');
    const avgTimeDisplay = document.getElementById('avg-time');
    const resetBtn = document.getElementById('reset-btn');

    let startTime;
    let timeoutId;
    let isWaiting = false;
    let reactionTimes = [];
    let readyTime;
    let currentColor;

    // Available colors for reaction test
    const reactionColors = [
        { name: 'green', class: 'reaction-go', hex: '#16a34a' },
        { name: 'blue', class: 'reaction-blue', hex: '#2563eb' },
        { name: 'purple', class: 'reaction-purple', hex: '#9333ea' },
        { name: 'yellow', class: 'reaction-yellow', hex: '#ca8a04' },
        { name: 'pink', class: 'reaction-pink', hex: '#db2777' }
    ];

    // Color thresholds (in milliseconds)
    const speedCategories = [
        { threshold: 150, label: 'Lightning Fast!' },
        { threshold: 250, label: 'Great Reaction!' },
        { threshold: 350, label: 'Good' },
        { threshold: 500, label: 'A Bit Slow' },
        { threshold: Infinity, label: 'Too Slow!' }
    ];

    function resetBox() {
        reactionBox.className = 'w-full max-w-2xl h-96 rounded-xl shadow-lg flex flex-col items-center justify-center cursor-pointer reaction-ready';
        instruction.textContent = 'Wait for color change...';
        resultText.classList.add('hidden');
    }

    function getRandomColor() {
        return reactionColors[Math.floor(Math.random() * reactionColors.length)];
    }

    function startTest() {
        if (isWaiting) return;
        
        isWaiting = true;
        resetBox();
        
        // Random delay (1.5-5 seconds)
        const delay = Math.random() * 3500 + 1500;
        
        readyTime = Date.now();
        currentColor = getRandomColor();
        
        timeoutId = setTimeout(() => {
            reactionBox.className = `w-full max-w-2xl h-96 rounded-xl shadow-lg flex flex-col items-center justify-center cursor-pointer ${currentColor.class}`;
            reactionBox.style.backgroundColor = currentColor.hex;
            instruction.textContent = `CLICK NOW! (${currentColor.name})`;
            startTime = performance.now();
            isWaiting = false;
        }, delay);
    }

    function getSpeedCategory(time) {
        return speedCategories.find(cat => time <= cat.threshold);
    }

    reactionBox.addEventListener('click', () => {
        if (reactionBox.classList.contains('reaction-ready')) {
            // Clicked too early
            clearTimeout(timeoutId);
            reactionBox.className = 'w-full max-w-2xl h-96 rounded-xl shadow-lg flex flex-col items-center justify-center cursor-pointer reaction-late';
            instruction.textContent = 'Too early! Wait for the color';
            resultText.textContent = 'Clicked before color appeared!';
            resultText.classList.remove('hidden');
            resultText.classList.add('result-animate');
            setTimeout(startTest, 2000);
            return;
        }

        if (reactionColors.some(color => reactionBox.classList.contains(color.class))) {
            const endTime = performance.now();
            const reactionTime = endTime - startTime;
            const category = getSpeedCategory(reactionTime);
            
            // Show result
            resultText.textContent = `${category.label} (${reactionTime.toFixed(0)} ms) - ${currentColor.name}`;
            resultText.classList.remove('hidden');
            resultText.classList.add('result-animate');
            
            updateStats(reactionTime);
            setTimeout(startTest, 2500);
        }
    });

    function updateStats(time) {
        reactionTimes.push(time);
        
        lastTimeDisplay.textContent = `${time.toFixed(0)} ms`;
        bestTimeDisplay.textContent = reactionTimes.length ? `${Math.min(...reactionTimes).toFixed(0)} ms` : '-';
        worstTimeDisplay.textContent = reactionTimes.length ? `${Math.max(...reactionTimes).toFixed(0)} ms` : '-';
        
        const avg = reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length;
        avgTimeDisplay.textContent = reactionTimes.length ? `${avg.toFixed(0)} ms` : '-';
    }

    resetBtn.addEventListener('click', () => {
        reactionTimes = [];
        lastTimeDisplay.textContent = '-';
        bestTimeDisplay.textContent = '-';
        worstTimeDisplay.textContent = '-';
        avgTimeDisplay.textContent = '-';
        resetBox();
    });

    // Initial setup
    resetBox();
    startTest();
});