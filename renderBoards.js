import Board from './board.js'
import Computer from './computer.js'

const shiplengths = [5,4,3,3,2];
const shipnames = ["Carrier", "Battleship", "Destroyer", "Submarine", "Patrol Boat"];
let current_ship = 0;
let myBoard, computerBoard;
let computer;
let gameinprogress;
let username;
let current_gamesPlayed, current_losses, current_wins, current_shipsSunk;

const renderInitialBoards = function(){
    let my_board_div = document.getElementById("myboard");
    let computer_board_div = document.getElementById("computerboard");
    for (var row = 0; row < 10; row++) {
        for (var col = 0; col < 10; col++) {
            //myboard stuff
            var cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.data_x = col;
            cell.data_y = row;
            cell.data_shiptype = 0;
            cell.addEventListener("mouseenter", (e) => handlePlaceHover(e));
            cell.addEventListener("click", handlePlaceClick);
            my_board_div.appendChild(cell);
            //computer board stuff
            var comp_cell = document.createElement('div');
            comp_cell.className = 'grid-cell';
            comp_cell.data_x = col;
            comp_cell.data_y = row;
            comp_cell.data_shiptype = 0;
            comp_cell.addEventListener("mouseenter", (e) => handleShootHover(e));
            comp_cell.addEventListener("click", (e) => handleShootClick(e));
            computer_board_div.appendChild(comp_cell);
        }
    }
}

const renderButtons = function(){
    let current_ship_label = document.createElement('h2');
    current_ship_label.id = "current_ship";
    current_ship_label.innerText = "Currently Placing: " + shipnames[current_ship];

    let orientation_question = document.createElement('p');
    orientation_question.innerText = "What orientation would you like this ship to be?"

    let horizontal_option = document.createElement('input');
    horizontal_option.type = "radio";
    horizontal_option.name = "orientation";
    horizontal_option.id = "horizontal";
    horizontal_option.checked = true;
    let horizontal_label = document.createElement('label');
    horizontal_label.for = "horizontal";
    horizontal_label.innerText = "Horizontal";

    let vertical_option = document.createElement('input');
    vertical_option.type = "radio";
    vertical_option.name = "orientation";
    vertical_option.id = "vertical";
    let vertical_label = document.createElement('label');
    vertical_label.for = "vertical";
    vertical_label.innerText = "Vertical";

    let control_div = document.getElementById("control-area");

    control_div.appendChild(current_ship_label);
    control_div.appendChild(orientation_question);
    control_div.appendChild(horizontal_option);
    control_div.appendChild(horizontal_label);
    control_div.appendChild(vertical_option);
    control_div.appendChild(vertical_label);
}

const handlePlaceHover = function(event){
    let current_temps = document.getElementsByClassName("temp-ship-cell");
    let temp_length = current_temps.length;
    for(let i = 0; i < temp_length; i++){
        current_temps[0].className = "grid-cell";
    }
    let hovered_tile = event.target;
    let current_length = shiplengths[current_ship];
    let space = 0;
    if(document.getElementById('horizontal').checked){//horizontal
        space = 10 - hovered_tile.data_x;
        if(current_length <= space){
            let potential_spaces = [];
            let overlap = false;
            let ship_tile = hovered_tile;
            for(let j = 0; j < current_length; j++){
                overlap = ship_tile.className == "perm-ship-cell";
                if(overlap){
                    break;
                }
                potential_spaces.push(ship_tile);
                ship_tile = ship_tile.nextElementSibling;
            }
            if(!overlap){
                potential_spaces.forEach((element) => element.className = "temp-ship-cell");
            }
        }
    }
    else{//vertical
        space = 10 - hovered_tile.data_y;
        if(current_length <= space){
            let potential_spaces = [];
            let overlap = hovered_tile.className == "perm-ship-cell";
            let ship_tile = hovered_tile;
            if(!overlap){
                potential_spaces.push(ship_tile);
            }
            for(let j = 0; j < current_length - 1; j++){
                for(let k = 0; k < 10; k++){
                    ship_tile = ship_tile.nextElementSibling;
                }
                overlap = ship_tile.className == "perm-ship-cell";
                if(overlap){
                    break;
                }
                potential_spaces.push(ship_tile);
            }
            if(!overlap){
                potential_spaces.forEach((element) => element.className = "temp-ship-cell");
            }
        }
    }
}

const handlePlaceClick = function(){
    let current_temps = document.getElementsByClassName("temp-ship-cell");
    let temp_length = current_temps.length;
    if(temp_length != 0){
        document.getElementById("current_ship").innerText = "Currently Placing: " + shipnames[current_ship];
        for(let i = 0; i < temp_length; i++){
            current_temps[0].data_shiptype = current_ship + 1;
            current_temps[0].className = "perm-ship-cell";
        }
        current_ship += 1;
        if(current_ship == 5){
            submitBoard();
        }
    }
}

const submitBoard = function(){
    let final_tiles = document.getElementById("myboard").childNodes;
    let final_board = [];
    for(let i = 0; i < final_tiles.length; i++){
        final_board.push(final_tiles[i].data_shiptype);
    }
    myBoard = new Board(final_board, "User");
    myBoard.addSinkListener(updateComputerSink);
    myBoard.addLoseListener(updateResult);
    computerBoard = new Board(createRandomBoard(), "Computer");
    computerBoard.addSinkListener(updateUserSink);
    computerBoard.addLoseListener(updateResult);
    computer = new Computer();
    renderMyFinalBoard(final_board);
    document.getElementById("control-area").innerHTML = "";
    renderStatusArea();
    gameinprogress = true;
    //Change or clear out control area here
}

const handleShootHover = function(event){
    let current_target = document.getElementsByClassName("target-cell");
    if(current_target.length != 0){
        current_target[0].className = "grid-cell";
    }
    if(gameinprogress){
        if(event.target.className == "grid-cell"){
            event.target.className = "target-cell";
        }
    }
}

const handleShootClick = function(event){
    if(gameinprogress){
        if(event.target.className == "target-cell"){
            let result = computerBoard.shoot(event.target.data_x, event.target.data_y);
            if(result != 0){
                event.target.className = "hit-cell";
                if(gameinprogress){
                    let status_div_children = document.getElementById("my-status").childNodes[result - 1].childNodes[1].childNodes;
                    if(status_div_children.length != 1){
                        let unhit_cell = false;
                        let current_child = 0;
                        while(!unhit_cell){
                            if(status_div_children[current_child].className == "ship-indicator-tile"){
                                status_div_children[current_child].className = "hit-ship-indicator-tile";
                                unhit_cell = true;
                            }
                            current_child++;
                        }
                    }
                }
            }
            else{
                event.target.className = "miss-cell";
            }
            let computer_shot = computer.getShot();
            let computer_result = myBoard.shoot(computer_shot[0], computer_shot[1]);
            if(computer_result != 0){
                //render computers shot
                document.getElementById("my" + computer_shot[0] + computer_shot[1]).className = "hit-cell";
                if(gameinprogress){
                    computer.notifyHit(computer_result);
                    let status_div_children = document.getElementById("computer-status").childNodes[computer_result - 1].childNodes[1].childNodes;
                    if(status_div_children.length != 1){
                        let unhit_cell = false;
                        let current_child = 0;
                        while(!unhit_cell){
                            if(status_div_children[current_child].className == "ship-indicator-tile"){
                                status_div_children[current_child].className = "hit-ship-indicator-tile";
                                unhit_cell = true;
                            }
                            current_child++;
                        }
                    }
                }
            }
            if(computer_result == 0){
                //render computer miss
                document.getElementById("my" + computer_shot[0] + computer_shot[1]).className = "miss-cell";
            }
        }
    }
}

const renderMyFinalBoard = function(board){
    let my_board_div = document.getElementById("myboard");
    my_board_div.innerHTML = "";
    for (var row = 0; row < 10; row++) {
        for (var col = 0; col < 10; col++) {
            let current_value = board[(row * 10) + col];
            var cell = document.createElement('div');
            if(current_value == 0){
                cell.className = 'grid-cell';
            }
            else{
                cell.className = 'perm-ship-cell';
            }
            cell.data_x = col;
            cell.data_y = row;
            cell.id = "my" + col + row;
            cell.data_shiptype = current_value;
            my_board_div.appendChild(cell);
        }
    }
}

const renderStatusArea = function(){
    //label section too
    let my_status_div = document.getElementById("my-status");
    for(let ship = 0; ship < 5; ship++){
        let label = document.createElement('h3');
        label.innerText = shipnames[ship];
        let status = document.createElement('div');
        for(let i = 0; i < shiplengths[ship]; i++){
            let ship_tile = document.createElement('div');
            ship_tile.className = "ship-indicator-tile";
            status.appendChild(ship_tile);
        }
        let ship_div = document.createElement("div");
        ship_div.className = "status-block";
        ship_div.appendChild(label);
        ship_div.appendChild(status);
        my_status_div.appendChild(ship_div);
    }

    let computer_status_div = document.getElementById("computer-status");

    for(let ship = 0; ship < 5; ship++){
        let label = document.createElement('h3');
        label.innerText = shipnames[ship];
        let status = document.createElement('div');
        for(let i = 0; i < shiplengths[ship]; i++){
            let ship_tile = document.createElement('div');
            ship_tile.className = "ship-indicator-tile";
            status.appendChild(ship_tile);
        }
        let ship_div = document.createElement('div');
        ship_div.className = "status-block";
        ship_div.appendChild(label);
        ship_div.appendChild(status);
        computer_status_div.appendChild(ship_div);
    }

}

const createRandomBoard = function(){
    let resultboard = [];
    for(let i = 0; i < 100; i++){
        resultboard.push(0);
    }
    for(let random_ship = 0; random_ship < 5; random_ship++){
        let placeable = false;
        let ship_length = shiplengths[random_ship];
        let x_rand, y_rand, horizontal;
        while(!placeable){
            placeable = true;
            if(Math.random() > .5){
                //try to place horizontally
                horizontal = true;
                let x_range = 10 - ship_length;
                x_rand = Math.floor(Math.random() * x_range);
                y_rand = Math.floor(Math.random() * 10);
                for(let j = x_rand; j < (x_rand + ship_length); j++){
                    let cell_value = resultboard[j + (y_rand * 10)];
                    if(cell_value != 0){
                        placeable = false;
                    }
                }
            }
            else{
                //try to place vertically
                horizontal = false;
                let y_range = 10 - ship_length;
                x_rand = Math.floor(Math.random() * 10);
                y_rand = Math.floor(Math.random() * y_range);
                for(let j = y_rand; j < (y_rand + ship_length); j++){
                    let cell_value = resultboard[x_rand + (j * 10)];
                    if(cell_value != 0){
                        placeable = false;
                    }
                }
            }
        }
        //place ship on resultboard
        if(horizontal){
            for(let j = x_rand; j < (x_rand + ship_length); j++){
                resultboard[j + (y_rand * 10)] = random_ship + 1;  
            }
        }
        else{
            for(let j = y_rand; j < (y_rand + ship_length); j++){
                resultboard[x_rand + (j * 10)] = random_ship + 1;
            }
            //place vertical new ship
        }
    }
    return resultboard;
}

const updateUserSink = async function(shipID){
    let ship_status_div = document.getElementById("my-status").childNodes[shipID - 1].childNodes[1];
    let sunk_notification = document.createElement('h3');
    sunk_notification.innerText = "SUNK";
    sunk_notification.className = "sink-notification";
    ship_status_div.innerHTML = "";
    ship_status_div.appendChild(sunk_notification);
    current_shipsSunk += 1;
    updateUserInfo();
}

const updateComputerSink = function(shipID){
    let ship_status_div = document.getElementById("computer-status").childNodes[shipID - 1].childNodes[1];
    let sunk_notification = document.createElement('h3');
    sunk_notification.innerText = "SUNK";
    sunk_notification.className = "sink-notification";
    ship_status_div.innerHTML = "";
    ship_status_div.appendChild(sunk_notification);
    computer.notifySink(shipID);
}

const updateResult = function(loser){
    document.getElementById("my-status").innerHTML = "";
    document.getElementById("computer-status").innerHTML = "";
    let result_div = document.getElementById("resultarea");
    let result_message = document.createElement("h2");
    if(loser == "User"){
        result_message.innerText = "Computer Wins, Game Over. Better Luck Next Time";
        current_losses += 1;
    }
    if(loser == "Computer"){
        result_message.innerText = "You Win, Want To Go Again?";
        current_wins += 1;
    }
    current_gamesPlayed += 1;
    let button_div = document.createElement("div");
    let new_game_button = document.createElement("button");
    new_game_button.innerText = "Start A New Game";
    new_game_button.addEventListener("click", handleGameReset);
    let leaderboard_button = document.createElement("button");
    leaderboard_button.innerText = "Go To Leaderboard";
    leaderboard_button.addEventListener("click", handleGoToLeaderboard);
    button_div.appendChild(new_game_button);
    button_div.appendChild(leaderboard_button);
    result_div.appendChild(result_message);
    result_div.appendChild(button_div);
    gameinprogress = false;
    updateUserInfo();
}

const handleGameReset = function(){
    document.getElementById("resultarea").innerHTML = "";
    document.getElementById("myboard").innerHTML = "";
    document.getElementById("computerboard").innerHTML = "";
    current_ship = 0;
    gameinprogress = false;
    renderInitialBoards();
    renderButtons();
}

const handleGoToLeaderboard = function(){
    console.log("Attempting to navigate to Leaderboard");
}

const getUserInfo = async function(){
    const result = await axios({
        method: 'get',
        url: 'https://battleshipcomp426.herokuapp.com/api/user/' + username,
        withCredentials: true,
    });
    current_gamesPlayed = result.data.gamesPlayed;
    current_losses = result.data.losses;
    current_wins = result.data.wins;
    current_shipsSunk = result.data.shipsSunk;
}

const updateUserInfo = async function(){
    const result = await axios({
        method: 'put',
        url: 'https://battleshipcomp426.herokuapp.com/api/user/' + username,
        //withCredentials: true,
        data: {
            gamesPlayed: current_gamesPlayed,
            losses: current_losses,
            wins: current_wins,
            shipsSunk: current_shipsSunk
        }
      });
}

const handleLogout = async function(){
    const result = await axios({
        method: 'get',
        url: 'https://battleshipcomp426.herokuapp.com/api/logout',
        //withCredentials: true,
      });
    window.location.replace("./index.html");
}

window.onload = () => {
    username = window.location.hash.substring(1);
    document.getElementById("logout").addEventListener("click" , handleLogout)
    renderInitialBoards();
    renderButtons();
    gameinprogress = false;
    getUserInfo();
};