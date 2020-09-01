/**
* @author Jana Walter, Adrian Spork
* @matrNr 459 762, 460 137
*/

"use strict";

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