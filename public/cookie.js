function setCookie(name,password) {
  document.cookie = "username=" + name + ";path=/";
  document.cookie = "password=" + password + ";path=/";
}


function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function checkCookie() {
  var username = getCookie("username");
  var password = getCookie("password");
  if (username != "") {
   alert("Welcome " + username);
  } else {
    username = prompt("Please enter your name:", "");
    password = prompt("Please enter your password:", "");
    if (username != "" && username != null&&password != "" && password != null) {
      setCookie(username,password);
    }
  }
}

function deleteCookie()
{
  document.cookie = "password=; path=/;";
  document.cookie = "username=; path=/;";
  return true;
}
