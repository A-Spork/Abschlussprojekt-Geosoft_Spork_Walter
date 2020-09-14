/**
* @author Jana Walter, Adrian Spork
* @matrNr 459 762, 460 137
*/

"use strict";


// Global variables
var username = getCookie("username");
var station;
var position;
var stationDepartures;
var radius = 50000;


/**
* @function mainAddTour - Requests the locations of busstops near the set location and displays them in a map
*/

async function mainAddTour()
{
	checkCookie("username");
	await getBusstops(position.geometry.coordinates);
	await showMap();
}


/**
* @function showMap - Shows the map at the website
* @var map - The map with the view at the coordinates of the chosen startposition
* @var LayerBusstops - The layer which shows the tours
* @var Circle - The circles which show the tours
* @var temp - The chosen position of the user
* @var PositionMarker - The marker with the chosen position of the user
* @var Empty - The empty layer which shows only the map
* @var Layercontrol - The complete layers in the layercontrol
*/

function showMap()
{
	document.getElementById("mapContainer").style = "width:100%"
	var map = L.map('mapSection').setView(position.geometry.coordinates, 15);
	L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
	{
		maxZoom: 18,
		attribution: 'Leaflet, OpenStreetMapContributors',
	}).addTo(map);
	var LayerBusstops = L.featureGroup().addTo(map).on("click", event);
 	for(var i = 0; i < stationDepartures.boards.length; i++)
	{
		var Circle = L.circle([stationDepartures.boards[i].place.location.lat, stationDepartures.boards[i].place.location.lng],
		{
			color:'cyan',
			fillColor: 'pink',
			fillOpacity: 1.0,
			radius: 25
		});
		Circle.name = stationDepartures.boards[i].place.id;
		Circle.id = i;
		Circle.bindPopup(stationDepartures.boards[i].place.name);
		LayerBusstops.addLayer(Circle);
 	}

	// Add current position
	var temp = toGeoJSONPoint(JSON.parse("[" + position.geometry.coordinates[1]+ "," + position.geometry.coordinates[0]+ "]"));
	var PositionMarker = L.geoJSON(temp).addTo(map);
	PositionMarker.bindPopup("You are here!");

	function event(event)
	{
		station = event.layer.id;
		showTable(event.layer.name, event.layer.id);
	}

	// Create Layers
	var Empty = L.featureGroup();
	var Layercontrol =
	{
		Nothing : Empty,
		Busstops: LayerBusstops,
	};

    // Add control to map
	L.control.layers(Layercontrol).addTo(map);
}


/**
* @function getLocation - Uses the geolocator to get the current position of the user for showPosition()
*/

async function getLocation()
{
	if(navigator.geolocation)
	{
		await navigator.geolocation.getCurrentPosition(await showPosition);
	}
	else
	{
	   document.getElementById("Failure").innerHTML = "Geolocation is not suppoerted by this browser";
	}
}


/**
* @function showPosition - Saves the given position as point_modified and shows it on the webpage
* @param position1 - The given userposition
* @return position - The position
*/

async function showPosition(position1)
{
	position = await toGeoJSONPoint([position1.coords.latitude, position1.coords.longitude]);
	console.log("position set");
	hideGeocoding();
	hideCoordinates();
	showGo();
	return position;
}


/**
* @function showGo - Displays the (hidden) inputs and buttons needed for using the API
*/

function showGo()
{
	document.getElementById("footerGeofields").style = "";
	document.getElementById("stationMap").style = "";
	document.getElementById("keyinput").style = "";
	document.getElementById("keyinputString").style = "";
}


/**
* @function hideCoordinates - Hides the inputs and buttons needed for setting the position via coordinates
*/

function hideCoordinates()
{
	document.getElementById("coordinatesString").style = "display:none";
	document.getElementById("coordinatesInput").style = "display:none";
	document.getElementById("coordinatesButton").style = "display:none";
	document.getElementById("keyinput").style = "display:none";
	document.getElementById("keyinputString").style = "display:none";
	document.getElementById("stationMap").style = "display:none";
}


/**
* @function hideGeocoding - Hides the inputs and buttons needed for setting the position via coordinates
*/

function hideGeocoding()
{
	document.getElementById("adress").style = "display:none";
	document.getElementById("adressString").style = "display:none";
	document.getElementById("keystring").style = "display:none";
	document.getElementById("geocodingkeyinput").style = "display:none";
	document.getElementById("geocodingButton").style = "display:none";
	document.getElementById("keyinput").style = "display:none";
	document.getElementById("keyinputString").style = "display:none";
	document.getElementById("stationMap").style = "display:none";
}


/**
* @function showGeocoding - Displays the (hidden) inputs and buttons needed for setting the position via Geocoding
*/

function showGeocoding()
{
	hideCoordinates();
	document.getElementById("footerGeofields").style = "";
	document.getElementById("adress").style = "";
	document.getElementById("geocodingkeyinput").style = "";
	document.getElementById("geocodingButton").style = "";
	document.getElementById("keystring").style = "";
	document.getElementById("adressString").style = "";
}


/**
* @function startGeocoding - Takes the adress and the key, makes a Geocodingrequest and displays the following steps
* @var geocodingkey - The inserted API - key of the user for the LocationIQ - API
* @var adressString - The inserted adress for the research
*/

function startGeocoding()
{
	var geocodingkey = document.getElementById("geocodingkeyinput").value;
	if(geocodingkey == "")
	{
		geocodingkey = geokey;
	}
	var adressString = document.getElementById("adress").value;
	try
	{
		geocoding(geocodingkey,adressString);
		showGo();
	}
	catch(e)
	{}
}


/**
* @function geocoding - Makes the request for the geocoding
* @param geocodingkey - The key for LocationIQ API
* @param adressString - The adress send to the API
* @return position - The geocoded adress as coordinates in GeoJSON
*/

function geocoding(geocodingkey, adressString)
{
	var resource = "https://eu1.locationiq.com/v1/search.php?key=" + geocodingkey + "&q=" + adressString + "&format=" + "json";
	var z = new XMLHttpRequest();
	z.open("GET", resource, false);
	z.send();
	try
	{
		var response = JSON.parse(z.response);
		position = toGeoJSONPoint(JSON.parse("[" + response[0].lat + "," + response[0].lon + "]"));
		console.log("position set");
		return position;
	}
	catch(e)
	{
		alert(z.response);
		return JSON.parse(z.response);
	}
}


/**
* @function showCoordinates - Displays the (hidden) inputs and buttons needed for setting the position via coordinates
*/

function showCoordinates()
{
	hideGeocoding();
	document.getElementById("footerGeofields").style = "";
	document.getElementById("coordinatesString").style = "";
	document.getElementById("coordinatesInput").style = "";
	document.getElementById("coordinatesButton").style = "";
}


/**
* @function coordinates - Sets the user position via given coordinates
* @return position - The position in GeoJSON
*/

function coordinates()
{
	position = toGeoJSONPoint(JSON.parse("[" + document.getElementById("coordinatesInput").value + "]"));
	showGo();
	return position;
}


/**
* @function getBusstops - Makes the request for the busstops from the Here - API
* @param location - The startposition chosen by the user
* @var key - The API - key for the Here Transit - API
* @var resource - The URL for the request
* @var x - The Request for the XHR - Object
* @return An JSONObject with the busstations in the radius
*/

function getBusstops (location)
{
	//var key = "";  //insert your here transport api key here, if you do not want to insert it every time...
	var key = document.getElementById("keyinput").value;
	if(key == "")
	{
		key = herekey;
	}
	var resource = "https://transit.hereapi.com/v8/departures?in=" + location + ";r=" + radius + "&apiKey=" + key;
	var x = new XMLHttpRequest();
	x.open("GET", resource, false);
	x.send();
	stationDepartures = JSON.parse(x.response);
}


/**
* @function showTable - Displays the table and hides unnecassary checkboxes and lines
*/

function showTable(id, storage)
{
	document.getElementById("tableID").style = "width:100%";
	document.getElementById("tableContainer").style = "width:100%";

	// Hide unnecassary stuff
	for(var j = 0; j < 5; j++)
	{
		document.getElementById("myCheck"+j).style = "display:none";
		document.getElementById("label"+j).style = "display:none";
		document.getElementById(""+j).style = "display:none";
	}

	// Builds the lines and checkboxes
	for(var i = 0; i < stationDepartures.boards[storage].departures.length; i++)
	{
		document.getElementById("checkboxButton").style = "";
		document.getElementById("myCheck"+i).style = "";
		document.getElementById("label"+i).style = "";
		document.getElementById(""+i).style = "";
		document.getElementById("Line"+JSON.stringify(i)).innerHTML = stationDepartures.boards[storage].departures[i].transport.name;
		document.getElementById("Type"+JSON.stringify(i)).innerHTML = stationDepartures.boards[storage].departures[i].transport.category;
		document.getElementById("Destination"+JSON.stringify(i)).innerHTML = stationDepartures.boards[storage].departures[i].transport.headsign;
		document.getElementById("Date"+JSON.stringify(i)).innerHTML = stationDepartures.boards[storage].departures[i].time;
	}
}


// An eventlistener for clicking on the table rows to check on the checkbox
var table = document.getElementById("tableID");
if(table != null)
{
	for(var i = 0; i < table.rows.length; i++)
	{
        table.rows[i].onclick = function()
		{
            tableText(this);
        };
    }
}


/**
* @function tableText - Checks/unchecks the checkbox when click on the row
* @param row - The row for the onclick action
*/

function tableText(row)
{
	if(document.getElementById("myCheck" + row.id).checked != true)
	{
		document.getElementById("myCheck" + row.id).checked = true;
	}
	else
	{
		document.getElementById("myCheck" + row.id).checked = false;
	}
}


/**
* @function checkcheckboxes - Saves marked tours
* @var risk - The risk to overgive to the addTour is false at the beginning
*/

async function checkcheckboxes()
{
	var risk = Boolean(false);
	for(var i = 0; i < 5; i++)
	{
		if(document.getElementById("myCheck" + i).checked == true)
		{
			if(await addTour(station, i, risk) == true)
			{
				alert("Tour " + (i + 1) + " saved");
			}
			else
			{
				alert("Tour " + (i + 1) + " could not be saved or was already saved");
			}
		}
    }
}


/**
* @function toGeoJSONPoint - Converts the given point to GeoJSON
* @param newGeopoint - The point as GeoJSON
* @return newGeopoint - The point as GeoJSON point
*/

function toGeoJSONPoint(coordinatesPoint)
{
	var newGeopoint =
	{
		"type": "Feature",
		"properties": {},
		"geometry":
		{
			"type": "Point",
			"coordinates": coordinatesPoint
 		}
	};
	return newGeopoint;
}


/**
* @function addTour - Creates a tourobject by given parameters and sends it to the db
* @param station - The position the station has in stationDepartures
* @param id - The position the tour has in station.boards
* @param risk - The risk for this tour
* @var input - The tour - object to store in the db
* @var temp - The result of the checkTour - function
* @return true - If the post - request was successful
* @return false - If something went wrong
*/

async function addTour(station, id, risk)
{
	// Create an object to save in the db
    var input =
	{
		"tourId": stationDepartures.boards[station].departures[id].transport.name +
					stationDepartures.boards[station].departures[id].transport.headsign +
					stationDepartures.boards[station].departures[id].time + username,
		"category": stationDepartures.boards[station].departures[id].transport.category,
		"line": stationDepartures.boards[station].departures[id].transport.name,
		"destination": stationDepartures.boards[station].departures[id].transport.headsign,
		"date": stationDepartures.boards[station].departures[id].time,
		"risk": JSON.parse(risk),
		"username": username,
		"place":
		[{
			"id": stationDepartures.boards[station].place.id,
			"name": stationDepartures.boards[station].place.name,
			"coordinates":
			{
				"lat": stationDepartures.boards[station].place.location.lat,
				"lng": stationDepartures.boards[station].place.location.lng
			},
			"type": stationDepartures.boards[station].place.type
		}]
	};

	// Check if the tour is already saved
	var temp = await checkTour(input.tourId);
    if(temp == false)
	{
		try
		{
			// Send the data to the db
			await tourPostRequest(input);
			return true;
		}
		catch(e)
		{
			console.log("PostRequest broke");
			return false;
		}
    }
	else
	{
		if((await checkTour(input.tourId)) == true)
		{
			return false;
		}
	}
}


/**
* @function checkTour - Checks if a tour is already saved in the db
* @param id - The tourId of the overgiven tour
* @var temp - The result of the get - request to the db
* @return true - If the tour already saved or an error occures
* @return false - If the tour is not saved yet
*/

async function checkTour(id)
{
	var temp = await tourDbSearchTourId(id);
	if(temp.length == 0)
	{
		return false;
    }
	else if(temp.length != 0)
	{
		return true;
    }
	else
	{
		alert("Error!!!");
        return true;
    }
}
