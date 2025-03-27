import Boot from "./scenes/boot.js";
import Game from "./scenes/game.js";
import Menu from "./scenes/menu.js";
import GameOver from "./scenes/gameOver.js";
import Pause from "./scenes/pause.js";
import PlayerJoinScene from "./scenes/join.js";

const config = {
    type: Phaser.AUTO,
    width: window.innerHeight / 2,
    height: window.innerHeight,
    mode: Phaser.Scale.FIT,  // Ensures the game scales to fit the screen
    autoCenter: Phaser.Scale.CENTER_BOTH, // Centers game
    //width: window.innerWidth,
   // height: window.innerHeight,
    parent: '#game-screen',
    backgroundColor: '#000',
    physics: {
        default: 'arcade',
        arcade: {
            // gravity: { y: 300 },
            debug: false
        }
    },
    scene: [Boot, PlayerJoinScene, Game, Menu, GameOver, Pause],
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    fps: {
        target: 60,
        smoothStep: true
    },
    input: {
        keyboard: true,
        mouse: true,
        touch: true
    },
    audio: {
        disableWebAudio: false
    },
    render: {
        antialias: false,
        pixelArt: true,
        roundPixels: true
    }
};


export default config;
