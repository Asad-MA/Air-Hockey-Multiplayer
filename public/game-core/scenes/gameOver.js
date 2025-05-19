export default class GameOver extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOver' });
  }

  init(data) {
    this.result = data.result; // "win" or "lose"
  }

  create() {
    const { width, height } = this.scale;

    // Glassy transparent overlay
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.5);

    // Create animations once
    if (!this.anims.exists('winner')) {
      this.anims.create({
        key: 'winner',
        frames: this.anims.generateFrameNumbers('winner', { start: 0, end: 2 }),
        frameRate: 5,
        repeat: 0
      });
    }

    if (!this.anims.exists('loser')) {
      this.anims.create({
        key: 'loser',
        frames: this.anims.generateFrameNumbers('loser', { start: 0, end: 3 }),
        frameRate: 5,
        repeat: 0
      });
    }

    // Show appropriate animation
    const animKey = this.result === 'win' ? 'winner' : 'loser';
    const spriteKey = this.result === 'win' ? 'winner' : 'loser';

    const spritte = this.add.sprite(width / 2 - 30, height / 2, spriteKey).setScale(0.5).setOrigin(0.5).play(animKey);

    // Restart button (optional)
    this.add.text(width / 2, height - 80, 'Play Again', {
      fontSize: '24px',
      color: '#ffffff'
    })
      .setOrigin(0.5)
      .setInteractive()
      .on('pointerdown', () => {
        this.scene.stop();
        this.scene.stop('Game'); // in case it's paused
        this.scene.start('Game');
      });
  }
}
