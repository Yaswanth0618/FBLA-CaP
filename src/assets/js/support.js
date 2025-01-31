// FAQ Accordion
document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', function () {
        const answer = this.nextElementSibling;
        if (answer.style.display === "block") {
            answer.style.display = "none";
        } else {
            answer.style.display = "block";
        }
    });
});

// AI Chatbot - Expanded Responses
const responses = {
    "add transaction": "Go to the Transactions page, fill out the form, and click 'Add Transaction'.",
    "edit transaction": "Click the 'Edit' button next to the transaction on the Transactions page.",
    "delete account": "Currently, you need to contact support to delete your account. Email: support.wealthify@gmail.com.",
    "reset password": "Currently, you need to contact support to reset your password. Reach us at support.wealthify@gmail.com.",
    "secure data": "Yes, Wealthify uses encrypted storage and Firebase authentication to keep your data safe.",
    "change email": "Currently, you need to contact support to update your email. Reach us at support.wealthify@gmail.com.",
    "categorize expenses": "Yes! When adding a transaction, select a category (Food, Transport, Entertainment, etc.) to organize your expenses.",
    "mobile app": "Wealthify is currently only available as a web app, but a mobile app is in development!",
    "export transactions": "Yes! Go to the Transactions page and click 'Download' to export your transactions as a CSV file.",
    "set budget": "Currently, we do not have a budgeting feature, but we are working on adding it soon!",
    "multiple accounts": "No, currently each user is allowed only one Wealthify account.",
    "transaction limit": "There is no transaction limit. You can add as many as you need!",
    "customer support": "You can reach our support team at support.wealthify@gmail.com.",
    "forgot username": "Your username is your registered email. If you forgot it, contact support.",
    "change currency": "Currently, Wealthify only supports USD. Multi-currency support is in development.",
    "investment tracking": "We currently do not have an investment tracking feature, but it is in our roadmap.",
    "auto transaction import": "Auto-import from bank accounts is not supported yet, but we are working on it!",
    "dark mode": "Dark mode is not available yet, but we plan to add it in future updates."
};

// Initialize Chatbot Greeting Message
function initializeChatbot() {
    const chatMessages = document.getElementById('chat-messages');
    const greetingMessage = document.createElement('div');
    greetingMessage.innerHTML = `<strong>AI Bot:</strong> Hello! 👋 I'm your Wealthify assistant. How can I help you today?`;
    chatMessages.appendChild(greetingMessage);
}

// Function to Send Messages
function sendMessage() {
    const userInput = document.getElementById('user-input').value.trim().toLowerCase();
    if (userInput === "") return;

    const chatMessages = document.getElementById('chat-messages');

    // Add user message to chat
    const userMessage = document.createElement('div');
    userMessage.innerHTML = `<strong>You:</strong> ${userInput}`;
    chatMessages.appendChild(userMessage);

    // AI Response - Find Best Match
    let botResponse = "I'm not sure about that. Please try rephrasing your question.";
    for (const [question, response] of Object.entries(responses)) {
        if (userInput.includes(question)) {
            botResponse = response;
            break;
        }
    }

    setTimeout(() => {
        const botMessage = document.createElement('div');
        botMessage.innerHTML = `<strong>AI Bot:</strong> ${botResponse}`;
        chatMessages.appendChild(botMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1000);

    document.getElementById('user-input').value = "";
}

// Handle Enter Key Submission
function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

// Attach Functions to Window for Global Access
window.sendMessage = sendMessage;
window.handleKeyPress = handleKeyPress;
window.onload = initializeChatbot; // Initialize Chatbot Greeting on Page Load
