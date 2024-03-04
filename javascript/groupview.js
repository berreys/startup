document.addEventListener('DOMContentLoaded', function() {
    loadUserName();
    loadGroupID();
    loadValues();
    loadUserVal();
});

function loadUserVal(){
    const username = localStorage.getItem('userName');
    const currentGroup = JSON.parse(localStorage.getItem('currentGroup'));
    currentGroup.values.forEach(function(item){
        if(item.username === username && item.value !== 0){
            var inpEl = document.querySelector('#input-value');
            inpEl.value = item.value;
        }
    });
}

function loadUserName() {
    const username = localStorage.getItem('userName');
    document.querySelector('.username').textContent = username;
    // console.log(username);
}

function loadGroupID() {
    const group = localStorage.getItem('currentGroup');
    // console.log(group);
    const groupID = JSON.parse(group).id;
    document.querySelector('.groupID').textContent = groupID;
}

function loadValues() {
    const username = localStorage.getItem('userName');
    const currGroupStr = localStorage.getItem('currentGroup');
    if(currGroupStr === null){
        console.log('Something wrong happened. We are in the groupview page with no current group set.');
    }
    var currGroup = JSON.parse(currGroupStr);
    var tableEl = document.querySelector('.group-view-table');
    currGroup.values.forEach(function(item){
        //make a new row for each person who is not the current user
        // console.log(item);
        if(item.username !== username){
            var tr = document.createElement('tr');
            var td1 = document.createElement('td');
            td1.textContent = item.username;
            var td2 = document.createElement('td');
            td2.textContent = item.value;
            var td3 = document.createElement('td');
            td3.textContent = getDebt();
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tableEl.appendChild(tr);
        }
    });
    

}

function getDebt(){
    return 4.5;
}

function changeValue(value){
    //get username and group from localstorage
    const username = localStorage.getItem('userName');
    const groupString = localStorage.getItem('currentGroup');
    var group = JSON.parse(groupString);
    //change the value of the user's value in the current group
    group.values.forEach(function(item){
        if(item.username === username){
            item['value'] = value;
        }
    });
    console.log(group);
    //update current group in localstorage
    const newGroupString = JSON.stringify(group);
    localStorage.setItem('currentGroup', newGroupString);
    //get list of groups from localstorage
    var groups = JSON.parse(localStorage.getItem('groups'));
    //update changed group
    groups.forEach(function(item){
        console.log(item);
        if(item.id === group.id){
            item.values.forEach(function(valueObj){
                if(valueObj.username === username){
                    valueObj['value'] = value;
                }
            });
        }
        console.log(item);
    });
    //update changed group in localstorage
    localStorage.setItem('groups', JSON.stringify(groups));
}