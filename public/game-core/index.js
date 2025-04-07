console.log("Welcome To the Game!");
// import {Phaser} from 'https://cdn.jsdelivr.net/npm/phaser@3.70.0/dist/phaser.js';
import config from "./config.js";
// import Phaser from "./phaser.js";

const game = new Phaser.Game(config);

const onChangeScreen = () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
    game.scene.scenes.forEach((scene) => {
        if (scene.resize) {
            scene.resize();
        }
    });
}

const _orientation = screen.orientation;// || (screen as any).mozOrientation || (screen as any).msOrientation;
_orientation.addEventListener('change', () => {
    onChangeScreen();
});

window.addEventListener('resize', () => {
    onChangeScreen();
});

// console.log(game);

