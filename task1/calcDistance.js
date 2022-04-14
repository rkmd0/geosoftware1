"use strict"
/**
 * Geosoftware Abgabe 1
 * @author Erkam Dogan
 * @version 1.0.0
 */


//var's
var distancemeasurment = Array.apply(null, Array[cities.length]); // "temp" Array for the unsorted result of "calcDistanc"
var finishedcalc = ""; //creating a, for now, undefined var for future purposes

var longitude1 = point[0];
var latitude1 = point[1];

function distanceCalculator() {
  

  for(var i = 0; i < cities.length; i++){

    var latitude2 = cities[i][1]; //declaration of the lat and long points to start calc. the distance
    var longitude2 = cities[i][0];
    
    //iterating to calc. to calc. the distance for each city
    const R = 6371; //radius of earth in meter
    const φ1 = latitude1 * Math.PI/180; // φ, λ in radians
    const φ2 = latitude2 * Math.PI/180;
    const Δφ = (latitude2 - latitude1) * Math.PI/180;
    const Δλ = (longitude2 - longitude1) * Math.PI/180;
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ2) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = Math.round(R * c); //rounding up to get "better" values

    distancemeasurment[i] = d; //measuring the distances, array isnt sorted though
    
    
  }

  //function to sort array with insertionsort -> source: https://www.section.io/engineering-education/sorting-algorithms-in-js/#insertion-sort
  function insertionSort(arr){
    for(let i = 1; i < arr.length;i++){
        for(let j = i - 1; j > -1; j--){
            if(arr[j + 1] < arr[j]){
                [arr[j+1],arr[j]] = [arr[j],arr[j + 1]];

            }
        }
    };

  return arr;
}
   insertionSort(distancemeasurment) //starting the sorting




  // iterating through the array to add it as text with breakpoints
  for(var i2=0; i2<distancemeasurment.length; i2++){

    finishedcalc = finishedcalc + distancemeasurment[i2] + " km" + "<br />";
  }

}
distanceCalculator(); //starting the calc.
