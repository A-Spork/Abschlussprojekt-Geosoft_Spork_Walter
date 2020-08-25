/**
* @author Jana Walter, Adrian Spork
* @matrNr 459 762, 460 137
*/

"use strict";


async function logIn(){
  var name = document.getElementById("logIn").value;
  var password = document.getElementById("password").value;
  if(password==""){
    alert("Please fill in password!");
    return;
  }
  if(checkName(name) && await checkUser(name,password)){
    if(name=="admin"&&password=="admin"){
    }else{
    setCookie(name,password);
    window.location = "http://localhost:3000/public/lastTours.html";
  }
  }
  else{
    alert("Please sign in. Username unknown");
  }
}


  async function signIn(){
    var name = document.getElementById("logIn").value;
    var password = document.getElementById("password").value;
    if(password==""){
      alert("Please fill in password!");
      return;
    }
    if(await checkUser(name,"")== false && checkName(name) == true){
      if(await createNewCustomer(name, password)){
      await setCookie(name,password);///////
      window.location = "http://localhost:3000/public/addTour.html";
      }else{
        while(true){
        alert("Error. Could not create this user. Please contact the admin: 0800 666 666");
      }
      }
    }else
    {
      alert("Please login. Already registered");
    }
  }

//Ist Username+passwort vergeben
  async function checkUser(username,password){
    var temp = await customerDbSearchUsernamePassword(username,password);
    if(temp.length==0){
      return false;
    }
    else{
    return true;
    }
    }
//Wird der name unterstützt
function checkName(username){
  if(username==""||username==" "||username=="  "||username=="   "||username=="    "||username=="     "||username=="      "||username=="       "||username=="        "
||username=="Felix"||username=="Nick"||username=="felix"||username=="nick"||username=="qwertz123456789"||username=="qwertz")
  {
    alert("Name not supported");
    return false;
  }else{
    return true;
  }
}



    /**
     * ´@desc Send Files in textarea to Server to store them
     */

  async function createNewCustomer(username,password)
    {
        var input = {
          "username": username,
          "password": password,
          "lastLogIn": Date.now()
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






        async function customerDbUpdate(username,password)
        {
        deleteCustomerUsername(username);
        await createNewCustomer(username,password);
        }




async function logOut(){
  var username =  getCookie("username");
  var password= getCookie("password");
  await customerDbUpdate(username,password);
  deleteCookie();
  window.location = "http://localhost:3000/";
}
