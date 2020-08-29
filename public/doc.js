/**
* @author Jana Walter, Adrian Spork
* @matrNr 459 762, 460 137
*/

"use strict";
var username;
var tours = [];


async function main(){
  username = document.getElementById("username").value;
  if(username!=""){
    if((await customerDbSearchUsernamePassword(username,"")).length==0){
      alert("User unknown!");
      return;
    }
  	tours = await tourDbSearchUsername(username);
    if(tours.length==0)
    {
      alert("No tours for this user available");
      return;
    }
    tours = timefilter();
    if(tours==-1)return;
    if(tours==[])
    {
      alert("No tours for this period available");
      return;
    }
		await showMap();
		showTable();

  }else{
    alert("Not a valid username");
  }

}




/**
* @function showMap -
*/

function showMap()
{
	if(tours.length==0) {
		console.log("No Tour to display");
		return;
	}


	var map = L.map('mapSection').setView (tours[0].place[0].coordinates, 15);
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
        "\t\t\t<td id = \"tourId" + i + "\">" + tours[i].tourId + "</td>\n" +
				"\t\t</tr>";
			}else{
				out += "<tr id = "+"green"+">\n" +
				"\t\t\t<td id = \"date" + i + "\">" + tours[i].date + "</td>\n" +
				"\t\t\t<td id = \"departure" + i + "\">" + tours[i].place[0].name + "</td>\n" +
				"\t\t\t<td id = \"destination" + i + "\">" + tours[i].destination + "</td>\n" +
				"\t\t\t<td id = \"line" + i + "\">" + tours[i].line + "</td>\n" +
				"\t\t\t<td id = \"risk" + i + "\">" + tours[i].risk + "</td>\n" +
        "\t\t\t<td id = \"tourId" + i + "\">" + tours[i].tourId + "</td>\n" +
				"\t\t</tr>";
			}
		}
document.getElementById("lastToursBodyDoc").innerHTML = out;
}



function timefilter(){

    var start = document.getElementById("startDate").value;
    var end = document.getElementById("endDate").value;

    if(start==""){
      start=Number.NEGATIVE_INFINITY;
    }else{
      if(isNaN(start)==true){
        start = getUnix(start);
      }
      else {
        start = JSON.parse(start);
      }
    }


    if(end==""){
      end=Number.POSITIVE_INFINITY;
    }else{
      if(isNaN(end)==true){
        end = getUnix(end);
      }
      else {
        end = JSON.parse(end);
      }
    }


    var a = false;
    if(isNaN(start)){
      alert("Start not a valid date");
      a=true;
    }
    if(isNaN(end)){
      alert("End not a valid date");
      a=true;
    }
    if(a==true){
      return -1;
    }else if(start>end)
    {
      alert("Start needs to be earlier than end");
      return -1;
    }
var filteredTours=[];
for(var i=0;i<tours.length;i++){
  if((getUnix(tours[i].date) >= start) && (getUnix(tours[i].date) <= end)){
    filteredTours[filteredTours.length]=tours[i];
  }
}
return filteredTours

}

/**
* @function getTime - Gets the time in unixseconds and gives it out as a readable time used for the departures of the busses
* @param unix - The overgiven time
* @var unix_timestamp - The overgiven time in unix - seconds
* @var date - Creates a new JavaScript Date object based on the timestamp multiplied by 1000 so that the argument is in milliseconds, not seconds
* @var hours - Hours part from the timestamp
* @var minutes - Minutes part from the timestamp
* @var seconds - Seconds part from the timestamp
* @var year - Years part from the timestamp
* @var month - Months part from the timestamp
* @var day - Days part from the timestamp
* @var formattedTime - Displays the time in "05.10.2020, 10:30:23" - format
* @return formattedTime - Returns the formatted time for the departure
* @source: https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript
*/

function getTime(unix)
{
	var unix_timestamp = unix;
	var date = new Date (unix_timestamp);

	var hours = date.getHours();
	var minutes = "0" + date.getMinutes();
	var seconds = "0" + date.getSeconds();
	var year = date.getFullYear();
	var month = date.getMonth();
	var day = date.getDate();

	var formattedTime = day + '.' + (month+1) + '.' + year + ', ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
  var time = {
    year:   year,
    month:  (month+1),
    day:    day,
    hour:   hours,
    minute: minutes,
    seconds:seconds,
    formattedTime: formattedTime
  };
	return time;
}

/**
* Calculates a timestring in ECMAScript 5 ISO-8601 Format + timezone into unixseconds
* @param timestring time in ECMAScript 5 ISO-8601 Format + timezone (e.g.: 2020-08-26T17:02:00+02:00)
* @return time in unixseconds
*/

function getUnix(timestring){
var timezone = timestring.substr(19,3);
var unix = Date.parse(timestring.substr(0,19))-(timezone*60*60*1000);
return unix;
}


function markSingle(){
  var id = document.getElementById("tour").value;
  for(var i=0;i<tours.length;i++){
    if(id==tours[i].tourId){
       mark(i);
       alert("Tour marked");
       location.reload();
      return;
    }
  }
  alert("TourId not valid");
}

 function markAll(){
  for(var i=0;i<tours.length;i++){
   mark(i);
  }
  alert("All Tours marked");
  location.reload();
  return;
}

function mark(i){
  if(tours[i].risk=="true"){
    return;
  }
  tourDbUpdate(i,true);
  contact(tours[i]);
return;
}



function clearSingle(){
  var id = document.getElementById("tour").value;
  for(var i=0;i<tours.length;i++){
    if(id==tours[i].tourId){
      clear(i);
      alert("Tour cleared");
      location.reload();
      return;
    }
  }
  alert("TourId not valid");
  return;
}


 function clearAll(){
  for(var i=0;i<tours.length;i++){
    clear(i);
  }
  alert("All Tours cleared");
  location.reload();
  return;
}


function clear(i){
  if(tours[i].risk=="false"){
    return;
  }
  tourDbUpdate(i,false);
  return;
}




async function contact(tour){
  var matches = await tourGetRequestMatch(tour.line, tour.destination, tour.place, tour.date, tour.category);/////await?!?!?!?
  for(var i = 0; i<matches.length;i++){
    if(matches[i].risk == "false"){

      deleteTour(matches[i].tourId);
      var input = {
        "tourId": matches[i].tourId,
        "category":matches[i].category,
        "line": matches[i].line,
        "destination": matches[i].destination,
        "date": matches[i].date,
        "risk": JSON.parse(true),
        "username": matches[i].username,
        "place":matches[i].place
      };
        try{
          await tourPostRequest(input);
        }
        catch(e){
          console.log("PostRequest broke");

        }
    }
  var temp = await( customerDbSearchUsernamePassword( matches[i].username,""));
  customerDbUpdate(matches[i].username,temp[0].password,true);
  }
}


async function tourDbUpdate(i,risk)
{
  deleteTour(tours[i].tourId);
  var input = {
    "tourId": tours[i].tourId,
    "category":tours[i].category,
    "line": tours[i].line,
    "destination": tours[i].destination,
    "date": tours[i].date,
    "risk": JSON.parse(risk),
    // "riskDate" : Date.now(),
    "username": tours[i].username,
    "place":tours[i].place
  };


    try{
      await tourPostRequest(input);
      return true;
    }
    catch(e){
      console.log("PostRequest broke");
      return false;
    }
}

function docLogOut(){
  window.location = "http://localhost:3000";
}
