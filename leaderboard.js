let usernames = [];
let stats;

const makePage = function(){

    let theBoard = document.createElement('table');
    theBoard.className = 'board';
    theBoard.id = 'board';

    let theSearch = document.getElementById('searcharea');
    theSearch.addEventListener('submit', (e)=>{handleSearchSubmit(e)});

    let theClear = document.getElementById('clearbutton');
    theClear.addEventListener('click', (e)=>{handleClearButton(e)});

    let theLabels = document.createElement('tr');
    theLabels.id = 'topLabels';

    theBoard.appendChild(theLabels);

    let theUsername = document.createElement('td');
    theUsername.className ='sortCat';
    theUsername.innerText = 'Username'

    let numGames = document.createElement('td');
    numGames.className = 'sortCat';
    numGames.id = 'numgames';
    numGames.innerText = '# Games Played:';
    numGames.addEventListener('click', ()=>{refreshFeed("gamesPlayed")});

    let numWins = document.createElement('td');
    numWins.className = 'sortCat';
    numWins.id = 'numwins';
    numWins.innerText = '# Wins:';
    numWins.addEventListener('click', ()=>{refreshFeed("wins")});

    let numLoses = document.createElement('td');
    numLoses.className = 'sortCat';
    numLoses.id = 'numloses';
    numLoses.innerText = '# Losses:';
    numLoses.addEventListener('click', ()=>{refreshFeed("losses")});

    let numShipsSunk = document.createElement('td');
    numShipsSunk.className = 'sortCat';
    numShipsSunk.id = 'numshipssunk';
    numShipsSunk.innerText = '# Ships Sunk:';
    numShipsSunk.addEventListener('click', ()=>{refreshFeed("shipsSunk")});

    theLabels.appendChild(theUsername);
    theLabels.appendChild(numGames);
    theLabels.appendChild(numWins);
    theLabels.appendChild(numLoses);
    theLabels.appendChild(numShipsSunk);

    let homePage = document.createElement('div');
    homePage.id = 'main';
    
    homePage.appendChild(theBoard);
    
    document.body.appendChild(homePage);

};

async function getStats(){
    let result = await axios({
        method: 'get',
        url: 'https://battleshipcomp426.herokuapp.com/api/user',
    });
    stats = result.data;
    renderStats("wins");
}

function renderStats(filter){
    let theBoard = document.getElementById('board');
    if(filter=="wins"){
        let holdeles = document.getElementsByClassName("sortCat");
        Array.from(holdeles).forEach(element => {
            element.className = "sortCat";
        });
        document.getElementById("numwins").className = "sortCat sortedBy";
        stats.sort((a,b)=>b.wins-a.wins).forEach(element => {
            theBoard.appendChild(leaderboardLayout(element));
        });
    }
    if(filter=="gamesPlayed"){
        let holdeles = document.getElementsByClassName("sortCat");
        Array.from(holdeles).forEach(element => {
            element.className = "sortCat";
        });
        document.getElementById("numgames").className = "sortCat sortedBy";
        stats.sort((a,b)=>b.gamesPlayed-a.gamesPlayed).forEach(element => {
            theBoard.appendChild(leaderboardLayout(element));
        });
    }
    if(filter=="losses"){
        let holdeles = document.getElementsByClassName("sortCat");
        Array.from(holdeles).forEach(element => {
            element.className = "sortCat";
        });
        document.getElementById("numloses").className = "sortCat sortedBy";
        stats.sort((a,b)=>b.losses-a.losses).forEach(element => {
            theBoard.appendChild(leaderboardLayout(element));
        });
    }
    if(filter=="shipsSunk"){
        let holdeles = document.getElementsByClassName("sortCat");
        console.log(holdeles);
        Array.from(holdeles).forEach(element => {
            element.className = "sortCat";
        });
        document.getElementById("numshipssunk").className = "sortCat sortedBy";
        stats.sort((a,b)=>b.shipsSunk-a.shipsSunk).forEach(element => {
            theBoard.appendChild(leaderboardLayout(element));
     });
    }
};

function leaderboardLayout(user){
    
    let theLine = document.createElement('tr');
    theLine.className = 'theLine';
    
    let theUsername = document.createElement('td');
    theUsername.className ='username';
    theUsername.innerText = `${user.username}`;

    let numGames = document.createElement('td');
    numGames.className = 'numberOfGames';
    numGames.innerText = `${user.gamesPlayed}`;

    let numWins = document.createElement('td');
    numWins.className = 'numberOfWins';
    numWins.innerText = `${user.wins}`;

    let numLoses = document.createElement('td');
    numLoses.className = 'numberOfLosses';
    numLoses.innerText = `${user.losses}`;

    let numShipsSunk = document.createElement('td');
    numShipsSunk.className = 'shipsSunk';
    numShipsSunk.innerText = `${user.shipsSunk}`;

    theLine.appendChild(theUsername);
    theLine.appendChild(numGames);
    theLine.appendChild(numWins);
    theLine.appendChild(numLoses);
    theLine.appendChild(numShipsSunk);

    return theLine;
};

function handleClearButton(press){
    press.preventDefault();
    refreshFeed("wins");
};

function refreshFeed(filter){
    let tableChildren = document.getElementById('board').childNodes;
    Array.from(tableChildren).forEach(element =>{
        if(element.id!="topLabels"){
            element.remove();
        }
    });
    renderStats(filter);
};

function handleSearchSubmit(event){
    event.preventDefault();
    refreshFeed("wins");
    if(event.target[0].value != ""){
        let tableChildren = document.getElementById('board').childNodes;
        Array.from(tableChildren).forEach(row =>{
            if(row.id!="topLabels" && row.firstChild.innerText != event.target[0].value){
                row.remove();
            }
        })
    }
};

function handleInput(event){
    if(document.getElementById("autocompletearea") != null){
        document.getElementById("autocompletearea").remove();
    }
    if(document.getElementById("searchbox").value){
        let autocomplete_div = document.createElement('div');
        autocomplete_div.id = "autocompletearea";
        event.target.parentNode.appendChild(autocomplete_div);
        let value = event.target.value;
        usernames.forEach((username) => {
            if(username.substr(0, value.length).toLowerCase() == value.toLowerCase()){
                let option = document.createElement('div');
                option.innerText = username;
                autocomplete_div.appendChild(option);
                option.addEventListener("click", (e) => {
                    document.getElementById("searchbox").value = e.target.innerText;
                    autocomplete_div.remove();
                });
            }
        });
    }
}

const handleLogout = async function(){
    const result = await axios({
        method: 'get',
        url: 'https://battleshipcomp426.herokuapp.com/api/logout',
        withCredentials: true,
      });
    window.location.replace("./index.html");
}

const getUsernames = async function(){
    const result = await axios({
        method: 'get',
        url: 'https://battleshipcomp426.herokuapp.com/api/user',
        withCredentials: true,
    });
    result.data.forEach((user) => usernames.push(user.username));
}

window.onload = ()=>{
    makePage();
    getStats();
    getUsernames();
    document.getElementById("logout").addEventListener("click" , handleLogout);
    document.getElementById("searchbox").addEventListener("input", (e) => handleInput(e));
};

