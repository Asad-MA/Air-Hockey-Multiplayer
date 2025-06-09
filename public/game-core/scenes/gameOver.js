export default class GameOver extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOver' });
  }

  init(data) {
    console.log('Game Over Data:' , data);
    this.result = data.result; // "win" or "lose"
  }

  preload(){
    this.players = this.scene.get('PlayerJoinScene').players;
  }

  create() {

    console.log(this.players);
    const { width, height } = this.scale;

    // Glassy transparent overlay
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.5);

    // Create animations once
    if (!this.anims.exists('winner')) {
      this.anims.create({
        key: 'winner',
        frames: this.anims.generateFrameNumbers('winner', { start: 0, end: 2 }),
        frameRate: 10,
        repeat: 0
      });
    }

    if (!this.anims.exists('loser')) {
      this.anims.create({
        key: 'loser',
        frames: this.anims.generateFrameNumbers('loser', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: 0
      });
    }

    // Show appropriate animation
    const animKey = this.result.result === 'win' ? 'winner' : 'loser';
    const spriteKey = this.result.result === 'win' ? 'winner' : 'loser';

    // const glow = this.add.sprite(width / 2 - 30, height / 2 - 100, spriteKey);
    // glow.setTint(0xffff00);       // Glow color (yellow)
    // glow.setAlpha(0.2);           // Make it transparent
    // glow.setScale(1.2);           // Slightly larger for glow effect
    // glow.setDepth(2);             // Behind the main sprite

    // In front

    const emitter = this.add.particles(0, 0, 'trail', {
      speed: 50,
       lifespan: 2000,
      //  quantity: 10,
      frequency: 10,
       angle: { min: 0, max: 360 },
      scale: { start: 0.5, end: 0 },
      blendMode: 'ADD',
     
    });
    

    const spritte = this.add.sprite(width / 2 - 30, height / 2 - 100, spriteKey).setOrigin(0.5).play(animKey);

    emitter.startFollow(spritte);

    this.add.text(width / 2, height / 2 , `Your Score: ${this.result.scores[this.players[0].name]}`, {
      fontSize: '18px',
      fontFamily: 'Impact',
      color: '#ffffff'
    }).setOrigin(0.5 , 0.5);

    
    this.add.text(width / 2, height / 2 + 40, `Opponent Score: ${this.result.scores[this.players[1].name]}`, {
      fontSize: '18px',
      fontFamily: 'Impact',
      color: '#ffffff'
    }).setOrigin(0.5 , 0.5);

    const G = this.result.scores[this.players[0].name];
    const C = this.result.scores[this.players[1].name];
    const D = G - C;

    const Points = (G * 20) - (C * 10) + (D * 5)

    
    this.add.text(width / 2, height / 2 + 80, `Points Earned: ${Points}`, {
      fontSize: '18px',
      fontFamily: 'Impact',
      color: '#ffffff'
    }).setOrigin(0.5 , 0.5);

  const buttonWidth = 200;
const buttonHeight = 50;
const radius = 20;

// Create graphics object
const graphics = this.add.graphics();

// Apply gradient fill (TopLeft, TopRight, BottomLeft, BottomRight)
graphics.fillGradientStyle(0xff7e5f, 0xff7e5f, 0xfeb47b, 0xfeb47b, 1);
graphics.fillRoundedRect(0, 0, buttonWidth, buttonHeight, radius);

// Generate texture from graphics
graphics.generateTexture('rematchGradientBtn', buttonWidth, buttonHeight);
graphics.destroy(); // Remove graphics from scene

// Add image from texture
const bg = this.add.image(0, 0, 'rematchGradientBtn').setOrigin(0.5);

// Add text
const rematchText = this.add.text(0, 0, 'Rematch', {
  fontSize: '24px',
  color: '#ffffff',
  fontFamily: 'Arial'
}).setOrigin(0.5);

// Combine into container
const button = this.add.container(width / 2, height - 250, [bg, rematchText])
  .setSize(buttonWidth, buttonHeight)
  .setInteractive({ useHandCursor: true })
  .on('pointerdown', () => {
    console.log('Rematch clicked');
    // Add rematch logic here
  });

  }

}
