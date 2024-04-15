document.addEventListener('DOMContentLoaded', function() {
  // localStorage.clear();
});


async function login() {
  const nameEl = document.querySelector('#username');
  localStorage.setItem('userName', nameEl.value);
  loginOrCreate('/api/auth/login');
}

async function create(){
  const nameEl = document.querySelector('#username');
  localStorage.setItem('userName', nameEl.value);
  loginOrCreate('/api/auth/create');
}

async function getUsername(){
  //send endpoint request to get current user's username
  try{
    const response = await fetch('/api/username');
    usernameObj = await response.json();
    //update localstorage
    localStorage.setItem('userName', usernameObj.username);
    //return username from response
    return usernameObj.username;
  }
  catch(e){
    //if error occured, return last stored username
    console.log(e);
    return localStorage.getItem('userName');
  }
}
async function setUsername(username){
  //create username object to pass in the body
  const usernameObj = {username: username};
  //send endpoint request to store username
  try{
    const response = await fetch('/api/username', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(usernameObj),
    });
    //if it failed to store the username in the server, store it locally
    if(response.status !== 200){
      localStorage.setItem('userName', username);
    }
  }
  catch{
    //if any errors were thrown, store the username locally
    localStorage.setItem('userName', username);
  }
}

async function loginOrCreate(endpoint){
  const userName = document.querySelector('#username').value;
  const password = document.querySelector('#password').value;
  console.log(`username: ${userName} password: ${password}`);
  if(userName.length === 0 || password.length === 0){
    document.getElementById('login-failure').style = "visibility:visible;";
    return;
  }
  const response = await fetch(endpoint, {
    method: 'post',
    body: JSON.stringify({username: userName, password: password}),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    }
  });
  if(response.ok){
    localStorage.setItem('userName', userName);
    setUsername(userName).then(getUsername);
    window.location.href = 'groups.html';
  }
  else{
    const body = await response.json();
    document.getElementById('login-failure').style = "visibility:visible;";
  }
}

