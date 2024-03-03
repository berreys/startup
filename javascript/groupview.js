document.addEventListener('DOMContentLoaded', function() {
    loadUserName();
});

function loadUserName() {
    const username = localStorage.getItem('userName');
    document.querySelector('.username').textContent = username;
}