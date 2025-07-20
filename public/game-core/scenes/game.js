import Network from '../networking/network.js';
import GameWorld from '../components/world.js';
import Paddle from '../components/paddle.js';
import Puck from '../components/puck.js';
import ArcadePhysicsManager from '../physics/arcadePhysicsManager.js';
import MatterPhysicsManager from '../physics/matterPhysicsManager.js';
import { GameState } from '../gamestate.js';
import { GameInfoOverlay } from '../utils/overlayInfo.js';
import HUD from '../components/hud.js';


class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' });
    this.isGoal = false;
    this.goals = 0;
    this.remoteGoals = 0;
    this.remotePlayer = {};
    this.isNearPaddle = false;
    this.isNearFrame = false;
    this.serverSnapshot = null;
    // console.log = function () { };

    this.gameSettings = {
      puckMass: parseFloat(document.querySelector('#puck-mass').value),
      paddleMass: parseFloat(document.querySelector('#paddle-mass').value),
      puckSpeed: parseFloat(document.querySelector('#puck-speed').value),
      paddleSpeed: parseFloat(document.querySelector('#paddle-speed').value),
    }


    console.log(this);

    this.logs = {
      latency: document.querySelector('.latency'),
    }
  }
  preload() {
    this.room = this.scene.get('PlayerJoinScene').gameRoom;
    this.players = this.scene.get('PlayerJoinScene').players;
    this.physicsManager = null;
  }

  create() {


    this.add.image(0, 0, 'background').setOrigin(0).setDisplaySize(this.scale.width, this.scale.height).setDepth(-1);
    this.music = this.sound.add('glitch', { volume: 0.8 });
    this.bgMusic = this.sound.add('bg-music', { volume: 0.3 });
    // this.bgMusic.play({ loop: true });
    // this.bgMusicNeon = this.sound.add('neon', { volume: 0.05 });
    this.puckhit = this.sound.add('hit', { volume: 1 });

    // console.log(this.game.config.physics.default);

    this.scaleFactor = this.sys.game.config.physics.scaleFactor;
    // Choose Physics Manager (Arcade or Matter)
    if (this.game.config.physics.default === 'matter') {
      this.physicsManager = new MatterPhysicsManager(this);
    } else {
      this.physicsManager = new ArcadePhysicsManager(this);
    }

    this.gameFrame = new GameWorld(this);
    this.gameState = new GameState(this);
    this.infoOverlay = new GameInfoOverlay(this);
    this.hud = new HUD(this);
this.physics.world.setBounds(this.gameFrame.frameX, this.gameFrame.frameY , this.gameFrame.frameWidth , this.gameFrame.frameHeight );

    console.log(this.gameFrame);

    console.log("Game State: ", this.gameState);

    this.anims.create({
      key: 'impactAnim',
      frames: this.anims.generateFrameNumbers('impactEffect', { start: 2, end: 5 }), // Adjust frame count
      frameRate: 15,
      repeat: 0
    });

    this.puck = new Puck(this, this.gameState.puck.x, this.gameState.puck.y, "puck");
    this.paddle = new Paddle(this, this.gameState.paddles.player1.x, this.gameState.paddles.player1.y, "paddle1");
    this.paddle2 = new Paddle(this, this.gameState.paddles.player2.x, this.gameState.paddles.player2.y, "paddle1");

    console.log(this.puck)

    this.paddle2.disableInteractive();
    // this.paddle2.setImmovable(false);
    // this.paddle2.body.setDirectControl(false);

    this.fixPaddlePosition();

    if (!this.players[0].isHost)
      this.paddle.setCircle(1, this.paddle.body.halfWidth, this.paddle.body.halfHeight);

    // Render Player Avatars
    this.renderPlayer(this.players[0], 5, 50);
    this.renderPlayer(this.players[1], this.scale.width - 50, 50);
    this.addRemotePlayer(this.players[1]);

    // In create:
    const paddleRadius = this.paddle.displayWidth / 2;

    const paddleCircle = new Phaser.Geom.Circle(0, 0, paddleRadius);

    const emitter = this.add.particles(0, 0, 'trail', {
      speed: 30, // Set to 0, we'll apply custom velocity
      lifespan: 1000,
      frequency: 10,
      scale: { start: 0.2, end: 0 },
      blendMode: 'ADD',
      emitZone: {
        type: 'edge',
        source: paddleCircle,
        quantity: 100,
        seamless: false
      }
    });

    emitter.startFollow(this.paddle);
    emitter.setDepth(0);

    // 🔁 Apply outward velocity to each emitted particle
    // emitter.on('particleEmit', (particle) => {
    //   const dx = particle.x - this.paddle.x;
    //   const dy = particle.y - this.paddle.y;
    //   const angle = Math.atan2(dy, dx);
    //   const speed = 90;

    //   particle.velocityX = Math.cos(angle) * speed;
    //   particle.velocityY = Math.sin(angle) * speed;
    // });



    // this.physics.add.collider(this.paddle, this.gameFrame.frameParts)
    // this.physics.add.collider(this.puck, this.gameFrame.frameParts, (puck, frame) => {
    //   this.puckhit.play();
    //   // puck.body.setVelocity(puck.body.velocity.y*0.7 , puck.body.velocity.y*0.7);
    // }
    // )
    // this.physics.add.collider(this.puck, this.paddle, (puck, paddle) => {
    //   this.puckhit.play();
    //   // emitter.explode(50, this.puck.body.position.x , this.puck.body.position.y);
    //   // console.log(this.puck.body.velocity);
    //   const puckVirtualX = (this.puck.body.position.x - this.gameFrame.frameX) / this.gameFrame.scaleFactor;
    //   const puckVirtualY = (this.puck.body.position.y - this.gameFrame.frameY) / this.gameFrame.scaleFactor;

    //   const puckVirtualVelocityX = this.puck.body.velocity.x / this.gameFrame.scaleFactor;
    //   const puckVirtualVelocityY = this.puck.body.velocity.y / this.gameFrame.scaleFactor;

    //   // this.puck.setVelocity(puckVirtualVelocityX , puckVirtualVelocityY );

    //   // this.sendPuckData({
    //   //   x: puckVirtualX,
    //   //   y: puckVirtualY,
    //   //   vx: puckVirtualVelocityX,
    //   //   vy: puckVirtualVelocityY
    //   // });

    // });
    // this.physics.add.collider(this.puck, this.paddle2, (puck, paddle) => {
    //   this.puckhit.play();
    //   const puckVirtualX = (this.puck.body.position.x - this.gameFrame.frameX) / this.gameFrame.scaleFactor;
    //   const puckVirtualY = (this.puck.body.position.y - this.gameFrame.frameY) / this.gameFrame.scaleFactor;

    //   const puckVirtualVelocityX = this.puck.body.velocity.x / this.gameFrame.scaleFactor;
    //   const puckVirtualVelocityY = this.puck.body.velocity.y / this.gameFrame.scaleFactor;

    //   // this.puck.setVelocity(puckVirtualVelocityX , puckVirtualVelocityY );

    //   // this.sendPuckData({
    //   //   x: puckVirtualX,
    //   //   y: puckVirtualY,
    //   //   vx: puckVirtualVelocityX,
    //   //   vy: puckVirtualVelocityY
    //   // });
    // });
    // this.physics.add.overlap(this.puck, this.gameFrame.goals, (puck, goal) => {
    //   console.log(goal.texture.key);
    //   if (!this.players[0].isHost) return;

    //   Network.sendMessage('Goal', { goal: goal.texture.key });
    //   // this.pause();
    //   this.handleGoal({ goal: goal.texture.key == 'goal-top' ? 'goal-bottom' : 'goal-top' });
    // }, null, this);

    // When dragging, set the ball's position to follow the mouse pointer
    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {

      const x = Phaser.Math.Clamp(pointer.x, this.gameFrame.frameX + 50, this.gameFrame.frameX + this.gameFrame.frameWidth - 50);
      const y = Phaser.Math.Clamp(pointer.y, this.gameFrame.frameY + 50, this.gameFrame.frameY + this.gameFrame.frameHeight - 50);

      // Network delay
      this.time.delayedCall(1, () => {
        gameObject.setPosition(x, y);
      })



      // In Player A's drag handler (old /)
      const virtualX = (x - this.gameFrame.frameX) / this.gameFrame.scaleFactor;
      const virtualY = (y - this.gameFrame.frameY) / this.gameFrame.scaleFactor;
      const vx = gameObject.body.velocity.x / this.gameFrame.scaleFactor;
      const vy = gameObject.body.velocity.y / this.gameFrame.scaleFactor;

      this.gameState.updatePaddle('player1', virtualX, virtualY, vx, vy);

      // console.log(this.gameState.getState().paddles.player1);
    });


    // In preload:
    // small soft white dot


    // emitter.setDepth(0);



    this.events.on('update', () => {
      // const speed = this.paddle.body.velocity.length();
      // emitter.setFrequency(Math.max(50 , 100 - speed));
    });



    this.registerListener();

    this.infoOverlay.show('Game Started', 2000);
    this.time.delayedCall(2000, () => {
      this.infoOverlay.hide();
      this.startGame();
      console.log('Paddle2 Position: ', this.paddle2.body.position);
    })

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


  update(delta) {




    if (!this.serverSnapshot) return;

    // console.log('Received Game State: ', gameState);
    const { puck, players, timestamp } = this.serverSnapshot;

    this.logs.latency.innerHTML = `
    Latency: ${(Date.now() - timestamp)}ms
    `;

    // console.table({
    //   puck1x: gameState.puck.x,
    //   puck2x: this.puck.body.position.x,
    //   puck1y: gameState.puck.y,
    //   puck2y: this.puck.body.position.y,
    // })

    const lerpFactor = 0.4;

    if (Date.now() - timestamp > 200) return;
    const targetX = puck.x * this.gameFrame.scaleFactor + this.gameFrame.frameX;
    const targetY = puck.y * this.gameFrame.scaleFactor;

    const newX = Phaser.Math.Linear(this.puck.x, targetX, lerpFactor);
    const newY = Phaser.Math.Linear(this.puck.y, targetY, lerpFactor);



    this.puck.setPosition(newX, newY);

    // this.puck.setVelocity(gameState.puck.velocityX * this.gameFrame.scaleFactor, gameState.puck.velocityY * this.gameFrame.scaleFactor);


    const targetVX = puck.vx * this.gameFrame.scaleFactor;
    const targetVY = puck.vy * this.gameFrame.scaleFactor;

    this.puck.body.velocity.x = Phaser.Math.Linear(this.puck.body.velocity.x, targetVX, lerpFactor);
    this.puck.body.velocity.y = Phaser.Math.Linear(this.puck.body.velocity.y, targetVY, lerpFactor);





    // this.resetPuckIfOutOfBounds(this.puck, this.gameFrame.bounds, 5);

    // const puckVirtualX = (this.puck.body.position.x - this.gameFrame.frameX) / this.gameFrame.scaleFactor;
    // const puckVirtualY = (this.puck.body.position.y - this.gameFrame.frameY) / this.gameFrame.scaleFactor;
    // const puckVirtualVelocityX = this.puck.body.velocity.x / this.gameFrame.scaleFactor;
    // const puckVirtualVelocityY = this.puck.body.velocity.y / this.gameFrame.scaleFactor;

    // this.gameState.updatePuck(puckVirtualX, puckVirtualY, puckVirtualVelocityX, puckVirtualVelocityY);
    // this.gameState.updateTimestamp();
    // // this.gameState.

    // const d = Phaser.Math.Distance.Between(this.paddle.body.center.x, this.paddle.body.center.y, this.puck.body.center.x, this.puck.body.center.y);
    // this.isNearPaddle = d < 100 ? true : false;

    // for (const part of this.gameFrame.frameParts) {
    //   const dF = Phaser.Math.Distance.Between(
    //     this.puck.body.position.x,
    //     this.puck.body.position.y,
    //     part.x,
    //     part.y
    //   );

    //   this.puckDistance = dF;
    //   this.isNearFrame = dF < 150;

    //   if (dF < 150) break;
    // }



    // HUD Updates
    // this.hud.update(delta);
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
  }

  sendPlayerPosition() {
    // console.log('Sending Player Position: ', position); 
    var state = this.gameState.getState();
    var playerPosition = state.paddles.player1;
    playerPosition.timeStamp = state.timestamp;
    Network.sendMessage('position', playerPosition);
  }

  resize() {
    // this.gameFrame.frameParts.forEach(part => part.destroy());
    // this.puck.destroy();
    // this.paddle.destroy();
    // this.gameFrame.bg.destroy()
    //this.create()
    //this.gameFrame = new GameWorld(this);
  }

  registerListener() {
    // Network.addMessageListener('remote_position', (message) => this.receiveRemotePosition(message));
    // Network.addMessageListener('remote_puck_data', (message) => this.receivePuckData(message));

    Network.addMessageListener('game_state', (message) => this.receiveGameState(message));
    Network.addMessageListener('clientInputs', (message) => { this.receiveClientInputs(message) });
    Network.addMessageListener('pause', (message) => { console.log('Host Pause'); this.pause(); });
    Network.addMessageListener('resume', (message) => { console.log('Host REsume'); this.resume() });
    Network.addMessageListener('reset', (message) => this.reset());
    Network.addMessageListener('Goal', (message) => { console.log("Host Goal"); this.handleGoal(message); });
    Network.addMessageListener('match_timer', (time) => { console.log(time); this.hud.update(time.remaining); })
    Network.addMessageListener('game_over', (message) => {
      console.log(message);
      let result = this.players[0].name == message.winner ? 'win' : 'lose'
      if (message.winner == 'Draw') result = 'draw';
      this.gameOver({ scores: message.scores, result });

    })
  }

  fixPaddlePosition() {
    const virtualX = (this.gameFrame.frameWidth / 2) / this.gameFrame.scaleFactor;
    const virtualY = (this.gameFrame.frameHeight - 50) / this.gameFrame.scaleFactor;
    this.gameState.updatePaddle('player1', virtualX, virtualY, 0, 0);
  }

  /*Handlers*/
  handleGoal(data) {
    console.log('Goal Data From Host:', data);
    if (this.gameState.isGoal) return;
    this.bgMusic.setVolume(0.1);
    this.music.play();
    // this.bgMusic.pl();
    this.gameState.isGoal = true;

    if (data.goal == 'goal-top') {
      this.hud.addGoal('player1');
    } else {
      this.hud.addGoal('player2');
    }

    // this.hud.addGoal('player1');

    // Port network Here
    if (this.players[0].isHost)
      Network.sendMessage('pause', this.gameState.getState());
    this.pause();
    this.infoOverlay.show('Goal', 2000);
    this.cameras.main.shake(500, 0.005)
    // this.cameras.main.flash(250, 255, 255, 255);
    this.tweens.add({
      targets: this.puck,
      alpha: 0,
      duration: 100,
      ease: 'Linear'
    });


    this.time.delayedCall(2000, () => {
      this.reset();
      this.tweens.add({
        targets: this.puck,
        alpha: 1,
        duration: 100,
        ease: 'Linear'
      });
      this.resume();
      // Port network Here
      if (this.players[0].isHost)
        Network.sendMessage('resume', this.gameState.getState());

      this.bgMusic.setVolume(0.3);
    }, [], this);
  }

  /*Network Physics Implementation (New)*/
  sendClientInputs() {

  }

  receiveClientInputs(input) {
    // console.log('Paddle2 Position: ' , input);
    // console.log('Client Inputs: ', input);
    const { x, y, vx, vy, timeStamp } = input;
    const flippedY = this.gameFrame.virtualHeight - y;
    const flippedX = this.gameFrame.virtualWidth - x;
    const screenX = flippedX * this.gameFrame.scaleFactor + this.gameFrame.frameX //+ this.paddle2.body.halfWidth;
    const screenY = flippedY * this.gameFrame.scaleFactor + this.gameFrame.frameY// + this.paddle2.body.halfHeight;

    this.gameState.getState().paddles.player2.timeStamp = timeStamp;

    const delta = (Date.now() - timeStamp) > 0 ? (Date.now() - timeStamp) / 1000 : 0;
    const dx = vx * delta * this.gameFrame.scaleFactor;
    const dy = vy * delta * this.gameFrame.scaleFactor;

    // console.log("Receving:" , screenX, screenY - this.gameFrame.frameHeight);
    // this.remotePlayer.paddle.setPosition(screenX, screenY);
    this.paddle2.setPosition(screenX, screenY);
    // this.physics.moveTo(this.paddle2 , (screenX ) , (screenY ) ,  700)
    // this.paddle2.setVelocity(-vx*this.gameFrame.scaleFactor , -vy*this.gameFrame.scaleFactor)

  }

  sendGameState() {
    // console.log('Host Game State: ' , this.gameState.getState());
    // Network.sendMessage('game_state', this.gameState.getState());
  }

  receiveGameState(gameState) {

    this.serverSnapshot = gameState;



    return;

    if (this.puck.body.touching.none === false) return;

    // console.log(Date.now() - gameState.paddles.player2.timeStamp);
    // const { puck, paddles, timestamp } = gameState;
    // // if(Date.now() - gameState.paddles.player2.timeStamp > 60) return;
    // const diff = Date.now() - gameState.paddles.player2.timeStamp;
    // const delta = (!isNaN(diff) || diff > 0) ? diff / 1000 : 0;

    // if (diff > 160) return;

    // var dx = ((this.puck.body.velocity.x) * delta) / this.gameFrame.scaleFactor;
    // var dy = ((this.puck.body.velocity.y) * delta) / this.gameFrame.scaleFactor;

    // if (this.isNearPaddle || this.isNearFrame) {
    //   dx = 0;
    //   dy = 0;
    // }



    // console.log('Latency: ', Date.now() - timestamp, 'ms');



    const puckFlippedY = this.gameFrame.virtualHeight - puck.y - this.puck.body.halfHeight;
    const puckFlippedX = this.gameFrame.virtualWidth - puck.x - this.puck.body.halfWidth;
    const puckScreenX = puckFlippedX * this.gameFrame.scaleFactor + this.gameFrame.frameX;
    const puckScreenY = puckFlippedY * this.gameFrame.scaleFactor + this.gameFrame.frameY;

    // POsition interpolation 

    // const currentPuckX = this.puck.body.position.x;
    // const currentPuckY = this.puck.body.position.y;
    // const newPuckX = Phaser.Math.Linear(currentPuckX + this.puck.body.halfWidth, puckScreenX + dx, 0.15);
    // const newPuckY = Phaser.Math.Linear(currentPuckY + this.puck.body.halfHeight, puckScreenY + dy, 0.15);

    // this.puck.setPosition(newPuckX, newPuckY);


    this.logs.latency.innerHTML = `
    Latency: ${delta * 1000}ms
    <br>
    dx: ${Math.round(dx)}px
    <br> 
    dy: ${Math.round(dy)}px
    <br> 
    puckx: ${Math.round(this.puck.body.position.x)}px
    <br> 
    pucky: ${Math.round(this.puck.body.position.y)}px
    <br> 
    HostX: ${Math.round(puck.x)}px
    <br> 
    HostY: ${Math.round(puck.y)}px
    <br>
    PredictedX: ${Math.round(puckScreenX + dx)}px
    <br>
    PredictedY: ${Math.round(puckScreenY + dy)}px
    <br>
    NearPaddle: ${this.isNearPaddle}
    <br>
    NearFrame: ${this.isNearFrame}
    <br>
    PuckDistance: ${this.puckDistance}px

    `;



    const puckVelocityX = puck.vx * this.gameFrame.scaleFactor;
    const puckVelocityY = puck.vy * this.gameFrame.scaleFactor;


    // Velocity Interpolation
    const currentVx = this.puck.body.velocity.x // this.gameFrame.scaleFactor;
    const currentVy = this.puck.body.velocity.y // this.gameFrame.scaleFactor;

    const newVx = Phaser.Math.Linear(currentVx, puckVelocityX, 0.89);
    const newVy = Phaser.Math.Linear(currentVy, puckVelocityY, 0.89);

    // this.puck.setVelocity(-puckVelocityX, -puckVelocityY);

    this.puck.setVelocity(-newVx, -newVy);

    this.receiveClientInputs(paddles.player1)

  }

  /*Network Physics Implementation (End)*/

  reset() {
    console.log("Reset Game State");
    this.gameState.reset();
    // this.gameState.reset();
    this.puck.setVelocity(0, 0);
    this.paddle.setVelocity(0, 0);
    this.paddle.setPosition(this.gameState.paddles.player1.x, this.gameState.paddles.player1.y);
    this.paddle2.setPosition(this.gameState.paddles.player2.x, this.gameState.paddles.player2.y);
    this.puck.setPosition(this.gameState.puck.x, this.gameState.puck.y);
    this.gameState.isGoal = false;
    this.puck.setVisible(true);
    this.fixPaddlePosition();
  }

  pause() {
    // this.physics.world.pause();
    // this.gameLoopx.paused = true;
    // this.gameState.isPaused = true;


  }

  gameOver(result) {
    this.physics.world.pause();
    this.gameLoopx.paused = true;
    this.gameState.isPaused = true;
    this.bgMusic.pause();
    this.scene.launch('GameOver', { result });
  }

  resume() {
    // this.physics.world.resume();
    // this.gameLoopx.paused = false;
    // this.gameState.isPaused = false;



  }

  startGame() {
    if (this.players[0].isHost) {
      this.gameLoopx = this.time.addEvent({
        delay: 20, // ms 
        callback: this.sendGameState,
        callbackScope: this,
        loop: true,
        paused: false,
      });
    }
    else {
      this.gameLoopx = this.time.addEvent({
        delay: 10, // ms 
        callback: this.sendPlayerPosition,
        // args: [this.gameState.getState().paddles.player1],
        callbackScope: this,
        loop: true,
        paused: false,
      });
    }
  }

}

export default Game;