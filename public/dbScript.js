/**
* @author Jana Walter, Adrian Spork
* @matrNr 459 762, 460 137
*/

"use strict";

///////////////////////// Customer //////////////////////////////////////////////////////////

/**
* @function customerPostRequest - Sends data to the server to get stored in database
* @param dat - Data to store
* @return promise - Returns the success - or the error - function
*/

async function customerPostRequest(dat)
{
	return new Promise(function(res, rej)
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
* @function customerGetRequestUsername - Request data stored in MongoDB by username and password and resolves them as promise
* @param query - Query to filter stored data here the username and the password
* @return promise - Returns the success - or the error - function
*/

async function customerGetRequestUsername(query)
{
  var temp =  new Promise(function(res, rej){
      $.ajax({
          url: "/customer" +"?username="+encodeURIComponent(query.username)+"&"+ "password"+"="+encodeURIComponent(query.password),
          type: "get",
          success: function(result){res(result);  return result;},
          error: function(err){console.log(err); return result;}
      });
  });
  return await temp;
}


/**
* @function customerDbSearchUsernamePassword - Shows files of the customer stored in Database searched by username and password
* @param username - The username to use for the query
* @param password - The password to use for the query
* @var temp - The answer of the get request
* @return temp - The answer of the request will be returned
*/

async function customerDbSearchUsernamePassword(username, password)
{
	// If the password is not overgiven, the user will be searched by the username
	if(password == "")
	{
		var query =
		{
			"username": username,
			"password": ""
		}
	}
	else
	{
		var query =
		{
			"username": username,
			"password": password
		}
	}
	var temp = await customerGetRequestUsername(query);
	return temp;
}


/**
* @function deleteCustomerUsername - Deletes files of the customer stored in Database searched by username
* @param username - The username to use for the query
* @var temp - The data for the query
* @return promise - Returns the success - or the error - function
*/

async function deleteCustomerUsername(username)
{
	var temp = {username : username};
    return await new Promise(function(res, rej)
	{
    	$.ajax
        ({
    		url: "/customer",
    		method: "DELETE",
    		data: temp,
    		success: function(result) {res(result);},
    		error: function(err) {console.log(err);}
    	});
    });
}



///////////////////////// Tour //////////////////////////////////////////////////////////

/**
* @function tourPostRequest - Sends data to the server to get stored in database
* @param dat - Data to store
* @return promise - Returns the success - or the error - function
*/

async function tourPostRequest(dat)
{
	return new Promise(function(res, rej)
	{
		$.ajax
		({
			url: "/tour",
            data: dat,
            type: "post",
            success: function(result) {res(result);},
            error: function(err) {console.log(err); }
        });
    });
}


/**
* @function tourGetRequestUsername - Request data stored in MongoDB by username and resolves them as promise
* @param query - Query to filter stored data here the username
* @return promise - Returns the success - or the error - function
*/

function tourGetRequestUsername(query)
{
	// The username has to be encoded so that it can be given correct to the server
	var encodedUsername = encodeURIComponent(query.username);
    return new Promise(function(res, rej)
	{
		$.ajax
		({
            url: "/tour" + "?username=" + encodedUsername,
            type: "get",
            success: function(result){res(result);},
            error: function(err){console.log(err);}
        });
    });
}


/**
* @function tourGetRequestTourId - Request data stored in MongoDB by the tourId and resolves them as promise
* @param query - Query to filter stored data here the tourId
* @return promise - Returns the success - or the error - function
*/

function tourGetRequestTourId(query)
{
	// The tourId has to be encoded so that it can be given correct to the server
	var encodedId = encodeURIComponent(query.tourId);
    return new Promise(function(res, rej)
	{
        $.ajax
		({
            url: "/tour" + "?tourId=" + encodedId,
            type: "get",
            success: function(result) {res(result);},
            error: function(err) {console.log(err);}
        });
    });
}


/**
* @function tourGetRequestMatch - Request data stored in MongoDB by line, destination, place, date and category and resolves them as promise
* @param query - Query to filter stored data here the line, destination, place, date and category
* @var encodedLine - Encodes the line for the query
* @var encodedDestination - Encodes the destination for the query
* @var encodedPlace - Encodes the place for the query
* @var encodedDate - Encodes the date for the query
* @var encodedCategory - Encodes the category for the query
* @return promise - Returns the success - or the error - function
*/

function tourGetRequestMatch (line, destination, place, date, category)
{
	var encodedLine = encodeURIComponent(line);
	var encodedDestination = encodeURIComponent(destination);
	var encodedPlace = encodeURIComponent(place);
	var encodedDate = encodeURIComponent(date);
	var encodedCategory = encodeURIComponent(category);

    return new Promise(function(res, rej)
	{
        $.ajax
		({
            url: "/tour" + "?category=" + encodedCategory + "&" + "destination" + "=" + encodedDestination + "&" + "place" + "=" + encodedPlace + "&" + "date" + "=" + encodedDate + "&" + "line" + "=" + encodedLine,
            type: "get",
            success: function(result) {res(result);},
            error: function(err) {console.log(err);}
        });
    });
}


/**
* @function tourDbSearchTourId - Shows files of a tour stored in Database searched by the tourId
* @param tourId - The tourId to use for the query
* @var query - The object for the get - request
* @var result - The answer of the get request
* @return result - The answer of the request will be returned
*/

async function tourDbSearchTourId(tourId)
{
	var query = {"tourId" : tourId};
	var result = await tourGetRequestTourId(query);
	return result;
}


/**
* @function tourDbSearchUsername - Shows files of a tour stored in Database searched by the username
* @param username - The username to use for the query
* @var query - The object for the get - request
* @var result - The answer of the get request
* @return result - The answer of the request will be returned
*/

async function tourDbSearchUsername(username)
{
	var query = {"username" : username};
	var result = await tourGetRequestUsername(query);
	return result;
}


/**
* @function deleteTour - Deletes files of the customer stored in Database searched by the tourId
* @param tourId - The tourId to use for the query
* @var object - The data for the query
*/

async function deleteTour(tourId)
{
	var object = {tourId : encodeURIComponent(tourId)};
    return await new Promise(function(res, rej)
	{
		$.ajax
    	({
    		url: "/tour",
    		method: "DELETE",
    		data: object,
            success: function(result) {res(result);},
    		error: function(err) {console.log(err);}
    	});
    });
}
