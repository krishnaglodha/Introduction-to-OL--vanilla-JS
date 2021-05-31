// Map init
 var map = new ol.Map({
   layers: [
     new ol.layer.Tile({
       source: new ol.source.OSM({
         attributions:'Loaded map for skill share class'
       }),
     }),
   ],
   target: "map1",
     view: new ol.View({
       rotation:30,
     center: [0, 0],
     zoom: 2,
   }),
 });