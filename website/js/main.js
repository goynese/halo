// Halo: Combat Evolved Short Stories - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Add futuristic UI effects
    addHologramEffect();
    
    // Handle navigation highlighting
    highlightCurrentPage();
    
    // Add scroll animations
    addScrollAnimations();
});

// Add hologram effect to UI elements
function addHologramEffect() {
    const hologramElements = document.querySelectorAll('.hologram');
    
    hologramElements.forEach(element => {
        // Add subtle animation to hologram elements
        element.addEventListener('mouseover', function() {
            this.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.4)';
            this.style.transform = 'translateY(-2px)';
        });
        
        element.addEventListener('mouseout', function() {
            this.style.boxShadow = '0 0 10px rgba(0, 255, 255, 0.2)';
            this.style.transform = 'translateY(0)';
        });
    });
}

// Highlight current page in navigation
function highlightCurrentPage() {
    const currentPage = window.location.pathname;
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        
        if (currentPage.includes(linkPath) && linkPath !== '/') {
            link.parentElement.classList.add('active');
        } else if (currentPage === '/' && linkPath === '/') {
            link.parentElement.classList.add('active');
        }
    });
}

// Add scroll animations to elements
function addScrollAnimations() {
    const storyCards = document.querySelectorAll('.story-card');
    const storyContent = document.querySelectorAll('.story-content');
    const elements = [...storyCards, ...storyContent];
    
    // Simple animation on scroll
    window.addEventListener('scroll', function() {
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    });
    
    // Initialize elements
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Trigger initial check
    window.dispatchEvent(new Event('scroll'));
}

// Terminal-like typing effect for text elements
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Add futuristic cursor effect to elements
function addCursorEffect(element) {
    const cursor = document.createElement('span');
    cursor.classList.add('cursor');
    cursor.innerHTML = '|';
    cursor.style.animation = 'blink 1s infinite';
    element.appendChild(cursor);
}

// Create a CSS animation for the cursor
const style = document.createElement('style');
style.innerHTML = `
    @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
    }
`;
document.head.appendChild(style); 