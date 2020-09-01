/**
* @author Jana Walter, Adrian Spork
* @matrNr 459 762, 460 137
*/

"use strict";


/**
* @function logIn - Function to log in with an username and a password, the usernames doc, admin and test are intercepted
* @username doc - You can go directly to the docpage(Password = "doc")
* @username test - You can go directly to the testpage(Password = "test")
* @username admin - You can see all users in the db at the server consolePassword = "admin")
* @var name - The username will be checked and saved in a cookie
* @var password - The password will be checked and saved in a cookie
*/

async function logIn()
{
	var name = document.getElementById("usernameInput").value;
	var password = document.getElementById("password").value;
	if(password == "")
	{
		alert("Please fill in password!");
		return;
	}
	if(name == "doc" && password == "doc")
	{
		window.location = "http://localhost:3000/public/doc.html";
	}
	else if(name == "test" && password == "test")
	{
		setCookie(name, password);
		window.location = "http://localhost:3000/public/test.html";
	}
	else
	{
		if(await checkUser(name, password))
		{
			if(name == "admin" && password == "admin")
			{
				return;
			}
			else
			{
				setCookie(name, password);
				window.location = "http://localhost:3000/public/landing.html";
			}
		}
		else
		{
			alert("Please sign in. Username unknown");
		}
	}
}


/**
* @function signIn - Function to sign in with an username and a password, some usernames are not supoorted :)
* @var name - The username will be checked and saved in a cookie
* @var password - The password will be checked and saved in a cookie
*/

async function signIn()
{
    var name = document.getElementById("usernameInput").value;
    var password = document.getElementById("password").value;
    if(password == "")
	{
		alert("Please fill in password!");
		return;
    }
    if(await checkUser(name, "") == false && checkName(name) == true)
	{
		if(await createNewCustomer(name, password, false))
		{
			await setCookie(name, password);
			window.location = "http://localhost:3000/public/landing.html";
		}
		else
		{
			while(true)
			{
				alert("Error. Could not create this user. Please contact the admin: 0800 666 666");
			}
		}
    }
	else
    {
		alert("Please login. Already registered");
    }
}


/**
* @function checkUser - Checks if the username and the password is already in the db
* @param username - The username to check
* @param password - The password to check
* @var temp - The answer of the db - request
* @return false - If the user is not in the db
* @return true - If the user is in the db
*/

async function checkUser(username, password)
{
    var temp = await customerDbSearchUsernamePassword(username, password);
    if(temp.length == 0)
	{
		return false;
    }
    else
	{
		return true;
    }
}


/**
* @function checkUser - Checks if the username is supported
* @param username - The username to check
* @return false - If the name is not supported
* @return true - If the name is supported
*/

function checkName(username)
{
	if(username == "" || username == " " || username == "  " || username == "   " || username == "    " || username == "     "
		|| username == "      " || username == "       " || username == "        " || username == "Felix" || username == "Nick"
		|| username == "felix" || username == "nick" || username == "qwertz123456789" || username == "qwertz" || username == "doc"
		|| username == "admin" || username == "test")
	{
		alert("Name not supported");
		return false;
	}
	else
	{
		return true;
	}
}


/**
* @function createNewCustomer - Creates a new customer with the overgiven username, password and message and stores the user in the db
* @param username - The overgiven username
* @param password - The overgiven password
* @param message - The overgiven message
* @var input - The inputobject for the db
* @return true - If the request was successful
* @return false - If the request runs in an error
*/

async function createNewCustomer(username, password, message)
{
    var input =
	{
        "username": username,
        "password": password,
        "message" : message
    };
    try
  	{
        await customerPostRequest(input);
       	return true;
    }
    catch(e)
  	{
        console.log(e);
        alert("Error");
        return false;
    }
}


/**
* @function customerDbUpdate - Updates the riskmessage for a user with deleting and creating the user new
* @param username - The username of the user
* @param password - The password of the user
* @param message - The message of the user says if he has a risk to be infected or not
*/

async function customerDbUpdate(username, password, message)
{
    deleteCustomerUsername(username);
    await createNewCustomer(username, password, message);
}


/**
* @logOut - Logs the user out, deletes his cookies and jumps back to the login - page
*/

async function logOut()
{
	deleteCookie();
	window.location = "http://localhost:3000/";
}