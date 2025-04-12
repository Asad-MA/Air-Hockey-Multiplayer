import ArcadePhysicsManager from "../physics/arcadePhysicsManager.js";

class GameWorld {
    constructor(scene) {
        this.scene = scene;
        this.physicsManager = new ArcadePhysicsManager(scene);

        // Define the virtual world size
        this.virtualWidth = 560;  // Fixed logical width
        this.virtualHeight = 900; // Fixed logical height

        // Initialize scale factor
        this.calculateScaleFactor();

        // Set initial frame size and position
        this.updateFramePosition();

        //this.margin = 25; // Margin for the frame
        // Create background and frame parts
        this.bg = this.scene.add.image(this.frameX, this.frameY, 'gamebg')
            .setDisplaySize(this.frameWidth, this.frameHeight)
            .setOrigin(0);

        this.createFrameParts();

        // Listen for window resize events
        // window.addEventListener('resize', this.onResize.bind(this));
    }



    // Function to calculate scale factor
    calculateScaleFactor() {
        const screenWidth = this.scene.scale.width;
        const screenHeight = this.scene.scale.height;

        const scaleX = screenWidth / this.virtualWidth;
        const scaleY = screenHeight / this.virtualHeight;

        // Use the smallest scale to ensure everything fits inside the screen
        this.scaleFactor = Math.min(scaleX, scaleY);
    }

    // Function to update frame dimensions and position based on scale factor
    updateFramePosition() {
        const screenWidth = this.scene.scale.width;
        const screenHeight = this.scene.scale.height;

        this.frameWidth = this.virtualWidth * this.scaleFactor;
        this.frameHeight = (this.virtualHeight) * this.scaleFactor;

        // Center the game world on the screen
        this.frameX = (screenWidth - this.frameWidth) / 2;
        this.frameY = (screenHeight - this.frameHeight) / 2;
    }

    // Handle the window resize event
    onResize() {
        // Recalculate scale factor and frame position
        this.calculateScaleFactor();
        this.updateFramePosition();

        // Resize background
        // this.scene.add.image(this.frameX, this.frameY, 'gamebg')
        //     .setDisplaySize(this.frameWidth, this.frameHeight)
        //     .setOrigin(0);

        // Re-scale all frame parts
        this.scaleGameElements();
    }

    createFrameParts() {
        this.frameParts = [];
        this.goals = [];

        const topLeft = this.createFrameSprite(this.frameX, this.frameY, 'top-left');
        topLeft.setDisplaySize(this.frameWidth / 2, this.frameHeight / 2).setOrigin(0, 0);

        const bottomLeft = this.createFrameSprite(this.frameX, ( this.frameHeight / 2) + this.frameY, 'bottom-left');
        bottomLeft.setDisplaySize(this.frameWidth / 2, this.frameHeight / 2).setOrigin(0, 0);

        const topRight = this.createFrameSprite(this.frameX + this.frameWidth, this.frameY, 'top-right');
        topRight.setDisplaySize(this.frameWidth / 2, this.frameHeight / 2).setOrigin(1, 0);

        const bottomRight = this.createFrameSprite(this.frameX + this.frameWidth / 2,  ( this.frameHeight / 2) + this.frameY, 'bottom-right');
        bottomRight.setDisplaySize(this.frameWidth / 2, this.frameHeight / 2).setOrigin(-0, 0);

        // Enable Arcade physics and make them immovable
        // this.physicsManager.addGameObject(topLeft).setImmovable(true);
        // this.physicsManager.addGameObject(topRight).setImmovable(true);
        // this.physicsManager.addGameObject(bottomLeft).setImmovable(true);
        // this.physicsManager.addGameObject(bottomRight).setImmovable(true);

        this.frameParts.push(topLeft, bottomLeft, topRight, bottomRight);

        // Create goals
        const goalTop = this.createFrameSprite(this.frameX + this.frameWidth / 2, this.frameY +20 , 'goal-top');
        goalTop.setDisplaySize(this.frameWidth / 2.7, 50)//.setOrigin(0.5, 0);
        const goalBottom = this.createFrameSprite(this.frameX + this.frameWidth / 2, this.frameY + this.frameHeight -20, 'goal-bottom');
        goalBottom.setDisplaySize(this.frameWidth / 2.7, 50)//.setOrigin(0.5, 0);

        goalTop.setSize(this.frameWidth + 50 , 50);
        goalBottom.setSize(this.frameWidth + 50 , 50);

        //Adding Static  images
        // const centerCircle = this.scene.add.image(this.frameX + this.frameWidth / 2, this.frameY + this.frameHeight / 2, 'center-circle')
        //     .setDisplaySize(this.frameWidth / 3, this.frameWidth / 3).setOrigin(0.5, 0.5);

        const centerCircle = this.scene.add.graphics({
            x: this.frameX + this.frameWidth / 2,
            y: this.frameY + this.frameHeight / 2,
            lineStyle: {
                width: 1,
                color: 0x493b72,
                alpha: 1
            },
        });

        const topHalf = this.scene.add.graphics({
            x: this.frameX + this.frameWidth / 2,
            y: this.frameY,
            lineStyle: {
                width: 1,
                color: 0x6ecefd,
                alpha: 1
            },
        })

        const bottomHalf = this.scene.add.graphics({
            x: this.frameX + this.frameWidth / 2,
            y: this.frameY + this.frameHeight,
            lineStyle: {
                width: 1,
                color: 0xce37ff,
                alpha: 1
            },
        })

        centerCircle.strokeCircleShape({ x: 0, y: 0, radius: this.frameWidth/6 });
        topHalf.beginPath();
        topHalf.arc(0, 30, this.frameWidth/6, Phaser.Math.DegToRad(0), Phaser.Math.DegToRad(180));
        topHalf.strokePath();

        bottomHalf.beginPath();
        bottomHalf.arc(0, -30, this.frameWidth/6, Phaser.Math.DegToRad(180), Phaser.Math.DegToRad(360));
        bottomHalf.strokePath();

        const centerLine = this.scene.add.image(this.frameX + 20, this.frameY + this.frameHeight / 2, 'center-line').setDisplaySize(this.frameWidth - 40, 1).setOrigin(0, 0.5);

    }



    createFrameSprite(x, y, texture) {
        const part = this.scene.add.sprite(x, y, texture);

        this.scene.anims.create({
            key: texture + 'Hit',
            frames: this.scene.anims.generateFrameNumbers(texture, { start: 0, end: 0 }),
            frameRate: 20,
            repeat: 1
        });

        part.on('animationcomplete', (anim) => {
            if (anim.key === texture + 'Hit') {
                part.setFrame(0);
            }
        });

        return part;
    }

    // Make sure all the game elements are scaled accordingly to fit the screen
    scaleGameElements() {
        this.frameParts.forEach(part => {
            part.setDisplaySize(part.width * this.scaleFactor, part.height * this.scaleFactor);
        });

        // Adjust all paddles and puck accordingly
        if (this.paddle) {
            this.paddle.setDisplaySize(this.paddle.width * this.scaleFactor, this.paddle.height * this.scaleFactor);
        }
        if (this.puck) {
            this.puck.setDisplaySize(this.puck.width * this.scaleFactor, this.puck.height * this.scaleFactor);
        }
    }

    // Call this in `Game.create()` after you initialize your paddle and puck
    initializeGameElements(paddle, puck) {
        this.paddle = paddle;
        this.puck = puck;

        // Scale the game elements
        this.scaleGameElements();
    }
}

export default GameWorld;
