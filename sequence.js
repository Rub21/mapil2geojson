const Promise = require('bluebird');
const cover = require('@mapbox/tile-cover');
const argv = require('minimist')(process.argv.slice(2));
const turf = require('@turf/turf');
const fs = require('fs');
const request = Promise.promisifyAll(require('request'), { multiArgs: true });

const client_id = process.env.CLIENT_ID || 'T1Fzd20xZjdtR0s1VDk5OFNIOXpYdzoxNDYyOGRkYzUyYTFiMzgz';
const inputFile = argv._[0];
const poly = JSON.parse(fs.readFileSync(inputFile));
const coverage = cover.geojson(poly.features[0].geometry, {
  min_zoom: argv.zoom || 14,
  max_zoom: argv.zoom || 14
});

const getResponses = async urls => {
  const requests = urls.map(u => fetch);
  const responses = await Promise.all(requests);
  return responses;
};

let urls = [];
for (let i = 0; i < coverage.features.length; i++) {
  const bbox = turf.bbox(coverage.features[i]);
  let url = `https://a.mapillary.com/v3/sequences?`;
  let props = [`client_id=${client_id}`, `bbox=${bbox}`];
  urls.push(url + props.join('&'));
}

Promise.map(urls, function (url) {
  return request.getAsync(url).spread(function (response, body) {
    return [JSON.parse(body), url];
  });
})
  .then(function (response) {
    sequences = response
      .map(res => {
        return res[0].features;
      })
      .flat(1);
    if (argv.output === 'csv') {
      printCVS(sequences);
    } else {
      printGeoJSON(turf.featureCollection(sequences))
    }
  })
  .catch(function (err) {
    console.log(err);
  });

function printCVS(sequences) {
  console.log(`image_key,sequence,username,lat,lon`);
  let imgs = {};
  sequences.forEach(sequence => {
    for (let i = 0; i < sequence.properties.coordinateProperties.image_keys.length; i++) {
      if (
        sequence.properties.coordinateProperties.image_keys[i] &&
        sequence.geometry.coordinates[i]
      ) {
        imgs[sequence.properties.coordinateProperties.image_keys[i]] = `${
          sequence.properties.key
          },${sequence.properties.username},${sequence.geometry.coordinates[i].join(',')}`;
      }
    }
  });
  Object.keys(imgs).forEach(key => {
    console.log(key, imgs[key]);
  });
}

function printGeoJSON(geojson) {
  let obj = {}
  geojson.features = geojson.features.map(function (feature) {
    feature.properties.captured_at = (new Date(feature.properties.captured_at).getTime() / 1000);
    feature.properties.created_at = (new Date(feature.properties.created_at).getTime() / 1000);
    obj[feature.properties.key] = feature
    return feature;
  });
  console.log(JSON.stringify(turf.featureCollection(Object.values(obj))));
}
