
const gameMusic = document.getElementById('my_audio-id');

gameMusic.play();


$('#start-over').on('click', () =>{
    if( getParameterFromUrl('difficulty') == 'n'){
        window.location = '/index-game.html?difficulty=n';
    } else {
        window.location = '/index-game.html?difficulty=h';
    }

});


function getParameterFromUrl(parameterName){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(parameterName)
}