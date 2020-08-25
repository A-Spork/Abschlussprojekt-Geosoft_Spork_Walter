/**
* @author Jana Walter, Adrian Spork
* @matrNr 459 762, 460 137
*/

"use strict";
checkCookie("username");
var username;
var tours;
var position;
main();

async function main(){
	username = getCookie("username");
	console.log(username);
	tours = await tourDbSearchUsername(username);
	// tours = await tourDbSearchUsername("+++");
	console.log(tours);
	getLocation();
}


function showTable(){

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


   var LayerBusstops = L.featureGroup().addTo(map);
	for (var i = 0; i < tours.length; i++)
	{
    var fillcolor;
    var color;
    if(tours[i].risk==true){
        console.log("Rsikio HOCH!!!");
      fillcolor = "red";
      color = "red";
    }else if(tours[i].risk==false){
        console.log("Rsikio gering");
      fillcolor = "green";
      color = "green";
    }else{
      console.log("Rsikio unbekannt");
      fillcolor = "pink";
      color = "cyan";
    }
    console.log(tours.length);
    try{
console.log(tours[i].place[0].coordinates);
		var Circle = L.circle ([tours[i].place[0].coordinates.lat,tours[i].place[0].coordinates.lng],
		{
			color:color,
			fillColor: fillcolor,
			fillOpacity: 0.9,
			radius: 10
		});
		Circle.bindPopup ("Busstop: "+tours[i].place[0].name);
		LayerBusstops.addLayer(Circle);
  }catch(e){
    console.log("We found an user");
  }
	}

	// current position
	var temp = toGeoJSONPoint (JSON.parse ("[" + position.geometry.coordinates[1 ]+ "," + position.geometry.coordinates[0]+ "]"));
	var PositionMarker = L.geoJSON (temp).addTo(map);
	PositionMarker.bindPopup ("You are here!");
//
//
// //Heat
// 	var temp = Array(pointcloud_modified.features.length);
// 	for(var i = 0; i < temp.length ;i++){
//   temp[i]=[pointcloud_modified.features[i].geometry.coordinates[1],pointcloud_modified.features[i].geometry.coordinates[0]];
// 	}
// 		var Heat = L.heatLayer(temp);
// 		var BusstopsAndHeat = L.featureGroup();
// 		BusstopsAndHeat.addLayer(Heat);
// 		BusstopsAndHeat.addLayer(LayerBusstops);
		var Empty = L.featureGroup();
//
		var HeatLayer =
		{
			 Nothing : Empty,
			 Busstops: LayerBusstops
       // ,
		   // Heat: Heat,
			 // BusstopsAndHeat: BusstopsAndHeat
		};
		L.control.layers(HeatLayer).addTo(map);
}


/**
* @function getLocation - Uses the geolocator to get the current position of the user for showPosition()
*/

function getLocation()
{
	if (navigator.geolocation)
	{
	 navigator.geolocation.getCurrentPosition (showPosition);
	}
	else
	{
		// document.getElementById("Failure").innerHTML = "Geolocation is not suppoerted by this browser";
	}
}


/**
* @function showPosition - Saves the given position as point_modified and shows it on the webpage
*/

function showPosition (position1)
{
	 position = toGeoJSONPoint([position1.coords.latitude, position1.coords.longitude]);

}



function ChangeToAdd(){
window.location = "http://localhost:3000/public/addTour.html";
}
