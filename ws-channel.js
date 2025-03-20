import { WebSocketServer } from "ws";
import dotenv from 'dotenv';
import AuthService from "./services/authService.js";
import cookie from 'cookie';
import { json } from "express";
const PORT = process.env.WSPORT || 7000;

const wss = new WebSocketServer({ port: PORT });

const ONLINEPLAYERS = new Map();

wss.on('connection', (ws , req) => {
    console.log('connected');
    const token = cookie.parse(req.headers.cookie).token;
    let user = null;
    AuthService.verifyToken(token)
    .then((data) => {
        console.log(data);
        user = data.email;

        ONLINEPLAYERS.set(user , ws);
        broadcastMessage('onlinePlayers' , ONLINEPLAYERS.size);
    }).catch((err) => {
        console.log(err.message);
        ws.close();
    });

    ws.on('message', (message) => {
        console.log('received: %s', message);
        // ws.send('Hello from server');
    });

    ws.on('close', ()=>  {
        console.log('disconnected');
        ONLINEPLAYERS.delete(user);
        broadcastMessage('onlinePlayers' , ONLINEPLAYERS.size);
    });
});


function broadcastMessage(type , message){
    for (const ws of ONLINEPLAYERS.values()) {
        console.log("Boardcasting");
        if (ws.readyState === ws.OPEN) {
            ws.send(JSON.stringify({type , message}));
        }
    }
}

console.log(`WebSocket Server running on port ${PORT}`);

export default wss;