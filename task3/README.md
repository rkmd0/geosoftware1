# Aufgabenstellung-3

3 Web-APIs und Objektorientierte Programmierung
Konzepte: Web-APIs, Callback-Funktionen, Objektorientierte Programmierung, XHRRequests, JSDoc

Das Ziel dieser Aufgabe ist es, die Distanz vom Nutzerstandort zu den Bushaltestellen in der Umgebung,
und die Abfahrtszeiten der nächsten Bushaltestelle darzustellen.
Erweitert eure letzte Abgabe um das Abfragen der Standorte der münsteraner Bushaltestellen. Benutzt das XHR-Objekt
des Browsers um Anfragen an den Haltestellen-Endpunkt der web-API auf api.busradar.conterra.de zu stellen.
Anstelle des pois-Datensatzes soll die Seite nun die Entfernungen der Bushaltestellen zum Nutzerstandort anzeigen. 
Diese sollen Programmatisch von der Web-API heruntergeladen werden und auf der Seite dargestellt werden.
Erstellt zusätzlich eine weitere Anfrage auf die ”abfahrten”-ressource um für die nächstliegende Haltestelle Abfahrten 
und Abfahrtszeiten der nächsten 5 Minuten auf der Seite darzustellen.

technische Anforderungen:
• Erstellt mindestens eine Sinnvolle Klasse mit Sinnvollen Attributen und Methoden (Bsp.: Bushaltestellen-Klasse). Die Klasse
  soll verwendet werden um Objekte zu erstellen dessen Methoden Programm-intern verwendet werden, um die Anforderungen zu
  erfüllen. 
• Klassen und Funktionen sind im JSDoc-Format zu kommentieren.
  Informationen zu Objektorientierter Programmierung und XHRrequests gibt es im Podcast.
  
Hinweise zur Bewertung:
Bei dieser Aufgabe zählt auch die Effizienz bei der Nutzung des XHRObjekts, sowie die Robustheit der Anwendung. Achtet bitte darauf,
die gegebenen Web-APIs nicht mit zu vielen Anfragen zu überlasten.

# Additional Readme
For some reason (my own Hardware maybe?) the get location feature has inconsistent running time means that it sometimes needs significantly more time than it needs some other times. This was - as far as I know already a thing in the last task.
The Original site had some flaws that had to be changed for the site to work. Here I did some structural changes. The logic between the old and newer files remain the same (source, way of working and complexity).
Sadly, due to lack of time, there was no chance to excessively test the last part of the code.

