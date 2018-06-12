function updatePerson(id){
    $.ajax({
        url: '/people/' + id,
        type: 'PUT',
        data: $('#update-person').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    });
}

function updateUser(userID){
    $.ajax({
        url: '/user/' + userID,
        type: 'PUT',
        data: $('#update-user').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    });
}

function updateRoster(rosterID){
    $.ajax({
        url: '/roster/' + rosterID,
        type: 'PUT',
        data: $('#update-roster').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    });
}

function updateRosterComment(rostercommentID){
    $.ajax({
        url: '/roster/comment/' + rostercommentID,
        type: 'PUT',
        data: $('#update-roster-comment').serialize(),
        success: function(result){
            window.location.replace("./roster");
        }
    });
}

function updateCharacter(characterID){
    $.ajax({
        url: '/character/' + characterID,
        type: 'PUT',
        data: $('#update-character').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    });
}

function updateCharacterComment(charactercommentID){

    $.ajax({
        url: '/character/comment/' + charactercommentID,
        type: 'PUT',
        data: $('#update-character-comment').serialize(),
        success: function(result){
            console.log("success!");
            window.location.replace("./");
        }
    });

    window.location.replace("./");

}


function updateRosterCharacter(rostercharacterID){
    $.ajax({
        url: '/roster/character/' + rostercharacterID,
        type: 'PUT',
        data: $('#update-roster-character').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
}

