class Chat {
    constructor() {
        this.socket = null;
        this.token = this.checkToken();
        this.username = null;
        this.userId = null;
        this.chatId = null;
    }

    init() {
        // Initialiser la connexion Socket.IO
        this.socket = io();

        // Écouter les événements Socket.IO
        this.socket.on('connect', () => {
            console.log('Connected to server');
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        this.socket.on('message', (message) => {
            this.displayMessage(message);
        });
    }

    login(userId, username) {
        axios.post('/api/login', {userId, username})
            .then((response) => {
                this.token = response.data.token;
                this.username = username;
                this.userId = userId;
                // Envoyer le token au client
                this.socket.emit('auth', this.token);
            })
            .catch((error) => {
            console.log(error);
        });
    }

    checkToken() {
        // Vérifier si un token est déjà stocké dans la session
        // Retourner le token ou null
    }

    createChat() {
        // Envoyer une demande POST pour créer un nouveau chat
        // Stocker l'ID du nouveau chat dans this.chatId
    }

    auth() {
        // Envoyer une demande à PHP pour générer un token
        // Stocker le token dans this.token
        // Envoyer le token au client
    }

    getUserInfo() {
        // Retourner les informations de l'utilisateur (nom d'utilisateur, ID)
    }

    sendMessage(message) {
        const message_data = {
            type: 'message',
            content: message,
            sender_name: this.username,
            sender_id: this.userId,
            sender_avatar: 'https://example.com/avatar.png',
        };
        this.socket.emit('message', message_data);
    }

    displayMessage(message) {
        const chatbox = document.querySelector('#chatbox');
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.innerHTML = `
            <div class="message-header">
            <img src="${message.sender_avatar}" class="message-avatar">
            <span class="message-sender">${message.sender_name}</span>
            </div>
            <div class="message-content">
            ${message.content}
            </div>
        `;
        chatbox.appendChild(messageElement);
        chatbox.scrollTop = chatbox.scrollHeight;
    }
}