var container = document.getElementById("popup");
var content = document.getElementById("popup-content");
var closer = document.getElementById("popup-closer");

var overlay = new ol.Overlay({
     element: container,
     autoPan: true,
     autoPanAnimation: {
       duration: 250,
     },
   });

     closer.onclick = function () {
       overlay.setPosition(undefined);
       closer.blur();
       return false;
     };
// Map init
var map = new ol.Map({
  layers: [
    new ol.layer.Tile({
      source: new ol.source.XYZ({
        attributions:
          'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' +
          'rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
        url:
          "https://server.arcgisonline.com/ArcGIS/rest/services/" +
          "World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
      }),
    }),
  ],
  overlays: [overlay],
  target: "map1",
  view: new ol.View({
    center: [0, 0],
    zoom: 2,
  }),
});

//CREATE TILE WMS LAYER
// create WMS source
var wmsSource = new ol.source.TileWMS({
  url: "https://ahocevar.com/geoserver/wms",
  params: { LAYERS: "ne:ne", TILED: true },
  serverType: "geoserver",
  crossOrigin: "anonymous",
});

// Create WMS Layer
var wmsLayer = new ol.layer.Tile({
  source: wmsSource,
});

// add layer to map
map.addLayer(wmsLayer);

// CREATE VECTOR LAYER FROM GEOJSON
var vectorSource = new ol.source.Vector({
  url: "data/airports.geojson",
  format: new ol.format.GeoJSON(),
});

var vectorLayer = new ol.layer.Vector({
  source: vectorSource,
  style: new ol.style.Style({
    image: new ol.style.Circle({
      fill: new ol.style.Fill({
        color: "rgba(255,0,0,1)",
      }),
      stroke: new ol.style.Stroke({
        color: "green",
        width: 2,
      }),
      radius: 2,
    }),
  }),
});

map.addLayer(vectorLayer);

// CREATE HEATMAP
var heatmaplayer = new ol.layer.Heatmap({
  source: vectorSource,
});
// map.addLayer(heatmaplayer)

//map.on click
// map.on('click', function (e) {
//   map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
//     console.log(feature)
//   });
//   console.log(e)
// })

map.on("click", function (e) {
  var flag_vectorFound = false
  map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
    console.log(feature);
    var name = feature.getProperties().name_en;
content.innerHTML = "<b>Airport Name : </b> " + name;
    overlay.setPosition(feature.getGeometry().getCoordinates());
    flag_vectorFound = true
  });
  if (!flag_vectorFound) {
    var viewResolution = /** @type {number} */ (map.getView().getResolution());
    var url = wmsSource.getGetFeatureInfoUrl(
      e.coordinate,
      viewResolution,
      "EPSG:3857",
      { INFO_FORMAT: "application/json" }
    );
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        var name = data.features[0].properties.admin
        content.innerHTML = "<b> Name : </b> " + name;
        overlay.setPosition(e.coordinate);
      })
      .catch((err) => console.log(err));
  }
});
