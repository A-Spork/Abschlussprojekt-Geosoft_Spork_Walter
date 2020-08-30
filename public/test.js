/**
* @author Jana Walter, Adrian Spork
* @matrNr 459 762, 460 137
*/

"use strict";

QUnit.test("function test in HTML: function checkNames() ", function (assert)
{
var invalid0="";
var invalid1="Felix";
var valid0="Adrian";
var valid1="+++";


	// Test the distance
		assert.notOk (checkName(invalid0), "Empty name");
    assert.notOk (checkName(invalid1), "Unsupported name");
    assert.ok (checkName(valid0), "Perfekt name");
 		assert.ok (checkName(valid1), "Stupid but valid name");
});

	QUnit.test("function test in HTML: Geocoding API", function (assert)
	{
		var validAdressString="Geo1, Heisenbergstraße 2, 48149 Münster";
		var emptyAdressString="";
		var invalidAdressString="kwuoehtrf9w7z84rtp7nbw4ön9t7vaw978n34tb9nv8zwouthew4rot8zjg48tzg8ojzö458hz4z8üg34h8zü";
		var invalidKey="346";
		var validKey=""////////////////////////////////////insert a valid key for the LocationIQ here


		var validAnswer = {"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[51.969283,7.595589]}};
	// Test the geocoding API
    assert.ok (geocoding(invalidKey,invalidAdressString).error == "Invalid key", "invalid key, invalid adress");
		assert.ok (geocoding(invalidKey,validAdressString).error == "Invalid key", "invalid key, valid adress");
		assert.ok (geocoding(validKey,emptyAdressString).error == "Invalid Request", "valid key, empty adress. Valid key necessary");
		console.log(geocoding(validKey,invalidAdressString).error);
		assert.ok (geocoding(validKey,invalidAdressString).error == "Unable to geocode", "valid key, invalid adress. Valid key necessary");
		assert.ok (JSON.stringify(geocoding(validKey,validAdressString)) == JSON.stringify(validAnswer), "valid key, valid adress. Valid key necessary");
		assert.notOk ((geocoding(validKey,validAdressString).error) == "Unknown error - Please try again after some time", "API available");
});
