export default class TimerManager {
  constructor(scene) {
    this.scene = scene;
    this.timeLeft = 600; // seconds
    this.isRunning = true;
    console.log(this.scene)
    this.createHUD();
  }

  createHUD() {
    const { width , height } = this.scene.scale;

    const bg = this.scene.add.rectangle(0, 0, 80, 30, 0x000000, 0.5).setOrigin(0.5);

    this.timerText = this.scene.add.text(0, 0, this.formatTime(this.timeLeft), {
      fontFamily: 'Impact',
      fontSize: '30px',
      color: '#615d8c',
      align: 'center',
      fontWeight: 'bold',
    }).setOrigin(0.5);

     

    this.container = this.scene.add.container(this.scene.gameFrame.frameX + 40, height / 2, [this.timerText]);
    this.container.setScrollFactor(0);
    this.container.setDepth(2);
    this.container.setRotation(Phaser.Math.DegToRad(-90))
  }



  update(delta) {
    if (!this.isRunning) return;

    this.timeLeft = delta / 1000;
    if (this.timeLeft <= 0) {
      this.timeLeft = 0;
      this.isRunning = false;
      this.onTimeUp();
    }

    this.timerText.setText(this.formatTime(this.timeLeft));
  }

  formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  onTimeUp() {
    this.scene.physics.pause();
    this.timerText.setText("00:00");
  }

  reset(timeInSeconds = 60) {
    this.timeLeft = timeInSeconds;
    this.isRunning = true;
    this.timerText.setText(this.formatTime(this.timeLeft));
  }

  pause() {
    this.isRunning = false;
  }

  resume() {
    this.isRunning = true;
  }
}
