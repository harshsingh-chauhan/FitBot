document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');
    const suggestionChips = document.querySelectorAll('.chip');

    function createMessage(content, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = content;
        
        messageDiv.appendChild(messageContent);
        return messageDiv;
    }

    function createTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator bot-message';
        indicator.innerHTML = `
            <div class="message-content">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        return indicator;
    }

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function sendMessage(message) {
        // Add user message
        chatMessages.appendChild(createMessage(message, true));
        userInput.value = '';
        scrollToBottom();

        // Add typing indicator
        const typingIndicator = createTypingIndicator();
        chatMessages.appendChild(typingIndicator);
        scrollToBottom();

        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            
            // Remove typing indicator
            typingIndicator.remove();
            
            // Add bot response
            chatMessages.appendChild(createMessage(data.response));
            scrollToBottom();

        } catch (error) {
            console.error('Error:', error);
            typingIndicator.remove();
            chatMessages.appendChild(createMessage('Sorry, I encountered an error. Please try again.'));
            scrollToBottom();
        }
    }

    // Handle form submission
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const message = userInput.value.trim();
        if (!message) return;
        await sendMessage(message);
    });

    // Handle suggestion chips
    suggestionChips.forEach(chip => {
        chip.addEventListener('click', async () => {
            const message = chip.textContent.trim();
            await sendMessage(message);
        });
    });

    // Auto-focus input field
    userInput.focus();
});

// Theme handling
const themeToggle = document.querySelector('.theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Initialize theme
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
    } else if (prefersDarkScheme.matches) {
        document.body.setAttribute('data-theme', 'dark');
    } else {
        document.body.setAttribute('data-theme', 'light');
    }
}

// Toggle theme
themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// Modal handling
const signupBtn = document.getElementById('signupBtn');
const signinBtn = document.getElementById('signinBtn');
const signupModal = document.getElementById('signupModal');
const signinModal = document.getElementById('signinModal');
const closeButtons = document.querySelectorAll('.close-modal');

// Show modal
function showModal(modal) {
    modal.classList.add('active');
}

// Hide modal
function hideModal(modal) {
    modal.classList.remove('active');
}

// Event listeners for buttons
signupBtn.addEventListener('click', () => showModal(signupModal));
signinBtn.addEventListener('click', () => showModal(signinModal));

// Close button handlers
closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        hideModal(signupModal);
        hideModal(signinModal);
    });
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === signupModal) hideModal(signupModal);
    if (e.target === signinModal) hideModal(signinModal);
});

// Form submission handling
const signupForm = document.getElementById('signupForm');
const signinForm = document.getElementById('signinForm');

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    try {
        // Here you would typically make an API call to your backend
        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            hideModal(signupModal);
            alert('Sign up successful!');
            // Handle successful signup (e.g., redirect or update UI)
        } else {
            const data = await response.json();
            alert(data.message || 'Sign up failed!');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during sign up');
    }
});

signinForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signinEmail').value;
    const password = document.getElementById('signinPassword').value;

    try {
        // Here you would typically make an API call to your backend
        const response = await fetch('/api/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            hideModal(signinModal);
            alert('Sign in successful!');
            // Handle successful signin (e.g., redirect or update UI)
        } else {
            const data = await response.json();
            alert(data.message || 'Sign in failed!');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during sign in');
    }
});

// Initialize theme on page load
initializeTheme(); 