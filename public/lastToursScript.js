/**
* @author Jana Walter, Adrian Spork
* @matrNr 459 762, 460 137
*/

"use strict";

checkCookie("username");

// Global variables
var username;
var tours;
var position;

main();


/**
* @function main - The main - function of the website which gives the global variables values and starts the location search
*/

async function main()
{
	username = getCookie("username");
	tours = await tourDbSearchUsername(username);
	await getLocation();
}


/**
* @function main2 - Another main - function of the website, shows the map and the table with the last tours of the user
* @var temp - The result of the showMapLastTour - function
*/

async function main2()
{
	var temp = await showMapLastTour();
	if (temp != (-1))
	{
		document.getElementById("mapLastTours").style = "";
		showTableLastTours();
	}
}


/**
* @function showMapLastTour - Shows the map at the website
* @var map - The map with the view at the coordinates of the chosen startposition
* @var Empty - The empty layer which shows only the map
* @var LayerRiskLow - The layer which shows the tours with a low risk
* @var LayerRiskHigh - The layer which shows the tours with a high risk
* @var LayerBusstops - The layer which shows the tours
* @var fillColor - The fillcolor of the circles
* @var color - The bordercolor of the circles
* @var Circle - The circles which show the tours
* @var temp - The chosen position of the user
* @var PositionMarker - The marker with the chosen position of the user
* @var Layers - The complete layers in the layercontrol
* @return -1 - If there is no tour to display, the map and the table will not been shown
*/

function showMapLastTour()
{
	if(tours.length == 0)
	{
		alert("No Tour to display");
		return (-1);
	}

	var map = L.map('mapSection').setView (position.geometry.coordinates, 15);
	L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
	{
		maxZoom: 18,
		attribution: 'Leaflet, OpenStreetMapContributors',
	}).addTo(map);

	var Empty = L.featureGroup();
	var LayerRiskLow = L.featureGroup();
	var LayerRiskHigh = L.featureGroup();
	var LayerBusstops = L.featureGroup().addTo(map);
	for (var i = 0; i < tours.length; i++)
	{
		var fillcolor;
		var color;
		if(tours[i].risk == "true")
		{
			fillcolor = "#FF0040";
			color = "#FF0040";
		}
		else if(tours[i].risk == "false")
		{
			fillcolor = "#2EFE2E";
			color = "#2EFE2E";
		}
		else
		{
			fillcolor = "pink";
			color = "cyan";
		}
		var Circle = L.circle ([tours[i].place[0].coordinates.lat,tours[i].place[0].coordinates.lng],
		{
			color: color,
			fillColor: fillcolor,
			fillOpacity: 0.9,
			radius: 10
		});
		Circle.bindPopup("Busstop: " + tours[i].place[0].name);
		LayerBusstops.addLayer(Circle);
		if(tours[i].risk == "true")
		{
			LayerRiskHigh.addLayer(Circle);
		}
		else
		{
			LayerRiskLow.addLayer(Circle);
		}
	}

	// Current position
	var temp = toGeoJSONPoint (JSON.parse ("[" + position.geometry.coordinates[1] + "," + position.geometry.coordinates[0] + "]"));
	var PositionMarker = L.geoJSON (temp).addTo(map);
	PositionMarker.bindPopup ("You are here!");

	var Layers =
	{
		"Nothing": Empty,
		"All Tours": LayerBusstops,
		"Tours with contact": LayerRiskHigh,
		"Tours without contact": LayerRiskLow
	};
	L.control.layers(Layers).addTo(map);
	showTableLastTours();
	return;
}


/**
* @function showTableLastTours - Builds and diplays the table to show the saved tours. Colours based on risk of the tour
* @var out - The content of the table
*/

function showTableLastTours()
{
	document.getElementById("lastToursContainer").style = "width: 100%";
	document.getElementById("lastTours").style = "width: 100%";
	var out = "";
 	for (var i = 0; i < tours.length; i++)
	{
		console.log(getTime(getUnix(tours[i].date)).formattedTime);
		if(tours[i].risk=="true")
		{
			out += "<tr id = 'red'>\n" +
				"\t\t\t<td id = \"date" + i + "\">" + getTime(getUnix(tours[i].date)).formattedTime + "</td>\n" +
				"\t\t\t<td id = \"departure" + i + "\">" + tours[i].place[0].name + "</td>\n" +
				"\t\t\t<td id = \"destination" + i + "\">" + tours[i].destination + "</td>\n" +
				"\t\t\t<td id = \"line" + i + "\">" + tours[i].line + "</td>\n" +
				"\t\t\t<td id = \"risk" + i + "\">" + tours[i].risk + "</td>\n" +
				"\t\t</tr>";
		}
		else
		{
			out += "<tr id = 'green'>\n" +
				"\t\t\t<td id = \"date" + i + "\">" + getTime(getUnix(tours[i].date)).formattedTime + "</td>\n" +
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
		navigator.geolocation.getCurrentPosition(showPosition);
		return;
	}
	else
	{
		alert("Geolocation is not supported by this browser");
		return;
	}
}


/**
* @function showPosition - Saves the given position as position and shows it on the website
* @param position1 - The overgiven position
*/

function showPosition(position1)
{
	position = toGeoJSONPoint([position1.coords.latitude, position1.coords.longitude]);
}