/**
* @author Jana Walter, Adrian Spork
* @matrNr 459 762, 460 137
*/

"use strict";
checkCookie("username");
var username = getCookie("username");
var station;
//get the userposition
var position;
var stationDepartures;
var radius=50000;

/**
* @function mainAddTour
* requests the locations of busstops near the set location and displays them in a map
*/
async function mainAddTour(){
  await getBusstops(position.geometry.coordinates);
  await showMap();
}



/**
* @function showMap
* Creates a leafletmap and displays the saved Busstops and the userposition
* adds layercontroll and popups into the map
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
   var LayerBusstops = L.featureGroup().addTo(map).on("click",event);
 	for(var i = 0; i < stationDepartures.boards.length; i++)
	{
		var Circle =
    L.circle(
      [stationDepartures.boards[i].place.location.lat,
      stationDepartures.boards[i].place.location.lng],
		{
			color:'cyan',
			fillColor: 'pink',
			fillOpacity: 1.0,
			radius: 25
		});
    Circle.name = stationDepartures.boards[i].place.id;
    Circle.id = i;
		Circle.bindPopup(stationDepartures.boards[i].place.name);

		 // circle.addTo(map);
		LayerBusstops.addLayer(Circle);
 	}

	// add current position
	var temp = toGeoJSONPoint(JSON.parse("[" + position.geometry.coordinates[1]+ "," + position.geometry.coordinates[0]+ "]"));
	var PositionMarker = L.geoJSON(temp).addTo(map);
	PositionMarker.bindPopup("You are here!");

  function event(event){
    station=event.layer.id;
    showTable(event.layer.name, event.layer.id);
  }
  //create Layers
		var Empty = L.featureGroup();
		var Layercontrole =
		{
			 Nothing : Empty,
			 Busstops: LayerBusstops,
		};
    //add controlle to map
		L.control.layers(Layercontrole).addTo(map);
}




/**
* @function getLocation - Uses the geolocator to get the current position of the user for showPosition()
*/

async function getLocation()
{
	if(navigator.geolocation)
	{
	await navigator.geolocation.getCurrentPosition( await showPosition);
	}
	else
	{
	   document.getElementById("Failure").innerHTML = "Geolocation is not suppoerted by this browser";
	}
}

/**
* @function showPosition - Saves the given position as point_modified and shows it on the webpage
* @param position1 the given userposition
* @return the position in GeoJSON-format
*/
async function showPosition(position1)
{
	 position = await toGeoJSONPoint( [position1.coords.latitude, position1.coords.longitude]);
   console.log("position set");
   hideGeocoding();
   hideCoordinates();
   showGo();
   return position;
}

/**
* @function showGo
* displays the (hidden) inputs and buttons needed for using the API
*/
function showGo(){
	document.getElementById("footerGeofields").style="";
  document.getElementById("stationMap").style="";
  document.getElementById("keyinput").style="";
  document.getElementById("keyinputString").style="";
}

/**
* @function hideCoordinates
* hides the  inputs and buttons needed for setting the position via coordinates
*/
function hideCoordinates(){
	document.getElementById("coordinatesString").style="display:none";
  document.getElementById("coordinatesInput").style="display:none";
  document.getElementById("coordinatesButton").style="display:none";
  document.getElementById("keyinput").style="display:none";
  document.getElementById("keyinputString").style="display:none";
  document.getElementById("stationMap").style="display:none";
}

/**
* @function hideGeocoding
* hides the inputs and buttons needed for setting the position via coordinates
*/
function hideGeocoding(){
  document.getElementById("adress").style="display:none";
  document.getElementById("adressString").style="display:none";
  document.getElementById("keystring").style="display:none";
  document.getElementById("geocodingkeyinput").style="display:none";
  document.getElementById("geocodingButton").style="display:none";
  document.getElementById("keyinput").style="display:none";
  document.getElementById("keyinputString").style="display:none";
  document.getElementById("stationMap").style="display:none";
}

/**
* @function showGeocoding
* displays the (hidden) inputs and buttons needed for setting the position via Geocoding
*/
function showGeocoding(){
  hideCoordinates();
  document.getElementById("footerGeofields").style="";
  document.getElementById("adress").style="";
  document.getElementById("geocodingkeyinput").style="";
  document.getElementById("geocodingButton").style="";
  document.getElementById("keystring").style="";
  document.getElementById("adressString").style="";
}

/**
* @function startGeocoding
* takes the adress and key, makes a Geocodingrequest and displays the following steps
*/
function startGeocoding(){
  var geocodingkey = document.getElementById("geocodingkeyinput").value;
  var adressString = document.getElementById("adress").value;
  geocoding(geocodingkey,adressString);
  showGo();
}


/**
* @function startGeocoding
* @param geocodingkey the key for LocationIQ API
* @param adressString  the adress send to the API
* @return the geocoded adress as coordinates in GeoJSON
* get your own key here: "https://locationiq.com/geocoding"
*/
function geocoding(geocodingkey,adressString)
{
	var resource = "https://eu1.locationiq.com/v1/search.php?key=" + geocodingkey + "&q=" + adressString + "&format=" + "json";
	var z = new XMLHttpRequest();
	z.open("GET", resource, false);
	z.send();
  try{
    var response=JSON.parse(z.response);
    position= toGeoJSONPoint(JSON.parse("[" + response[0].lat + "," + response[0].lon + "]"));
    console.log("position set");
  	return position;
  }catch(e){
    alert(z.response);
    return JSON.parse(z.response);
  }
}

/**
* @function showGeocoding
* displays the (hidden) inputs and buttons needed for setting the position via coordinates
*/
function showCoordinates(){
  hideGeocoding();
  document.getElementById("footerGeofields").style="";
  document.getElementById("coordinatesString").style="";
  document.getElementById("coordinatesInput").style="";
  document.getElementById("coordinatesButton").style="";
}

/**
* @function coordinates
* @return the position in GeoJSON
* sets the user position via given coordinates
*/
function coordinates(){
  position = toGeoJSONPoint( JSON.parse( "[" + document.getElementById("coordinatesInput").value + "]"));
  showGo();
  return position;
}

/**
* @function getBusstops - Makes the request for the busstops from the Conterra - Website
* @param resource - The URL for the request
* @param x - The Request for the XHR - Object
* @param temp - An array with the busstops as GeoJSONObject sorted by the distance to the point point_modified
* @return An GeoJSONObject sorted by the distance
*/
function getBusstops(location)
{
  //var key = "";  //insert your here transport api key here, if you do not want to insert it every time...
  var key = document.getElementById("keyinput").value;
	var resource = "https://transit.hereapi.com/v8/departures?in=" + location + ";r="+radius+"&apiKey="+key;
	var x = new XMLHttpRequest();
	x.open("GET", resource, false);
	x.send();
	stationDepartures  = JSON.parse(x.response);
}


/**
* @function showTable
* displays the table and hides unnecassary checkboxes and lines
*/
function showTable(id,storage){
document.getElementById("tableID").style="width:100%";
document.getElementById("tableContainer").style="width:100%";
//hide unnecassary stuff
for(var j=0;j<5;j++){
  document.getElementById("myCheck"+j).style="display:none";
  document.getElementById("label"+j).style="display:none";
  document.getElementById(""+j).style="display:none";
}
//builes the lines and checkboxes
  for(var i=0;i<stationDepartures.boards[storage].departures.length;i++){
    document.getElementById("checkboxButton").style="";
    document.getElementById("myCheck"+i).style="";
    document.getElementById("label"+i).style="";
    document.getElementById(""+i).style="";
    document.getElementById("Line"+JSON.stringify(i)).innerHTML = stationDepartures.boards[storage].departures[i].transport.name;
    document.getElementById("Type"+JSON.stringify(i)).innerHTML = stationDepartures.boards[storage].departures[i].transport.category;
    document.getElementById("Destination"+JSON.stringify(i)).innerHTML = stationDepartures.boards[storage].departures[i].transport.headsign;
    document.getElementById("Date"+JSON.stringify(i)).innerHTML = stationDepartures.boards[storage].departures[i].time;
  }
}
//onclick function
var table = document.getElementById("tableID");
if(table != null) {
    for(var i = 0; i < table.rows.length; i++) {
            table.rows[i].onclick = function() {
            tableText(this);
        };
    }
}
/**
*@function tableText checks/ unchecks the checkbox when click on the row
*@param row the row for the onclick action
*/
function tableText(row) {
  if( document.getElementById("myCheck"+row.id).checked!=true){
  document.getElementById("myCheck"+row.id).checked=true;
  }
  else{
    document.getElementById("myCheck"+row.id).checked=false;
  }
}


/**
*@function checkcheckboxes saves marked tours
*/
async function checkcheckboxes(){

  var risk=Boolean(false);
  for(var i=0;i<5;i++){
    if(document.getElementById("myCheck"+i).checked==true){
      if(await addTour(station,i,risk)==true)alert("Tour nr.: "+(i+1)+" saved");
      else alert("Tour nr.: "+(i+1)+" could not be saved or was already saved");
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
* @function changeToView changes the windowslocation to the viewpage
*/
function changeToView(){
window.location = "http://localhost:3000/public/lastTours.html";
}


/**
 *  @function addTour creates a tourobject by given parameters and sends it to the db
 *  @param station the position the station has in stationDepartures
 *  @param id the position the tour has in station.boards
 *  @param risk the risk for this tour
 * ´@desc Send Files in textarea to Server to store them
 */
async function addTour(station,id,risk) //Position von Station und der entsprechenden Abfahrt in Station Departure[]
{
  //create object
    var input = {
      "tourId": stationDepartures.boards[station].departures[id].transport.name+
                stationDepartures.boards[station].departures[id].transport.headsign+
                stationDepartures.boards[station].departures[id].time+
                username,
      "category":stationDepartures.boards[station].departures[id].transport.category,
      "line": stationDepartures.boards[station].departures[id].transport.name,
      "destination": stationDepartures.boards[station].departures[id].transport.headsign,
      "date": stationDepartures.boards[station].departures[id].time,
      "risk": JSON.parse(risk),
      // "riskDate" : null,
      "username": username,
      "place":[ {
        "id":stationDepartures.boards[station].place.id,
        "name":stationDepartures.boards[station].place.name,
        "coordinates":{
          "lat":stationDepartures.boards[station].place.location.lat,
          "lng":stationDepartures.boards[station].place.location.lng
        },
        "type":stationDepartures.boards[station].place.type
      }]};
//check if tour already saved
var temp = await checkTour(input.tourId);
    if(temp==false){
      try{
        //send it to the db
        await tourPostRequest(input);
        return true;
      }
      catch(e){
        console.log("PostRequest broke");
        return false;
      }
    }else{
      if((await checkTour(input.tourId))==true){
      return false;
    }
  }

}




/**
* @function checkTour checks if a tour is already saved in the db
* @return true if tour already saved or an error occures
* @return false if tour is not saved yet
**/
async function checkTour(id){
  var temp = await tourDbSearchTourId((id));
  if(temp.length==0){
        return false;
      }else if(temp.length!=0){
        return true;
      }else{
        alert("Error!!!");
        return true;
      }
}
