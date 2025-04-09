import { WebSocketServer } from "ws";
import dotenv from 'dotenv';
import AuthService from "./services/authService.js";
import cookie from 'cookie';

dotenv.config(); // Load environment variables

const PORT = process.env.WSPORT || 7000;
const wss = new WebSocketServer({ port: PORT });
const ONLINEPLAYERS = new Map();

wss.on('connection', async (ws, req) => {
    console.log('connected');
    
    // Parse the cookie
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.token;

    if (!token) {
        console.log('No token found');
        ws.close();
        return;
    }

    try {
        // Verify the token
        const data = await AuthService.verifyToken(token);
        const user = data.email;

        // Add user to online players
        ONLINEPLAYERS.set(user, { ws, user });
        broadcastMessage('onlinePlayers', ONLINEPLAYERS.size);

        // Handle incoming messages
        ws.on('message', (message) => {
            console.log('received: %s', message);
            // ws.send('Hello from server');
        });

        // Handle disconnection
        ws.on('close', () => {
            console.log('disconnected');
            ONLINEPLAYERS.delete(user);
            broadcastMessage('onlinePlayers', ONLINEPLAYERS.size);
        });

    } catch (err) {
        console.log(err.message);
        ws.close();
    }
});

// Function to broadcast messages to all connected clients
function broadcastMessage(type, message) {
    for (const user of ONLINEPLAYERS.values()) {
        if (user.ws.readyState === user.ws.OPEN) {
            user.ws.send(JSON.stringify({ type, message }));
        }
    }
}

console.log(`WebSocket Server running on port ${PORT}`);

export default wss;