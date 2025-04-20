function loadStats() {
    const defaultStats = {
        missedQuestions: {
            colors: { Red: 0, Blue: 0, Green: 0, Yellow: 0, Purple: 0, Orange: 0 },
            shapes: { Circle: 0, Square: 0, Triangle: 0, Rectangle: 0, Star: 0 },
            numbers: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0, '10': 0 }
        },
        correctAnswers: {
            colors: { Red: 0, Blue: 0, Green: 0, Yellow: 0, Purple: 0, Orange: 0 },
            shapes: { Circle: 0, Square: 0, Triangle: 0, Rectangle: 0, Star: 0 },
            numbers: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0, '10': 0 }
        }
    };

    const savedStats = JSON.parse(localStorage.getItem('learningStats')) || defaultStats;
    return savedStats;
}

let performanceStats = loadStats();

setInterval(() => {
    performanceStats = loadStats();
    const currentView = document.querySelector('.stats-container');
    if (currentView) {
        const type = currentView.classList.contains('missed') ? 'missed' : 'correct';
        displayStats(type);
    }
}, 5000); // Refresh every 5 seconds

function displayStats(type) {
    // Remove any existing container
    const existingContainer = document.querySelector('.stats-container');
    if (existingContainer) {
        existingContainer.remove();
    }

    // Create new container
    const container = document.createElement('div');
    container.className = `stats-container ${type}`; // Add type class for tracking current view
    
    // Add a title for the section
    const viewTitle = document.createElement('h2');
    viewTitle.className = 'view-title';
    viewTitle.textContent = type === 'missed' ? 'Most Missed Questions' : 'Most Correct Answers';
    container.appendChild(viewTitle);

    const stats = type === 'missed' ? performanceStats.missedQuestions : performanceStats.correctAnswers;
    
    // Create sections for each category
    ['colors', 'shapes', 'numbers'].forEach(category => {
        const section = document.createElement('div');
        section.className = 'stats-section';
        
        const title = document.createElement('h3');
        title.textContent = `${category.charAt(0).toUpperCase() + category.slice(1)}`;
        section.appendChild(title);

        const items = Object.entries(stats[category])
            .sort(([,a], [,b]) => b - a)
            .forEach(([name, count]) => {
                if (count > 0) { // Only show items with counts > 0
                    const item = document.createElement('div');
                    item.className = 'stat-item';
                    item.innerHTML = `
                        <span class="item-name">${name}</span>
                        <span class="item-count">${count} times</span>
                    `;
                    section.appendChild(item);
                }
            });

        container.appendChild(section);
    });

    if (type === 'missed') {
        addRecommendations(container, performanceStats);
    }

    // Find the menu section and insert the container after it
    const menu = document.querySelector('.menu');
    menu.insertAdjacentElement('afterend', container);
}

function addRecommendations(container, stats) {
    const recommendSection = document.createElement('div');
    recommendSection.className = 'recommendations';
    
    const title = document.createElement('h2');
    title.textContent = 'Focus Areas';
    recommendSection.appendChild(title);

    // Find items with highest miss counts
    const problemAreas = [];
    ['colors', 'shapes', 'numbers'].forEach(category => {
        const items = Object.entries(stats.missedQuestions[category]);
        const mostMissed = items.sort(([,a], [,b]) => b - a)[0];
        if (mostMissed && mostMissed[1] > 0) {
            problemAreas.push({
                category,
                item: mostMissed[0],
                count: mostMissed[1]
            });
        }
    });

    if (problemAreas.length > 0) {
        const recommendations = document.createElement('ul');
        problemAreas.forEach(area => {
            const li = document.createElement('li');
            li.textContent = `Practice ${area.item} in ${area.category} (missed ${area.count} times)`;
            recommendations.appendChild(li);
        });
        recommendSection.appendChild(recommendations);
    } else {
        const message = document.createElement('p');
        message.textContent = 'Great job! No specific focus areas needed right now.';
        recommendSection.appendChild(message);
    }

    container.appendChild(recommendSection);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const menuCards = document.querySelectorAll('.menu-card');
    menuCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            const section = card.getAttribute('href').replace('#', '');
            if (section === 'most_missed') {
                displayStats('missed');
            } else if (section === 'correct') {
                displayStats('correct');
            }
            return false; // Additional prevention of default behavior
        });
    });
});