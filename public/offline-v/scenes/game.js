// This version removes networking and adds AI control for paddle2

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
    this.playerGoals = 0;
    this.pcGoals = 0;
    this.isNearPaddle = false;
    this.isNearFrame = false;
    this.matchDuration = 60000;
  }

  preload() {
    this.physicsManager = null;
  }

  create() {
    this.add.image(0, 0, 'gameBackground').setOrigin(0).setDisplaySize(this.scale.width, this.scale.height).setDepth(-1);
    this.bgMusic = this.sound.add('bg-music', { volume: 0.3 });
    // this.bgMusic.play({ loop: true });
    this.puckhit = this.sound.add('hit', { volume: 1 });

    this.scaleFactor = this.sys.game.config.physics.scaleFactor;
    this.physicsManager = this.game.config.physics.default === 'matter'
      ? new MatterPhysicsManager(this)
      : new ArcadePhysicsManager(this);

    this.gameFrame = new GameWorld(this);
    this.gameState = new GameState(this);
    this.infoOverlay = new GameInfoOverlay(this);
    this.hud = new HUD(this);

    this.puck = new Puck(this, this.gameState.puck.x, this.gameState.puck.y, 'puck');
    this.paddle = new Paddle(this, this.gameState.paddles.player1.x, this.gameState.paddles.player1.y, 'paddle1');
    this.paddle2 = new Paddle(this, this.gameState.paddles.player2.x, this.gameState.paddles.player2.y, 'paddle1');
    this.paddle2.disableInteractive();

    this.paddle.setDepth(1)
    this.paddle2.setDepth(1)

    this.fixPaddlePosition();


    const brust = this.add.particles(0,0,'trail',{
      speed: 120,
      lifespan: 400,
      quantity: 20,
      scale: { start: 0.02, end: 0 },
      blendMode: 'ADD',
      on: false  // Important: prevent continuous emission
    });

    const brust2 = this.add.particles(0,0,'trail2',{
      speed: 150,
      lifespan: 400,
      quantity: 20,
      scale: { start: 0.02, end: 0 },
      blendMode: 'ADD',
      on: false // Important: prevent continuous emission
    });



    const emitter = this.add.particles(0, 0, 'trail', {
      speed: 60,
      lifespan: 800,
      frequency: 100,
      scale: { start: 0.02, end: 0 },
      blendMode: 'ADD',
      // emitZone: {
      //   type: 'edge',
      //   source: new Phaser.Geom.Circle(0, 0, this.paddle.displayWidth / 2),
      //   quantity: 100
      // }
    });
    emitter.startFollow(this.paddle);
    emitter.setDepth(0);

    const emitter2 = this.add.particles(0, 0, 'trail2', {
      speed: 60,
      lifespan: 800,
      frequency: 100,
      scale: { start: 0.02, end: 0 },
      blendMode: 'ADD',
      // emitZone: {
      //   type: 'edge',
      //   source: new Phaser.Geom.Circle(0, 0, this.paddle.displayWidth / 2),
      //   quantity: 100
      // }
    });
    emitter2.startFollow(this.paddle2);
    emitter2.setDepth(0);

    this.physics.add.collider(this.paddle, this.gameFrame.frameParts);
    this.physics.add.collider(this.puck, this.gameFrame.frameParts, () => this.puckhit.play());
    this.physics.add.collider(this.puck, this.paddle, (puck , paddle) => {
      this.puckhit.play();
      const contactX = (puck.x + paddle.x) / 2;
      const contactY = (puck.y + paddle.y) / 2;
       brust.explode(25, contactX, contactY);
    });
    this.physics.add.collider(this.puck, this.paddle2, (puck , paddle) => {
      this.puckhit.play();
      const contactX = (puck.x + paddle.x) / 2;
      const contactY = (puck.y + paddle.y) / 2;

      brust2.explode(25, contactX, contactY);
    });
    this.physics.add.overlap(this.puck, this.gameFrame.goals, (puck, goal) => {
      this.handleGoal(goal.texture.key === 'goal-top' ? 'goal-bottom' : 'goal-top');
    });

    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      const x = Phaser.Math.Clamp(pointer.x, this.gameFrame.frameX + 50, this.gameFrame.frameX + this.gameFrame.frameWidth - 50);
      const y = Phaser.Math.Clamp(pointer.y, this.gameFrame.frameY + 50, this.gameFrame.frameY + this.gameFrame.frameHeight - 50);
      this.time.delayedCall(1, () => gameObject.setPosition(x, y));
    });

    // this.puck.setVelocity(400, 300);

    this.infoOverlay.show('Game Started', 2000);
    this.time.delayedCall(2000, () => {
      this.infoOverlay.hide();
      this.startGame();
    });

    this.time.addEvent({
      delay: 1000, // milliseconds
      callback: () => {
        // console.log('Every second' , this.matchDuration);

        if (this.matchDuration <= 0) {
          console.log("GAME OVER")
          console.log(`PC Goals: ${this.pcGoals}\nPlayer Goals: ${this.playerGoals} `);
          this.gameOver({ playerGoals: this.playerGoals, pcGoals: this.pcGoals, result: this.playerGoals > this.pcGoals ? 'win' : 'lose' });
          return;
        }

        this.matchDuration -= 1000;
        this.hud.update(this.matchDuration);

      },
      callbackScope: this,
      loop: true
    });

  }

  update() {
    this.resetPuckIfOutOfBounds(this.puck, this.gameFrame.bounds, 5);

    // === Advanced AI Paddle Logic ===

    const puck = this.puck;
    const paddle = this.paddle2;
    const frameX = this.gameFrame.frameX;
    const frameY = this.gameFrame.frameY;
    const frameWidth = this.gameFrame.frameWidth;
    const frameHeight = this.gameFrame.frameHeight;

    const puckPos = puck.getCenter();
    const paddlePos = paddle.getCenter();

    const isPuckInAIHalf = puck.y < frameY + frameHeight / 2;

    // AI Parameters (can be tuned dynamically for difficulty)
    const reactionDelay = 50; // milliseconds
    const reactionChance = 0.95; // 90% chance to react (10% chance to "ignore" momentarily)
    const jitter = 100;// pixels to randomly offset movement
    const speed = 0.08; // lower is slower and smoother
    // Retreat cooldown (after hitting puck)
    if (!this.aiRetreatUntil) this.aiRetreatUntil = 0;
    if (!this.idlePuckTimer) this.idlePuckTimer = null;

    const isPuckNearCenterOrAI = puck.y < frameY + frameHeight * 0.6 && puck.body.speed < 20;

    if (isPuckNearCenterOrAI) {
      if (!this.idlePuckTimer) {
        this.idlePuckTimer = this.time.now + 2000;
      } else if (this.time.now > this.idlePuckTimer) {
        this.forceAIStrike = true;
      }
    } else {
      this.idlePuckTimer = null;
      this.forceAIStrike = false;
    }



    // Add a reaction timer if not already set
    if (!this.aiNextUpdate || this.aiNextUpdate < this.time.now) {
      this.aiShouldReact = Math.random() < reactionChance;
      this.aiTargetX = puck.x + Phaser.Math.Between(-jitter, jitter);
      this.aiTargetY = puck.y + Phaser.Math.Between(-jitter, jitter);

      // Predict puck's position 400ms ahead
      const predictedX = puck.x + puck.body.velocity.x * 0.2;
      const predictedY = puck.y + puck.body.velocity.y * 0.2;

      const justHit = Phaser.Math.Distance.Between(paddle.x, paddle.y, puck.x, puck.y) < 60 &&
        puck.body.velocity.y > 0;

      if (justHit) {
        this.aiRetreatUntil = this.time.now + 200; // Retreat for 300ms after hit
      }

      if (this.time.now < this.aiRetreatUntil) {
        // Retreat mode: go back to center-defensive position
        this.aiTargetX = Phaser.Math.Clamp(frameX + frameWidth / 2 + Phaser.Math.Between(-20, 20), frameX + 40, frameX + frameWidth - 40);
        this.aiTargetY = frameY + 80;
      }
      else if (isPuckInAIHalf && puck.body.velocity.y > 0 && this.aiShouldReact) {
        // Attack logic as before
        const predictedX = puck.x + puck.body.velocity.x * 0.2;
        const predictedY = puck.y + puck.body.velocity.y * 0.2;

        this.aiTargetX = Phaser.Math.Clamp(predictedX, frameX + 40, frameX + frameWidth - 40);
        this.aiTargetY = Phaser.Math.Clamp(-predictedY, frameY + 65, frameY + frameHeight / 2 - 65);
      }
      else if ((isPuckInAIHalf && puck.body.velocity.y < 0 && this.aiShouldReact) || this.forceAIStrike) {
        // Attack mode (normal or forced)
        const predictedX = puck.x + puck.body.velocity.x * 0.2;
        const predictedY = puck.y + puck.body.velocity.y * 0.1;

        this.aiTargetX = Phaser.Math.Clamp(predictedX, frameX + 20, frameX + frameWidth - 20);
        this.aiTargetY = Phaser.Math.Clamp(predictedY, frameY + 65, frameY + frameHeight / 2 - 65);
      } else {
        // Idle defense
        this.aiTargetX = Phaser.Math.Clamp(frameX + frameWidth / 2 + Phaser.Math.Between(-30, 30), frameX + 40, frameX + frameWidth - 40);
        this.aiTargetY = frameY + 68;
      }


      this.aiNextUpdate = this.time.now + reactionDelay;
    }

    // Smooth movement toward target
    // if(puck.body.velocity.y < 0){
    // paddle.x += (this.aiTargetX - paddle.x) * speed
    // paddle.y += (this.aiTargetY + paddle.y) * speed ;
    // return;
    // }
    paddle.x += (this.aiTargetX - paddle.x) * speed;
    paddle.y += (this.aiTargetY - paddle.y) * speed;




  }

  handleGoal(goal) {
    console.log(`PC Goals: ${this.pcGoals}\nPlayer Goals: ${this.playerGoals} `);
    if (this.gameState.isGoal) return;
    this.gameState.isGoal = true;
    this.bgMusic.setVolume(0.1);
    this.sound.play('glitch');
    this.hud.addGoal(goal === 'goal-top' ? 'player1' : 'player2');
    goal === 'goal-top' ? this.pcGoals++ : this.playerGoals++;
    this.pause();
    this.infoOverlay.show('Goal', 2000);
    this.cameras.main.shake(500, 0.005);
    this.tweens.add({ targets: this.puck, alpha: 0, duration: 100 });
    this.time.delayedCall(2000, () => {
      this.reset();
      this.tweens.add({ targets: this.puck, alpha: 1, duration: 100 });
      this.resume();
      this.bgMusic.setVolume(0.3);
    });
  }

  resetPuckIfOutOfBounds(puck, bounds, buffer = 5) {
    const { x, y, width, height } = bounds;
    const px = puck.body.position.x;
    const py = puck.body.position.y;
    if (px < x || px > x + width || py < y || py > y + height) {
      puck.setPosition(this.gameState.puck.x, this.gameState.puck.y);
      puck.setVelocity(0, 0);
    }
  }

  fixPaddlePosition() {
    const x = (this.gameFrame.frameWidth / 2) / this.gameFrame.scaleFactor;
    const y = (this.gameFrame.frameHeight - 50) / this.gameFrame.scaleFactor;
    this.gameState.updatePaddle('player1', x, y, 0, 0);
  }

  pause() {
    this.physics.world.pause();
    this.gameState.isPaused = true;
  }

  resume() {
    this.physics.world.resume();
    this.gameState.isPaused = false;
  }

  startGame() {
    this.gameState.isPaused = false;
  }

  gameOver(result) {
    this.physics.world.pause();
    // this.gameLoopx.paused = true;
    this.gameState.isPaused = true;
    this.bgMusic.pause();
    this.scene.launch('GameOver', { result });
  }

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
}

export default Game;
