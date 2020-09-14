#!/usr/bin/env node

'use strict';
var fs = require('fs');
var cover = require('@mapbox/tile-cover');
var argv = require('minimist')(process.argv.slice(2));
var turf = require('@turf/turf');
var request = require('request');
var inputFile = argv._[0];
var outputFile = argv._[1];
var opts = {};
for (var tag in argv) {
  if (tag !== '_') {
    opts[tag] = argv[tag];
  }
}
var poly = JSON.parse(fs.readFileSync(inputFile));
var limits = {
  min_zoom: opts.zoom || 14,
  max_zoom: opts.zoom || 14
};
var geojson = cover.geojson(poly.features[0].geometry, limits);
var urls = [];
for (var i = 0; i < geojson.features.length; i++) {
  var bbox = turf.bbox(geojson.features[i]);
  var url =
    'https://a.mapillary.com/v3/objects?client_id=T1Fzd20xZjdtR0s1VDk5OFNIOXpYdzoxNDYyOGRkYzUyYTFiMzgz&bbox=' +
    bbox.join(',');
  urls.push(url);
}
var k = 0;
//Lets check if the files exist
fs.exists(outputFile, function(exists) {
  if (!exists) {
    fs.writeFile(outputFile, '', function(err) {
      if (err) {
        console.error(err);
      }
    });
  } else {
    console.log('The file exists, the script will continue adding the outputs there.');
  }
});

// function getObjs (url) {
//   if (url) {
//     console.log('GET ' + (k + 1) + '/' + urls.length) // + ' ==>' + url
//     request(url, function (error, response, body) {
//       if (error) {
//         getObjs(urls[k])
//       } else {
//         var objTile = JSON.parse(body)
//         for (var i = 0; i < objTile.features.length; i++) {
//           if (objTile.features[i].properties && objTile.features[i].properties.value.indexOf('turn') > -1 && objTile.features[i].properties.value.indexOf('regulatory') > -1) {
//             fs.appendFile(outputFile, JSON.stringify(objTile.features[i]) + '\n', function (err) {
//               if (err) { console.error(err) }
//               console.log('added!')
//             })
//           }
//         }
//         k++
//         getObjs(urls[k])
//       }
//     })
//   }
// }
// getObjs(urls[k])
