export default class Computer{
    constructor(){
        this.board = [];
        for(let i = 0; i < 100; i++){
            this.board.push(0);
        }
        this.tryQueue = [];
        this.hits = [[], [], [], [], []];
        this.currentShipAttacking = -1;
        this.shipsToTry = [];
        this.longestShip = 5;
        this.lastShot = [0,0];
        this.shipLengths = [5,4,3,3,2];
        this.shipLengthsLeft = [5,4,3,3,2];
        this.justSunk = false;
    }

    getShot(){
        //gives next shot coordinates
        //returns object with x and y values
        let shot_x, shot_y;
        if(this.tryQueue.length == 0){
            if(this.currentShipAttacking == -1){
                let random_result = this.randomSelect();
                shot_x = random_result.x;
                shot_y = random_result.y;
            }
            else{
                //make new tryQueue based on which ship we are attacking
                if(this.hits[this.currentShipAttacking].length == 1){
                    //we don't know direction
                    let ship_x = this.hits[this.currentShipAttacking][0][0];
                    let ship_y = this.hits[this.currentShipAttacking][0][1];
                    if(ship_x - 1 >= 0){
                        if(this.board[(ship_x - 1) + (ship_y * 10)] == 0){
                            this.tryQueue.push([ship_x - 1, ship_y]);
                        }
                    }
                    if(ship_x + 1 <= 9){
                        if(this.board[(ship_x + 1) + (ship_y * 10)] == 0){
                            this.tryQueue.push([ship_x + 1, ship_y]);
                        }
                    }
                    if(ship_y - 1 >= 0){
                        if(this.board[ship_x + ((ship_y - 1) * 10)] == 0){
                            this.tryQueue.push([ship_x, ship_y - 1]);
                        }
                    }
                    if(ship_y + 1 <= 9){
                        if(this.board[ship_x + ((ship_y + 1) * 10)] == 0){
                            this.tryQueue.push([ship_x, ship_y + 1]);
                        }
                    } 
                }
                else{
                    //we do know direction
                    if(this.hits[this.currentShipAttacking][0][0] == this.hits[this.currentShipAttacking][1][0]){
                        //vertical ship
                        let col = this.hits[this.currentShipAttacking][0][0];
                        let current_ys = [];
                        this.hits[this.currentShipAttacking].forEach((pair) => current_ys.push(pair[1]));
                        let min_y = Math.min(...current_ys);
                        let max_y = Math.max(...current_ys);
                        if(min_y - 1 >= 0){
                            if(this.board[col + ((min_y - 1) * 10)] == 0){
                                this.tryQueue.push([col, min_y - 1]);
                            }
                        }
                        if(max_y + 1 <= 9){
                            if(this.board[col + ((max_y + 1) * 10)] == 0){
                                this.tryQueue.push([col, max_y + 1]);
                            }
                        }
                    }
                    else{
                        //horizontal ship
                        let row = this.hits[this.currentShipAttacking][0][1];
                        let current_xs = [];
                        this.hits[this.currentShipAttacking].forEach((pair) => current_xs.push(pair[0]));
                        let min_x = Math.min(...current_xs);
                        let max_x = Math.max(...current_xs);
                        if(min_x - 1 >= 0){
                            if(this.board[(min_x - 1) + (row * 10)] == 0){
                                this.tryQueue.push([min_x - 1, row]);
                            }
                        }
                        if(max_x + 1 <= 9){
                            if(this.board[(max_x + 1) + (row * 10)] == 0){
                                this.tryQueue.push([max_x + 1, row]);
                            }
                        }
                    }
                }
                let next_shot = this.tryQueue.pop();
                //issue with next_shot sometimes being undefined
                shot_x = next_shot[0];
                shot_y = next_shot[1];
            }
        }
        else{
            let next_shot = this.tryQueue.pop();
            shot_x = next_shot[0];
            shot_y = next_shot[1];
        }

        this.board[shot_x + (10 * shot_y)] = 1;
        this.lastShot = [shot_x, shot_y];
        return [shot_x, shot_y];
    }

    randomSelect(){
        let possible = false;
        let x,y;
        while(!possible){
            x = Math.floor(Math.random() * 10);
            y = Math.floor(Math.random() * 10);
            let left_possible = true;
            let right_possible = true;
            let up_possible = true;
            let down_possible = true;
            let left_limit = Math.max(x - (this.longestShip - 1), 0);
            let right_limit = Math.min(x + (this.longestShip - 1), 9);
            let top_limit = Math.max(y - (this.longestShip - 1), 0);
            let bottom_limit = Math.min(y + (this.longestShip - 1), 9);
            for(let j = left_limit; j <= x; j++){
                if(this.board[j + (10 * y)] != 0){
                    left_possible = false;
                }
            }
            for(let j = x; j <= right_limit; j++){
                if(this.board[j + (10 * y)] != 0){
                    right_possible = false;
                }
            }
            for(let j = top_limit; j <= y; j++){
                if(this.board[x + (10 * j)] != 0){
                    up_possible = false;
                }
            }
            for(let j = y; j <= bottom_limit; j++){
                if(this.board[x + (10 * j)] != 0){
                    down_possible = false;
                }
            }
            possible = (left_possible || right_possible) || (up_possible || down_possible)
        }
        return {x: x, y: y};
    }

    notifyHit(shipID){
        if(this.justSunk){
            this.justSunk = false;
        }
        else{
            this.tryQueue = [];
            if(this.currentShipAttacking == -1){
                this.currentShipAttacking = shipID -1;
            }
            else if(this.currentShipAttacking != shipID - 1){
                this.shipsToTry.push(shipID - 1);
            }
            
            this.hits[shipID - 1].push(this.lastShot);
            //update board
            this.board[this.lastShot[0] +  (this.lastShot[1] * 10)] = 1;
        }
    }

    notifySink(shipID){
        this.tryQueue = [];
        if(this.shipsToTry.length == 0){
            this.currentShipAttacking = -1;
        }
        else{
            this.currentShipAttacking = this.shipsToTry.pop();
        }
        //remove that ships length from possible
        this.shipLengthsLeft.splice(this.shipLengthsLeft.indexOf(this.shipLengths[shipID - 1]), 1);
        this.longestShip = Math.max(...this.shipLengthsLeft);
        this.justSunk = true;
    }
}