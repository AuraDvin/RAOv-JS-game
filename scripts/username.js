const regex = /^[a-z\s\_\-1-9]*$/gm;

function changeUserName() {
    let username = document.getElementById('username').value.toString();
    
    for (let letter in username) {
        if (
            !(
                (username[letter] >= 'A' && username[letter] <= 'Z') ||
                (username[letter] >= 'a' && username[letter] <= 'z') ||
                (username[letter] >= '0' && username[letter] <= '9') ||
                [' ', '-', '_'].includes(username[letter])
            )
        ) {
            const firstPart = username.substr(0, letter);
            const secondPart = username.substr(letter + 1, username.length - 1);
            document.getElementById('username').value = username = firstPart + secondPart;
            if (document.getElementById('usernameNote').hidden) document.getElementById('usernameNote').hidden = false;
        }
    }
    localStorage.username = username ? username : "null";
}

function setPreset() {
    document.getElementById('username').value = localStorage.username ? localStorage.username : '';
}
