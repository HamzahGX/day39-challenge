const socket = io('ws://localhost:3500');

const activity = document.querySelector('.activity');
const msgInput = document.querySelector('#message-input');
const sendButton = document.querySelector('#send-button');
const usernameInput = document.getElementById('username');
const recipientEmailInput = document.getElementById('recipient-email'); // Added recipient's email input field

let username = ''; // Store the authenticated username

function sendMessage(e) {
    e.preventDefault();
    if (msgInput.value && username) {
        socket.emit('message', { username, message: msgInput.value });
        msgInput.value = '';
    }
    msgInput.focus();
}

sendButton.addEventListener('click', sendMessage);

// Handle username authentication
const authForm = document.getElementById('auth-form');

authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    username = usernameInput.value;

    // Get the recipient's email from the input field
    const recipientEmail = recipientEmailInput.value;

    // Send the username and recipient's email to the server for authentication
    socket.emit('authenticate', { username, recipientEmail });
});

// Listen for authentication success and error only once
socket.once('authenticationSuccess', (message) => {
    alert(message);
});

socket.once('authenticationError', (message) => {
    alert(message);
});

// Listen for messages
socket.on('message', (data) => {
    activity.textContent = '';
    const li = document.createElement('li');
    li.textContent = `${data.username}: ${data.message}`;
    document.querySelector('ul').appendChild(li);
});

msgInput.addEventListener('keypress', () => {
    socket.emit('activity', socket.id.substring(0, 5));
});

let activityTimer;
socket.on('activity', (username) => {
    activity.textContent = `${username} is typing...`;

    // Clear after 3 seconds
    clearTimeout(activityTimer);
    activityTimer = setTimeout(() => {
        activity.textContent = '';
    }, 3000);
});
