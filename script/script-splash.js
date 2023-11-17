"use strict";

// document.getElementById('SetPlayerName').addEventListener('click', function() {
//     var messageContainer = document.getElementById('messageContainer');
  
//     // Process the input data and generate a new message
//     var newMessage = `Hi ${inputData}`;
  
//     messageContainer.innerHTML = newMessage;
//   });

$(document).ready(function() {
    setup();
  });

function setup() {
  $('#playerNameInput').val("");
  // $('.difficulty').attr("disabled", true);

  $('#dif1').on('click', () => {
    if ($('#playerNameInput').val() === "" || $("#playerName-span").val()!==""){
      alert ("Player Name Is Not Set");
    } 
    else {
      window.location = '/index-game.html?difficulty=n';
    } 
  });

  $('#dif2').on('click', () => {
    if ($('#playerNameInput').val() === "" || $("#playerName-span").val()!==""){
      alert ("Player Name Is Not Set");
    }   else {
      window.location = '/index-game.html?difficulty=h';
    } 
  });
}


function setPlayerName(event) { 
  // console.log( "the value is:" + $('#playerNameInput').val());
  if ($('#playerNameInput').val() !== ""){
    let name = $('#playerNameInput').val();
    let playerSpanLable = "<span id='playerName-span'>" + firstLetterToUpper(name) + " Let's Go" + "</span>";
      if (event.key === "Enter" || event.keyCode === 13) {
        $("#SetPlayerName").html(playerSpanLable);
        // $('.difficulty').attr("disabled", false);
      }
  }
}

function firstLetterToUpper (input) {
  let firstLetter = input.charAt(0);
  let result = firstLetter.toUpperCase()+ input.substring (1);
  return result;
}


