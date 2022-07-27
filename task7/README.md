</strong></h1>Aufgabe 7</strong></h1>
<h4>Authors:  Jonathan Mader, matr.Nr.: 502644 - Erkam Dogan, matr.Nr.: 508236</h4>

Our files for the 7th Assignment of the Geosoftware 1 course

The first website gives information about the busstops in Münster and lets the user get information about the time of depature,
the busline and the direction of the bus from a choosen busstop that is clicked on on the map.
It also allows you to choose a location that is stored in the database and lets you get information about the
nearest busstops, that would be the distance in kilometers, the busstop name, the direction and the coordinates.

The other website is a location creator, where the user can input new locations either by setting a marker on the map via leaflet drawm
enter a adress which will get converted to GeoJSON via forward geocoding or by using the browser location. These locations can also be updated
or deleted when they are stored in the mongoDB.

Link to the image on dockerhub: https://hub.docker.com/repository/docker/jonthnm/aufgabe7

<h2>Tutorial</h2>

For the forward geocoding you need a MapBox access Token at var access_token = "access Token" in /public/locationcreationmap

To start the application with Docker go to the terminal of your IDE and type the command <br>
$ docker-compose up

It will then take a while to download the services but after a few moments you are able to access mongo-express at 
http://localhost:8081/

and the html websites at <br>
http://localhost:5000/


(all this with given that docker is set up on your PC aswell as in your IDE etc.)
