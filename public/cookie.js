/**
* @author Jana Walter, Adrian Spork
* @matrNr 459 762, 460 137
*/

"use strict";


/**
* @function setCookie - Sets the cookie to given values
* @param name - The username to be saved
* @param password - The user´s password to be saved
*/

function setCookie(name, password)
{
	document.cookie = "username=" + name + ";path=/";
	document.cookie = "password=" + password + ";path=/";
}


/**
* @function getCookie - Gives the value saved in the names cookie
* @param cname - Name of the cookie
* @var name - The username
* @var decodedCookie - The decoded cookie
* @var ca - The cookie splitted up
* @return c.substring - Returns this is the cookie is empty
* @return "" - The value of the named cookie
*/

function getCookie(cname)
{
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for(var i = 0; i < ca.length; i++)
	{
		var c = ca[i];
		while(c.charAt(0) == ' ')
		{
			c = c.substring(1);
		}
		if(c.indexOf(name) == 0)
		{
			return c.substring(name.length, c.length);
		}
	}
	return "";
}


/**
* @function checkCookie - Checks if a cookie is set or logs out the user
* @var username - The username saved in the cookie
* @var password - The password saved in the cookie
*/

function checkCookie()
{
	var username = getCookie("username");
	var password = getCookie("password");
	if(username == "")
	{
		alert("Please log in again");
		window.location = "http://localhost:3000/";
	}
}


/**
* @function deleteCookie - Deletes all saved cookies
*/

function deleteCookie()
{
	document.cookie = "password=; path=/;";
	document.cookie = "username=; path=/;";
	return true;
}