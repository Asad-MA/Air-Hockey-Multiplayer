export class GameState {
    constructor(game) {
        this.timestamp = Date.now();
        this.game = game;
        // console.log(this.game.gameFrame);

        this.puck = {
            x: this.game.gameFrame.frameX + this.game.gameFrame.frameWidth / 2,
            y: this.game.gameFrame.frameY + this.game.gameFrame.frameHeight / 2,
            vx: 0,
            vy: 0,
        };

        this.paddles = {
            player1: {  
                x: this.game.gameFrame.frameX + this.game.gameFrame.frameWidth / 2,
                y: this.game.gameFrame.frameY + this.game.gameFrame.frameHeight - 50, 
                vx: 0,
                vy: 0,
            },
            player2: {  
                x: this.game.gameFrame.frameX + this.game.gameFrame.frameWidth / 2,
                y: this.game.gameFrame.frameY , 
                vx: 0,
                vy: 0,
            },
        };
    }

    updateTimestamp() {
        this.timestamp = Date.now();
    }

    updatePuck(x, y, vx, vy) {
        this.puck.x = x;
        this.puck.y = y;
        this.puck.vx = vx;
        this.puck.vy = vy;
        this.updateTimestamp();
    }

    updatePaddle(playerId, x, y, vx, vy) {
        if (this.paddles[playerId]) {
            this.paddles[playerId].x = x;
            this.paddles[playerId].y = y;
            this.paddles[playerId].vx = vx;
            this.paddles[playerId].vy = vy;
            this.updateTimestamp();
        }
    }

    getState() {
        this.timestamp = Date.now();
        return {
            timestamp: this.timestamp,
            puck: this.puck,
            paddles: this.paddles,
        };
    }

    reset(){
        this.puck = {
            x: this.game.gameFrame.frameX + this.game.gameFrame.frameWidth / 2,
            y: this.game.gameFrame.frameY + this.game.gameFrame.frameHeight / 2,
            vx: 0,
            vy: 0,
        };

        this.paddles = {
            player1: {  
                x: this.game.gameFrame.frameX + this.game.gameFrame.frameWidth / 2,
                y: this.game.gameFrame.frameY + this.game.gameFrame.frameHeight - 50, 
                vx: 0,
                vy: 0,
            },
            player2: {  
                x: this.game.gameFrame.frameX + this.game.gameFrame.frameWidth / 2,
                y: this.game.gameFrame.frameY , 
                vx: 0,
                vy: 0,
            },
        };
    }
}
