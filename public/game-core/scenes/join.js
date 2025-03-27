import Network from '../networking/network.js';

class PlayerJoinScene extends Phaser.Scene {
    constructor() {
        super('PlayerJoinScene');

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
            await this.joinLobby();
            joining.destroy();
            this.registerListeners();
            Network.latencyChecker.start(Network);

            // Placeholder for "VS" (hidden initially)
            this.vsText = this.add.text(this.scale.width / 2, this.scale.height / 2, 'VS', {
                fontSize: '32px',
                fontWeight: 'bold',
                fill: '#ffcc00'
            }).setOrigin(0.5).setVisible(false);

            await this.addPlayer(); //Need to update this to add player when match found

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





        //Add Player Here
    }

    async joinLobby() {
        return await Network.connect('LOBBY');
    }

    async addPlayer() {
        if (this.players.length >= this.maxPlayers) return;

        let playerId = this.players.length + 1;
        let playerName = `Player ${playerId}`;
        let rank = ` ${Math.floor(Math.random() * 100) + 1}`; // Example rank

        this.players.push({ id: playerId, name: playerName, rank });

        // Calculate positions
        let xPos = this.players.length === 1 ? this.scale.width / 6 : (this.scale.width * 3) / 6;
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
        let nameText = this.add.text(xPos, yPos + 60, playerName, {
            fontSize: '16px',
            fill: '#fff'
        }).setOrigin(0.5);

        // Show "VS" if both players joined
        if (this.players.length === 2) {
            this.vsText.setVisible(true);
            this.time.delayedCall(2000, () => {
                // this.scene.start('GameScene'); // Transition to game
            });
        }
    }

    registerListeners() {
        Network.addMessageListener('pong', (serverTime) => {
            console.log('Latency:', serverTime);
            const clientTime = Date.now();
            this.latency = clientTime - serverTime;
            console.log(`📶 Latency: ${this.latency}ms`);
        });


        Network.addMessageListener('Player_Data',  (message) => {
            console.log('Player:', message);
            // Redirect to game room
            // window.location.href = "/game";
        });

        Network.addMessageListener('match_found', async (message) => {
            console.log('Match Found:', message);
            // Redirect to game room
            // window.location.href = "/game";
        });

        Network.addMessageListener('__playground_message_types', async (message) => {
            console.log('Active Listeners:', message);
            // Redirect to game room
            // window.location.href = "/game";
        });
    }
}

export default PlayerJoinScene;
