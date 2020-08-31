/**
* @function setCookie sets the cookie to given values
* @param name the username to be saved
* @param password the user´s password to be saved
*/
function setCookie(name,password) {
  document.cookie = "username=" + name + ";path=/";
  document.cookie = "password=" + password + ";path=/";
}

/**
* @function getCookie gives the value saved in the names cookie
* @param cname name of the cookie
* @return the value of the named cookie
*/
function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while(c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if(c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

/**
* @function checkCookie checks if a cookie is set or logs out the user
*/
function checkCookie() {
  var username = getCookie("username");
  var password = getCookie("password");
  if(username != "") {
   alert("Welcome " + username);
  } else {
    //logOut
    alert("Please log in again");
    window.location = "http://localhost:3000/";
  }
}

/**
* @function deleteCookie deletes all saved cookies
*/
function deleteCookie()
{
  document.cookie = "password=; path=/;";
  document.cookie = "username=; path=/;";
  return true;
}
