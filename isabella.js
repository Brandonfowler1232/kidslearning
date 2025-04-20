const learningContent = {
    colors: [
        { name: 'Red', backgroundColor: '#ff0000' },
        { name: 'Blue', backgroundColor: '#0000ff' },
        { name: 'Green', backgroundColor: '#00ff00' },
        { name: 'Yellow', backgroundColor: '#ffff00' },
        { name: 'Purple', backgroundColor: '#800080' },
        { name: 'Orange', backgroundColor: '#ffa500' }
    ],
    shapes: [
        { name: 'Circle', shape: '⭕' },
        { name: 'Square', shape: '⬛' },
        { name: 'Triangle', shape: '🔺' },
        { name: 'Rectangle', shape: '▅' },
        { name: 'Star', shape: '⭐' }
    ],
    numbers: Array.from({ length: 10 }, (_, i) => ({
        name: (i + 1).toString(),
        value: i + 1
    }))
};

let currentScore = 0;
let currentQuestion = null;
let currentSection = 'colors';

function createQuiz(section) {
    const items = learningContent[section];
    currentQuestion = items[Math.floor(Math.random() * items.length)];
    
    const mainContent = document.createElement('div');
    mainContent.className = 'learning-content';
    
    const questionText = document.createElement('h3');
    questionText.textContent = `Can you find the ${currentQuestion.name}?`;
    mainContent.appendChild(questionText);

    const scoreDisplay = document.createElement('div');
    scoreDisplay.className = 'score';
    scoreDisplay.textContent = `Score: ${currentScore}`;
    mainContent.appendChild(scoreDisplay);

    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'options-container';

    // Shuffle items and create options
    const shuffledItems = [...items].sort(() => Math.random() - 0.5);
    shuffledItems.forEach(item => {
        const option = document.createElement('div');
        option.className = 'learning-item';
        
        if (section === 'colors') {
            option.style.backgroundColor = item.backgroundColor;
        } else if (section === 'shapes') {
            option.textContent = item.shape;
        } else {
            option.textContent = item.name;
        }

        option.addEventListener('click', () => checkAnswer(item, currentQuestion));
        optionsContainer.appendChild(option);
    });

    mainContent.appendChild(optionsContainer);
    return mainContent;
}

function checkAnswer(selected, correct) {
    // Update statistics in localStorage
    const stats = JSON.parse(localStorage.getItem('learningStats')) || {
        missedQuestions: {
            colors: {}, shapes: {}, numbers: {}
        },
        correctAnswers: {
            colors: {}, shapes: {}, numbers: {}
        }
    };

    if (selected.name === correct.name) {
        currentScore += 10;
        // Track correct answer
        if (!stats.correctAnswers[currentSection][correct.name]) {
            stats.correctAnswers[currentSection][correct.name] = 0;
        }
        stats.correctAnswers[currentSection][correct.name]++;
        showFeedback('✓ Correct!', 'success');
    } else {
        // Track missed answer
        if (!stats.missedQuestions[currentSection][correct.name]) {
            stats.missedQuestions[currentSection][correct.name] = 0;
        }
        stats.missedQuestions[currentSection][correct.name]++;
        showFeedback('Try again! 💪', 'error');
    }

    // Save updated stats
    localStorage.setItem('learningStats', JSON.stringify(stats));
    
    updateScore();
    setTimeout(() => {
        handleMenuClick(getCurrentSection());
    }, 1500);
}

function showFeedback(message, type) {
    const feedback = document.createElement('div');
    feedback.className = `feedback ${type}`;
    feedback.textContent = message;
    document.querySelector('.learning-content').appendChild(feedback);
    
    setTimeout(() => feedback.remove(), 1000);
}

function getCurrentSection() {
    return currentSection;
}

function updateScore() {
    const scoreDisplay = document.querySelector('.score');
    if (scoreDisplay) {
        scoreDisplay.textContent = `Score: ${currentScore}`;
    }
}

function handleMenuClick(section) {
    const existingContent = document.querySelector('.learning-content');
    if (existingContent) {
        existingContent.remove();
    }

    // Update current section
    currentSection = section;

    // Update active section
    document.querySelectorAll('.menu-card').forEach(card => {
        card.classList.remove('active-section');
        if (card.getAttribute('href') === `#${section}`) {
            card.classList.add('active-section');
        }
    });

    const quizContent = createQuiz(section);
    document.querySelector('.wrapper').appendChild(quizContent);
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    const menuCards = document.querySelectorAll('.menu-card');
    menuCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            const section = card.getAttribute('href').replace('#', '');
            handleMenuClick(section);
        });
    });

    // Start with colors section
    handleMenuClick('colors');
});