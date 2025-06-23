// import Network from '../networking/network.js';

class PlayerJoinScene extends Phaser.Scene {
    constructor() {
        super('PlayerJoinScene');
        this.roomID = document.getElementById('roomid').value;
    }

    preload() {
        // Load assets
        this.load.setBaseURL('./game-core/assets/');
        // this.load.image('background', 'textures/default-bg.png');
        this.load.image('avatarPlaceholder', 'textures/avatar-1.png');
        this.load.image('avatarPlaceholder1', 'textures/avatar-1.png');
    }

    async create() {
        // Set background
        this.add.image(this.scale.width / 2, this.scale.height / 2, 'background').setDisplaySize(this.scale.width, this.scale.height);

        const joining = this.add.text(this.scale.width / 2, 50, 'Joining Air Hockey Online...', {
            fontSize: '24px',
            fontWeight: 'bold',
            fill: '#fff'
        }).setOrigin(0.5);

        // Player Containers
        this.players = [];
        this.maxPlayers = 2;
        this.playerBoxes = [];
        // Join Lobby
        try {
            const room  = await this.joinGameRoom();

            console.log('Game Room: ' , room);

            joining.destroy();
            this.registerListeners();
            //Network.latencyChecker.start(Network);

            // Placeholder for "VS" (hidden initially)
            this.vsText = this.add.text(this.scale.width / 2, this.scale.height / 2, 'VS', {
                fontSize: '32px',
                fontWeight: 'bold',
                fill: '#ffcc00'
            }).setOrigin(0.5).setVisible(false);

            //Need to update this to add player when match found

            // Title Text
            this.add.text(this.scale.width / 2, 50, 'Waiting for Opponent...', {
                fontSize: '24px',
                fontWeight: 'bold',
                fill: '#fff'
            }).setOrigin(0.5);



        } catch (e) {
            console.log('ERROR:', e.message);
            joining.setText('Error While Joining Room: ' + e.message);
        }
        // Add Player

        //this.addPlayer({id: 'abcxgh', name: document.getElementById('playername').value , rank: 1});



        //Add Player Here
    }

    async joinGameRoom() {  
        this.gameRoom = await Network.joinByID(this.roomID);
        return this.gameRoom;
    }

    async joinLobby() {
        return await Network.connect('LOBBY');
    }

    async addPlayer(playerData) {
        if (this.players.length >= this.maxPlayers) return;

        console.log(playerData);

        let playerId = playerData.id; // Assuming playerData has an id property
        let playerName = playerData.name; // Assuming playerData has a name property`;
        let rank = ` ${Math.floor(Math.random() * 100) + 1}`; // Example rank

        this.players.push({ id: playerId, name: playerName, rank: 1, isHost: playerData.isHost });

        // Calculate positions
        let xPos = this.players.length === 1 ? this.scale.width / 6 : (this.scale.width * 3) / 4;
        let yPos = this.scale.height / 2;

        // Player Box
        let box = this.make.graphics();
        box.lineStyle(2, 0x9d47e0, 1); // Border color & width
        box.fillStyle(0x444444, 0.8); // Background color

        // Draw rounded rectangle (x, y, width, height, corner radius)
        // box.fillRoundedRect(xPos - 52, yPos - 52, 104, 104, 15);
        box.strokeRoundedRect(xPos - 52, yPos - 52, 104, 104, 15);
        this.playerBoxes.push(box);

        let mask = box.createGeometryMask();

        // Rank Text
        let rankText = this.add.text(xPos, yPos - 70, rank, {
            fontSize: '14px',
            fontWeight: 'bold',
            fill: '#ffcc00'
        }).setOrigin(0.5);

        // Avatar (Placeholder)
        let avatar = this.add.image(xPos, yPos, 'avatarPlaceholder').setDisplaySize(100, 100).setOrigin(0.5);
        // avatar.setMask(mask);
        // Player Name
        console.log(playerName);
        let nameText = this.add.text(xPos, yPos + 60, playerName, {
            fontSize: '16px',
            fill: '#fff'
        }).setOrigin(0.5);

            this.vsText.setVisible(true);
            
        
    }

    registerListeners() {
        Network.addMessageListener('pong', (serverTime) => {
            console.log('Latency:', serverTime);
            const clientTime = Date.now();
            this.latency = clientTime - serverTime;
            console.log(`📶 Latency: ${this.latency}ms`);
        });


        Network.addMessageListener('Player_Data',  async (message) => {
            console.log('Player:', message);
            
            // Redirect to game room
            // window.location.href = "/game";
        });

        Network.addMessageListener('pre_player_join', async (player) => {
            console.log('YOU Join the room:', player);
            // message.forEach((player) => {
                console.log('Player:', player);
                await this.addPlayer(player);
                console.log(this.players);
            // });
            // await this.addPlayer();
        });

        Network.addMessageListener('player_join', async (player) => {
            console.log('Player Join the room:', player);
            // message.forEach((player) => {
                console.log('Player:', player);
                await this.addPlayer(player);
                Network.sendMessage('ready', { message: player.name + ' is Ready!' });
                console.log(this.players);
            // });
            // await this.addPlayer();
        });


        Network.addMessageListener('ready', async (message) => {
            console.log('Ready:', message);
            this.vsText.setVisible(true);
            this.time.delayedCall(2000, () => {
                this.scene.start('Game'); // Transition to game
            });
        });

        Network.addMessageListener('__playground_message_types', async (message) => {
            console.log('Active Listeners:', message);
            // Redirect to game room
            // window.location.href = "/game";
        });
    }
}

export default PlayerJoinScene;
