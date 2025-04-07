class Paddle extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        this.setDisplaySize(100 , 100);

    }

    move(cursors) {
        if (cursors.left.isDown) this.setVelocityX(-300);
        else if (cursors.right.isDown) this.setVelocityX(300);
        else this.setVelocityX(0);
    }
}


export default Paddle;