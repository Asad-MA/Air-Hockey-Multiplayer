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
        console.log(this.game.config.physics.default);
        this.scaleFactor = this.sys.game.config.physics.scaleFactor;
        // Choose Physics Manager (Arcade or Matter)
        if (this.game.config.physics.default === 'matter') {
            this.physicsManager = new MatterPhysicsManager(this);
        } else {
            this.physicsManager = new ArcadePhysicsManager(this);
        }
 
        this.matter.add.pointerConstraint({ length: 1, stiffness: 0.6 });
        // this.matter.world.setBounds();
        this.anims.create({
            key: 'impactAnim',
            frames: this.anims.generateFrameNumbers('impactEffect', { start: 2, end: 5 }), // Adjust frame count
            frameRate: 15,
            repeat: 0
        });

        this.gameFrame = new GameWorld(this);
        this.paddle = new Paddle(this, this.gameFrame.frameX + this.gameFrame.frameWidth / 2, this.gameFrame.frameY + this.gameFrame.frameHeight - 50, 'paddle1');
        this.puck = new Puck(this, this.gameFrame.frameX + this.gameFrame.frameWidth / 2, this.gameFrame.frameY + this.gameFrame.frameHeight / 2, 'puck');
    
        // this.matter.world.setBounds(this.gameFrame.frameX , this.gameFrame.frameY , this.gameFrame.frameWidth - 10, this.gameFrame.frameHeight -10);

        this.physicsManager.addGameObject(this.paddle, { shape: 'circle' });
        this.physicsManager.addGameObject(this.puck, { shape: 'circle' , radius: 5 });

        this.puck.setCircle(this.puck.WIDTH/2 * this.scaleFactor);    
        this.paddle.setCircle(this.paddle.WIDTH/2 * this.scaleFactor);

        this.physicsManager.addCollider(this.paddle, this.puck);
        this.physicsManager.addCollider(this.puck, this.gameFrame.frameParts, this.hitFrame);

        // this.physicsManager.setBounce(this.paddle, 1);
        this.physicsManager.setBounce(this.puck, 1);
    
        this.cursors = this.input.keyboard.createCursorKeys();

        // Handling dragging the paddle
        this.paddle.setInteractive({draggable: true});
        this.paddle.setMass(10000000);
        this.input.setDraggable(this.paddle);   
        // this.paddle.setStatic(true);
        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            this.paddle.x = Phaser.Math.Clamp(pointer.x, this.gameFrame.frameX + 70, this.gameFrame.frameX + this.gameFrame.frameWidth - 70);
            this.paddle.y = Phaser.Math.Clamp(pointer.y, this.gameFrame.frameY + 70, this.gameFrame.frameY + this.gameFrame.frameHeight - 70);
            // Send new position to the server probably we use Network class here to send the data
            // this.sendPlayerPosition({
            //     x: this.paddle.x,
            //     y: this.paddle.y
            // });
        });

        this.input.on('dragend', (pointer, gameObject) => {
            this.paddle.setVelocity(0, 0); // Stop the paddle when dragging ends
        })
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
        // const maxSpeed = 10; // Maximum speed for the puck
        // console.log(this.puck.body.velocity);     
        // this.puck.setVelocity(Phaser.Math.Clamp(this.puck.body.velocity.x, -maxSpeed, maxSpeed), Phaser.Math.Clamp(this.puck.body.velocity.x, -maxSpeed, maxSpeed)); // Stop puck movement for testing 
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