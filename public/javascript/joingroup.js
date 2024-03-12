var username;

document.addEventListener('DOMContentLoaded', async function() {
    await loadUserName();
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

class Group{
    constructor(username){
        this.id = generateUUID();
        this.usernames = [username];
        this.values = [{username : username, value : 0.0}];
    }
}
//code copied from chatgpt
function generateUUID() {
    return 'xxxx-4xxx-yxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
async function createGroup(){
    const groupsFromStorage = await getGroups();
    console.log("Here: " + groupsFromStorage);
    let groupsList = null;
    //if there are already stored groups
    if(groupsFromStorage !== null){
        //retrieve and deserialize groups
        groupsList = JSON.parse(groupsFromStorage);
        console.log("GroupsList: " + groupsList + " :::end");
        //create new group
        const newGroup = new Group(username);
        //add new group to list
        groupsList.push(newGroup);
        //serialize updated list
        const newGroupsString = JSON.stringify(groupsList);
        //update localstorage with new list of groups
        localStorage.setItem('groups', newGroupsString);
        console.log('line 58')
        await setGroups(newGroupsString);
        //update localstorage current group
        localStorage.setItem('currentGroup', JSON.stringify(newGroup));
        //redirect
        console.log('redirect');
        window.location.href = 'groupview.html';
    }
    //if there are not already stored groups
    else{
        console.log('there are no groups in localstorage');
        //create new group
        const group = new Group(username);
        console.log(group);
        //create list of groups
        const groupsList = [group];
        //serialize list
        const groupsString = JSON.stringify(groupsList);
        //put list in localStorage
        console.log('line 77')
        localStorage.setItem('groups', groupsString);
        await setGroups(groupsString);
        //set current group in localStorage
        localStorage.setItem('currentGroup', JSON.stringify(group));
        //redirect
        console.log('redirect 2');
        window.location.href = 'groupview.html';
    }
}
async function joinGroup(){
    //find inputted id
    inputEl = document.querySelector('.groupIDInput');
    inputID = inputEl.value;
    console.log(inputID);
    //retrieve groups from localstorage
    const groupsString = await getGroups();
    //if there are no groups, show error message
    if(groupsString === null){
        console.log('There are no groups to search through.');
        document.getElementById('login-failure').style = "visibility:visible;";
        return;
    }
    var groupsList = JSON.parse(groupsString);
    /*
        Find corresponding group, append the current user's username,
        set current group to the corresponding group, and open the next
        page.
    */
    var wasSuccess = false;
    groupsList.forEach(async function(item){
        if(item.id === inputID){
            if(!item.usernames.includes(username)){
                item.usernames.push(username);
                item.values.push({username : username, value : 0.0});
                const newGroupsString = JSON.stringify(groupsList);
                await setGroups(newGroupsString);
            }
            localStorage.setItem('currentGroup', JSON.stringify(item));
            wasSuccess = true;
            window.location.href = 'groupview.html';
            
        }
    });
    /*
        If the id is invalid, show error message
    */
    if(!wasSuccess){
        console.log('invalid group id entered');
        document.getElementById('login-failure').style = "visibility:visible;";
    }
    
}

async function getGroups(){
    //send endpoint request to get the groups
    try{
        const response = await fetch('/api/groups');
        groupsObj = await response.json();
        console.log(groupsObj);
        //return groups from response
        if(groupsObj.groups.length === 0){
            return null;
        }
        return JSON.stringify(groupsObj.groups);
    }
    catch(e){
      //if error occured, return last stored groups
      console.log(e);
      return localStorage.getItem('groups');
    }
}

async function setGroups(groups){
    console.log('here!');
    //create groups object to pass in the body
    const groupsObj = {groups: groups};
    //send endpoint request to store groups
    try{
      const response = await fetch('/api/groups', {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(groupsObj),
      });
      console.log('response: ' + response);
    }
    catch{
        //if any errors were thrown, store the groups locally
        localStorage.setItem('groups', JSON.stringify(groups));
    }
}
