class Boot extends Phaser.Scene {
    constructor() {
        super({
            key: 'BootScene',
        });
    }

    preload() {
        // Set base URL (if needed)
        this.load.setBaseURL('./game-core/assets/');

        // Set background color
        this.cameras.main.setBackgroundColor('#222');

        // 🌟 Load the background image first
        this.load.image('bootBackground', 'textures/default-bg.png');
        this.load.image('logo', 'static/logo-light.png');
    }

    create() {
        this.scaleFactor = this.sys.game.config.physics.scaleFactor;
        // Set background image
        this.background = this.add.image(this.scale.width / 2, this.scale.height / 2, 'bootBackground');
        this.background.setDisplaySize(this.scale.width, this.scale.height);

        this.logo = this.add.image(this.scale.width / 2, this.scale.height / 2, 'logo');
        this.logo.setDisplaySize(550 * this.scaleFactor, 200 * this.scaleFactor);

        // ✅ Load other assets after background is set
        this.loadAssets();
    }

    loadAssets() {
        console.log('Loading assets...');

        // Loading text
        this.loadingText = this.add.text(
            this.scale.width / 2,
            this.scale.height - 30 * this.scaleFactor,
            'Copyright © 2025 Airhockey Multiplayer. All rights reserved.',
            {
                font: `bold ${12 * this.scaleFactor}px Tomorrow`,
                fill: '#fff'
            }
        ).setOrigin(0.5, 1);

        this.versionText = this.add.text(
            this.scale.width - 5,
            this.scale.height - 5,
            'version: 1.0.0',
            {
                font: `normal ${10 * this.scaleFactor}px Tomorrow`,
                color: '#fff',
            }
        ).setOrigin(1, 1); // Aligns text to bottom-right

        // Loading progress bar
        this.progressBox = this.add.graphics();
        this.progressBar = this.add.graphics();
        this.drawProgressBox();
        this.drawProgressBar(0);

        // Percentage text
        this.percentText = this.add.text(
            this.scale.width - 30,
            this.scale.height - 107 * this.scaleFactor,
            '0%',
            {
                font: `bold ${12 * this.scaleFactor}px Tomorrow`,
                fill: '#fff'
            }
        ).setOrigin(1, 1);

        // Text for current loading file
        this.assetText = this.add.text(
            20,
            this.scale.height - 115 * this.scaleFactor,
            'loading...',
            {
                font: `bold ${12 * this.scaleFactor}px Tomorrow`,
                fill: '#fff'
            }
        ).setOrigin(0, 0.5);

        // ✅ Load assets (NO `async: true` because it's invalid in Phaser)
        // Loading images
        this.load.image('background', 'textures/default-bg.png');
        this.load.image('gamebg', 'textures/background.png');
        this.load.image("puck", "textures/puck-128x128.png");
        this.load.image("paddle1", "textures/paddle-player.png");
        this.load.image("paddle2", "textures/paddle-remote.png");
        this.load.image("center-circle", "textures/center.png");
        this.load.image("center-line", "textures/center-line.png");
        this.load.image("goal-top", "textures/goal-top.png");
        this.load.image("goal-bottom", "textures/goal-bottom.png");
        this.load.image("top-half", "textures/top-half.png");
        this.load.image("bottom-half", "textures/bottom-half.png");
        this.load.image("vs", "textures/vs.png");

        // Loading SFX
        this.load.audio("glitch" , "sfx/glitch-c.wav");
        this.load.audio("bg-music" , "sfx/bg-music.mp3");
        this.load.audio("neon" , "sfx/neon-gaming.mp3");
        this.load.audio("hit" , "sfx/puck-hit.mp3");

        // Loading Sprites
        this.load.spritesheet("impactEffect", "textures/hit-sprite.png", { frameWidth: 1120, frameHeight: 1125 });
        this.load.spritesheet("top-left", "textures/top-left.png", { frameWidth: 1667, frameHeight: 2911 });
        this.load.spritesheet("top-right", "textures/top-right.png", { frameWidth: 1667, frameHeight: 2911 });
        this.load.spritesheet("bottom-left", "textures/bottom-left.png", { frameWidth: 1667, frameHeight: 2911 });
        this.load.spritesheet("bottom-right", "textures/bottom-right.png", { frameWidth: 1667, frameHeight: 2911 });

        this.load.spritesheet("winner", "textures/win.png", { frameWidth: 484.6, frameHeight: 271 });
        this.load.spritesheet("loser", "textures/lose.png", { frameWidth: 484.5, frameHeight: 271 });

        this.load.json('shapes' , 'textures/textures.json');


        // Update progress bar
        this.load.on('progress', (value) => {
            this.currentProgress = value;
            this.drawProgressBox();
            this.drawProgressBar(value);
            this.percentText.setText(parseInt(value * 100) + '%');
        });

        // Show currently loading asset
        let assetQueue = [];
        this.assetText.setText('textures/default-bg-4.png')
        this.load.on('fileprogress', (file) => {
            assetQueue.push(file.url);
        });

        // Cleanup when complete
        this.load.on('filecomplete', () => {
            if (assetQueue.length > 0) {
                let currentAsset = assetQueue.shift(); // Remove first item from queue
                this.assetText.setText(currentAsset);
                this.assetText.setText(assetQueue[0]); // Show next asset
            }

        });

        this.load.on('complete', () => {
            console.log('Assets loaded!');

            this.scene.start('PlayerJoinScene');
            // this.scale.resize(800, 1200);
            // this.scene.start('Game');
        });

        // ✅ **Start loading**
        this.load.start();

    }

    drawProgressBox() {
        this.progressBox.clear();
        this.progressBox.fillStyle(0x6e6f9d, 1);
        this.progressBox.fillRect(
            10,
            this.scale.height - 100 * this.scaleFactor,
            this.scale.width - 20,
            5
        );
    }

    drawProgressBar(progress = 0) {
        const barWidth = (this.scale.width - 20) * progress;

        this.progressBar.clear();
        this.progressBar.fillStyle(0xe044cb, 1);
        this.progressBar.fillRect(
            10,
            this.scale.height - 100 * this.scaleFactor,
            barWidth,
            5
        );
    }


    resize() {
        // console.log("Resizing Boot Scene");
        // console.log(this.game.scale.width, this.game.scale.height);
        this.background.setPosition(this.game.scale.width / 2, this.game.scale.height / 2);
        this.background.setDisplaySize(this.game.scale.width, this.game.scale.height);
        this.assetText.setPosition(20, this.game.scale.height - (115 * this.scaleFactor));
        this.loadingText.setPosition(this.game.scale.width / 2, this.game.scale.height - (30 * this.scaleFactor));
        this.versionText.setPosition(this.game.scale.width - 20, this.game.scale.height - (20 * this.scaleFactor));
        this.percentText.setPosition(this.game.scale.width - 30, this.game.scale.height - (107 * this.scaleFactor));
        this.drawProgressBox();
        this.drawProgressBar(this.currentProgress);

    }
}

export default Boot;
