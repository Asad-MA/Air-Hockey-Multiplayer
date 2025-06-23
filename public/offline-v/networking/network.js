const Client =   Colyseus.Client;

import { INetworkService } from './INetworkService.js';
import LatencyChecker from './LatencyChecker.js';
import MessageHandler from './MessageHandler.js';
import {config}  from '../../js/config.js';

console.log(config)

class ColyseusNetwork extends INetworkService {
    constructor(serverUrl , token) {
        super();
        this.client = new Client(serverUrl);
        this.client.auth.token = token;
        this.room = null;
        this.latencyChecker = new LatencyChecker();
        this.messageHandler = new MessageHandler();
    }

    async connect(roomName = 'LOBBY') {
        try {
            this.room = await this.client.joinOrCreate(roomName, { name: 'LOBBY ROOM' });
            console.log(`🎮 Joined room: ${this.room.roomId}`);

            this.setupListeners();
            // this.latencyChecker.start(this);
        } catch (error) {
            console.error('❌ Failed to join room:', error);
            throw error;
        }
    }

    async joinByID(ID){
        try {
            this.room = await this.client.joinById(ID, { name: 'LOBBY ROOM' });
            console.log(`🎮 Joined room: ${this.room.roomId}`);

            this.setupListeners();
            return this.room;
            // this.latencyChecker.start(this);
        } catch (error) {
            console.error('❌ Failed to join room:', error);
            throw error;
        }
    }

    setupListeners() {
        this.room.onMessage('*', (type, data) => {
            this.messageHandler.handle(type, data);
        });
    }

    sendMessage(type, data) {
        if (this.room) {
            this.room.send(type, data);
        }
    }

    addMessageListener(type, callback) {
        this.messageHandler.register(type, callback);
    }

    checkLatency() {
        this.sendMessage('ping', Date.now());
    }
}

export default new ColyseusNetwork(`ws://${config.baseUrl}:2567` , sessionStorage.getItem("token"));
