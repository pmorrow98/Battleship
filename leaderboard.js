const makePage = function(){
    
    let theTitle =document.createElement('h1');
    theTitle.className = 'title';
    theTitle.innerText = 'Battleship Leaderboard Page';

    let searchBar = document.createElement('textarea');
    searchBar.className = 'searchBar';
    searchBar.placeholder = 'Search for User';

    let theHeader = document.createElement('section');
    theHeader.id = 'header';

    let theLabels = document.createElement('div');
    theLabels.id = 'topLabels';

    let theUsername = document.createElement('h3');
    theUsername.className ='usernameTitle';
    theUsername.innerText = 'Username'

    let numGames = document.createElement('h3');
    numGames.className = 'numGamesTitle';
    numGames.innerText = '# Games Played:';
    numGames.addEventListener('click', ()=>{refreshFeed("gamesPlayed")});

    let numWins = document.createElement('h3');
    numWins.className = 'numWins';
    numWins.innerText = '# Wins:';
    numWins.addEventListener('click', ()=>{refreshFeed("wins")});

    let numLoses = document.createElement('h3');
    numLoses.className = 'numLosses';
    numLoses.innerText = '# Losses:';
    numLoses.addEventListener('click', ()=>{refreshFeed("losses")});

    let numShipsSunk = document.createElement('h3');
    numShipsSunk.className = 'shipsSunk';
    numShipsSunk.innerText = '# Ships Sunk:';
    numShipsSunk.addEventListener('click', ()=>{refreshFeed("shipsSunk")});

    theLabels.appendChild(theUsername);
    theLabels.appendChild(numGames);
    theLabels.appendChild(numWins);
    theLabels.appendChild(numLoses);
    theLabels.appendChild(numShipsSunk);

    let homePage = document.createElement('section');
    homePage.id = 'main';
    
    let theFeed = document.createElement('div');
    theFeed.id = 'feed';
    console.log('hello');
    homePage.appendChild(theLabels);
    homePage.appendChild(theFeed);
    theHeader.appendChild(searchBar);
    theHeader.appendChild(theTitle);
    
    document.body.appendChild(theHeader);
    document.body.appendChild(homePage);

};

async function getStats(filter){
    console.log('clicked');
    let theUsers = await axios({
        method: 'get',
        url: 'https://battleshipcomp426.herokuapp.com/api/user',
    });
    let theFeed = document.getElementById('feed');
    if(filter=="wins")
        theUsers.data.sort((a,b)=>b.wins-a.wins).forEach(element => {
            theFeed.appendChild(leaderboardLayout(element));
        });
    if(filter=="gamesPlayed")
        theUsers.data.sort((a,b)=>b.gamesPlayed-a.gamesPlayed).forEach(element => {
        theFeed.appendChild(leaderboardLayout(element));
    });
    if(filter=="losses")
        theUsers.data.sort((a,b)=>b.losses-a.losses).forEach(element => {
        theFeed.appendChild(leaderboardLayout(element));
    });
    if(filter=="shipsSunk")
        theUsers.data.sort((a,b)=>b.shipsSunk-a.shipsSunk).forEach(element => {
        theFeed.appendChild(leaderboardLayout(element));
    });

};

function leaderboardLayout(user){
    let theLine = document.createElement('div');
    theLine.className = 'theLine';
    
    let theUsername = document.createElement('h3');
    theUsername.className ='username';
    theUsername.innerText = `${user.username}`;

    let numGames = document.createElement('h3');
    numGames.className = 'numGames';
    numGames.innerText = `${user.gamesPlayed}`;

    let numWins = document.createElement('h3');
    numWins.className = 'numWins';
    numWins.innerText = `${user.wins}`;

    let numLoses = document.createElement('h3');
    numLoses.className = 'numLosses';
    numLoses.innerText = `${user.losses}`;

    let numShipsSunk = document.createElement('h3');
    numShipsSunk.className = 'shipsSunk';
    numShipsSunk.innerText = `${user.shipsSunk}`;

    theLine.appendChild(theUsername);
    theLine.appendChild(numGames);
    theLine.appendChild(numWins);
    theLine.appendChild(numLoses);
    theLine.appendChild(numShipsSunk);

    return theLine;
};


function refreshFeed(filter){
    let theFeed = document.getElementById('feed');
    while(theFeed.firstChild){
        theFeed.removeChild(theFeed.firstChild);
    }  
    getStats(filter);
};


window.onload = ()=>{
    getStats("wins");
    makePage();
};

