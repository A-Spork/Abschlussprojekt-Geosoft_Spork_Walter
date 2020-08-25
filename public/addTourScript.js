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

//var key= //////////////////////////////////////////////////////////////////////////////////////;


async function mainAddTour(){
  await getBusstops(position.geometry.coordinates);
  await showMap();
}


async function letsGo(){
   getBusstops(position.geometry.coordinates);
  document.getElementById("station").style="display:none";
  document.getElementById("Map").style="";

}

/**
* @function showMap -
*/

function showMap()
{
	var map = L.map('mapSection').setView (position.geometry.coordinates, 15);
	L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
	{
		maxZoom: 18,
		attribution: 'Leaflet, OpenStreetMapContributors',
	}).addTo(map);
   var LayerBusstops = L.featureGroup().addTo(map).on("click",event);
 	for (var i = 0; i < stationDepartures.boards.length; i++)
	{
		var Circle =
    L.circle (
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


	// current position
	var temp = toGeoJSONPoint (JSON.parse ("[" + position.geometry.coordinates[1]+ "," + position.geometry.coordinates[0]+ "]"));
	var PositionMarker = L.geoJSON (temp).addTo(map);
	PositionMarker.bindPopup ("You are here!");

  function event(event){
    station=event.layer.id;
    showTable(event.layer.name, event.layer.id);
  }

//Heat
	// var temp = Array(pointcloud_modified.features.length);
	// for(var i = 0; i < temp.length ;i++){
  // temp[i]=[pointcloud_modified.features[i].geometry.coordinates[1],pointcloud_modified.features[i].geometry.coordinates[0]];
	// }
		// var Heat = L.heatLayer(temp);
		// var BusstopsAndHeat = L.featureGroup();
		// BusstopsAndHeat.addLayer(Heat);
		// BusstopsAndHeat.addLayer(LayerBusstops);
		var Empty = L.featureGroup();

		var HeatLayer =
		{
			 Nothing : Empty,
			 Busstops: LayerBusstops,
		   // Heat: Heat,
			 // BusstopsAndHeat: BusstopsAndHeat
		};

		L.control.layers(HeatLayer).addTo(map);
}




/**
* @function getLocation - Uses the geolocator to get the current position of the user for showPosition()
*/

async function getLocation()
{
	if (navigator.geolocation)
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
*/

async function showPosition (position1)
{
	 position = await toGeoJSONPoint( [position1.coords.latitude, position1.coords.longitude]);
   console.log("position set");
   showGo();
   return position;
}

function showGo(){
  document.getElementById("stationMap").style="";
  document.getElementById("station").style="";
}

function showGeocoding(){
  //neues einlenden
  document.getElementById("adress").style="";
  document.getElementById("geocodingkey").style="";
  document.getElementById("GeocodingButton").style="";
  document.getElementById("keystring").style="";
  document.getElementById("adressString").style="";
  //andere ausblenden
  document.getElementById("coordinates").style="display:none";
  document.getElementById("coordinatesButton").style="display:none";
}

function startGeocoding(){
  geocoding();
  showGo();
  // document.getElementById("Map").style="";
}

function geocoding()
{

  // var geocodingkey = document.getElementById("geocodingkey").value;
  var adressString = document.getElementById("adress").value;
	var resource = "https://eu1.locationiq.com/v1/search.php?key=" + geocodingkey + "&q=" + adressString + "&format=" + "json";
	var z = new XMLHttpRequest();
	z.open ("GET", resource, false);
	z.send();
  var response=JSON.parse(z.response);
  position= toGeoJSONPoint (JSON.parse ("[" + response[0].lat + "," + response[0].lon + "]"));
  console.log("position set");
	return position;


  // var response = geocoding (key, adressString, format);
  // document.getElementById("displayResponse").innerHTML = JSON.stringify (response);
  // adressPoint = toGeoJSONPoint (JSON.parse ("[" + response[0].lat + "," + response[0].lon + "]"));
  // document.getElementById("displayCoordinates").innerHTML = JSON.stringify (adressPoint);
}

function showCoordinates(){
  document.getElementById("coordinates").style="";
  document.getElementById("coordinatesButton").style="";
}

function coordinates(){
  position = toGeoJSONPoint( JSON.parse( "[" + document.getElementById("coordinates").value + "]"));
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
	var resource = "https://transit.hereapi.com/v8/departures?in=" + location + ";r="+radius+"&apiKey="+key;
	var x = new XMLHttpRequest();
	x.open("GET", resource, false);
	x.send();
	stationDepartures  = JSON.parse(x.response);
}



function showTable(id,storage){
document.getElementById("tableID").style="width:50%";

document.getElementById("myCheck0").style="";
document.getElementById("myCheck1").style="";
document.getElementById("myCheck2").style="";
document.getElementById("myCheck3").style="";
document.getElementById("myCheck4").style="";
document.getElementById("myCheck0").style="";

document.getElementById("label0").style="";
document.getElementById("label1").style="";
document.getElementById("label2").style="";
document.getElementById("label3").style="";
document.getElementById("label4").style="";

document.getElementById("checkboxButton").style="";
document.getElementById("pinfo").style="";


for(var i=0;i<5;i++){
  document.getElementById("Linie"+JSON.stringify(i)).innerHTML = stationDepartures.boards[storage].departures[i].transport.name;
  document.getElementById("Type"+JSON.stringify(i)).innerHTML = stationDepartures.boards[storage].departures[i].transport.category;
  document.getElementById("Destination"+JSON.stringify(i)).innerHTML = stationDepartures.boards[storage].departures[i].transport.headsign;
  document.getElementById("Date"+JSON.stringify(i)).innerHTML = stationDepartures.boards[storage].departures[i].time;
  document.getElementById("Info"+JSON.stringify(i)).innerHTML = stationDepartures.boards[storage].departures[i].agency.website;
}
}


var table = document.getElementById("tableID");
if (table != null) {
    for (var i = 0; i < table.rows.length; i++) {
        // for (var j = 0; j < table.rows[i].cells.length; j++)
        // table.rows[i].cells[j].onclick = function () {
            table.rows[i].onclick = function () {
            tableText(this);
        };
    }
}

function tableText(row) {
  if( document.getElementById("myCheck"+row.id).checked!=true){
  document.getElementById("myCheck"+row.id).checked=true;
}
else{
  document.getElementById("myCheck"+row.id).checked=false;
}
}



async function checkcheckboxes(){
  // var a=0; //Anzahl gespeicherter Touren
  // var b=0; //
  var risk=Boolean(true);
for(var i=0;i<5;i++){
    if(document.getElementById("myCheck"+i).checked==true){
      // b++;
      if(await addTour(station,i,risk)==true){
        // a++;
          alert("Tour nr.: "+(i+1)+" saved");
      }
      else{
          alert("Tour nr.: "+(i+1)+" could not be saved or was already saved");
      }
    }
  }
  // if (b==0){
  //   alert("No tour chosen. Click on a fcking checkbox");
  // }
  // if (a==1){
  //   alert("Tour saved");
  // }
  // if (a>1){
  //   alert(a+" Tours saved");
  // }
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


function changeToView(){
window.location = "http://localhost:3000/public/lastTours.html";
}



////////////////////////////////////////ServerStuff//////////////////////////////////////

/**
 * ´@desc Send Files in textarea to Server to store them
 */

async function addTour(station,id,risk) //Position von Station und der entsprechenden Abfahrt in Station Departure[]
{
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
      "username": username,
      "place":[ {
        "id":stationDepartures.boards[station].place.id,
        "name":stationDepartures.boards[station].place.name,
        "coordinates":{
          "lat":stationDepartures.boards[station].place.location.lat,
          "lng":stationDepartures.boards[station].place.location.lng
        },
        "type":stationDepartures.boards[station].place.type
      }]
    };
var temp = await checkTour(input.tourId);
    if(temp==false){
      try{
        await tourPostRequest(input);
        return true;
      }
      catch(e){
        console.log("PostRequest broke");
        return false;
      }
    }else if((await checkTour(input.tourId))==true){
       // alert("Tour already been saved!");
      return false;
    }

}




/**
* Ist die Tour schon in der Datenbank gespeichert
*
**/
async function checkTour(id){
  var temp = await tourDbSearchTourId(encodeURIComponent(id));
  if(temp.length==0){
        return false;
      }else if(temp.length!=0){
        return true;
      }else{
        alert("Error!!!");
        return true;
      }
}
