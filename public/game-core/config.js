import Boot from "./scenes/boot.js";
import Game from "./scenes/game.js";
import Menu from "./scenes/menu.js";
import GameOver from "./scenes/gameOver.js";
import Pause from "./scenes/pause.js";
import PlayerJoinScene from "./scenes/join.js";

const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    // width: 540,
    //    height: 700,

    parent: '#game-screen',
    backgroundColor: '#000',
    physics: {
        default: 'arcade',
        debug: true,
        scaleFactor: window.devicePixelRatio,//isMobile ? 2 : 1,
        arcade:{
            debug: false,
            fps: 60,
            gravity: { y: 0 , x: 0 },
            debugShowBody: true,
            debugShowStaticBody: true,
            debugShowVelocity: true,
        }
    },
    scene: [Boot, PlayerJoinScene, Game, Menu, GameOver, Pause],
    // scene: [Game, Menu, GameOver, Pause],
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        // width: window.innerWidth,
        // height: window.innerHeight,

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
        antialias: true,
        pixelArt: false,
        roundPixels: true
    },

};


export default config;
