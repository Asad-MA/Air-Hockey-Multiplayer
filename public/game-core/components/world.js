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

        this.margin = 25; // Margin for the frame
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
        this.frameHeight = (this.virtualHeight - 100) * this.scaleFactor;

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

        const topLeft = this.createFrameSprite(this.frameX, this.frameY - 25, 'top-left')
            .setDisplaySize(this.frameWidth / 2.5, this.frameHeight / 1.9).setOrigin(0, 0);

        const bottomLeft = this.createFrameSprite(this.frameX, this.frameY + this.frameHeight / 2 , 'bottom-left')
            .setDisplaySize(this.frameWidth / 2.5, this.frameHeight / 1.9).setOrigin(0, 0);

        const topRight = this.createFrameSprite(this.frameX + this.frameWidth, this.frameY - 25, 'top-right')
            .setDisplaySize(this.frameWidth / 2.5, this.frameHeight / 1.9).setOrigin(1, 0);

        const bottomRight = this.createFrameSprite(this.frameX + this.frameWidth / 2, this.frameY + this.frameHeight / 2, 'bottom-right')
            .setDisplaySize(this.frameWidth / 2.5, this.frameHeight / 1.9).setOrigin(-0.25, 0);

        // Enable Arcade physics and make them immovable
        this.physicsManager.addGameObject(topLeft).setImmovable(true);
        this.physicsManager.addGameObject(topRight).setImmovable(true);
        this.physicsManager.addGameObject(bottomLeft).setImmovable(true);
        this.physicsManager.addGameObject(bottomRight).setImmovable(true);

        this.frameParts.push(topLeft, bottomLeft, topRight, bottomRight);

        // Create goals
        const goalTop = this.createFrameSprite(this.frameX + this.frameWidth / 2, this.frameY - 25, 'goal-top')
            .setDisplaySize(this.frameWidth / 2, 50)//.setOrigin(0.5, 0);
    }

    createFrameSprite(x, y, texture) {
        const part = this.scene.physics.add.sprite(x, y, texture);

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
