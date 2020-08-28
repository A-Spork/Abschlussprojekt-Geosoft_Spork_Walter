/**
* @author Jana Walter, Adrian Spork
* @matrNr 459 762, 460 137
*/

"use strict";


var username = getCookie("username");
var user;
showMessage();

function ChangeToAdd(){
window.location = "http://localhost:3000/public/addTour.html";
}

function changeToView(){
window.location = "http://localhost:3000/public/lastTours.html";
}

async function logOut(){
  deleteCookie();
  window.location = "http://localhost:3000/";
}



async function showMessage(){
user = await customerDbSearchUsernamePassword(username,"");
if(user[0].message=="true"){
  var info = "You got a problem"
  document.getElementById("message").innerHTML = info;
  alert(info);
  customerDbUpdate(user[0].username,user[0].password,false)// message will only be delivered once
}
else{
  document.getElementById("message").innerHTML = "No contacs to infected perosons since your last log in";
}
}
