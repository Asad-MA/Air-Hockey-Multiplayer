class GameWorld {
    constructor(scene) {
        this.scene = scene;
        // this.physics = scene.matter;

        console.log(scene);

        this.scaleFactor = scene.game.config.physics.scaleFactor;

        this.frameWidth = window.innerHeight / 1.5 * this.scaleFactor;
        this.frameHeight = window.innerHeight - 50 * this.scaleFactor;
        this.frameX = (scene.scale.width - this.frameWidth) / 2;
        this.frameY = 25;

        //this.physics.world.setBounds(this.frameX, this.frameY, this.frameWidth, this.frameHeight);

        this.scene.add.image(this.frameX, this.frameY, 'gamebg').setDisplaySize(this.frameWidth, this.frameHeight).setOrigin(0);

        // Create animated frame parts
        this.createFrameParts();

        // this.frameParts.forEach(sprite => {
        //    sprite.play('sprite');
        // });
    }

    createFrameParts() {
        this.frameParts = [];
        const topLeft = this.createFrameSprite(this.frameX, this.frameY, 'top-left').setDisplaySize(this.frameWidth / 2.5, this.frameHeight / 1.9).setOrigin(0.05, 0.05);
        const bottomLeft = this.createFrameSprite(this.frameX, (this.frameHeight / 2) - 25, 'bottom-left').setDisplaySize(this.frameWidth / 2.5, this.frameHeight / 1.9).setOrigin(0.05, -0.1);
        const topRight = this.createFrameSprite(this.frameX + this.frameWidth, this.frameY, 'top-right').setDisplaySize(this.frameWidth / 2.5, this.frameHeight / 1.9).setOrigin(1, 0.05);;
        const bottomRight = this.createFrameSprite(this.frameX + this.frameWidth / 2, this.frameHeight / 2 - 25, 'bottom-right').setDisplaySize(this.frameWidth / 2.5, this.frameHeight / 1.9).setOrigin(-0.25, -0.1);;

       // const platforms = this.physics.add.staticGroup();

        // Add a platform (static physics body) at a given position
       // const platform = platforms.create(this.frameX + 20, this.frameY + 20, 'platformImage');
        //platform.setSize(10, this.frameHeight/2); // Set the size of the platform
        //platform.refreshBody();  // ensures the physics body is updated

        this.frameParts.push(topLeft);
        this.frameParts.push(bottomLeft);
        this.frameParts.push(topRight);
        this.frameParts.push(bottomRight);
    }

    createFrameSprite(x, y, texture) {
        let part = this.scene.add.sprite(x, y, texture)//.setImmovable(true);
        this.scene.anims.create({
            key: texture + 'Hit',
            frames: this.scene.anims.generateFrameNumbers(texture, { start: 0, end: 0 }),
            frameRate: 20,
            repeat: 1
        });

        part.on('animationcomplete', (anim) => {
            if (anim.key === texture + 'Hit') {
                part.setFrame(0); // Reset to first frame
            }
        });

        return part;
    }
}

export default GameWorld;
