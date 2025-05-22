document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const chatOutput = document.getElementById('chat-output');
    const masterchiefAvatar = document.getElementById('masterchief-avatar'); // Get the image element

    // Optional: A simple way to make Master Chief's avatar "react" or indicate he's "typing"
    // For now, we'll just use it to ensure the image is loaded before chat starts.
    if (!masterchiefAvatar) {
        console.error("Master Chief avatar image not found!");
    }

    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const messageText = userInput.value.trim();
        if (messageText === '') return;

        appendMessage(messageText, 'user-message');
        userInput.value = '';

        // Basic pre-programmed responses
        let chiefResponse = "I need a weapon."; // Default response
        const lowerCaseMessage = messageText.toLowerCase();

        if (lowerCaseMessage.includes("hello") || lowerCaseMessage.includes("hi")) {
            chiefResponse = "Sir.";
        } else if (lowerCaseMessage.includes("how are you")) {
            chiefResponse = "Ready to fight.";
        } else if (lowerCaseMessage.includes("cortana")) {
            chiefResponse = "Her status is my concern.";
        } else if (lowerCaseMessage.includes("covenant")) {
            chiefResponse = "They're always trouble.";
        } else if (lowerCaseMessage.includes("flood")) {
            chiefResponse = "A single Flood spore can destroy a species.";
        } else if (lowerCaseMessage.includes("weapon")) {
            chiefResponse = "I need one.";
        } else if (lowerCaseMessage.includes("halo")) {
            chiefResponse = "When you first saw Halo, were you blinded by its majesty?";
        }


        // Simulate Chief "thinking" then responding
        setTimeout(() => {
            appendMessage(chiefResponse, 'chief-message');
        }, 500);
    }

    function appendMessage(text, className) {
        const messageElement = document.createElement('div');
        messageElement.classList.add(className);
        messageElement.textContent = text;
        chatOutput.appendChild(messageElement);
        chatOutput.scrollTop = chatOutput.scrollHeight; // Auto-scroll to the latest message
    }
});
