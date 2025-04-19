import Network from '../networking/network.js';
import GameWorld from '../components/world.js';
import Paddle from '../components/paddle.js';
import Puck from '../components/puck.js';
import ArcadePhysicsManager from '../physics/arcadePhysicsManager.js';
import MatterPhysicsManager from '../physics/matterPhysicsManager.js';
import { GameState } from '../gamestate.js';


class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' });
    this.isGoal = false;
    this.goals = 0;
    this.remoteGoals = 0;
    this.remotePlayer = {};
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

    this.music = this.sound.add('glitch', { volume: 0.8 });
    this.bgMusic = this.sound.add('bg-music', { volume: 0.3 });
    this.bgMusic.play({ loop: true });
    this.bgMusicNeon = this.sound.add('neon', { volume: 0.05 });
    this.puckhit = this.sound.add('hit', { volume: 1 });


    // this.add.image(this.scale.width / 2, this.scale.height / 2, 'gamebg').setDisplaySize(this.scale.width, this.scale.height);

    // this.bgMusicNeon.play({loop: true});
    // this.music.setSeek(1000);

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
    this.gameState = new GameState(this);

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
      'virtualWidth': this.gameFrame.virtualWidth,
      'virtualHeight': this.gameFrame.virtualHeight,
      'scaleFactor': this.gameFrame.scaleFactor
    });

    this.puck = new Puck(this, this.gameState.puck.x, this.gameState.puck.y, "puck");
    this.paddle = new Paddle(this, this.gameState.paddles.player1.x, this.gameState.paddles.player1.y, "paddle1");
    this.paddle2 = new Paddle(this, this.gameState.paddles.player2.x, this.gameState.paddles.player2.y, "paddle1");

    // Render Player Avatars
    this.renderPlayer(this.players[0], 5, 50);
    this.renderPlayer(this.players[1], this.scale.width - 50, 50);
    this.addRemotePlayer(this.players[1]);


    this.physics.add.collider(this.paddle, this.gameFrame.frameParts)
    this.physics.add.collider(this.puck, this.gameFrame.frameParts, null, () => {
      this.puckhit.play();
      this.time.delayedCall(50, () => {
        const puckVirtualX = (this.puck.body.position.x - this.gameFrame.frameX) / this.gameFrame.scaleFactor;
        const puckVirtualY = (this.puck.body.position.y - this.gameFrame.frameY) / this.gameFrame.scaleFactor;

        const puckVirtualVelocityX = this.puck.body.velocity.x / this.gameFrame.scaleFactor;
        const puckVirtualVelocityY = this.puck.body.velocity.y / this.gameFrame.scaleFactor;

        // this.puck.setVelocity(puckVirtualVelocityX , puckVirtualVelocityY );
        // if(this.players[0].isHost){
        // this.sendPuckData({
        //   x: puckVirtualX,
        //   y: puckVirtualY,
        //   vx: puckVirtualVelocityX,
        //   vy: puckVirtualVelocityY
        // });
        // }
      })
    }
    )
    this.physics.add.collider(this.puck, this.paddle, (puck, paddle) => {
      this.puckhit.play();
      // console.log(this.puck.body.velocity);
      const puckVirtualX = (this.puck.body.position.x - this.gameFrame.frameX) / this.gameFrame.scaleFactor;
      const puckVirtualY = (this.puck.body.position.y - this.gameFrame.frameY) / this.gameFrame.scaleFactor;

      const puckVirtualVelocityX = this.puck.body.velocity.x / this.gameFrame.scaleFactor;
      const puckVirtualVelocityY = this.puck.body.velocity.y / this.gameFrame.scaleFactor;

      // this.puck.setVelocity(puckVirtualVelocityX , puckVirtualVelocityY );

      // this.sendPuckData({
      //   x: puckVirtualX,
      //   y: puckVirtualY,
      //   vx: puckVirtualVelocityX,
      //   vy: puckVirtualVelocityY
      // });

    });
    this.physics.add.collider(this.puck, this.paddle2, (puck, paddle) => {
      this.puckhit.play();
      const puckVirtualX = (this.puck.body.position.x - this.gameFrame.frameX) / this.gameFrame.scaleFactor;
      const puckVirtualY = (this.puck.body.position.y - this.gameFrame.frameY) / this.gameFrame.scaleFactor;

      const puckVirtualVelocityX = this.puck.body.velocity.x / this.gameFrame.scaleFactor;
      const puckVirtualVelocityY = this.puck.body.velocity.y / this.gameFrame.scaleFactor;

      // this.puck.setVelocity(puckVirtualVelocityX , puckVirtualVelocityY );

      // this.sendPuckData({
      //   x: puckVirtualX,
      //   y: puckVirtualY,
      //   vx: puckVirtualVelocityX,
      //   vy: puckVirtualVelocityY
      // });
    });
    this.physics.add.collider(this.puck, this.gameFrame.goals, (puck, goal) => {
      // console.log(goal.texture.key, goal.body.position?.y)
      // if (this.isGoal) return;
      // this.bgMusic.setVolume(0.1);
      // this.music.play();
      // // this.bgMusic.pl();
      // this.physics.pause(); // Pause the game
      // this.isGoal = true;
      // console.log('Goal!');
      // goalText.setVisible(true);
      // this.cameras.main.shake(500, 0.005)
      // // this.cameras.main.flash(250, 255, 255, 255);
      // this.tweens.add({
      //   targets: this.puck,
      //   alpha: 0,
      //   duration: 100,
      //   ease: 'Linear'
      // });

      // this.puck.setVelocity(0, 0);
      // // this.physics.world.pause(); // Pause the game
      // // this.input.enabled = false;

      // this.paddle.setVelocity(0, 0);
      // this.time.delayedCall(2000, () => {
      //   this.gameState.reset();
      //   this.puck.setPosition(this.gameState.puck.x, this.gameState.puck.y);
      //   this.physics.world.resume();
      //   this.isGoal = false;
      //   goalText.setVisible(false);
      //   this.puck.setVisible(true);
      //   this.tweens.add({
      //     targets: this.puck,
      //     alpha: 1,
      //     duration: 100,
      //     ease: 'Linear'
      //   });
      //   this.bgMusic.setVolume(0.3);
      //   // this.input.enabled = true;
      //   // this.paddle.body.reset()
      // }, [], this);

    })

    // When dragging, set the ball's position to follow the mouse pointer
    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {

      const x = Phaser.Math.Clamp(pointer.x, this.gameFrame.frameX + 50, this.gameFrame.frameX + this.gameFrame.frameWidth - 50);
      const y = Phaser.Math.Clamp(pointer.y, this.gameFrame.frameY + 50, this.gameFrame.frameY + this.gameFrame.frameHeight - 50);

      // console.log('GameObject' , gameObject)

      // console.table({
      //   'Velocity': gameObject.body.velocity,
      //   'Mass': gameObject.body.mass,
      //   'Acceleration': gameObject.body.acceleration,
      //   'Position': gameObject.body.position,
      //   'Angle': gameObject.body.angle,
      //   'Drag': gameObject.body.drag,
      //   'speed': gameObject.body.speed,
      //   'Friction': gameObject.body.friction,
      //   'Gravity': gameObject.body.gravity,
      // });


      // this.playerPosition.x = x;
      // this.playerPosition.y = y;  
      gameObject.setPosition(x, y);


      // In Player A's drag handler (old /)
      const virtualX = (x - this.gameFrame.frameX) / this.gameFrame.scaleFactor;
      const virtualY = (y - this.gameFrame.frameY) / this.gameFrame.scaleFactor;

      this.gameState.updatePaddle('player1', virtualX, virtualY, 0 , 0);

      // this.playerPosition.x = virtualX;
      // this.playerPosition.y = virtualY;



    });

    // this.physicsManager.addCollider(this.paddle, this.gameFrame.frameParts);

    // this.timer = this.time.addEvent({
    //   delay: 50, // ms
    //   callback: this.sendPlayerPosition,
    //   args: [this.playerPosition],
    //   callbackScope: this,
    //   loop: true,
    // });

    // if (this.players[0].isHost) {
    //   this.timer = this.time.addEvent({
    //     delay: 300, // ms
    //     callback: this.sendPuckData,
    //     args: [this.puckPosition],
    //     callbackScope: this,
    //     loop: true,
    //   });
    // }
    this.registerListener();
    if (this.players[0].isHost) {
      this.gameLoopx = this.time.addEvent({
        delay: 13, // ms 
        callback: this.sendGameState,
        callbackScope: this,
        loop: true,
      });
    }
    else{
      this.gameLoopx = this.time.addEvent({
        delay: 15, // ms 
        callback: this.sendPlayerPosition,
        args: [this.gameState.getState().paddles.player1],
        callbackScope: this,
        loop: true,
      });
    }

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
    this.resetPuckIfOutOfBounds(this.puck, this.gameFrame.bounds, 5);

    const puckVirtualX = (this.puck.body.position.x - this.gameFrame.frameX) / this.gameFrame.scaleFactor;
    const puckVirtualY = (this.puck.body.position.y - this.gameFrame.frameY) / this.gameFrame.scaleFactor;
    const puckVirtualVelocityX = this.puck.body.velocity.x / this.gameFrame.scaleFactor;
    const puckVirtualVelocityY = this.puck.body.velocity.y / this.gameFrame.scaleFactor;

    // this.puck.setPosition(puckVirtualX, puckVirtualY);
    this.gameState.updatePuck(puckVirtualX, puckVirtualY, puckVirtualVelocityX, puckVirtualVelocityY);


    // Simulate remote player movement (Replace with actual WebSocket data)

  }

  isPuckOutOfBounds(puck, worldBounds) {
    return (
      puck.body.position.x < worldBounds.x ||
      puck.body.position.x > worldBounds.x + worldBounds.width ||
      puck.body.position.y < worldBounds.y ||
      puck.body.position.y > worldBounds.y + worldBounds.height
    );
  }

  resetPuckIfOutOfBounds(puck, worldBounds, buffer = 5) {
    const velX = puck.body.velocity.x;
    const velY = puck.body.velocity.y;

    let reset = false;

    if (puck.body.position.x < worldBounds.x) {
      puck.body.position.x = worldBounds.x + buffer;
      reset = true;
    } else if (puck.body.position.x > worldBounds.width + worldBounds.x) {
      puck.body.position.x = worldBounds.width - buffer;
      reset = true;
    }

    if (puck.body.position.y < worldBounds.y) {
      puck.body.position.y = worldBounds.y + buffer;
      reset = true;
    } else if (puck.body.position.y > worldBounds.height + worldBounds.y) {
      puck.body.position.y = worldBounds.height - buffer;
      reset = true;
    }

    if (reset) {
      puck.body.setVelocity(velX, velY);
    }
  }


  renderPlayer(player, x, y) {
    this.add.text(x, y, player.name, {
      fontSize: '16px',
      fill: '#fff'
    });
  }

  addRemotePlayer(player) {
    this.remotePlayer.name = player.name;
    this.remotePlayer.id = player.id;
    // this.remotePlayer.paddle = this.physics.add.sprite(this.gameFrame.frameX + this.gameFrame.frameWidth / 2, this.gameFrame.frameY + 50, "paddle2").setDisplaySize(this.gameFrame.frameWidth / 6 , this.gameFrame.frameWidth / 6).setOrigin(0.5, 0.5); // this.scale.width / 2, this.scale.height - 50
    // this.remotePlayer.paddle.body.setCircle(100, 30, 30);
    // this.remotePlayer.paddle.setInteractive(true);
    // this.remotePlayer.paddle.setDirectControl(true);
    // this.remotePlayer.paddle.setMass(1)
    // this.remotePlayer.paddle.setBounce(1);
    // // this.physics.add.collider(this.remotePlayer.paddle, this.gameFrame.frameParts)
    // this.physics.add.collider(this.puck, this.remotePlayer.paddle);
    // this.remotePlayer.paddle.setAngle(180)
  }


  // sendPuckData(data) {
  //   console.log('Sending Puck Data: ', data);
  //   Network.sendMessage('puck_data', data);

  // }



  sendPlayerPosition(position) {
    
    Network.sendMessage('position', position);
  }

  // receivePuckData(puck) {
  //   console.log("PUCK DATA: ", puck);
  //   const puckFlippedY = this.gameFrame.virtualHeight - puck.y;
  //   const puckFlippedX = this.gameFrame.virtualWidth - puck.x;
  //   const puckScreenX = puckFlippedX * this.gameFrame.scaleFactor + this.gameFrame.frameX;
  //   const puckScreenY = puckFlippedY * this.gameFrame.scaleFactor + this.gameFrame.frameY;

  //   // POsition interpolation 

  //   const currentPuckX = this.puck.body.position.x;
  //   const currentPuckY = this.puck.body.position.y;
  //   const newPuckX = Phaser.Math.Linear(currentPuckX + this.puck.body.halfWidth, puckScreenX, 0.1);
  //   const newPuckY = Phaser.Math.Linear(currentPuckY + this.puck.body.halfHeight, puckScreenY, 0.1);

  //   this.puck.setPosition(puckScreenX, puckScreenY);

  //   //Setting Velocity
  //   // if(!puck.vx || !puck.vy) return;
  //   const puckVelocityX = puck.vx * this.gameFrame.scaleFactor;
  //   const puckVelocityY = puck.vy * this.gameFrame.scaleFactor;


  //   // Velocity Interpolation
  //   // const currentVx = this.puck.body.velocity.x;
  //   // const currentVy = this.puck.body.velocity.y;

  //   // const newVx = Phaser.Math.Linear(currentVx, puckVelocityX, 0.1);
  //   // const newVy = Phaser.Math.Linear(currentVy, puckVelocityY, 0.1);  

  //   this.puck.setVelocity(-puckVelocityX, -puckVelocityY);

  // }

  // receiveRemotePosition(virtual) {

  //   const { puck, paddle } = virtual;
  //   // console.log('receving Remote positions: ', virtual)

  //   const flippedY = this.gameFrame.virtualHeight - paddle.y;
  //   const flippedX = this.gameFrame.virtualWidth - paddle.x;
  //   const screenX = flippedX * this.gameFrame.scaleFactor + this.gameFrame.frameX;
  //   const screenY = flippedY * this.gameFrame.scaleFactor + this.gameFrame.frameY;

  //   if (puck) {
  //     const puckFlippedY = this.gameFrame.virtualHeight - puck.y;
  //     const puckFlippedX = this.gameFrame.virtualWidth - puck.x;
  //     const puckScreenX = puckFlippedX * this.gameFrame.scaleFactor + this.gameFrame.frameX;
  //     const puckScreenY = puckFlippedY * this.gameFrame.scaleFactor + this.gameFrame.frameY;


  //     // this.puck.setPosition(puckScreenX, puckScreenY);
  //   }
  //   // console.log("Receving:" , screenX, screenY - this.gameFrame.frameHeight);
  //   // this.remotePlayer.paddle.setPosition(screenX, screenY);
  //   this.paddle2.setPosition(screenX, screenY);
  // }

  resize() {
    this.gameFrame.frameParts.forEach(part => part.destroy());
    this.puck.destroy();
    this.paddle.destroy();
    this.gameFrame.bg.destroy()
    //this.create()
    //this.gameFrame = new GameWorld(this);
  }

  registerListener() {
   // Network.addMessageListener('remote_position', (message) => this.receiveRemotePosition(message));
   // Network.addMessageListener('remote_puck_data', (message) => this.receivePuckData(message));

    Network.addMessageListener('game_state', (message) => this.receiveGameState(message));
    Network.addMessageListener('clientInputs' , (message) => this.receiveClientInputs(message));
  }

  /*Network Physics Implementation (New)*/
  sendClientInputs() {

  }

  receiveClientInputs(input) {
    console.log('Client Inputs: ', input);
    const { x, y } = input;
    const flippedY = this.gameFrame.virtualHeight - y;
    const flippedX = this.gameFrame.virtualWidth - x;
    const screenX = flippedX * this.gameFrame.scaleFactor + this.gameFrame.frameX;
    const screenY = flippedY * this.gameFrame.scaleFactor + this.gameFrame.frameY;

    // console.log("Receving:" , screenX, screenY - this.gameFrame.frameHeight);
    // this.remotePlayer.paddle.setPosition(screenX, screenY);
    this.paddle2.setPosition(screenX, screenY);
  }

  sendGameState() {
    // console.log(this.gameState.getState());
    Network.sendMessage('game_state', this.gameState.getState());
  }

  receiveGameState(gameState) {
    // console.log(gameState);
    const { puck, paddles } = gameState;
    const puckFlippedY = this.gameFrame.virtualHeight - puck.y - 30;
    const puckFlippedX = this.gameFrame.virtualWidth - puck.x - 30;
    const puckScreenX = puckFlippedX * this.gameFrame.scaleFactor + this.gameFrame.frameX;
    const puckScreenY = puckFlippedY * this.gameFrame.scaleFactor + this.gameFrame.frameY;

    // POsition interpolation 

    const currentPuckX = this.puck.body.position.x;
    const currentPuckY = this.puck.body.position.y;
    const newPuckX = Phaser.Math.Linear(currentPuckX + this.puck.body.halfWidth, puckScreenX, 0.1);
    const newPuckY = Phaser.Math.Linear(currentPuckY + this.puck.body.halfHeight, puckScreenY, 0.1);

    this.puck.setPosition(newPuckX, newPuckY);

    const puckVelocityX = puck.vx * this.gameFrame.scaleFactor;
    const puckVelocityY = puck.vy * this.gameFrame.scaleFactor;


    // Velocity Interpolation
    // const currentVx = this.puck.body.velocity.x;
    // const currentVy = this.puck.body.velocity.y;

    // const newVx = Phaser.Math.Linear(currentVx, puckVelocityX, 0.1);
    // const newVy = Phaser.Math.Linear(currentVy, puckVelocityY, 0.1);  

    this.puck.setVelocity(-puckVelocityX, -puckVelocityY);

    this.receiveClientInputs(paddles.player1)

  }

  /*Network Physics Implementation (End)*/

}

export default Game;