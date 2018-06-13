function filterCharactersByUser(){
    var userId = document.getElementById('characterFilter').value;

    var url = '/character/filter/' + parseInt(userId);
    window.location.pathname = url;
}