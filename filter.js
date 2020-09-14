const fs = require('fs');
const turf = require('@turf/turf');
const argv = require('minimist')(process.argv.slice(2));
const inputFile = argv._[0];
let geojson = JSON.parse(fs.readFileSync(inputFile).toString());

let obj = {}
geojson.features = geojson.features.map(function (feature) {
  feature.properties.captured_at = (new Date(feature.properties.captured_at).getTime() / 1000);
  feature.properties.created_at = (new Date(feature.properties.created_at).getTime() / 1000);
  obj[feature.properties.key] = feature
  return feature;
});

function printCVS(sequences) {
  console.log(`image_key,sequence,cas,username,lon,lat`);
  let imgs = {};
  sequences.forEach(sequence => {
    for (let i = 0; i < sequence.properties.coordinateProperties.image_keys.length; i++) {
      if (
        sequence.properties.coordinateProperties.image_keys[i] &&
        sequence.geometry.coordinates[i]
      ) {
        imgs[sequence.properties.coordinateProperties.image_keys[i]] = `${
          sequence.properties.key
          },${
          sequence.properties.coordinateProperties.cas[i]
          },${sequence.properties.username},${sequence.geometry.coordinates[i].join(',')}`;
      }
    }
  });
  Object.keys(imgs).forEach(key => {
    console.log(`${key}, ${imgs[key]}`);
  });
}

printCVS(Object.values(geojson.features));
