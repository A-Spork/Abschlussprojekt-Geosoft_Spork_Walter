/**
* @author Jana Walter, Adrian Spork
* @matrNr 459 762, 460 137
*/

"use strict";


async function logIn(){
  var name = document.getElementById("usernameInput").value;
  var password = document.getElementById("password").value;
  console.log(name,password);
  if(password==""){
    alert("Please fill in password!");
    return;
  }
  if(name=="doc"&&password=="doc"){
    window.location = "http://localhost:3000/public/doc.html";
  }else if(name=="test"&&password=="test"){
    setCookie(name,password);
    window.location = "http://localhost:3000/public/test.html";
  }
  else{
  if(await checkUser(name,password)){
    if(name=="admin"&&password=="admin"){
      return;
    }else{
    setCookie(name,password);
    window.location = "http://localhost:3000/public/landing.html";
  }
  }
  else{
    alert("Please sign in. Username unknown");
  }
}
}


  async function signIn(){
    var name = document.getElementById("usernameInput").value;
    var password = document.getElementById("password").value;
    if(password==""){
      alert("Please fill in password!");
      return;
    }
    if(await checkUser(name,"")== false && checkName(name) == true){
      if(await createNewCustomer(name, password, false)){
      await setCookie(name,password);///////
      window.location = "http://localhost:3000/public/landing.html";
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
//name valid= true, invalid=false
function checkName(username){
  if(username==""||username==" "||username=="  "||username=="   "||username=="    "||username=="     "||username=="      "||username=="       "||username=="        "
||username=="Felix"||username=="Nick"||username=="felix"||username=="nick"||username=="qwertz123456789"||username=="qwertz"||username=="doc"||username=="admin")
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

  async function createNewCustomer(username,password,message)
    {
        var input = {
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






async function customerDbUpdate(username,password,message)
  {
    deleteCustomerUsername(username);
    await createNewCustomer(username,password,message);
   }




async function logOut(){
  deleteCookie();
  window.location = "http://localhost:3000/";
}
