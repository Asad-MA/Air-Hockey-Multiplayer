import Network from '../networking/network.js';
import GameWorld from '../components/world.js';
import Paddle from '../components/paddle.js';
import Puck from '../components/puck.js';
import ArcadePhysicsManager from '../physics/arcadePhysicsManager.js';
import MatterPhysicsManager from '../physics/matterPhysicsManager.js';


class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' });
    this.isGoal = false;
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
  // this.remotePaddle = this.physics.add.sprite(400, 50, 'this.paddle').setImmovable(true);

  // this.physics.add.collider(this.puck, this.playerPaddle);
  // this.physics.add.collider(this.puck, this.remotePaddle);

  // this.playerPaddle.setInteractive();

  // // Allow dragging the ball with the mouse
  // this.input.setDraggable(this.playerPaddle);
  // // this.input.setDraggable(this.paddle);

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

    const goalText = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      'GOAL!',
      {
        fontSize: '64px',
        fontFamily: 'Arial',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 6
      }
    ).setOrigin(0.5).setDepth(10000).setVisible(false);
    console.log(this.game.config.physics.default);

    this.scaleFactor = this.sys.game.config.physics.scaleFactor;
    // Choose Physics Manager (Arcade or Matter)
    if (this.game.config.physics.default === 'matter') {
      this.physicsManager = new MatterPhysicsManager(this);
    } else {
      this.physicsManager = new ArcadePhysicsManager(this);
    }

    this.gameFrame = new GameWorld(this);
    this.defaultPuckPosition = {
      x: this.gameFrame.frameX + this.gameFrame.frameWidth / 2,
      y: this.gameFrame.frameY + this.gameFrame.frameHeight / 2 
    };

    this.anims.create({
      key: 'impactAnim',
      frames: this.anims.generateFrameNumbers('impactEffect', { start: 2, end: 5 }), // Adjust frame count
      frameRate: 15,
      repeat: 0
    });

    

    console.table({
      'physics': this.game.config.physics.default,
      'frameX': this.gameFrame.frameX,
      'frameY': this.gameFrame.frameY,
      'frameWidth': this.gameFrame.frameWidth,
      'frameHeight': this.gameFrame.frameHeight, 
      'scaleFactor': this.scaleFactor
    });

    this.paddle = this.physics.add.sprite(this.gameFrame.frameX + this.gameFrame.frameWidth / 2, this.gameFrame.frameY + this.gameFrame.frameHeight - 50, "paddle1").setDisplaySize(100, 100);
    this.puck = this.physics.add.sprite(this.defaultPuckPosition.x  , this.defaultPuckPosition.y , "puck").setDisplaySize(64, 64).setOrigin(0.5, 0.5); 


    this.puck.body.setCircle(64, 64, 64);
    this.puck.setMass(0.8);

    // paddle1.setCircle(51, 0, 0);
    this.paddle.setCircle(100, 30, 30);

    console.log(this.puck)
    this.puck.setBounce(0.8);
    this.puck.setFriction(10, 10);
    this.puck.setDrag(10, 10)
    this.puck.setMaxVelocity(1000);

    this.puck.setCollideWorldBounds(true);

    this.physics.add.collider(this.paddle, this.gameFrame.frameParts)
    this.physics.add.collider(this.puck, this.gameFrame.frameParts)
    this.physics.add.collider(this.puck, this.paddle);
    this.physics.add.overlap(this.puck , this.gameFrame.goals, (puck, goal) => {
      console.log(goal.texture.key, goal.body.position?.y)
       if(this.isGoal) return;
      //this.physics.pause(); // Pause the game
      this.isGoal = true;
      console.log('Goal!');
      goalText.setVisible(true);
      this.cameras.main.shake(500, 0.01)
      // this.cameras.main.flash(250, 255, 255, 255);
      this.puck.setPosition(this.defaultPuckPosition.x, this.defaultPuckPosition.y);
      this.puck.setVelocity(0, 0);
     // this.physics.world.pause(); // Pause the game
      this.input.enabled = false;
      
      this.paddle.setVelocity(0, 0);  
      this.time.delayedCall(2000, () => {
       // this.physics.world.resume();
        this.isGoal = false;
        goalText.setVisible(false);
        this.input.enabled = true;
        // this.paddle.body.reset()
      }, [], this);
      
    })

    this.paddle.setImmovable(true);
    this.paddle.setDirectControl(true)
    this.paddle.setInteractive();
    this.input.setDraggable(this.paddle);
    this.OtherPlayer = this.paddle;


    // When dragging, set the ball's position to follow the mouse pointer
    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {

      const x = Phaser.Math.Clamp(pointer.x, this.gameFrame.frameX + 50, this.gameFrame.frameX + this.gameFrame.frameWidth - 50);
      const y = Phaser.Math.Clamp(pointer.y, this.gameFrame.frameY + 50, this.gameFrame.frameY + this.gameFrame.frameHeight - 50);


      gameObject.setPosition(x, y);

 
    });

    this.physicsManager.addCollider(this.paddle, this.gameFrame.frameParts);
  

  }

  hitFrame(puck, framePart) {

    framePart.play(framePart.texture.key + 'Hit');
    // Create impact effect at collision point
    const impact = this.physics.add.sprite(puck.x - 30, puck.y, 'impactEffect');
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
    Network.sendMessage('position', x);
  }

  receiveRemotePosition(x) {
    console.log('receving Remote positions: ', x)
    // Placeholder for receiving opponent's position
    this.remotePaddle.x = 800 - x.x;
    this.remotePaddle.y = 600 - x.y;
  }

  resize() {
    this.gameFrame.frameParts.forEach(part => part.destroy());
    this.puck.destroy();
    this.paddle.destroy();
    this.gameFrame.bg.destroy()
    //this.create()
    //this.gameFrame = new GameWorld(this);
  }
}

export default Game;