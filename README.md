# Mapillary objects to JSON

Script for getting mapillary features in a JSON files for an area

## Install

```
git clone git@github.com:Rub21/mapillary2json.git
cd mapil2geojson/
npm link
```

## Usage

```
export MAPILLARY_CLIENT_ID=xyz...
mapillary2json <imput file> <output file> <opts>
```

e.g

```
mapillary2json map.geojson output.json --zoom 15
cat output.json | jq '{"type":"FeatureCollection","features":.}' --slurp -c  > output.geojson
```
