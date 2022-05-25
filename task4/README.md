# task 4
Das Ziel dieser Aufgabe ist die Darstellung der Bushaltestellen auf
einer Karte. Hierfür werden externe Libraries verwendet (mehr dazu ¨
im Podcast 05).
Erweitert eure Seite um eine Leaflet-Karte (leafletjs.com/examples/quickstart), welche die Position der Bushaltestellen, sowie den Nutzerstandort anzeigt. Pop-ups sollen Informationen uber die jeweilige Haltestelle einhalten und die Entfernung zum Nutzerstandort zeigen.
Für alle API-Anfragen in dieser Ubung soll nun statt dem XHR- ¨
Objekt die fetch API (siehe Podcast 04) verwendet werden.
Das Anzeigen aller Bushaltestellen resultiert in einer großen Menge
von Markern. Implementiert die Möglichkeit, mit Leaflet-draw
(leaflet.github.io/Leaflet.draw) eine Bounding Box zu zeichnen, mit
welcher eine Auswahl von Bushaltestellen gewählt werden kann, welche alleine angezeigt werden. Verwendet die turf-js Library zur bestimmung der Haltestellen die sich in der Auswahlbox befinden (Beispiel:
turfjs.org/docs/#booleanPointInPolygon).


