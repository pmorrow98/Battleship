export default class Ship{
    constructor(id){
        this.id = id;
        this.length = Ship.Lengths[id - 1];
        this.partsleft = Ship.Lengths[id - 1];
        this.sunk = false;
        this.listeners = [];
    }
    hit(){
        this.partsleft -= 1;
        if(this.partsleft == 0){
            this.sunk = true;
            this.updateSink();
        }
    }
    addSinkListener(callback){
        this.listeners.push(callback);
    }
    updateSink(){
        this.listeners.forEach((callback) => callback(this.id));
    }
}

Ship.Lengths = [5,4,3,3,2];