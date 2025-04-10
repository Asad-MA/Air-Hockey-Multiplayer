class Puck extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        this.WIDTH = 64;
        this.HEIGHT = 64;
        this.scaleFactor = scene.sys.game.config.physics.scaleFactor;
        // console.log(this.scaleFactor);
       this.setDisplaySize(this.WIDTH * this.scaleFactor , this.WIDTH * this.scaleFactor);
        
        // And set world bounds (once, usually in scene create)
        // scene.matter.world.setBounds(0, 0, width, height, 32, true, true, true, true);
        
    }
}


export default Puck;