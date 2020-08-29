/**
* @authors Adrian Spork and Jana Walter
*/

"use strict";

var point1 = [51.969508,7.595737];		// Geo
var point2 = [52.797913,7.225038];		// Adrian
var point3 = [51.92,7.67];				// Jana

QUnit.test("function Test in HTML: Distances ", function (assert)
{
	var deviation = 0.10;


	var distance1 = 0;						// Geo - Geo
	var distance2 = 95490;					// Geo - Adrian
	var distance3 = 7498;					// Jana - Geo


	// Test the distance
		assert.ok (getDistance (point1, point1) <= distance1 * (1 + deviation) && getDistance (point1, point1) >= distance1 * (1 - deviation), "Distance Geo to Geo");
    assert.ok (getDistance (point1, point2) <= distance2 * (1 + deviation) && getDistance (point1, point2) >= distance2 * (1 - deviation), "Distance Geo to Adrian");
    assert.ok (getDistance (point2, point1) <= distance2 * (1 + deviation) && getDistance (point2, point1) >= distance2 * (1 - deviation), "Distance Adrian to Geo");
 		assert.ok (getDistance (point3, point1) <= distance3 * (1 + deviation) && getDistance (point3, point1) >= distance3 * (1 - deviation), "Distance Jana to Geo");
});
	QUnit.test("function Test in HTML: Bearings", function (assert)
	{
		var bearing_1 = "North";
		var bearing_2 = "South";
		var bearing_3 = "Southeast";
		var bearing_4 = "Northwest";
	// Test the bearing
    assert.ok (getBearing (point1, point2) == bearing_1 || getBearing (point1, point2) == bearing_4, "Bearing Geo to Adrian");
    assert.ok (getBearing (point2, point1) == bearing_2 || getBearing (point2, point1) == bearing_3, "Bearing Adrian to Geo");
    assert.ok (getBearing (point1, point3) == bearing_2 || getBearing (point1, point3) == bearing_3, "Bearing Geo to Jana");
    assert.ok (getBearing (point3, point1) == bearing_1 || getBearing (point3, point1) == bearing_4, "Bearing Jana to Adrian");
});
