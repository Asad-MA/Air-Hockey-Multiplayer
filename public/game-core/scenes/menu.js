class Menu extends Phaser.Scene {
  constructor() {
    super({ key: 'Menu' });
  }

  create() {
    this.add.text(20, 20, 'Menu', { fill: '#0f0' });

    this.input.keyboard.on('keydown', this.handleKey, this);
  }

  handleKey(e) {
    if (e.key === 'Enter') {
      this.scene.start('Game');
    }
  }
}

export default Menu;   