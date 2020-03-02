const fs = require('fs');
const turf = require('@turf/turf');
var moment = require('moment');

let geojson = JSON.parse(fs.readFileSync('res.json').toString());

let obj = {}
geojson.features = geojson.features.map(function (feature) {

  feature.properties.captured_at = (new Date(feature.properties.captured_at).getTime() / 1000)
  feature.properties.created_at = (new Date(feature.properties.created_at).getTime() / 1000)

  obj[feature.properties.key] = feature
  return feature;
});

console.log(JSON.stringify(turf.featureCollection(Object.values(obj))));