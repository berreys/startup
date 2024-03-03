document.addEventListener('DOMContentLoaded', function() {
  localStorage.clear();
});

function login() {
    const nameEl = document.querySelector('#username');
    localStorage.setItem('userName', nameEl.value);
    console.log(nameEl.value);

    //TODO later validate valid username/password here
    if(nameEl.value === 'invalid'){
        document.getElementById('login-failure').style = "visibility:visible;";
    }
    else{
        window.location.href = 'groups.html';
    }
  }
  function getUsername(){
    return localStorage.getItem('userName');
  }