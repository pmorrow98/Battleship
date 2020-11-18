export default class Board{
    constructor(startboard, owner){
        this.board = startboard;
        this.owner = owner;
        this.arrlength = startboard.length;
        this.dimension = Math.sqrt(this.arrlength);
        this.state = Board.State.INITIALIZED;
        this.ships = [5,4,3,3,2];
        this.sinkListeners = [];
        this.loseListeners = [];
        this.ships_left = 5;
    }
    addSinkListener(callback){
        this.sinkListeners.push(callback);
    }
    addLoseListener(callback){
        this.loseListeners.push(callback);
    }

    updateSink(shipID){
        this.sinkListeners.forEach((callback) => callback(shipID));
    }

    updateLose(){
        this.loseListeners.forEach((callback) => callback(this.owner));
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
                this.ships[selected_tile - 1] -= 1;
                if(this.ships[selected_tile - 1] == 0){
                    this.updateSink(selected_tile);
                    this.ships_left -= 1;
                    if(this.ships_left == 0){
                        this.updateLose();
                    }
                }
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