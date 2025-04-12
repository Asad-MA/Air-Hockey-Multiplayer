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
    console.log(this.game.config.physics.default);

    this.scaleFactor = this.sys.game.config.physics.scaleFactor;
    // Choose Physics Manager (Arcade or Matter)
    if (this.game.config.physics.default === 'matter') {
      this.physicsManager = new MatterPhysicsManager(this);
    } else {
      this.physicsManager = new ArcadePhysicsManager(this);
    }

    // this.matter.add.pointerConstraint({ length: 1, stiffness: 0.2 });
    // this.matter.world.setBounds();
    this.anims.create({
      key: 'impactAnim',
      frames: this.anims.generateFrameNumbers('impactEffect', { start: 2, end: 5 }), // Adjust frame count
      frameRate: 15,
      repeat: 0
    });

    this.gameFrame = new GameWorld(this);

    console.table({
      'physics': this.game.config.physics.default,
      'frameX': this.gameFrame.frameX,
      'frameY': this.gameFrame.frameY,
      'frameWidth': this.gameFrame.frameWidth,
      'frameHeight': this.gameFrame.frameHeight, 
      'scaleFactor': this.scaleFactor
    });
    //this.paddle = new Paddle(this, this.gameFrame.frameX + this.gameFrame.frameWidth / 2, this.gameFrame.frameY + this.gameFrame.frameHeight - 50, 'paddle1');
    //    this.puck = new Puck(this, this.gameFrame.frameX + this.gameFrame.frameWidth / 2, this.gameFrame.frameY + this.gameFrame.frameHeight / 2, 'puck');

    this.paddle = this.physics.add.sprite(this.gameFrame.frameX + this.gameFrame.frameWidth / 2, this.gameFrame.frameY + this.gameFrame.frameHeight - 50, "paddle1").setDisplaySize(100, 100);
    this.puck = this.physics.add.sprite(this.gameFrame.frameX + this.gameFrame.frameWidth / 2, ( this.gameFrame.frameHeight / 2), "puck").setDisplaySize(50, 50).setOrigin(0.5, 0.5); 


    this.puck.setCircle(80, 35, 35);
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

    this.physics.add.collider(this.puck, this.paddle, () => {
      // Calculate collision normal (line connecting the centers of the two circles)
      const collisionNormal = new Phaser.Math.Vector2(
        this.puck.x - this.paddle.x,
        this.puck.y - this.paddle.y
      ).normalize();

      // console.log(this.puck.x , this.paddle.x)
      // Compute relative velocity
      const relativeVelocity = new Phaser.Math.Vector2(
        this.puck.body.velocity.x - this.paddle.tempVelocity.x,
        this.puck.body.velocity.y - this.paddle.tempVelocity.y
      );

      // Project relative velocity onto the collision normal
      const velocityAlongNormal = relativeVelocity.dot(collisionNormal);

      // If the objects are separating, no need to resolve collision
      if (velocityAlongNormal > 0) return;

      // Restitution (elasticity of the collision: 1 for perfectly elastic)
      const restitution = 1;

      // Calculate impulse scalar
      const impulseMagnitude =
        (-(1 + restitution) * velocityAlongNormal) /
        (1 / this.puck.body.mass + 1 / this.paddle.body.mass);

      // Compute impulse vector
      const impulse = collisionNormal.scale(impulseMagnitude);

      // Apply impulse to the puck's velocity
      this.puck.body.velocity.x -= impulse.x / this.puck.body.mass;
      this.puck.body.velocity.y -= impulse.y / this.puck.body.mass;

      // Apply impulse to the paddle's velocity (if it's movable)
      // this.paddle.tempVelocity.x += impulse.x / this.paddle.body.mass;
      // this.paddle.tempVelocity.y += impulse.y / this.paddle.body.mass;
    });





    this.paddle.setImmovable(true);

    // paddle1.setInteractive();

    this.paddle.setInteractive();

    // Allow dragging the ball with the mouse
    // this.input.setDraggable(paddle1);
    this.input.setDraggable(this.paddle);

    this.OtherPlayer = this.paddle;


    // Velocity Calculations
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    this.lastTime = 0;

    this.velocityX = 0;
    this.velocityY = 0;

    this.tempVel = new Phaser.Math.Vector2();

    // When dragging, set the ball's position to follow the mouse pointer
    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {

      const x = Phaser.Math.Clamp(pointer.x, this.gameFrame.frameX + 50, this.gameFrame.frameX + this.gameFrame.frameWidth - 50);
      const y = Phaser.Math.Clamp(pointer.y, this.gameFrame.frameY + 50, this.gameFrame.frameY + this.gameFrame.frameHeight - 50);


      gameObject.setPosition(x, y);

      // Vel Calculations
      const currentMouseX = x;
      const currentMouseY = y;
      const currentTime = performance.now(); // High-resolution timestamp

      if (this.lastTime !== 0) {
        // Ensure we have a previous time
        const deltaX = currentMouseX - this.lastMouseX;
        const deltaY = currentMouseY - this.lastMouseY;
        const deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds

        if (deltaTime > 0) {
          this.velocityX = deltaX / deltaTime;
          this.velocityY = deltaY / deltaTime;
        }

        this.tempVel.x = parseInt(this.velocityX.toFixed(2));
        this.tempVel.y = parseInt(this.velocityY.toFixed(2));

        this.paddle.tempVelocity = this.tempVel;
        // console.log(`Velocity X: ${velocityX.toFixed(2)} px/s, Velocity Y: ${velocityY.toFixed(2)} px/s`);
      }

      // Update previous values
      this.lastMouseX = currentMouseX;
      this.lastMouseY = currentMouseY;
      this.lastTime = currentTime;

      //  gameObject.body.position.x = dragX - 51;
      // gameObject.body.position.y = dragY - 51;



      //   this.positionPlayer.pos = {

      //       x: dragX,
      //       y: dragY
      //     };

      //     this.positionPlayer.vel = {
      //       x: this.tempVel.x,
      //       y:  this.tempVel.y
      //     }

      // console.log(gameObject.scene.time) dev
      //if(dataChannel.readyState == 'open'){
      // dataChannel.send(JSON.stringify(this.positionPlayer));
      // }
    });


    // this.input.setDraggable(this.paddle);

    this.physicsManager.addCollider(this.paddle, this.gameFrame.frameParts);
    // this.physicsManager.addCollider(this.puck, this.gameFrame.frameParts, this.hitFrame, this);


    // this.paddle.setStatic(true);
    // this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
    //   this.paddle.x = Phaser.Math.Clamp(pointer.x, this.gameFrame.frameX + 50, this.gameFrame.frameX + this.gameFrame.frameWidth - 50);
    //   this.paddle.y = Phaser.Math.Clamp(pointer.y, this.gameFrame.frameY + 50, this.gameFrame.frameY + this.gameFrame.frameHeight - 50);
    // Send new position to the server probably we use Network class here to send the data
    // this.sendPlayerPosition({
    //     x: this.paddle.x,
    //     y: this.paddle.y
    // });
    //  });


    // Velocity Calculations
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    this.lastTime = 0;

    this.velocityX = 0;
    this.velocityY = 0;

    this.tempVel = new Phaser.Math.Vector2();




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