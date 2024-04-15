var username;

document.addEventListener('DOMContentLoaded', async function() {
    await loadUserName();
    await loadGroups()
});

async function loadUserName() {
    username = await getUsername();
    document.querySelector('.username').textContent = username;
}

async function getUsername(){
    //send endpoint request to get current user's username
    try{
      const response = await fetch('/api/username');
      usernameObj = await response.json();
      //return username from response
      return usernameObj.username;
    }
    catch(e){
      //if error occured, return last stored username
      console.log(e);
      return localStorage.getItem('userName');
    }
}

async function loadGroups(){
    //retrieve the list of groups in the localstorage
    const groups = await getGroups();
    if(groups === undefined || groups === null || groups.length === 0){
        console.log("UNDEFINED OR NULL OR 0 LENGTH");
        return;
    }
    //filter to only the groups that the user is a part of
    const deserializedGroups = JSON.parse(groups);
    var groupsToDisplay = []
    for(var i = 0; i < deserializedGroups.length; i++){
        if(deserializedGroups[i].usernames.includes(username)){
            groupsToDisplay.push(deserializedGroups[i]);
        }
    }
    //display the groups
    var groupUL = document.getElementById("groupUL");

    groupsToDisplay.forEach(function(item) {
        var li = document.createElement("li");
        var link = document.createElement("a");
        var text = document.createElement("p");
        var button = document.createElement("button");
        link.href = "./groupview.html";
        link.addEventListener('click', function(){
            localStorage.setItem('currentGroup', JSON.stringify(item));
        })
        button.textContent = "X";
        text.textContent = item.id;
        link.appendChild(text);
        li.appendChild(link);
        li.appendChild(button);
        groupUL.appendChild(li);
    });
}

async function getGroups(){
    //send endpoint request to get the groups
    try{
        const response = await fetch('/api/getGroups');
        groupsObj = await response.json();
        console.log(groupsObj);
        //return groups from response
        return JSON.stringify(groupsObj);
    }
    catch(e){
      //if error occured, return last stored groups
      console.log(e);
      return localStorage.getItem('groups');
    }
}
  