/** Musterlösung zu Aufgabe 2, Geosoft 1, SoSe 2022
 * * with parts of the "Beispiellösung2 given in "https://www.uni-muenster.de/LearnWeb/learnweb2/mod/resource/view.php?id=2535714"
 * @author {Erkam Dogan}   matr.Nr.: {508236}
 */

 //****various jshint configs****
// jshint esversion: 8
// jshint browser: true
// jshint node: true
// jshint -W117
"use strict";

 //declaration of global variables
 var pointcloud = [];
 var point;
 var departureList;
 var haltestellen;
 
 
 /**
  * @function onLoad function that is executed when the page is loaded
  * @refresh refreses the page
  * @abstract
  */
 function onLoad() {
     document.getElementById("myGeoLocation").addEventListener("click",
     () => {
       var x = document.getElementById("userPosition");
       if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(showPosition);
         navigator.geolocation.getCurrentPosition(myGeoLocation);
       } else {
         x.innerHTML = "Geolocation is not supported by this browser.";
       }
     }
   );
   haltestellen.haltestellen(); //promise
 }


 
 //##############################################################################
 //## FUNCTIONS
 //##############################################################################
 
 /**
  * @function main function
  */
 function main(point, pointcloud) {
   //sort(method)/ 
   let results = sortByDistance(point, pointcloud);
   clearTable('depatureTable');
   drawTable(results);
   haltestellen.departure(results[0].id, 600);
 }
 
 /**
  * @function refresh
  * @desc is called when new coordinates are inserted. refreshes the data on the site
  */
 function refresh() {
   let positionGeoJSON = document.getElementById("userPosition").value;
 
   //remove all table rows
   var tableHeaderRowCount = 1;
   var table = document.getElementById('nextDepartureTable');
   var rowCount = table.rows.length;
   for (var i = tableHeaderRowCount; i < rowCount; i++) {
     table.deleteRow(tableHeaderRowCount);
   }
 
   try {
     positionGeoJSON = JSON.parse(positionGeoJSON);
     //check validity of the geoJSON. it can only be a point
     if (validGeoJSONPoint(positionGeoJSON)) {
       point = positionGeoJSON.features[0].geometry.coordinates;
       main(point, pointcloud);
     } else {
       alert("invalid input.please input a single valid point in a feature collection");
     }
   } catch (error) {
     console.log(error);
     alert("invalid input. see console for more info.");
   }
 }
 

 /* .then(response => {
    let res = response.json() // return a Promise as a result
    console.log(res)
    res.then(data => { // get the data in the promise result
    console.log(data)
    showNearbyPlaces(data.results.items)
    })
    }) */


 /** 
  * This class contains all methods that are used to communicate and get the data from the given API 
  * and a constructor for creating objects
  * @class
  */

 


 class BusAPI {
   /**
    * haltestellen
    * @public
    * @desc fills the pointcloud array with the response data from the api and calls the main method with it
    */
   async haltestellen() {
     const API_URL = "https://rest.busradar.conterra.de/prod";
     const response = await fetch(API_URL + '/haltestellen');
     const data = await response.json();
     pointcloud = data;
     main(point, pointcloud);
   }
   /**
    * @public
    * @desc method to retrieve upcoming departues from a given bus stop.
    * @param busStop busstop id for nearest bus stop
    * @param time in seconds
    */
   async departure(busStop, time) {
     let resource = `https://rest.busradar.conterra.de/prod/haltestellen/${busStop}/abfahrten?sekunden=`;
     resource += time;
 
     const response = await fetch(resource);
     const data = await response.json();
     departureList = data;
 
     drawDepatureTable(departureList);


   }
 }

 var haltestellen = new BusAPI();
 /**
  * timeConverter
  * @desc converts the given time in seconds (hh:mm:ss)
  * @source https://stackoverflow.com/questions/6312993/javascript-seconds-to-time-string-with-format-hhmmss
  * @param seconds time in seconds
  */
 function timeConverter(seconds) {
   var miliseconds = seconds * 1000 + (60000 * 120);
   var date = new Date(miliseconds)
   var readTime = date.toISOString().slice(11, -5);
 
   return readTime;
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
 
   for (let i = 0; i < pointArray.features.length; i++) {
     let distance = twoPointDistance(point, pointArray.features[i].geometry.coordinates);
     let j = 0;
     //Searches for the Place
     while (j < output.length && distance > output[j].distance) {
       j++;
     }
     let newPoint = {
       name: pointArray.features[i].properties.lbez,
       coordinates: pointArray.features[i].geometry.coordinates,
       distance: Math.round(distance),
       richtung: pointArray.features[i].properties.richtung,
       id: pointArray.features[i].properties.nr,
     };
     output.splice(j, 0, newPoint);
   }
 
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
  * @source https://stackoverflow.com/questions/3710204/how-to-check-if-a-string-is-a-valid-json-string
  * @param geoJSON the input JSON that is to be validated
  * @returns boolean true if okay, false if not
  */
 function validGeoJSONPoint(geoJSON) {
   if (geoJSON.features.length == 1 &&
     geoJSON.features[0].geometry.type.toUpperCase() == "POINT"
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
  * function clearTable
  * @desc removes all table entries and rows except for the header.
  * @param tableID the id of the table to clear
  */
 function clearTable(tableID) {
   //remove all table rows
   var tableHeaderRowCount = 1;
   var table = document.getElementById(tableID);
   var rowCount = table.rows.length;
   for (var i = tableHeaderRowCount; i < rowCount; i++) {
     table.deleteRow(tableHeaderRowCount);
   }
 }
 
 /**
  * @function drawTable
  * @desc inserts the calculated data into the table that's displayed on the page
  * @param {*} results array of JSON with contains
  */
 function drawTable(results) {
   var table = document.getElementById("nextDepartureTable");
   //creates the Table with the direction an distances
   for (var j = 0; j < 20; j++) {
     var newRow = table.insertRow(j + 1);
     var cel1 = newRow.insertCell(0);
     var cel2 = newRow.insertCell(1);
     var cel3 = newRow.insertCell(2);
     var cel4 = newRow.insertCell(3);
     cel1.innerHTML = results[j].name;
     cel2.innerHTML = results[j].coordinates;
     cel3.innerHTML = results[j].richtung;
     cel4.innerHTML = results[j].distance;
   }
 }
 /**
  * drawDepatureTable
  * @desc draws the table for the nearest bus stop containg the linienid as number
  * the direction as end stop and the actual depature time with date and time as YY:MM:DD:T:hh:mm:ss GMT
  * @param {*} results array of JSON with contains
  */
 function drawDepatureTable(results) {
   var table = document.getElementById("depatureTable");
   for (var j = 0; j < results.length; j++) {
     var newRow = table.insertRow(j + 1);
     var cel1 = newRow.insertCell(0);
     var cel2 = newRow.insertCell(1);
     var cel3 = newRow.insertCell(2);
     cel1.innerHTML = results[j].linienid;
     cel2.innerHTML = results[j].richtungstext;
     cel3.innerHTML = timeConverter(results[j].abfahrtszeit);
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
   let outJSON = {
     "type": "FeatureCollection",
     "features": []
   };
   //skelton of a valid Feature 
   let pointFeature = {
     "type": "Feature",
     "properties": {},
     "geometry": {
       "type": "Point",
       "coordinates": []
     }
   };
 
   //turn all the points in the array into proper features and append
   for (const element of inputArray) {
     let newFeature = pointFeature;
     newFeature.geometry.coordinates = element;
     outJSON.features.push(JSON.parse(JSON.stringify(newFeature)));
   }
 
   return outJSON;
 }
 
/*  *
  * @function showPosition
  * @desc Shows the position of the user in the textares
  * @param {*} position Json object of the user
  */
 function showPosition(position) {
   var x = document.getElementById("userPosition");
   //"Skeleton" of a valid geoJSON Feature collection
   let outJSON = {
     "type": "FeatureCollection",
     "features": []
   };
   //skelton of a Point
   let Feature_all = {
     "type": "Feature",
     "properties": {},
     "geometry": {
       "type": "Point",
       "coordinates": []
     }
   };
   Feature_all.geometry.coordinates = [position.coords.longitude, position.coords.latitude];
   //coords -> JSON.stringify
   outJSON.features.push(Feature_all);
   x.innerHTML = JSON.stringify(outJSON);
 }
 
 var map = L.map('mapid').setView([51.961, 7.618], 12);
 L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
   attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
 }).addTo(map);
 
 // user position (iconURL from an older project of mine (SAIM))
 var standortIcon = L.icon({
   iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
   iconSize: [10, 15], 
   iconAnchor: [0, 0], 
   popupAnchor: [15, 0] 
 });
 
 // bus stops position in marked area (iconURL from an older project of mine (SAIM))
 var busstopIcon = L.icon({
   iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
   iconSize: [10, 15], 
   iconAnchor: [0, 0], 
   popupAnchor: [15, 0] 
 });
 
 /**
  * myGeoLocation
  * @desc shows my Geolocations
  * @param position from My Location 
  * @return coordinates as text in pop up
  */
 function myGeoLocation(position) {
   var lat = position.coords.latitude;
   var lng = position.coords.longitude;
   var marker = L.marker([lat, lng], {
     icon: standortIcon
   }).addTo(map);
   marker.bindPopup("My Location is: " + lat + " " + lng);
   marker.openPopup();
 }
 
 var item = new L.FeatureGroup()
 var Control = new L.Control.Draw({
   draw: {
     polygon: false,
     marker: false,
     circle: false,
     polyline: false,
     circlemarker: false
   },
   edit: {
     featureGroup: item
   }
 })
 
 
 map.addLayer(item)
 map.addControl(Control)


 //lat = Math.floor(lat*1000+0.5)/1000; (dither 0.001)
 //drawing the polygon
 var polygon = [];
 map.on(L.Draw.Event.CREATED, (e) => {
   var type = e.layerType;
   var layer = e.layer;
   polygon = layer.toGeoJSON().geometry.coordinates;
   item.addLayer(layer);
   map.addLayer(layer);
    //var for check
   var busStopEqualsPolygon = sortByDistance(point, pointcloud); //calling the sort func 
   for (var i = 0; i < busStopEqualsPolygon.length; i++) {
 
     var poly = turf.polygon(polygon);
     var pt = turf.point(busStopEqualsPolygon[i].coordinates);
 
     //using turf.booleanPointInPolygon to control if the coords are in the polygon
     turf.booleanPointInPolygon(pt, poly)
     if (turf.booleanPointInPolygon(pt, poly) == true) { //yes, do:
       let marker = new L.marker([busStopEqualsPolygon[i].coordinates[1], busStopEqualsPolygon[i].coordinates[0]], {
         icon: busstopIcon
       }).addTo(map);
       //putting everything up on the popup
       marker.bindPopup("Name of bus stop: " + busStopEqualsPolygon[i].name + "<br> coordinates: " + busStopEqualsPolygon[i].coordinates +
         " <br> direction: " + busStopEqualsPolygon[i].richtung + "<br> distance: " + busStopEqualsPolygon[i].distance + " m")
 
     }
   }
 })