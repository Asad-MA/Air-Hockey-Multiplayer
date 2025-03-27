class Boot extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        this.scale.startFullscreen();
        // Set base URL (if needed)
        this.load.setBaseURL('./game-core/assets/');

        // Set background color
        this.cameras.main.setBackgroundColor('#222');

        // 🌟 Load the background image first
        this.load.image('bootBackground', 'textures/default-bg.png');
    }

    create() {
        // Set background image
        let bg = this.add.image(this.scale.width / 2, this.scale.height / 2, 'bootBackground');
        bg.setDisplaySize(this.scale.width, this.scale.height);

        // ✅ Load other assets after background is set
        this.loadAssets();
    }

    loadAssets() {
        console.log('Loading assets...');

        // Loading text
        let loadingText = this.add.text(this.scale.width / 2, this.scale.height - 30, 'Copyright © 2025 Airhockey Multiplayer. All rights reserved.', {
            fontSize: '12px',
            fill: '#fff'
        }).setOrigin(0.5, 1);

        let versionText = this.add.text(this.scale.width - 20, this.scale.height - 20, 'v1.0.0', {
            fontSize: '12px',
            color: '#fff'
        }).setOrigin(1, 1); // Aligns text to bottom-right
        

        // Loading progress bar

        let progressBox = this.add.graphics();
        let progressBar = this.add.graphics();
        progressBox.fillStyle(0x6e6f9d, 1);
        progressBox.fillRect(10, this.scale.height - 100, (this.scale.width - 20), 5);

        // Percentage text
        let percentText = this.add.text(this.scale.width - 30, this.scale.height - 107, '0%', {
            fontSize: '12px',
            
            fill: '#fff'
        }).setOrigin(1 ,1);

        // Text for current loading file
        let assetText = this.add.text(20, this.scale.height - 115, 'loading...', {
            fontSize: '11px',
            
            fill: '#fff'
        }).setOrigin(0, 0.5);

        // ✅ Load assets (NO `async: true` because it's invalid in Phaser)
        this.load.image('background', 'textures/default-bg.png');
        this.load.image('paddle', 'textures/default-bg-1.jpg');
        this.load.image('puck', 'textures/default-bg-2.jpg');
        this.load.image('puck1', 'textures/default-bg-3.jpg');
        this.load.audio('hitSound', 'tracks/track-1.mp3');
        this.load.audio('goalSound', 'tracks/track-1.mp3');

        // Update progress bar
        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0xe044cb, 1);
            progressBar.fillRect(10, this.scale.height - 100, (this.scale.width * value - 20), 5);
            percentText.setText(parseInt(value * 100) + '%');
        });

        // Show currently loading asset
        let assetQueue = [];
        assetText.setText('textures/default-bg-4.png')
        this.load.on('fileprogress', (file) => {
            // console.log(file);
            // assetText.setText('Loading: ' + file.url);
            assetQueue.push(file.url);
        });

        // Cleanup when complete
        this.load.on('filecomplete', () => {
            if (assetQueue.length > 0) {
                let currentAsset = assetQueue.shift(); // Remove first item from queue
                assetText.setText(currentAsset);

                assetText.setText(assetQueue[0]); // Show next asset
            }

        });

        this.load.on('complete', () => {
            console.log('Assets loaded!');

            this.scene.start('PlayerJoinScene');
        });

        // ✅ **Start loading**
        this.load.start();
    }
}

export default Boot;
