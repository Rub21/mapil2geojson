# Mapillary objects to geojson

## Istall

```
git clone git@github.com:Rub21/mapillary2json.git
cd mapil2geojson/
npm link
```

## Usage

https://www.mapillary.com/developer/api-documentation/

- map_features

```

node map_features.js data/ayac.geojson --zoom=14 --layers=trafficsigns > map_features.geojson

```

- trafficsigns
- points
- lines

Return a geojson files of map features

```

node sequence.js data/ayac.geojson --zoom=16 > sequence.geojson

```

Returns a geojson file lines of sequence. add `--output=csv` if you want csv of all the sequence,image and geo coordinates

```
node sequence.js data/ayac.geojson  --zoom=16  --output=csv > sequence.csv
```