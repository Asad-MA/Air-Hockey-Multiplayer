import Network from '../networking/network.js';
import GameWorld from '../components/world.js';
import Paddle from '../components/paddle.js';
import Puck from '../components/puck.js';
import ArcadePhysicsManager from '../physics/arcadePhysicsManager.js';
import MatterPhysicsManager from '../physics/matterPhysicsManager.js';


class Game extends Phaser.Scene {
    constructor() {
        super({ key: 'Game' });
    }
    preload() {
        this.room = this.scene.get('PlayerJoinScene').gameRoom;
        this.players = this.scene.get('PlayerJoinScene').players;
       this.physicsManager = null;
        // this.remotePlayerX = 0;
        // this.remotePaddle;
    }
    //create() {

       // new GameWorld(this);
       // this.paddle = new Paddle(this, this.scale.width / 2, this.scale.height - 50, 'paddle');
       // this.puck = new Puck(this, this.scale.width / 2, this.scale.height / 2, 'puck');

      //  this.physics.add.collider(this.paddle, this.puck);
       // this.cursors = this.input.keyboard.createCursorKeys();

        // this.cursors = this.input.keyboard.createCursorKeys();
        
        // this.puck = this.physics.add.sprite(400, 300, 'puck').setCollideWorldBounds(true).setBounce(1);
        // this.playerPaddle = this.physics.add.sprite(400, 550, 'paddle1').setImmovable(true);
        // this.remotePaddle = this.physics.add.sprite(400, 50, 'paddle2').setImmovable(true);

        // this.physics.add.collider(this.puck, this.playerPaddle);
        // this.physics.add.collider(this.puck, this.remotePaddle);

        // this.playerPaddle.setInteractive();

        // // Allow dragging the ball with the mouse
        // this.input.setDraggable(this.playerPaddle);
        // // this.input.setDraggable(paddle2);

        // // Input Handling
        // this.input.on('drag', (pointer , gameObject, dragX, dragY) => {
        //     console.log(pointer)
        //     this.playerPaddle.x = Phaser.Math.Clamp(pointer.x, 50, 750);
        //     this.playerPaddle.y = Phaser.Math.Clamp(pointer.y, 50, 750);
        //     // Send new position to the server
        //     this.sendPlayerPosition({
        //        x: this.playerPaddle.x,
        //        y: this.playerPaddle.y
        //     });
        // });

        // Network.addMessageListener('remote_position' , this.receiveRemotePosition.bind(this))
   // }

    create() {
        console.log(this);
        
        // Choose Physics Manager (Arcade or Matter)
        if (this.game.config.physics.default === 'matter') {
            this.physicsManager = new MatterPhysicsManager(this);
        } else {
            this.physicsManager = new ArcadePhysicsManager(this);
        }
 
        this.anims.create({
            key: 'impactAnim',
            frames: this.anims.generateFrameNumbers('impactEffect', { start: 2, end: 5 }), // Adjust frame count
            frameRate: 15,
            repeat: 0
        });

        this.gameFrame = new GameWorld(this);
        this.paddle = new Paddle(this, this.gameFrame.frameX + this.gameFrame.frameWidth / 2, this.gameFrame.frameY + this.gameFrame.frameHeight - 50, 'paddle1');
        this.puck = new Puck(this, this.gameFrame.frameX + this.gameFrame.frameWidth / 2, this.gameFrame.frameY + this.gameFrame.frameHeight / 2, 'puck');
    
        this.physicsManager.addCollider(this.paddle, this.puck, this.hitFrame);
        this.physicsManager.addCollider(this.puck, this.gameFrame.frameParts, this.hitFrame);
    
        this.cursors = this.input.keyboard.createCursorKeys();
    }
    
    hitFrame(puck, framePart) {
        framePart.play(framePart.texture.key + 'Hit');
         // Create impact effect at collision point
        const impact = this.add.sprite(puck.x-30, puck.y, 'impactEffect');
        impact.setScale(0.05).play('impactAnim');

        // Remove the impact effect after animation completes
        impact.on('animationcomplete', () => {
            impact.destroy();
        });
    }
    

    update() {
        // console.log(this);
        // Simulate remote player movement (Replace with actual WebSocket data)
        if (this.remotePlayerX !== undefined) {
            this.remotePaddle.x = this.remotePlayerX;
            this.remotePaddle.y = this.remotePlayerY;
        }
    }

    sendPlayerPosition(x) {
        Network.sendMessage('position' , x);
    }

    receiveRemotePosition(x) {
        console.log('receving Remote positions: ' , x)
        // Placeholder for receiving opponent's position
        this.remotePaddle.x = 800 - x.x;
        this.remotePaddle.y = 600 - x.y;
    }
}

export default Game;