/**
* Aufgabe 3, Geosoft 1, SoSe 2022
* @author Erkam Dogan  matr.Nr.: 508236
*/

"use strict";

//declaration of global variables
var tmpArrayForBusstations = [];
var point;
var nextBuststation;

/**
* @function onLoad function that is executed when the page is loaded
*/
function onLoad() {
  //event listener
  document.getElementById("refreshBtn").addEventListener("click",
    () => {
      refresh()
    }
  );
  document.getElementById("getLocationBtn").addEventListener("click",
    () => {
      var x = document.getElementById("userPosition");
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
      } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
      }
    }
  );

  //gets the Stations (initiator)
  getStations();
}



//##############################################################################
//## CLASSES
//##############################################################################



/**
 * @class Station
 * @desc object of a station with its attributes
 * @param {*} nr number of station
 * @param {*} name name of station
 * @param {*} richtung direction which it will drive to
 * @param {*} koordinaten coordinates for distance measurement
 * @param {*} aURL URL um die Abfahrten der Haltestelle in den nächsten 5 Minuten zu bekommen
 */
 class Station {
  constructor(nr, lbez, richtung, coordinates) {
        this.nr = nr;
        this.lbez = lbez;
        this.richtung = richtung;
        this.coordinates = coordinates;
        this.URL_GETTER = `https://rest.busradar.conterra.de/prod/haltestellen/${nr}/abfahrten?sekunden=600`;
  }

  
}

//##############################################################################
//## FUNCTIONS
//##############################################################################

/**
* @function main the main function
*/
function main(point, pointcloud) {
  //sort and publish
  let results = sortByDistance(point, pointcloud);
  GIVE_TABLE_FOR_RESULTS(results);
}

/**
* @function refresh
* @desc is called when new coordinates are inserted. refreshes the data on the site
*/
function refresh() {
  let positionGeoJSON = document.getElementById("userPosition").value;

  //remove all table rows
  var tableHeaderRowCount = 1;
  var table = document.getElementById('resultTable');
  var rowCount = table.rows.length;
  for (var i = tableHeaderRowCount; i < rowCount; i++) {
    table.deleteRow(tableHeaderRowCount);
  }

  try {
    positionGeoJSON = JSON.parse(positionGeoJSON);
    //check validity of the geoJSON. it can only be a point
    if (validGeoJSONPoint(positionGeoJSON)) {
      point = positionGeoJSON.features[0].geometry.coordinates;
      main(point, tmpArrayForBusstations);
    } else {
      alert("invalid input.please input a single valid point in a feature collection");
    }
  }
  catch (error) {
    console.log(error);
    alert("invalid input. see console for more info.");
  }
}

/**
* @function sortByDistance
* @desc takes a point and an array of points and sorts them by distance ascending
* @param point array of [lon, lat] coordinates
* @param pointArray array of points to compare to
* @returns Array with JSON Objects, which contain coordinate and distance
*/
function sortByDistance(point, pointArray) {
  let output = [];

  for (let i = 0; i < pointArray.length; i++) {
    let distance = twoPointDistance(point, pointArray[i].coordinates);
    let j = 0;
    //Searches for the Place
    while (j < output.length && distance > output[j].distance) {
      j++;
    }
    let newPOIS = {
      coordinates: pointArray[i].coordinates,
      distance: distance.toFixed(2),
      name: pointArray[i].lbez,
      richtung: pointArray[i].richtung,
      aURL: pointArray[i].aURL
    };
    
    output.splice(j, 0, newPOIS);
  }
  // saving the next station
  nextBuststation = output[0];

  // calc. the next departures
  getAbfahrten(nextBuststation);

  return output;
}

/**
* @function twoPointDistance
* @desc takes two geographic points and returns the distance between them. Uses the Haversine formula (http://www.movable-type.co.uk/scripts/latlong.html, https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula)
* @param start array of [lon, lat] coordinates
* @param end array of [lon, lat] coordinates
* @returns the distance between 2 points on the surface of a sphere with earth's radius
*/
function twoPointDistance(start, end) {
  //variable declarations
  var earthRadius; //the earth radius in meters
  var phi1;
  var phi2;
  var deltaLat;
  var deltaLong;

  var a;
  var c;
  var distance; //the distance in meters

  //function body
  earthRadius = 6371e3; //Radius
  phi1 = toRadians(start[1]); //latitude at starting point. in radians.
  phi2 = toRadians(end[1]); //latitude at end-point. in radians.
  deltaLat = toRadians(end[1] - start[1]); //difference in latitude at start- and end-point. in radians.
  deltaLong = toRadians(end[0] - start[0]); //difference in longitude at start- and end-point. in radians.

  a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) + Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLong / 2) * Math.sin(deltaLong / 2);
  c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  distance = earthRadius * c;

  return distance;
}

/**
* @function validGeoJSONPoint
* @desc funtion that validates the input GeoJSON so it's only a point
* @param geoJSON the input JSON that is to be validated
* @returns boolean true if okay, false if not
*/
function validGeoJSONPoint(geoJSON) {
  if (geoJSON.features.length == 1
    && geoJSON.features[0].geometry.type.toUpperCase() == "POINT"
  ) {
    return true;
  } else {
    return false;
  }
}

/**
* @function toRadians
* @desc helping function, takes degrees and converts them to radians
* @returns a radian value
*/
function toRadians(degrees) {
  var pi = Math.PI;
  return degrees * (pi / 180);
}

/**
* @function toDegrees
* @desc helping function, takes radians and converts them to degrees
* @returns a degree value
*/
function toDegrees(radians) {
  var pi = Math.PI;
  return radians * (180 / pi);
}

/**
 * @function GIVE_TABLE_FOR_RESULTS
 * @desc Giving out the next 10 busstations.
 * @param {*} results array of JSON with contains
 */
function GIVE_TABLE_FOR_RESULTS(results) {
  var table = document.getElementById("resultTable");
  //creates the Table with the 
  for (var j = 0; j < 10; j++) {
    var newRow = table.insertRow(j + 1);
    var cel1 = newRow.insertCell(0);
    var cel2 = newRow.insertCell(1);
    var cel3 = newRow.insertCell(2);
    var cel4 = newRow.insertCell(3);
    cel1.innerHTML = results[j].coordinates;
    cel2.innerHTML = results[j].name;
    cel3.innerHTML = results[j].richtung;
    cel4.innerHTML = results[j].distance;
  }
}

/**
 * @function TIME_FOR_DEPARTURE()
 * @desc sets the results in zable format
 * @param {*} responseArray Array of the attributes (table)
 */
function TIME_FOR_DEPARTURE(responseArray) {
  var table = document.getElementById("RESULT_OF_DEPART");
  for ( var j = 0; j < responseArray.length; j++) {
    var newRow = table.insertRow(j + 1);
    var cel1 = newRow.insertCell(0);
    var cel2 = newRow.insertCell(1);
    var cel3 = newRow.insertCell(2);
    var cel4 = newRow.insertCell(3);
    cel1.innerHTML = responseArray[j].linienid;
    cel2.innerHTML = responseArray[j].lbez;
    cel3.innerHTML = responseArray[j].richtungstext;
    cel4.innerHTML = LEFT_TIME(responseArray[j].ankunftszeit);
  }
}

/**
* @function arrayToGeoJSON
* @desc function that converts a given array of points into a geoJSON feature collection.
* @param inputArray Array that is to be converted
* @returns JSON of a geoJSON feature collectio
*/
function arrayToGeoJSON(inputArray) {
  //"Skeleton" of a valid geoJSON Feature collection
  let outJSON = { "type": "FeatureCollection", "features": [] };
  //skelly of a (point)feature
  let pointFeature = { "type": "Feature", "properties": {}, "geometry": { "type": "Point", "coordinates": [] } };

  //turn all the points in the array into proper features and append
  for (const element of inputArray) {
    let newFeature = pointFeature;
    newFeature.geometry.coordinates = element;
    outJSON.features.push(JSON.parse(JSON.stringify(newFeature)));
  }

  return outJSON;
}

/**
 * @function showPosition
 * @desc Shows the position of the user in the textares
 * @param {*} position Json object of the user
 */
function showPosition(position) {
  var x = document.getElementById("userPosition");
  //"Skeleton" of a valid geoJSON Feature collection
  let outJSON = { "type": "FeatureCollection", "features": [] };
  //skelly of a (point)feature
  let pointFeature = {"type": "Feature","properties": {},"geometry": {"type": "Point","coordinates": []}};
  pointFeature.geometry.coordinates = [position.coords.longitude, position.coords.latitude];
  //add the coordinates to the geoJson
  outJSON.features.push(pointFeature);
  x.innerHTML = JSON.stringify(outJSON);
}

/**
 * @function getHaltestellen
 * @description creating station-getter with XHR Request
 * @source https://youtu.be/4K33w-0-p2c
 */
function getStations() {
  let xhr = new XMLHttpRequest; 
  xhr.open('Get', 'https://rest.busradar.conterra.de/prod/haltestellen',true);
  xhr.onload = () => {
    if (xhr.status >= 400) {
      reject(response);
    } else {
      let res = JSON.parse(xhr.response);
      for (var i = 0; i < res.features.length; i++) {
        tmpArrayForBusstations[i] = new Station(
          res.features[i].properties.nr,
          res.features[i].properties.lbez, 
          res.features[i].properties.richtung, 
          res.features[i].geometry.coordinates
        )
      }
      main(point, tmpArrayForBusstations);
    }
  }
  xhr.send()
}

/**
 * @function getAbfahrten()
 * @description departure of the busstation through a XHR Request
 * @param {*} NEXT_STATION next departures 
 */
function getAbfahrten(NEXT_STATION) {
  let xhr2 = new XMLHttpRequest;
  xhr2.open('Get', NEXT_STATION.aURL , true);
  xhr2.onload = () => {
    if (xhr2.status >= 400) {
      reject(response);
    } else {
      let res = JSON.parse(xhr2.response);
      let message = "";
      if(res.length > 0) {
        message = 'Those are the soon to come busses ' + NEXT_STATION.name + ':';
        document.getElementById('AbfahrtVon').innerHTML = message;
        TIME_FOR_DEPARTURE(res);
      } else {
        message = "No new busses from this station: " + NEXT_STATION.name + ".";
        document.getElementById('AbfahrtVon').innerHTML = message;
      }
    }
  }
  xhr2.send();
}

/**
 * @function LEFT_TIME()
 * @description calculating the left time for the next bus
 * @param {*} seconds 
 * @returns Message String that tells the LEFT_TIME
 */
function LEFT_TIME(seconds) {
  var CURRENT_DATE = new Date();
  CURRENT_DATE = CURRENT_DATE.getTime() / 1000;
  var LEFT_TIME_FOR_B = seconds - CURRENT_DATE;
  var LEFT_TIME_FOR_B_IN_MINUTES = Math.floor(LEFT_TIME_FOR_B / 60);
  var LEFT_TIME_FOR_B_IN_SECONDS = Math.round(LEFT_TIME_FOR_B % 60);
  var FINAL_LEFT_TIME = LEFT_TIME_FOR_B_IN_MINUTES + "Min " + LEFT_TIME_FOR_B_IN_SECONDS + "Sec";
  return FINAL_LEFT_TIME
}
