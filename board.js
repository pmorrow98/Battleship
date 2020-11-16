import Ship from "./ship.js";

export default class Board{
    constructor(startboard){
        this.board = startboard;
        this.arrlength = startboard.length;
        this.dimension = Math.sqrt(this.arrlength);
        this.state = Board.State.INITIALIZED;
        this.ships = [];
        this.sinkListeners = [];
        this.loseListeners = [];
        for (let i = 1; i <= 5; i++){
            this.ships[i] = new Ship(i);
        }
        this.ships_left = 5;
    }
    addSinkListener(callback){
        for (let i = 1; i <= 5; i++){
            this.ships[i].addSinkListener(callback);
        }
        //this.sinkListeners.push(callback);
    }
    addLoseListener(callback){
        this.loseListeners.push(callback);
    }

    updateLose(){
        this.loseListeners.forEach((callback) => callback());
    }
    shoot(x, y){
        if(this.state == Board.State.INITIALIZED){
            this.state = Board.State.IN_PROGRESS;
        }
        let result = -1;
        let selected_tile = this.board[(y * this.dimension) + x];
        if(selected_tile != -1){
            if(selected_tile == 0){
                result = 0;
                this.board[(y * this.dimension) + x] = -1;
            }
            else{
                result = selected_tile;
                this.board[(y * this.dimension) + x] = -1;
                this.ships[selected_tile].hit();
            }
        }
        return result;
    }
}

Board.State = {
    INITIALIZED: 0,
    IN_PROGRESS: 1,
    OVER:        2
};