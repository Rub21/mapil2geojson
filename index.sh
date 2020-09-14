# !/usr/bin/env bash

#node index.js bbox_$1.geojson $1-rows.json --zoom 18

docker run --rm -v ${PWD}:/mnt/data developmentseed/geokit:latest geokit jsonlines2geojson $1-rows.json > $1.geojson

docker run --rm -v ${PWD}:/mnt/data developmentseed/geokit:latest geokit fc2csv $1.geojson > $1.csv

csvcut -c 8,10 $1.csv > $1-fixed.csv