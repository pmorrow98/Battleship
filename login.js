let usernames = [];

const renderLogin = function(){
    let area_div = document.getElementById("loginarea");
    area_div.innerHTML = "";
    let form = document.createElement("form");
    //form.action = "https://battleshipcomp426.herokuapp.com/api/login";
    //form.method = "post";

    let username_label = document.createElement("label");
    username_label.innerText = "Username";
    username_label.for = "username";

    let username_input = document.createElement("input");
    username_input.type = "text";
    username_input.id = "username";
    username_input.name = "username";

    let password_label = document.createElement("label");
    password_label.innerText = "Password";
    password_label.for = "password";

    let password_input = document.createElement("input");
    password_input.type = "password";
    password_input.id = "password";
    password_input.name = "password";

    let submit_button = document.createElement("button");
    submit_button.type = "submit";
    submit_button.value = "Submit";
    submit_button.innerText = "Login";

    let incorrect_area = document.createElement('p');
    incorrect_area.id = "incorrect_area";

    let createuser_button = document.createElement("button");
    createuser_button.innerText = "Or Create an Account";
    createuser_button.addEventListener("click", renderCreateUser);

    form.appendChild(username_label);
    form.appendChild(username_input);
    form.appendChild(document.createElement("br"));
    form.appendChild(document.createElement("br"));
    form.appendChild(password_label);
    form.appendChild(password_input);
    form.appendChild(document.createElement("br"));
    form.appendChild(incorrect_area);
    form.appendChild(submit_button);

    form.addEventListener("submit", (e) => handleLoginSubmit(e));

    area_div.appendChild(form);
    area_div.appendChild(createuser_button);
}

const handleLoginSubmit = async function(event){
    event.preventDefault();
    let incorrect_message = document.getElementById("incorrect_area");
    incorrect_message.innerText = "";
    let submit_username = event.target[0].value;
    let submit_password = event.target[1].value;
    try{
        const result = await axios({
            method: 'post',
            url: 'https://battleshipcomp426.herokuapp.com/api/login',
            //withCredentials: true,
            data : {
                username: submit_username,
                password: submit_password
            }
        });
        if(result.data == true){
            // push to game.html page
            window.location.replace("./game.html");
        } 
        else{
            //put code here to render incorect login text
            incorrect_message.innerText = "Incorrect Password";
        }
    } catch(err){
        //incorrect username stuff
        incorrect_message.innerText = "No Account With This Username Found";
    }
}

const renderCreateUser = function(){
    let area_div = document.getElementById("loginarea");
    //area_div.innerHTML = "";
    console.log("Create User Called");
}


const getUsernames = async function(){
    const result = await axios({
        method: 'get',
        url: 'https://battleshipcomp426.herokuapp.com/api/user',
        //withCredentials: true,
    });
    result.data.forEach((user) => usernames.push(user.username));
}



window.onload = () => {
    getUsernames();
    renderLogin();
};