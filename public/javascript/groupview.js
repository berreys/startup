var username;

document.addEventListener('DOMContentLoaded', async function() {
    await loadUserName();
    loadGroupID();
    loadValues();
    loadUserVal();
    getDebt();
    loadQuote();
});

function loadQuote(){
    fetch('https://api.quotable.io/random')
    .then((response) => response.json())
    .then((data) => {
      const element = document.querySelector('#quote');
      element.textContent = 'Here is a random quote for you today: ' + data.content;
    });
}

function loadUserVal(){
    const currentGroup = JSON.parse(localStorage.getItem('currentGroup'));
    currentGroup.values.forEach(function(item){
        if(item.username === username && item.value !== 0){
            var inpEl = document.querySelector('#input-value');
            inpEl.value = item.value;
        }
    });
}

async function loadUserName() {
    username = await getUsername();
    document.querySelector('.username').textContent = username;
}

async function getUsername(){
    //send endpoint request to get current user's username
    let username = '';
    try{
      const response = await fetch('/api/username');
      usernameObj = await response.json();
      //return username from response
      return usernameObj.username;
    }
    catch(e){
      //if error occured, return last stored username
      console.log(e);
      return username;
    }
}

function loadGroupID() {
    const group = localStorage.getItem('currentGroup');
    // console.log(group);
    const groupID = JSON.parse(group).id;
    document.querySelector('.groupID').textContent = groupID;
}

function loadValues() {
    const currGroupStr = localStorage.getItem('currentGroup');
    if(currGroupStr === null){
        console.log('Something wrong happened. We are in the groupview page with no current group set.');
    }
    var currGroup = JSON.parse(currGroupStr);
    var tableEl = document.querySelector('.group-view-table');
    currGroup.values.forEach(function(item){
        //make a new row for each person who is not the current user
        //these rows will be augmented in real time using web sockets
        if(item.username !== username){
            var tr = document.createElement('tr');
            var td1 = document.createElement('td');
            td1.textContent = item.username;
            var td2 = document.createElement('td');
            td2.textContent = '$' + item.value;
            var td3 = document.createElement('td');
            td3.textContent = '$0.00'
            td3.className = item.username;
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tableEl.appendChild(tr);
        }
    });
    

}

async function changeValue(value){
    //get username and group from localstorage
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
    var groups = JSON.parse(await getGroups());
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
    await setGroups(JSON.stringify(groups));
    getDebt();
}


function getDebt(){
    var currUsersPayment = 0;
    var values = JSON.parse(localStorage.getItem('currentGroup')).values;
    var sum = 0;
    values.forEach(function(item){
        item.value = parseFloat(item.value);
        sum += item.value;
        if(item.username === username){
            currUsersPayment = item.value;
        }
    });
    const avg = sum/values.length;
    values.sort(function(a, b){
        return a.value - b.value;
    });

    var debtInformation = [];

    for(var i = 0; i < values.length - 1; i++){
        debtInformation.push({sender: values[i].username, receiver: values[i+1].username, amount: parseFloat(avg)-parseFloat(values[i].value)});
        values[i+1].value = parseFloat(values[i+1].value) - parseFloat(avg - parseFloat(values[i].value));
    }

    var debts = localStorage.getItem('debts');
    var currGroupid = JSON.parse(localStorage.getItem('currentGroup')).id;
    if(debts === null){
        var debtsList = [];
        debtsList.push({id : currGroupid, debtInfo : debtInformation});
        var debtsSerialized = JSON.stringify(debtsList);
        localStorage.setItem('debts', debtsSerialized);
    }
    else{
        var debtsDeserialized = JSON.parse(debts);
        var index = -1;
        for(var i = 0; i < debtsDeserialized.length; i++){
            if(debtsDeserialized[i].id === currGroupid){
                index = i;
                break;
            }
        }
        if(index !== -1){
            debtsDeserialized.splice(i, 1);
        }
        debtsDeserialized.push({id : currGroupid, debtInfo : debtInformation});
        var debtsSerialized = JSON.stringify(debtsDeserialized);
        localStorage.setItem('debts', debtsSerialized);
    }

    var currentGroup = JSON.parse(localStorage.getItem('currentGroup'));
    currentGroup.usernames.forEach(function(item){
        var element = document.querySelector('.' + item);
        if(element !== null){
            var changed = false;
            debtInformation.forEach(function(d){
                if(d.receiver === item && d.sender === username){
                    element.textContent = '$' + d.amount;
                    changed = true;
                }
            });
            if(!changed){
                element.textContent = '$0.00';
            }
        }
    });
    console.log(debtInformation);

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