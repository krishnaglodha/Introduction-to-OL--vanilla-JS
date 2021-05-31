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
  target: "map1",
  view: new ol.View({
    center: [0, 0],
    zoom: 2,
  }),
});

//CREATE TILE WMS LAYER
// create WMS source
var wmsSource = new ol.source.TileWMS({
  url: "http://localhost:8080/geoserver/topp/wms",
  params: { LAYERS: "topp:states" },
  serverType: 'geoserver',
});

// Create WMS Layer
var wmsLayer = new ol.layer.Tile({
  source: wmsSource,
});

// add layer to map
// map.addLayer(wmsLayer);

//CREATE IMAGE WMS LAYERS
//create image wms source 
var imgWmsSource = new ol.source.ImageWMS({
  url: "http://localhost:8080/geoserver/topp/wms",
  params: { LAYERS: "topp:states" },
  serverType: "geoserver",
});
//create image wms layer
var imgWmsLayer = new ol.layer.Image({
  source: imgWmsSource,
});
//add layer to the map
map.addLayer(imgWmsLayer)

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

map.addLayer(vectorLayer)

// CREATE HEATMAP
var heatmaplayer = new ol.layer.Heatmap({
  source:vectorSource
})
// map.addLayer(heatmaplayer)