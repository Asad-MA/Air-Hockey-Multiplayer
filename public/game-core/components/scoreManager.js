export default class ScoreManager {
  constructor(scene) {
    this.scene = scene;
    this.scores = {
      player1: 0,
      player2: 0
    };

    this.createHUD();
  }

  createHUD() {
    const { width , height } = this.scene.scale;

    const bg = this.scene.add.rectangle(0, 0, 140, 50, 0x000000, 0.1).setOrigin(0.5);

    this.scoreTop = this.scene.add.text(0, -20, this.getScoreText().p1, {
      fontFamily: 'Impact',
      fontSize: '30px',
      color: '#615d8c',
      align: 'center',
      fontWeight: 'bold',
    }).setOrigin(0.5 , 0.5);

    this.scoreBottom =  this.scene.add.text(0, 20, this.getScoreText().p2, {
      fontFamily: 'Impact',
      fontSize: '30px',
      color: '#615d8c',
      align: 'center',
      fontWeight: 'bold',
    }).setOrigin(0.5 , 0.5);

    this.scoreText =  this.scene.add.text(0, 20, this.getScoreText(), {
      fontFamily: 'Impact',
      fontSize: '30px',
      color: '#615d8c',
      align: 'center',
      fontWeight: 'bold',
    }).setOrigin(0.5 , 0.5);

    this.container = this.scene.add.container(this.scene.gameFrame.frameX + this.scene.gameFrame.frameWidth - 60  , height / 2 , [ this.scoreText]);
    this.container.setScrollFactor(0);
    this.container.setDepth(2)
    this.container.setRotation(Phaser.Math.DegToRad(-90));
  }

  getScoreText() {
    // return {p1: this.scores.player1 , p2: this.scores.player2}
    return ` ${this.scores.player2} : ${this.scores.player1}`;
  }

  addGoal(player) {
    if (this.scores[player] !== undefined) {
      this.scores[player]++;
      this.updateScoreDisplay();
    }
  }

  updateScoreDisplay() {
    // this.scoreTop.setText(this.getScoreText().p1);
    // this.scoreBottom.setText(this.getScoreText().p2);
    this.scoreText.setText(this.getScoreText())
  }

  resetScores() {
    this.scores.player1 = 0;
    this.scores.player2 = 0;
    this.updateScoreDisplay();
  }
}
