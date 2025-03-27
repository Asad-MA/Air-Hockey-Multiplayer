class Game extends Phaser.Scene {
    constructor() {
        super({ key: 'Game' });
    }
    create() {
        console.log("Game Scene");
        this.add.text(20, 20, "Loading Game...", { font: "25px Arial", fill: "yellow" });
        this.scene.start('Level1');
    }
}

export default Game;