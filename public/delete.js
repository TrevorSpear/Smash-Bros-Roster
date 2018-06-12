function deletePerson(id){
    $.ajax({
        url: '/people/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
}

function deletePeopleCert(pid, cid){
  $.ajax({
      url: '/people_certs/pid/' + pid + '/cert/' + cid,
      type: 'DELETE',
      success: function(result){
          if(result.responseText != undefined){
            alert(result.responseText)
          }
          else {
            window.location.reload(true)
          } 
      }
  })
}

function deleteuser(userID){
    $.ajax({
        url: '/user/' + userID,
        type: 'DELETE',
        success: function(result){
            if(result.responseText != undefined){
                alert(result.responseText)
            }
            else {
                window.location.reload(true)
            }
        }
    })
}

function deleteroster(rosterID){
    $.ajax({
        url: '/roster/' + rosterID,
        type: 'DELETE',
        success: function(result){
            if(result.responseText != undefined){
                alert(result.responseText)
            }
            else {
                window.location.reload(true)
            }
        }
    })
}

function deleterostercomment(rostercommentID){
    $.ajax({
        url: '/roster/comment/' + rostercommentID,
        type: 'DELETE',
        success: function(result){
            if(result.responseText != undefined){
                alert(result.responseText)
            }
            else {
                window.location.reload(true)
            }
        }
    })
}

function deletecharacter(characterID){
    $.ajax({
        url: '/character/' + characterID,
        type: 'DELETE',
        success: function(result){
            if(result.responseText != undefined){
                alert(result.responseText)
            }
            else {
                window.location.reload(true)
            }
        }
    })
}


function deletecharactercomment(charactercommentID){
    $.ajax({
        url: '/character/comment/' + charactercommentID,
        type: 'DELETE',
        success: function(result){
            if(result.responseText != undefined){
                alert(result.responseText)
            }
            else {
                window.location.reload(true)
            }
        }
    })
}

function deleterostercharacter(rosterID, characterID){
    $.ajax({
        url: '/roster/character/' + rosterID + "/" + characterID,
        type: 'DELETE',
        success: function(result){
            if(result.responseText != undefined){
                alert(result.responseText)
            }
            else {
                window.location.reload(true)
            }
        }
    })
}
