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
                event.target.className = "hit-cell mo-fire";
                //Fire Animation Code Adapted from Codepen by Deepak K Vijayan https://codepen.io/2xsamurai/pen/EKpYMg
                event.target.innerHTML = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"width="125px" height="189.864px" viewBox="0 0 125 189.864" enable-background="new 0 0 125 189.864" xml:space="preserve"><path class="flame-main" fill="#F36E21" d="M76.553,186.09c0,0-10.178-2.976-15.325-8.226s-9.278-16.82-9.278-16.82s-0.241-6.647-4.136-18.465c0,0,3.357,4.969,5.103,9.938c0,0-5.305-21.086,1.712-30.418c7.017-9.333,0.571-35.654-2.25-37.534c0,0,13.07,5.64,19.875,47.54c6.806,41.899,16.831,45.301,6.088,53.985"/><path class="flame-main one" fill="#F6891F" d="M61.693,122.257c4.117-15.4,12.097-14.487-11.589-60.872c0,0,32.016,10.223,52.601,63.123c20.585,52.899-19.848,61.045-19.643,61.582c0.206,0.537-19.401-0.269-14.835-18.532S57.576,137.656,61.693,122.257z"/><path class="flame-main two" fill="#FFD04A" d="M81.657,79.192c0,0,11.549,24.845,3.626,40.02c-7.924,15.175-21.126,41.899-0.425,64.998C84.858,184.21,125.705,150.905,81.657,79.192z"/><path class="flame-main three" fill="#FDBA16" d="M99.92,101.754c0,0-23.208,47.027-12.043,80.072c0,0,32.741-16.073,20.108-45.79C95.354,106.319,99.92,114.108,99.92,101.754z"/><path class="flame-main four" fill="#F36E21" d="M103.143,105.917c0,0,8.927,30.753-1.043,46.868c-9.969,16.115-14.799,29.041-14.799,29.041S134.387,164.603,103.143,105.917z"/><path class="flame-main five" fill="#FDBA16" d="M62.049,104.171c0,0-15.645,67.588,10.529,77.655C98.753,191.894,69.033,130.761,62.049,104.171z"/><path class="flame" fill="#F36E21" d="M101.011,112.926c0,0,8.973,10.519,4.556,16.543C99.37,129.735,106.752,117.406,101.011,112.926z"/><path class="flame one" fill="#F36E21" d="M55.592,126.854c0,0-3.819,13.29,2.699,16.945C64.038,141.48,55.907,132.263,55.592,126.854z"/><path class="flame two" fill="#F36E21" d="M54.918,104.595c0,0-3.959,6.109-1.24,8.949C56.93,113.256,52.228,107.329,54.918,104.595z"/></svg>';
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
                let hit_cell = document.getElementById("my" + computer_shot[0] + computer_shot[1]);
                hit_cell.className = "hit-cell mo-fire";
                //Fire Animation Code Adapted from Codepen by Deepak K Vijayan https://codepen.io/2xsamurai/pen/EKpYMg
                hit_cell.innerHTML = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"width="125px" height="189.864px" viewBox="0 0 125 189.864" enable-background="new 0 0 125 189.864" xml:space="preserve"><path class="flame-main" fill="#F36E21" d="M76.553,186.09c0,0-10.178-2.976-15.325-8.226s-9.278-16.82-9.278-16.82s-0.241-6.647-4.136-18.465c0,0,3.357,4.969,5.103,9.938c0,0-5.305-21.086,1.712-30.418c7.017-9.333,0.571-35.654-2.25-37.534c0,0,13.07,5.64,19.875,47.54c6.806,41.899,16.831,45.301,6.088,53.985"/><path class="flame-main one" fill="#F6891F" d="M61.693,122.257c4.117-15.4,12.097-14.487-11.589-60.872c0,0,32.016,10.223,52.601,63.123c20.585,52.899-19.848,61.045-19.643,61.582c0.206,0.537-19.401-0.269-14.835-18.532S57.576,137.656,61.693,122.257z"/><path class="flame-main two" fill="#FFD04A" d="M81.657,79.192c0,0,11.549,24.845,3.626,40.02c-7.924,15.175-21.126,41.899-0.425,64.998C84.858,184.21,125.705,150.905,81.657,79.192z"/><path class="flame-main three" fill="#FDBA16" d="M99.92,101.754c0,0-23.208,47.027-12.043,80.072c0,0,32.741-16.073,20.108-45.79C95.354,106.319,99.92,114.108,99.92,101.754z"/><path class="flame-main four" fill="#F36E21" d="M103.143,105.917c0,0,8.927,30.753-1.043,46.868c-9.969,16.115-14.799,29.041-14.799,29.041S134.387,164.603,103.143,105.917z"/><path class="flame-main five" fill="#FDBA16" d="M62.049,104.171c0,0-15.645,67.588,10.529,77.655C98.753,191.894,69.033,130.761,62.049,104.171z"/><path class="flame" fill="#F36E21" d="M101.011,112.926c0,0,8.973,10.519,4.556,16.543C99.37,129.735,106.752,117.406,101.011,112.926z"/><path class="flame one" fill="#F36E21" d="M55.592,126.854c0,0-3.819,13.29,2.699,16.945C64.038,141.48,55.907,132.263,55.592,126.854z"/><path class="flame two" fill="#F36E21" d="M54.918,104.595c0,0-3.959,6.109-1.24,8.949C56.93,113.256,52.228,107.329,54.918,104.595z"/></svg>';
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
    if(loser == "Computer"){
        let share_div = document.createElement('div');
        let twitter_message = document.createElement('h3');
        twitter_message.innerText = "Share your success on Social Media!";
        share_div.appendChild(twitter_message);
        share_div.innerHTML += '<a href="https://twitter.com/share?ref_src=twsrc%5Etfw" class="twitter-share-button" data-size="large" data-text="I just beat a Computer in Battleship! Check out the game at https://pmorrow98.github.io/Battleship/" data-show-count="false">Tweet</a>'//<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>';
        share_div.innerHTML += '<div class="fb-share-button" data-href="https://pmorrow98.github.io/Battleship/" data-layout="button" data-size = "large">';
        result_div.appendChild(share_div);
        runTwitter();
        runFacebook();
    }
    gameinprogress = false;
    updateUserInfo();
}

const handleGameReset = function(){
    document.getElementById("resultarea").innerHTML = "";
    document.getElementById("myboard").innerHTML = "";
    document.getElementById("computerboard").innerHTML = "";
    current_ship = 0;
    gameinprogress = false;
    renderButtons();
    renderInitialBoards();
}

const handleGoToLeaderboard = function(){
    window.location.href = "./leaderboard.html";
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
        withCredentials: true,
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
        withCredentials: true,
      });
      document.cookie = "";
}

const runTwitter = function(){
    window.twttr = (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0],
          t = window.twttr || {};
        if (d.getElementById(id)) return t;
        js = d.createElement(s);
        js.id = id;
        js.src = "https://platform.twitter.com/widgets.js";
        fjs.parentNode.insertBefore(js, fjs);
      
        t._e = [];
        t.ready = function(f) {
          t._e.push(f);
        };
      
        return t;
      }(document, "script", "twitter-wjs"));
}

const runFacebook = function(){
    (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.0";
        fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
}

window.onload = () => {
    username = document.cookie;
    document.getElementById("logout").addEventListener("click" , handleLogout)
    renderButtons();
    renderInitialBoards();
    gameinprogress = false;
    getUserInfo();
    //updateResult("Computer");
};