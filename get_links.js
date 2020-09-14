const fs = require('fs')
var argv = require('minimist')(process.argv.slice(2));
var file = argv._[0];
let geojson = JSON.parse(fs.readFileSync(file).toString());
geojson.features.forEach((feature, i) => {
    if ( i > -1 && i <= 5000  ) { 
        console.log(`wget https://images.mapillary.com/${feature.properties.image_key}/thumb-2048.jpg -O ${i}-${feature.properties.image_key}.jpg`);
    }
})
