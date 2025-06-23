import ScoreManager from './scoreManager.js';
import TimerManager from './timerManager.js';

export default class HUD {
  constructor(scene) {
    this.scene = scene;

    // HUD Background (optional)
    this.bg = this.scene.add.rectangle(0, 0, scene.scale.width, 40, 0x000000, 0.3)
      .setOrigin(0)
      .setScrollFactor(0);

    // Managers
    this.scoreManager = new ScoreManager(scene);
    this.timerManager = new TimerManager(scene);

    // Avatars (example)
    // this.avatar1 = this.scene.add.image(40, 20, 'avatar1').setDisplaySize(32, 32).setScrollFactor(0);
    // this.avatar2 = this.scene.add.image(scene.scale.width - 40, 20, 'avatar2').setDisplaySize(32, 32).setScrollFactor(0);
  }

  update(delta) {
    this.timerManager.update(delta);
  }

  updateTime(t){
    this.timerManager.setRemaining(t);
  }

  addGoal(player) {
    console.log(player);
    this.scoreManager.addGoal(player);
  }

  resetHUD() {
    this.scoreManager.resetScores();
    this.timerManager.reset();
  }
}
