document.addEventListener('DOMContentLoaded', function() {
    loadUserName();
    loadGroupID();
    console.log(localStorage.getItem('groups'));
});

function loadUserName() {
    const username = localStorage.getItem('userName');
    document.querySelector('.username').textContent = username;
}

function loadGroupID() {
    const group = localStorage.getItem('currentGroup');
    console.log(group);
    const groupID = JSON.parse(group).id;
    document.querySelector('.groupID').textContent = groupID;
}