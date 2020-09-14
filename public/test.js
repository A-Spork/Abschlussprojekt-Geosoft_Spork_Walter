/**
* @author Jana Walter, Adrian Spork
* @matrNr 459 762, 460 137
*/

"use strict";

QUnit.test("function test in HTML: function checkNames()", function(assert)
{
	// Test the checkNames function
	var invalid0 = "";
	var invalid1 = "Felix";
	var valid0 = "Adrian";
	var valid1 = "+++";

	assert.notOk(checkName(invalid0), "Empty name");
    assert.notOk(checkName(invalid1), "Unsupported name");
    assert.ok(checkName(valid0), "Perfect name");
 	assert.ok(checkName(valid1), "Stupid but valid name");
});

QUnit.test("function test in HTML: Geocoding - API", function(assert)
{
	// Test the Geolocation - API (LocationIQ)
	// Please insert your valid key in line 32!
	var validAdressString = "Geo1, Heisenbergstraße 2, 48149 Münster";
	var emptyAdressString = "";
	var invalidAdressString = "kwuoehtrf9w7z84rtp7nbw4ön9t7vaw978n34tb9nv8zwouthew4rot8zjg48tzg8ojzö458hz4z8üg34h8zü";
	var invalidKey = "346";
	var validAnswer = {"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[51.969283,7.595589]}};
	var validKey = geokey;

	assert.ok(geocoding(invalidKey, invalidAdressString).error == "Invalid key", "Invalid key, invalid adress");
	assert.ok(geocoding(invalidKey,validAdressString).error == "Invalid key", "Invalid key, valid adress");
	assert.ok(geocoding(validKey, emptyAdressString).error == "Invalid Request", "Valid key, empty adress. Valid key necessary");
	assert.ok(geocoding(validKey, invalidAdressString).error == "Unable to geocode", "Valid key, invalid adress. Valid key necessary");
	assert.ok(JSON.stringify(geocoding(validKey, validAdressString)) == JSON.stringify(validAnswer), "Valid key, valid adress. Valid key necessary");
	assert.notOk(geocoding(validKey, validAdressString).error == "Unknown error - Please try again after some time", "API available");
});
