class Pause extends Phaser.Scene {
    constructor() {
        super({ key: 'Pause' });
    }

    create() {
        this.add.text(100, 100, 'Pause', { fontSize: '48px', fill: '#fff' });
        this.input.keyboard.on('keydown_ESC', () => {
            this.scene.stop('Pause');
            this.scene.resume('Game');
        });
    }
}

export default Pause;