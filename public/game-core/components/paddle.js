class Paddle extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        this.WIDTH = 100;
        this.HEIGHT = 100;
        this.scaleFactor = scene.sys.game.config.physics.scaleFactor;
        scene.add.existing(this);
        this.setDisplaySize(this.WIDTH * this.scaleFactor , this.WIDTH * this.scaleFactor);

    }

    move(cursors) {
        if (cursors.left.isDown) this.setVelocityX(-300);
        else if (cursors.right.isDown) this.setVelocityX(300);
        else this.setVelocityX(0);
    }
}


export default Paddle;