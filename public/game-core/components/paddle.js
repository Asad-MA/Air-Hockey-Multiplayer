class Paddle extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        this.virtualWidth = 100;
        this.virtualHeight = 100;
        this.scaleFactor = scene.gameFrame.scaleFactor;
        scene.add.existing(this);
        this.setDisplaySize(this.virtualWidth * this.scaleFactor , this.virtualWidth * this.scaleFactor);

    }

   
}


export default Paddle;