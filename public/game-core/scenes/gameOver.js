class GameOver extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOver' });
  }

  create() {
    this.add.text(100, 100, 'Game Over', { fontSize: '50px', fill: '#fff' });
    this.add.text(100, 200, 'Press SPACE to restart', { fontSize: '20px', fill: '#fff' });

    this.input.keyboard.on('keydown-SPACE', () => {
      this.scene.start('Game');
    });
  }
}

export default GameOver;