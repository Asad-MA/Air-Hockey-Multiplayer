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
        default: 'matter',
        scaleFactor: window.devicePixelRatio,//isMobile ? 2 : 1,
        matter: {
            enabled: true,
            debug: true,
            gravity: {
                x: 0,
                y: 0,
            },
            // debug: {
            //     enabled: false,
            //     showAxes: true,
            //     showAngleIndicator: true,
            //     angleColor: 0xe81153,
            //     showBroadphase: true,
            //     broadphaseColor: 0xffb400,
            //     showBounds: true,
            //     boundsColor: 0xffffff,
            //     showVelocity: true,
            //     velocityColor: 0x00aeef,
            //     showCollisions: true,
            //     collisionColor: 0xf5950c,
            //     showSeparations: true,
            //     separationColor: 0xffa500,
            //     showBody: true,
            //     showStaticBody: true,
            //     showInternalEdges: true,
            //     renderFill: true,
            //     renderLine: true,
            //     fillColor: 0x106909,
            //     fillOpacity: 1,
            //     lineColor: 0x28de19,
            //     lineOpacity: 1,
            //     lineThickness: 1,
            //     staticFillColor: 0x0d177b,
            //     staticLineColor: 0x1327e4,
            //     showSleeping: false,
            //     staticBodySleepOpacity: 0.7,
            //     sleepFillColor: 0x464646,
            //     sleepLineColor: 0x999a99,
            //     showSensors: true,
            //     sensorFillColor: 0x0d177b,
            //     sensorLineColor: 0x1327e4,
            //     showPositions: true,
            //     positionSize: 4,
            //     positionColor: 0xe042da,
            //     showJoint: true,
            //     jointColor: 0xe0e042,
            //     jointLineOpacity: 1,
            //     jointLineThickness: 2,
            //     pinSize: 4,
            //     pinColor: 0x42e0e0,
            //     springColor: 0xe042e0,
            //     anchorColor: 0xefefef,
            //     anchorSize: 4,
            //     showConvexHulls: false,
            //     hullColor: 0xd703d0
            // }
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
        smoothStep: false
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
        roundPixels: false
    },

};


export default config;
