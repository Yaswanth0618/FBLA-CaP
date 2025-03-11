// FAQ Accordion
document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', function () {
        const answer = this.nextElementSibling;
        answer.style.display = (answer.style.display === "block") ? "none" : "block";
    });
});

// Chatbot Responses
const responses = [
    { pattern: /add.*transaction/i, response: "Go to the Transactions page, fill out the form, and click 'Add Transaction'." },
    { pattern: /edit.*transaction/i, response: "Click the 'Edit' button next to the transaction on the Transactions page." },
    { pattern: /delete.*account/i, response: "Currently, you need to contact support to delete your account. Email: support.wealthify@gmail.com." },
    { pattern: /reset.*password/i, response: "You can reach our support team at support.wealthify@gmail.com." },
    { pattern: /secure.*data/i, response: "Yes, Wealthify uses encrypted storage and Firebase authentication to keep your data safe." },
    { pattern: /categorize.*expenses/i, response: "Yes! When adding a transaction, select a category to organize your expenses." },
    { pattern: /export.*transactions/i, response: "Go to the Transactions page and click 'Download' to export your transactions as a CSV file." },
    { pattern: /mobile.*app/i, response: "Currently, Wealthify is only available as a web app, but a mobile app is in development." },
    { pattern: /budget/i, response: "Currently, we do not have a budgeting feature, but we are working on adding it soon!" },
    { pattern: /dark.*mode/i, response: "Dark mode is not available yet, but we plan to add it in future updates." },
    { pattern: /help|support/i, response: "You can reach our support team at support.wealthify@gmail.com." },
    { pattern: /hello|hi/i, response: "Hello! 👋 How can I assist you today?" },
    { pattern: /thank you|thanks/i, response: "You're welcome! 😊 Let me know if you need anything else." },
    { pattern: /bye/i, response: "Goodbye! Have a great day! 👋" }
];

// Function to Send Messages
function sendMessage() {
    const userInput = document.getElementById('user-input').value.trim();
    if (userInput === "") return;

    const chatMessages = document.getElementById('chat-messages');

    // Add user message to chat
    const userMessage = document.createElement('div');
    userMessage.innerHTML = `<strong>You:</strong> ${userInput}`;
    chatMessages.appendChild(userMessage);

    // Find the best response
    let botResponse = "I'm not sure about that. Try asking something else!";
    for (const entry of responses) {
        if (entry.pattern.test(userInput)) {
            botResponse = entry.response;
            break;
        }
    }

    // Add AI response with delay
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

// Initialize Chatbot Greeting Message
function initializeChatbot() {
    const chatMessages = document.getElementById('chat-messages');
    const greetingMessage = document.createElement('div');
    greetingMessage.innerHTML = `<strong>AI Bot:</strong> Hello! 👋 I'm your Wealthify assistant. How can I help you today?`;
    chatMessages.appendChild(greetingMessage);
}

// Attach Functions to Window for Global Access
window.sendMessage = sendMessage;
window.handleKeyPress = handleKeyPress;
window.onload = initializeChatbot;
