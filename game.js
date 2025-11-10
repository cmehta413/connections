// Game data - word groups and their categories
const gameData = {
    groups: [
        {
            "category": "Alternate Personas / Eras",
            "difficulty": "extremely difficult",
            "words": ["Lizzy Grant", "May Jailer", "Sparkle Jump Rope Queen", "Lanita"]
          },
          {
            "category": "American Decay Aesthetic",
            "difficulty": "extremely difficult",
            "words": ["Cherry Coke", "Motel Sign", "Gas Station", "Cheerleader Uniform"]
          },
          {
            "category": "Daddy Figures / Power Dynamics",
            "difficulty": "extremely difficult",
            "words": ["Sugar Daddy", "Pastor’s Son", "Cop", "Record Producer"]
          },
          {
            "category": "Spiritual & Mystical Lore",
            "difficulty": "extremely difficult",
            "words": ["The Grants", "God Bless America", "California Witches", "Blue Hydrangea"]
          }
    ],
    allWords: []
};

// Game state
let gameState = {
    selectedWords: [],
    mistakesRemaining: 4,
    completedGroups: [],
    shuffled: false
};

// Theme management
function initTheme() {
    // Setup theme toggle button first
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
        
        // Load saved theme preference and apply it
        const savedTheme = localStorage.getItem('connectionsTheme') || 'hot-pink';
        setTheme(savedTheme);
    }
}

function setTheme(theme) {
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle ? themeToggle.querySelector('.theme-icon') : null;
    
    if (theme === 'baby-blue') {
        body.classList.add('theme-baby-blue');
        if (themeToggle) {
            themeToggle.title = 'Switch to Hot Pink theme';
        }
        if (themeIcon) {
            themeIcon.textContent = '💙';
        }
    } else {
        body.classList.remove('theme-baby-blue');
        if (themeToggle) {
            themeToggle.title = 'Switch to Baby Blue theme';
        }
        if (themeIcon) {
            themeIcon.textContent = '💗';
        }
    }
    
    // Save preference
    localStorage.setItem('connectionsTheme', theme);
}

function toggleTheme(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    const currentTheme = localStorage.getItem('connectionsTheme') || 'hot-pink';
    const newTheme = currentTheme === 'hot-pink' ? 'baby-blue' : 'hot-pink';
    setTheme(newTheme);
}

// Initialize game
function initGame() {
    // Initialize theme
    initTheme();
    
    // Flatten all words from groups
    gameData.allWords = gameData.groups.flatMap(group => group.words);
    
    // Shuffle words
    shuffleWords();
    
    // Set current date
    const today = new Date();
    document.getElementById('gameDate').textContent = today.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
    });
    
    // Render grid
    renderGrid();
    
    // Update mistakes display
    updateMistakesDisplay();
    
    // Load stats
    loadStats();
    
    // Setup event listeners
    setupEventListeners();
}

// Shuffle words array
function shuffleWords() {
    for (let i = gameData.allWords.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [gameData.allWords[i], gameData.allWords[j]] = [gameData.allWords[j], gameData.allWords[i]];
    }
}

// Render the game grid
function renderGrid() {
    const grid = document.getElementById('gameGrid');
    grid.innerHTML = '';
    
    gameData.allWords.forEach((word, index) => {
        const tile = document.createElement('div');
        tile.className = 'word-tile';
        tile.textContent = word;
        tile.dataset.word = word;
        
        // Check if word is in a completed group
        const isCompleted = gameState.completedGroups.some(group => 
            group.words.includes(word)
        );
        
        if (isCompleted) {
            tile.classList.add('completed');
            tile.style.cursor = 'not-allowed';
        } else {
            tile.addEventListener('click', () => toggleWordSelection(word));
        }
        
        grid.appendChild(tile);
    });
}

// Toggle word selection
function toggleWordSelection(word) {
    const tile = document.querySelector(`[data-word="${word}"]`);
    
    // Don't allow selection of completed words
    if (tile.classList.contains('completed')) {
        return;
    }
    
    const index = gameState.selectedWords.indexOf(word);
    
    if (index > -1) {
        // Deselect
        gameState.selectedWords.splice(index, 1);
        tile.classList.remove('selected');
    } else {
        // Select (max 4)
        if (gameState.selectedWords.length < 4) {
            gameState.selectedWords.push(word);
            tile.classList.add('selected');
        } else {
            showMessage('You can only select 4 words at a time!', 'error');
            return;
        }
    }
    
    updateControlButtons();
}

// Update control buttons state
function updateControlButtons() {
    const deselectBtn = document.getElementById('deselectBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    if (gameState.selectedWords.length > 0) {
        deselectBtn.disabled = false;
    } else {
        deselectBtn.disabled = true;
    }
    
    if (gameState.selectedWords.length === 4) {
        submitBtn.disabled = false;
    } else {
        submitBtn.disabled = true;
    }
}

// Deselect all words
function deselectAll() {
    gameState.selectedWords.forEach(word => {
        const tile = document.querySelector(`[data-word="${word}"]`);
        if (tile) {
            tile.classList.remove('selected');
        }
    });
    gameState.selectedWords = [];
    updateControlButtons();
}

// Submit selected words
function submitGuess() {
    if (gameState.selectedWords.length !== 4) {
        showMessage('Please select exactly 4 words!', 'error');
        return;
    }
    
    // Check if selected words form a valid group
    const selectedSet = new Set(gameState.selectedWords);
    let foundGroup = null;
    
    for (const group of gameData.groups) {
        const groupSet = new Set(group.words);
        if (selectedSet.size === groupSet.size && 
            [...selectedSet].every(word => groupSet.has(word))) {
            foundGroup = group;
            break;
        }
    }
    
    if (foundGroup && !gameState.completedGroups.some(g => g.category === foundGroup.category)) {
        // Correct guess!
        handleCorrectGuess(foundGroup);
    } else {
        // Incorrect guess
        handleIncorrectGuess();
    }
}

// Handle correct guess
function handleCorrectGuess(group) {
    gameState.completedGroups.push(group);
    
    // Mark tiles as correct
    gameState.selectedWords.forEach(word => {
        const tile = document.querySelector(`[data-word="${word}"]`);
        if (tile) {
            tile.classList.add('correct');
            tile.classList.remove('selected');
        }
    });
    
    showMessage(`Correct! ${group.category}`, 'success');
    
    // Clear selection
    gameState.selectedWords = [];
    updateControlButtons();
    
    // Check if game is won
    setTimeout(() => {
        if (gameState.completedGroups.length === 4) {
            handleGameWin();
        } else {
            // Re-render to show completed state
            renderGrid();
        }
    }, 1500);
}

// Handle incorrect guess
function handleIncorrectGuess() {
    gameState.mistakesRemaining--;
    
    // Mark tiles as incorrect
    gameState.selectedWords.forEach(word => {
        const tile = document.querySelector(`[data-word="${word}"]`);
        if (tile) {
            tile.classList.add('incorrect');
            setTimeout(() => {
                tile.classList.remove('incorrect', 'selected');
            }, 1000);
        }
    });
    
    showMessage('Not quite! Try again.', 'error');
    updateMistakesDisplay();
    
    // Clear selection after animation
    setTimeout(() => {
        gameState.selectedWords = [];
        updateControlButtons();
    }, 1000);
    
    // Check if game is lost
    if (gameState.mistakesRemaining === 0) {
        setTimeout(() => {
            handleGameLose();
        }, 1500);
    }
}

// Handle game win
function handleGameWin() {
    showMessage('🎉 Congratulations! You found all four groups! 🎉', 'success');
    updateStats(true);
    
    // Disable all tiles
    document.querySelectorAll('.word-tile').forEach(tile => {
        tile.style.cursor = 'not-allowed';
    });
    
    // Disable buttons
    document.getElementById('submitBtn').disabled = true;
    document.getElementById('deselectBtn').disabled = true;
}

// Handle game lose
function handleGameLose() {
    showMessage('Game Over! Better luck next time!', 'error');
    updateStats(false);
    
    // Reveal all groups
    gameData.groups.forEach(group => {
        if (!gameState.completedGroups.some(g => g.category === group.category)) {
            showMessage(`You missed: ${group.category} - ${group.words.join(', ')}`, 'info');
        }
    });
    
    // Disable all tiles
    document.querySelectorAll('.word-tile').forEach(tile => {
        tile.style.cursor = 'not-allowed';
    });
    
    // Disable buttons
    document.getElementById('submitBtn').disabled = true;
    document.getElementById('deselectBtn').disabled = true;
}

// Update mistakes display
function updateMistakesDisplay() {
    const mistakesEl = document.getElementById('mistakesRemaining');
    mistakesEl.innerHTML = '';
    
    for (let i = 0; i < 4; i++) {
        const dot = document.createElement('span');
        dot.className = 'mistake-dot';
        if (i >= gameState.mistakesRemaining) {
            dot.classList.add('lost');
        }
        mistakesEl.appendChild(dot);
    }
}

// Show message
function showMessage(text, type = 'info') {
    const messageEl = document.getElementById('message');
    messageEl.textContent = text;
    messageEl.className = `message ${type}`;
    
    // Clear message after 3 seconds
    setTimeout(() => {
        messageEl.textContent = '';
        messageEl.className = 'message';
    }, 3000);
}

// Shuffle button handler
function shuffleGrid() {
    if (gameState.completedGroups.length === 4) {
        return; // Game is over
    }
    
    // Only shuffle non-completed words
    const completedWords = gameState.completedGroups.flatMap(g => g.words);
    const nonCompletedWords = gameData.allWords.filter(w => !completedWords.includes(w));
    const completedWordsInOrder = gameData.allWords.filter(w => completedWords.includes(w));
    
    shuffleWords();
    
    // Re-render
    renderGrid();
    gameState.shuffled = true;
}

// Stats management
function loadStats() {
    const stats = JSON.parse(localStorage.getItem('connectionsStats') || '{}');
    document.getElementById('gamesPlayed').textContent = stats.gamesPlayed || 0;
    document.getElementById('gamesWon').textContent = stats.gamesWon || 0;
    document.getElementById('currentStreak').textContent = stats.currentStreak || 0;
}

function updateStats(won) {
    const stats = JSON.parse(localStorage.getItem('connectionsStats') || '{}');
    stats.gamesPlayed = (stats.gamesPlayed || 0) + 1;
    
    if (won) {
        stats.gamesWon = (stats.gamesWon || 0) + 1;
        stats.currentStreak = (stats.currentStreak || 0) + 1;
    } else {
        stats.currentStreak = 0;
    }
    
    localStorage.setItem('connectionsStats', JSON.stringify(stats));
    loadStats();
}

// Setup event listeners
function setupEventListeners() {
    // Control buttons
    document.getElementById('shuffleBtn').addEventListener('click', shuffleGrid);
    document.getElementById('deselectBtn').addEventListener('click', deselectAll);
    document.getElementById('submitBtn').addEventListener('click', submitGuess);
    
    // Modal buttons
    const helpBtn = document.getElementById('helpBtn');
    const statsBtn = document.getElementById('statsBtn');
    const helpModal = document.getElementById('helpModal');
    const statsModal = document.getElementById('statsModal');
    
    helpBtn.addEventListener('click', () => {
        helpModal.style.display = 'block';
    });
    
    statsBtn.addEventListener('click', () => {
        statsModal.style.display = 'block';
    });
    
    // Close modals
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            e.target.closest('.modal').style.display = 'none';
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
    
    // Hint button (shows a random hint)
    document.getElementById('hintBtn').addEventListener('click', () => {
        const incompleteGroups = gameData.groups.filter(group => 
            !gameState.completedGroups.some(g => g.category === group.category)
        );
        
        if (incompleteGroups.length > 0) {
            const randomGroup = incompleteGroups[Math.floor(Math.random() * incompleteGroups.length)];
            const hintWord = randomGroup.words[Math.floor(Math.random() * randomGroup.words.length)];
            showMessage(`Hint: One word in this group is "${hintWord}"`, 'info');
        } else {
            showMessage('You\'ve completed all groups!', 'success');
        }
    });
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', initGame);

