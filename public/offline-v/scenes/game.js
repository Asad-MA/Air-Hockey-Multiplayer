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
    this.remoteGoals = 0;
    this.isNearPaddle = false;
    this.isNearFrame = false;
  }

  preload() {
    this.physicsManager = null;
  }

  create() {
    this.bgMusic = this.sound.add('bg-music', { volume: 0.3 });
    this.bgMusic.play({ loop: true });
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

    this.fixPaddlePosition();

    const emitter = this.add.particles(0, 0, 'trail', {
      speed: 30,
      lifespan: 1000,
      frequency: 10,
      scale: { start: 0.2, end: 0 },
      blendMode: 'ADD',
      emitZone: {
        type: 'edge',
        source: new Phaser.Geom.Circle(0, 0, this.paddle.displayWidth / 2),
        quantity: 100
      }
    });
    emitter.startFollow(this.paddle);
    emitter.setDepth(0);

    this.physics.add.collider(this.paddle, this.gameFrame.frameParts);
    this.physics.add.collider(this.puck, this.gameFrame.frameParts, () => this.puckhit.play());
    this.physics.add.collider(this.puck, this.paddle, () => this.puckhit.play());
    this.physics.add.collider(this.puck, this.paddle2, () => this.puckhit.play());
    this.physics.add.overlap(this.puck, this.gameFrame.goals, (puck, goal) => {
      this.handleGoal(goal.texture.key === 'goal-top' ? 'goal-bottom' : 'goal-top');
    });

    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      const x = Phaser.Math.Clamp(pointer.x, this.gameFrame.frameX + 50, this.gameFrame.frameX + this.gameFrame.frameWidth - 50);
      const y = Phaser.Math.Clamp(pointer.y, this.gameFrame.frameY + 50, this.gameFrame.frameY + this.gameFrame.frameHeight - 50);
      this.time.delayedCall(1, () => gameObject.setPosition(x, y));
    });

    this.infoOverlay.show('Game Started', 2000);
    this.time.delayedCall(2000, () => {
      this.infoOverlay.hide();
      this.startGame();
    });
  }

  update() {
    this.resetPuckIfOutOfBounds(this.puck, this.gameFrame.bounds, 5);

    const d = Phaser.Math.Distance.Between(
      this.paddle.body.center.x, this.paddle.body.center.y,
      this.puck.body.center.x, this.puck.body.center.y
    );
    this.isNearPaddle = d < 100;

    for (const part of this.gameFrame.frameParts) {
      const dF = Phaser.Math.Distance.Between(
        this.puck.body.position.x, this.puck.body.position.y,
        part.x, part.y
      );
      this.puckDistance = dF;
      this.isNearFrame = dF < 150;
      if (dF < 150) break;
    }

    // Simple AI: follow puck X slowly
    const dx = this.puck.x - this.paddle2.x;
    this.paddle2.setVelocity(dx * 3, 0);
  }

  handleGoal(goal) {
    if (this.gameState.isGoal) return;
    this.gameState.isGoal = true;
    this.bgMusic.setVolume(0.1);
    this.sound.play('glitch');
    this.hud.addGoal(goal === 'goal-top' ? 'player1' : 'player2');
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
}

export default Game;
