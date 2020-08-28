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
	tours = await tourDbSearchUsername(username);
	await getLocation();
	//
	// await showMap();
	// showTable()
}

async function main2(){
		await showMap();
		showTable();
}




/**
* @function showMap -
*/

function showMap()
{
	if(tours.length==0) {
		alert("No Tour to display");
		return;
	}


	var map = L.map('mapSection').setView (position.geometry.coordinates, 15);
	L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
	{
		maxZoom: 18,
		attribution: 'Leaflet, OpenStreetMapContributors',
	}).addTo(map);
	var Empty = L.featureGroup();
	var LayerRiskLow=  L.featureGroup();
	var LayerRiskHigh=  L.featureGroup();
  var LayerBusstops = L.featureGroup().addTo(map);
	for (var i = 0; i < tours.length; i++)
	{
    var fillcolor;
    var color;
    if(tours[i].risk=="true"){
      fillcolor = "red";
      color = "red";
    }else if(tours[i].risk=="false"){
      fillcolor = "green";
      color = "green";
    }else{
      fillcolor = "pink";
      color = "cyan";
    }
		var Circle = L.circle ([tours[i].place[0].coordinates.lat,tours[i].place[0].coordinates.lng],{
			color:color,
			fillColor: fillcolor,
			fillOpacity: 0.9,
			radius: 10
		});
		Circle.bindPopup ("Busstop: "+tours[i].place[0].name);
		LayerBusstops.addLayer(Circle);
		if(tours[i].risk=="true"){
			LayerRiskHigh.addLayer(Circle);
		}else{
			LayerRiskLow.addLayer(Circle);
		}
	}

	// current position
	var temp = toGeoJSONPoint (JSON.parse ("[" + position.geometry.coordinates[1 ]+ "," + position.geometry.coordinates[0]+ "]"));
	var PositionMarker = L.geoJSON (temp).addTo(map);
	PositionMarker.bindPopup ("You are here!");
//
		var Layers =
		{
			 "Nothing" : Empty,
			 "All Tours": LayerBusstops,
			 "Tours with contact": LayerRiskHigh,
			 "Tours without contact":LayerRiskLow
		};
		L.control.layers(Layers).addTo(map);
		showTable();
		return;
}


function showTable(){

	var out = "";
 	for (var i = 0; i < tours.length; i++)
		{
			if(tours[i].risk=="true")
			{
				out += "<tr id = "+"red"+">\n" +  /////////"red" oder ..."+"red"+"...oder 'red'
				"\t\t\t<td id = \"date" + i + "\">" + tours[i].date + "</td>\n" +
				"\t\t\t<td id = \"departure" + i + "\">" + tours[i].place[0].name + "</td>\n" +
				"\t\t\t<td id = \"destination" + i + "\">" + tours[i].destination + "</td>\n" +
				"\t\t\t<td id = \"line" + i + "\">" + tours[i].line + "</td>\n" +
				"\t\t\t<td id = \"risk" + i + "\">" + tours[i].risk + "</td>\n" +
				"\t\t</tr>";
			}else{
				out += "<tr>\n" +
				"\t\t\t<td id = \"date" + i + "\">" + tours[i].date + "</td>\n" +
				"\t\t\t<td id = \"departure" + i + "\">" + tours[i].place[0].name + "</td>\n" +
				"\t\t\t<td id = \"destination" + i + "\">" + tours[i].destination + "</td>\n" +
				"\t\t\t<td id = \"line" + i + "\">" + tours[i].line + "</td>\n" +
				"\t\t\t<td id = \"risk" + i + "\">" + tours[i].risk + "</td>\n" +
				"\t\t</tr>";
			}
		}
document.getElementById("lastToursBody").innerHTML = out;
}


/**
* @function getLocation - Uses the geolocator to get the current position of the user for showPosition()
*/

function getLocation()
{
	if (navigator.geolocation)
	{
	 navigator.geolocation.getCurrentPosition (showPosition);
	 return;
	}
	else
	{
		alert("Geolocation is not supported by this browser");
		return;
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
