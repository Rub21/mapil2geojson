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

// https://www.mapillary.com/developer/api-documentation/#map-feature-layers
// layers=trafficsigns,points,lines
let urls = [];
for (let i = 0; i < coverage.features.length; i++) {
  const bbox = turf.bbox(coverage.features[i]);
  let url = `https://a.mapillary.com/v3/map_features?`;
  let props = [`client_id=${client_id}`, `bbox=${bbox}`];
  if (argv.layers) props.push(`layers=${argv.layers}`);
  urls.push(url + props.join('&'));
}

Promise.map(urls, function(url) {
  return request.getAsync(url).spread(function(response, body) {
    return [JSON.parse(body), url];
  });
})
  .then(function(response) {
    results = response
      .map(res => {
        return res[0].features;
      })
      .flat(1);
    console.log(JSON.stringify(turf.featureCollection(results)));
  })
  .catch(function(err) {
    console.log(err);
  });
