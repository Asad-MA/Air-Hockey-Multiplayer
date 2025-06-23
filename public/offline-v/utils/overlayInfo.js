export class GameInfoOverlay {
    constructor(scene) {
      this.scene = scene;
  
      this.overlay = scene.add.graphics();
      this.overlay.fillStyle(0x46109f, 0.8);
      this.overlay.fillRect(this.scene.gameFrame.frameX, this.scene.gameFrame.frameY, this.scene.gameFrame.frameWidth, this.scene.gameFrame.frameHeight);
      this.overlay.setDepth(100).setVisible(false);
  
      this.text = scene.add.text(scene.scale.width / 2, scene.scale.height / 2, '', {
        fontSize: '32px',
        fill: '#ffffff',
        fontStyle: 'bold'
      }).setOrigin(0.5).setDepth(101).setVisible(false);
    }
  
    show(message, duration = 1500) {
      this.overlay.setVisible(true);
      this.text.setText(message).setVisible(true);
  
      this.scene.time.delayedCall(duration, () => this.hide());
    }
  
    hide() {
      this.overlay.setVisible(false);
      this.text.setVisible(false);
    }
  }
  