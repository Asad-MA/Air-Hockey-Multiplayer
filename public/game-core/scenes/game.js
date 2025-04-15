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

    this.music = this.sound.add('glitch',  {volume: 0.8});
    this.bgMusic = this.sound.add('bg-music', {volume: 0.3});
    this.bgMusic.play({loop: true});
    this.bgMusicNeon = this.sound.add('neon', {volume: 0.05});
    this.puckhit = this.sound.add('hit', {volume: 1});

   
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
    this.defaultPuckPosition = {
      x: this.gameFrame.frameX + this.gameFrame.frameWidth / 2,
      y: this.gameFrame.frameY + this.gameFrame.frameHeight / 2 
    };

    this.playerPosition = {
      x: this.gameFrame.frameX + this.gameFrame.frameWidth / 2, 
      y: this.gameFrame.frameY + this.gameFrame.frameHeight - 50,
    }

     // Render Player Avatars
     this.renderPlayer(this.players[0] , 5 , 50);
     this.renderPlayer(this.players[1] , this.scale.width - 50 , 50);
     this.addRemotePlayer(this.players[1]);

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

    this.paddle = this.physics.add.sprite(this.playerPosition.x, this.playerPosition.y, "paddle1").setDisplaySize(this.gameFrame.frameWidth / 6 , this.gameFrame.frameWidth / 6).setOrigin(0.5, 0.5); // this.scale.width / 2, this.scale.height - 50
    this.puck = this.physics.add.sprite(this.defaultPuckPosition.x  , this.defaultPuckPosition.y , "puck").setDisplaySize(this.gameFrame.frameWidth/ 10, this.gameFrame.frameWidth/ 10)//.setOrigin(0.5, 0.5); 


    this.puck.body.setCircle(64, 64, 64);
    this.puck.body.setMass(2);

    // paddle1.setCircle(51, 0, 0);
    this.paddle.setCircle(100, 30, 30);

    console.log(this.puck)
    this.puck.setBounce(0.9);
    this.puck.setFriction(10, 10);
    this.puck.setDrag(10, 10)
    this.puck.setMaxVelocity(1000);
    this.paddle.setMass(1)
    this.paddle.setBounce(1);
    // this.puck.setInertia(100)

    this.puck.setCollideWorldBounds(true);

    this.physics.add.collider(this.paddle, this.gameFrame.frameParts)
    this.physics.add.collider(this.puck, this.gameFrame.frameParts , null,  ()=> {this.puckhit.play();})
    this.physics.add.collider(this.puck, this.paddle , (puck , paddle)=>{
      this.puckhit.play();
    });
    this.physics.add.overlap(this.puck , this.gameFrame.goals, (puck, goal) => {
      console.log(goal.texture.key, goal.body.position?.y)
       if(this.isGoal) return;
       this.bgMusic.setVolume(0.1);
      this.music.play();
      // this.bgMusic.pl();
      this.physics.pause(); // Pause the game
      this.isGoal = true;
      console.log('Goal!');
      goalText.setVisible(true);
      this.cameras.main.shake(500, 0.005)
      // this.cameras.main.flash(250, 255, 255, 255);
      console.log(this.defaultPuckPosition);
      this.tweens.add({
        targets: this.puck,
        alpha: 0,
        duration: 100,
        ease: 'Linear'
      });
      
      this.puck.setVelocity(0, 0);
     // this.physics.world.pause(); // Pause the game
     // this.input.enabled = false;
      
      this.paddle.setVelocity(0, 0);  
      this.time.delayedCall(2000, () => {
        this.puck.setPosition(this.defaultPuckPosition.x, this.defaultPuckPosition.y);
        this.physics.world.resume();
        this.isGoal = false;
        goalText.setVisible(false);
        this.puck.setVisible(true);
        this.tweens.add({
          targets: this.puck,
          alpha: 1,
          duration: 100,
          ease: 'Linear'
        });
        this.bgMusic.setVolume(0.3);
       // this.input.enabled = true;
        // this.paddle.body.reset()
      }, [], this);
      
    })

    // this.paddle.body.setMass(0.5);
    this.paddle.setImmovable(true);
    this.paddle.setDirectControl(true)
    this.paddle.setInteractive();
    this.input.setDraggable(this.paddle);
    this.OtherPlayer = this.paddle;


    // When dragging, set the ball's position to follow the mouse pointer
    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {

      const x = Phaser.Math.Clamp(pointer.x, this.gameFrame.frameX + 50, this.gameFrame.frameX + this.gameFrame.frameWidth - 50);
      const y = Phaser.Math.Clamp(pointer.y, this.gameFrame.frameY + 50, this.gameFrame.frameY + this.gameFrame.frameHeight - 70);


      this.playerPosition.x = x;
      this.playerPosition.y = y;  
      gameObject.setPosition(x, y);

 
    });

    this.physicsManager.addCollider(this.paddle, this.gameFrame.frameParts);
  
     this.timer = this.time.addEvent({
      delay: 50, // ms
      callback: this.sendPlayerPosition,
      args: [this.playerPosition],
      callbackScope: this,
      loop: true,
    });

    this.registerListener();
    

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
    // Simulate remote player movement (Replace with actual WebSocket data)
    if (this.remotePlayerX !== undefined) {
      this.remotePlayer.paddle.x = this.remotePlayerX;
      // this.remotePaddle.y = this.remotePlayerY;
    }
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


  renderPlayer(player , x , y) {
    this.add.text(x, y, player.name, {
      fontSize: '16px',
      fill: '#fff'
    });
  }

  addRemotePlayer(player){
    this.remotePlayer.name = player.name;
    this.remotePlayer.id = player.id;
    this.remotePlayer.paddle = this.add.sprite(this.gameFrame.frameX + this.gameFrame.frameWidth / 2, this.gameFrame.frameY + 50, "paddle2").setDisplaySize(this.gameFrame.frameWidth / 6 , this.gameFrame.frameWidth / 6).setOrigin(0.5, 0.5); // this.scale.width / 2, this.scale.height - 50
  }
  
  

  sendPlayerPosition(x) {
    console.log('Sending Player positions: ');
    Network.sendMessage('position', x);
  }

  receiveRemotePosition(x) {
    console.log('receving Remote positions: ', x)
    console.log(this.gameFrame.frameX + this.gameFrame.frameWidth - x.x, this.gameFrame.frameY + this.gameFrame.frameHeight - x.y)
    // Placeholder for receiving opponent's position
    this.remotePlayer.paddle.x = this.gameFrame.frameX + this.gameFrame.frameWidth - x.x;
    this.remotePlayer.paddle.y = this.gameFrame.frameY + this.gameFrame.frameHeight - x.y;
  }

  resize() {
    this.gameFrame.frameParts.forEach(part => part.destroy());
    this.puck.destroy();
    this.paddle.destroy();
    this.gameFrame.bg.destroy()
    //this.create()
    //this.gameFrame = new GameWorld(this);
  }

  registerListener(){
    Network.addMessageListener('remote_position', (message) => this.receiveRemotePosition(message));

  }
}

export default Game;