/**
* @author Jana Walter, Adrian Spork
* @matrNr 459 762, 460 137
*/

"use strict";

alert ("We only use essential cookies. If you not accept, use an other app!");
var username = getCookie ("username");
showMessage ();


/**
* @function showMessage - Shows the user a message which tells if he has a risk to be infected or not
* @var user - Saves the user to set the message attribut to false again after he logged in
* @var info - The message
*/

async function showMessage ()
{
	var user = await customerDbSearchUsernamePassword (username, "");
	if (user[0].message == "true")
	{
		var info = "You got a problem";
		document.getElementById("message").innerHTML = info;
		alert (info);
		
		// With this command the message will only be delivered once!
		customerDbUpdate (user[0].username, user[0].password, false)
	}
	else
	{
		document.getElementById("message").innerHTML = "No contacs to infected perosons since your last log in";
	}
}