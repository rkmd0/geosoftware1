"use strict"
/**
 * Geosoftware Abgabe 1
 * @author Erkam Dogan
 * @version 1.1.0
 */


 // title for our website (display and popup)
 document.title = "Assignment 2 By Erkam";
 alert(document.title);


 

//var's
var distancemeasurment = Array.apply(null, Array[pois.features.length]); // "temp" Array for the unsorted result of "calcDistanc"

/**
  *@function distanceCalculator
  *@desc calculates the distance between 2 points
  *@param NeuesPunkt
  */


//source for formula: https://www.movable-type.co.uk/scripts/latlong.html
function distanceCalculator(NeuesPunkt) {
    
  
  for(var i = 0; i < pois.features.length; i++){

    var latitude1 = NeuesPunkt.coordinates[1];
    var longitude1 = NeuesPunkt.coordinates[0];


    var latitude2 = pois.features[i].geometry.coordinates[1]; //declaration of the lat and long points to start calc. the distance
    var longitude2 = pois.features[i].geometry.coordinates[0];
    
    //iterating to calc. the distance for each city
    const R = 6371e3; //radius of earth
    const φ1 = latitude1 * Math.PI/180; // φ, λ in radians
    const φ2 = latitude2 * Math.PI/180;
    const Δφ = (latitude2 - latitude1) * Math.PI/180;
    const Δλ = (longitude2 - longitude1) * Math.PI/180;
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = Math.round(R * c); //rounding up to get "better" values

    distancemeasurment[i] = d; //measuring the distances, array isnt sorted though
    
    
  }
  insertionSort(distancemeasurment) //starting the sorting
  
  

  var finishedcalc = ""; //creating for now, undefined var for future purposes
  // iterating through the array to add it as text with breakpoints
  for(var i2=0; i2<distancemeasurment.length; i2++){

    finishedcalc = finishedcalc + distancemeasurment[i2] + " Meter" + "<br />";
  }
  
  document.getElementById("finishedcalc").innerHTML = finishedcalc
}
//distanceCalculator();
//function to sort array with insertionsort -> source: https://www.section.io/engineering-education/sorting-algorithms-in-js/#insertion-sort
//slightly changed to an arrow function

/**
  *@function insertionSort
  *@desc known sort algorithm
  *@param arr
  *@returns arr
  */


let insertionSort = (arr) => { 
  for(let i = 1; i < arr.length;i++){
      for(let j = i - 1; j > -1; j--){
          if(arr[j + 1] < arr[j]){
              [arr[j+1],arr[j]] = [arr[j],arr[j + 1]];

          }
      }
  };

return arr;
}


