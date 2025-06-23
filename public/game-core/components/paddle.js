class Paddle extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        this.virtualWidth = 100;
        this.virtualHeight = 100;
        this.scaleFactor = scene.gameFrame.scaleFactor;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setImmovable(true);
        this.body.setDirectControl(true);
        this.setFriction(0,0);
        this.setMaxVelocity(this.scene.gameSettings.paddleSpeed , this.scene.gameSettings.paddleSpeed);
        this.setMass(this.scene.gameSettings.paddleMass);
        
        console.log(this);

        this.setInteractive({draggable: true});
        scene.input.setDraggable(this);
        this.setDisplaySize(this.virtualWidth , this.virtualWidth );
        this.setCircle(this.body.halfWidth, 0, this.body.halfHeight - this.body.halfWidth);
        this.setScale(this.scaleFactor / 3.5);
        
        // 

    }

   
}


export default Paddle;