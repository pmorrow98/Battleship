let usernames = [];
let usernameavailable = false;

const renderLogin = function(){
    let area_div = document.getElementById("loginarea");
    area_div.innerHTML = "";
    let form = document.createElement("form");

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
            window.location.replace("./game.html" + "#" + submit_username);
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
    area_div.innerHTML = "";
    let form = document.createElement("form");

    let username_label = document.createElement("label");
    username_label.innerText = "Choose a Username";
    username_label.for = "username";

    let username_status = document.createElement("p");
    username_status.id = "username_status";

    let username_input = document.createElement("input");
    username_input.type = "text";
    username_input.id = "username";
    username_input.name = "username";
    username_input.addEventListener("input", (e) => usernameCheck(e));

    let password_label = document.createElement("label");
    password_label.innerText = "Create a Password";
    password_label.for = "password";

    let password_input = document.createElement("input");
    password_input.type = "password";
    password_input.id = "password";
    password_input.name = "password";

    let password_status = document.createElement("p");
    password_status.id = "password_status";

    let submit_button = document.createElement("button");
    submit_button.type = "submit";
    submit_button.value = "Submit";
    submit_button.innerText = "Create Account";

    let incorrect_area = document.createElement('p');
    incorrect_area.id = "incorrect_area";

    let login_button = document.createElement("button");
    login_button.innerText = "Go Back To Login";
    login_button.addEventListener("click", renderLogin);

    form.appendChild(username_label);
    form.appendChild(username_input);
    form.appendChild(username_status);
    form.appendChild(document.createElement("br"));
    form.appendChild(document.createElement("br"));
    form.appendChild(password_label);
    form.appendChild(password_input);
    form.appendChild(password_status);
    form.appendChild(document.createElement("br"));
    form.appendChild(incorrect_area);
    form.appendChild(submit_button);

    form.addEventListener("submit", (e) => handleCreateUserSubmit(e));

    area_div.appendChild(form);
    area_div.appendChild(login_button);
}

const usernameCheck = function(event){
    let username_status = document.getElementById("username_status");
    username_status.innerText = "";
    let current_input = event.target.value;
    usernameavailable = true;
    if(usernames.indexOf(current_input) != -1){
        username_status.innerText = "Username Taken, Try Something Else";
        usernameavailable = false;
    }
}

const handleCreateUserSubmit = async function(event){
    event.preventDefault();
    document.getElementById("password_status").innerText = "";
    if(usernameavailable){
        let submit_username = event.target[0].value;
        let submit_password = event.target[1].value;
        if(submit_password == "" || submit_username == ""){
            document.getElementById("password_status").innerText = "Please enter a username and password";
        }
        else{
            const result = await axios({
                method: 'post',
                url: 'https://battleshipcomp426.herokuapp.com/api/user',
                //withCredentials: true,
                data : {
                    username: submit_username,
                    password: submit_password
                }
            });
            if(result.data){
                renderLogin();
            }
        }
    }
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