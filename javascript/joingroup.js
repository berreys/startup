document.addEventListener('DOMContentLoaded', function() {
    loadUserName();
    console.log(localStorage.getItem('groups'));
});

function loadUserName() {
    const username = localStorage.getItem('userName');
    document.querySelector('.username').textContent = username;
}
class Group{
    constructor(username){
        this.id = generateUUID();
        this.usernames = [username];
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
function createGroup(){
    const groupsFromStorage = localStorage.getItem('groups');
    let groupsList = null;
    //if there are already stored groups
    if(groupsFromStorage != null){
        console.log('there are groups in localstorage');
        //retrieve and deserialize groups
        groupsList = JSON.parse(groupsFromStorage);
        console.log(groupsList);
        //create new group
        const newGroup = new Group(localStorage.getItem('userName'));
        //add new group to list
        groupsList.push(newGroup);
        //serialize updated list
        const newGroupsString = JSON.stringify(groupsList);
        //update localstorage with new list of groups
        localStorage.setItem('groups', newGroupsString);
        //update localstorage current group
        localStorage.setItem('currentGroup', JSON.stringify(newGroup));
        //redirect
        window.location.href = 'groupview.html';
    }
    //if there are not already stored groups
    else{
        console.log('there are no groups in localstorage');
        //create new group
        const group = new Group(localStorage.getItem('userName'));
        console.log(group);
        //create list of groups
        const groupsList = [group];
        //serialize list
        const groupsString = JSON.stringify(groupsList);
        //put list in localStorage
        localStorage.setItem('groups', groupsString);
        //set current group in localStorage
        localStorage.setItem('currentGroup', JSON.stringify(group));
        //redirect
        window.location.href = 'groupview.html';
    }
}
function joinGroup(){
    //find inputted id
    inputEl = document.querySelector('.groupIDInput');
    inputID = inputEl.value;
    console.log(inputID);
    //retrieve groups from localstorage
    const groupsString = localStorage.getItem('groups');
    //if there are no groups, show error message
    if(groupsString === null){
        //TODO show error message
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
    groupsList.forEach(function(item){
        if(item.id === inputID){
            if(!item.usernames.includes(localStorage.getItem('userName'))){
                item.usernames.push(localStorage.getItem('userName'));
                const newGroupsString = JSON.stringify(groupsList);
                localStorage.setItem('groups', newGroupsString);
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