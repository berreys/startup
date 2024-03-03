document.addEventListener('DOMContentLoaded', function() {
    loadUserName();
    loadGroups();
});

function loadUserName() {
    const username = localStorage.getItem('userName');
    document.querySelector('.username').textContent = username;
}

function loadGroups(){
    //retrieve the list of groups in the localstorage
    localStorage.getItem('groups');
    //filter to only the groups that the user is a part of
    //display the groups
}