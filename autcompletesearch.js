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