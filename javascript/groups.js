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
    const groups = localStorage.getItem('groups');
    //filter to only the groups that the user is a part of
    const deserializedGroups = JSON.parse(groups);
    var groupsToDisplay = []
    for(var i = 0; i < deserializedGroups.length; i++){
        if(deserializedGroups[i].usernames.includes(localStorage.getItem('userName'))){
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
            localStorage.setItem('currentGroup', item);
        })
        button.textContent = "X";
        text.textContent = item.id;
        link.appendChild(text);
        li.appendChild(link);
        li.appendChild(button);
        groupUL.appendChild(li);
    });
}