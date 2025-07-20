class Puck extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.virtualWidth = 64;
        this.virtualHeight = 64;
        // this.scaleFactor = scene.sys.game.config.physics.scaleFactor;
        this.scaleFactor = scene.gameFrame.scaleFactor;
        // console.log(this.scaleFactor);
        this.setDisplaySize(this.virtualWidth * this.scaleFactor, this.virtualWidth * this.scaleFactor);
        this.setCircle(this.body.halfWidth, 0, this.body.halfHeight - this.body.halfWidth);
        this.setScale(this.scaleFactor / 3.5);
        this.setMass(0.5);
        this.setBounce(1);
        this.setFriction(0, 0);
        this.body.setAllowRotation();
        // this.body.slideFactor.set(0.8,0.8);
        // this.setDrag(10, 10)
        this.setMaxVelocity(1000 , 1000);

        this.setCollideWorldBounds(true);

        // And set world bounds (once, usually in scene create)
        // scene.matter.world.setBounds(0, 0, width, height, 32, true, true, true, true);

    }
}


export default Puck;