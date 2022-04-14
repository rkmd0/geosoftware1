"use strict"

//console.log(cities[1]) //gustav meeeow
var distancemeasurment = Array.apply(null, Array[cities.length]); // "temp" Array for the unsorted result of "calcDistanc"
var finishedcalc = ""; //creating a, for now, undefined var for future purposes

function distanceCalculator() {
  

  var longitude1 = point[1];
  var latitude1 = point[0];

  for(var i = 0; i < cities.lenght; i++){

    var latitude2 = cities[i][1];
    var longitude2 = cities[i][0];
    
    
    const R = 6371e3; //radius of earth in meter
    const φ1 = latitude1 * Math.PI/180; // φ, λ in radians
    const φ2 = latitude2 * Math.PI/180;
    const Δφ = (latitude2 - latitude1) * Math.PI/180;
    const Δλ = (longitude2 - longitude1) * Math.PI/180;
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ2) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c; // in metres

    distancemeasurment[i] = d; //measuring the distances, array isnt sorted though
    

    console.log(distancemeasurment[i]);


    
  }
 
    
distancemeasurment.sort(function(a, b){ //sorting the
  return b - a});



  for(var k=0; k<distancemeasurment.length; k++){

    finishedcalc = finishedcalc + distancemeasurment[k] + "<br />";
  }

}
distanceCalculator();