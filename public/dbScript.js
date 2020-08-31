/**
* @author Jana Walter, Adrian Spork
* @matrNr 459 762, 460 137
*/

"use strict";


//Customer

/**
 * @desc Sends data to server to get stored in database
 * @param dat to store
 */

async function customerPostRequest(dat)
{
  return new Promise( function(res, rej)
  {
        $.ajax
    ({
            url: "/customer",
            data: dat,
            type: "post",
            success: function(result) {res(result);},
            error: function(err) { console.log(err); }
        });
    });
}



/**
 * @desc Request data stored in MongoDB and resolves them as promise
 * @param query to filter stored data
 */

async  function customerGetRequestUsername(query)
{
    return new Promise(function(res, rej){
        $.ajax({
            url: "/customer" +"?username="+encodeURIComponent(query.username)+"&"+ "password"+"="+encodeURIComponent(query.password),
            type: "get",

            success: function(result){res(result);},
            error: function(err){console.log(err);}
        });
    });
}

/**
 * @desc Shows Files stored in Database
 */

async function customerDbSearchUsernamePassword(username,password)
{
  if(password==""){
    var query={
      "username": username,
      "password": ""
    }
  }else{
    var query={
      "username": username,
      "password": password
    }
  }
  var temp = await customerGetRequestUsername(query);
  return temp;
}

async function deleteCustomerUsername(username)
    {
    	var temp = {username : username};
    		return await new Promise(function(res, rej){
    						$.ajax
    				        ({
    								url: "/customer",
    								method: "DELETE",
    								data: temp,
    								success: function(result) { res(result); },
    								error: function(err) {console.log(err);}
    						});
    				});
        }



// Tour


/**
 * @desc Sends data to server to get stored in database
 * @param dat to store
 */

async function tourPostRequest(dat)
{
  return new Promise( function(res, rej)
  {
        $.ajax
    ({
            url: "/tour",
            data: dat,
            type: "post",
            success: function(result) {res(result);},
            error: function(err) { console.log(err); }
        });
    });
}


/**
 * @desc Shows Files stored in Database
 */

async function tourDbSearchTourId(tourId)
{
  var query = {"tourId" : tourId};
	var result = await tourGetRequestTourId(query);
  return result;
}


/**
 * @desc Shows Files stored in Database
 */

async function tourDbSearchUsername(username)
{
  var query = {"username" : username};
	var result = await tourGetRequestUsername(query);
  return result;
}

/**
 * @desc Request data stored in MongoDB and resolves them as promise
 * @param query to filter stored data
 */
function tourGetRequestUsername(query)
{
  var encodedUsername= encodeURIComponent(query.username);
    return new Promise(function(res, rej){
        $.ajax({
            url: "/tour" + "?username=" + encodedUsername,
            type: "get",
            success: function(result){ res(result);},
            error: function(err){ console.log(err);}
        });
    });
}


/**
 * @desc Request data stored in MongoDB and resolves them as promise
 * @param query to filter stored data
 */
function tourGetRequestTourId(query)
{
  var encodedId = encodeURIComponent(query.tourId);
    return new Promise(function(res, rej){
        $.ajax({
            url: "/tour" + "?tourId=" + encodedId,
            type: "get",
            success: function(result){ res(result);},
            error: function(err){ console.log(err);}
        });
    });
}


/**
 * @desc Request data stored in MongoDB and resolves them as promise
 * @param query to filter stored data
 */
function tourGetRequestMatch(line, destination, place, date, category)
{
  var encodedLine = encodeURIComponent(line);
  var encodedDestination = encodeURIComponent(destination);
  var encodedPlace = encodeURIComponent(place);
  var encodedDate = encodeURIComponent(date);
  var encodedCategory = encodeURIComponent(category);

    return new Promise(function(res, rej){
        $.ajax({
            url: "/tour" + "?category=" + encodedCategory+"&"+ "destination"+"="+encodedDestination+"&"+ "place"+"="+encodedPlace+"&"+ "date"+"="+encodedDate+"&"+ "line"+"="+encodedLine,
            type: "get",
            success: function(result){ res(result);},
            error: function(err){ console.log(err);}
        });
    });
}


/**
* @function delteTour - Deletes a tour from the DB by its tourId
* @param tourId The tourId of the tour to be deleted
*/

async function deleteTour(tourId)
  {
    var object = {tourId : encodeURIComponent(tourId)};
    	return await new Promise(function(res, rej){
    					$.ajax
    				     ({
    						url: "/tour",
    						method: "DELETE",
    						data: object,
                success: function(result) {  res(result); },
    						error: function(err) {console.log(err);}
    						});
    				});
    }
