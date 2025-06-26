export class GameInfoOverlay {
    constructor(scene) {
      this.scene = scene;
  
      this.overlay = scene.add.graphics();
      this.overlay.fillStyle(0x000000, 0);
      this.overlay.fillRect(this.scene.gameFrame.frameX, this.scene.gameFrame.frameY, this.scene.gameFrame.frameWidth, this.scene.gameFrame.frameHeight);
      this.overlay.setDepth(100).setVisible(false);

      this.createAnimations();
    }


    createAnimations(){
      if (!this.scene.anims.exists('GOAL')) {
      this.scene.anims.create({
        key: 'GOAL',
        frames: this.scene.anims.generateFrameNumbers('GOAL', { start: 0, end: 7 }),
        frameRate: 35,
        repeat: 0
      });
    }
    }
  
    show(key, duration = 1500) {
      const {width , height} = this.scene.scale;
      this.spritte = this.scene.add.sprite(width / 2, height / 2, key).setOrigin(0.5).play(key).setDepth(101).setScale(10).setAlpha(0);
      this.scene.tweens.add({
        targets: this.spritte,
        scale: 1,     // Final size (50%)
        alpha: 1,       // Optional: fade in
        ease: 'Back.Out', // Easing for bounce-like effect
        duration: 250, 
        // yoyo: true // Duration in ms
      });

      this.overlay.setVisible(true);
      
      // this.text.setText(message).setVisible(true);
  
      this.scene.time.delayedCall(duration, () => this.hide());
    }
  
    hide() {
      this.overlay.setVisible(false);
      this.spritte.setVisible(false);
    }
  }
  