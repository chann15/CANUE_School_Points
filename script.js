// Set the Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhbm5pNDIiLCJhIjoiY201cjdmdmJxMDdodTJycHc2a3ExMnVqaiJ9.qKDYRE5K3C9f05Cj_JNbWA'; // Add default public map token from your Mapbox account


// Create a new map with Mapbox
const map = new mapboxgl.Map({
  container: 'my-map', // container id
  style: 'mapbox://styles/mapbox/standard-satellite',  // ****ADD MAP STYLE HERE *****
  center: [-79.39514670504386, 43.661694006349904],
  zoom: 13 // starting zoom
});

map.on('load', () => {
    // This adds the data that outlines the listings
    map.addSource('walking_map', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/chann15/CANUE_School_Points/refs/heads/main/Data/Tree_Canopy_5min_Walking.geojson'
    });
    map.addLayer({ 
        'id': 'walking_map',
        'type': 'fill',
        'source': 'walking_map',
        'paint': {
            'fill-color': '#088',
            'fill-opacity': 0.4,
        }
    });
    map.addLayer({
        'id': 'walking_map_outline',
        'type': 'line',
        'source': 'walking_map',
        'paint': {
            'line-color': '#000', // Black outline
            'line-width': 2 // Thicker outline
        }
    });


});


console.log(features[0]);


map.on('click', 'walking_map', (e) => {
    const coordinates = e.features[0].geometry.coordinates.slice();
    const description = e.features[0].properties.MEAN_Zonal;
    

    if (['mercator', 'equirectangular'].includes(map.getProjection().name)) {
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
    }

    new mapboxgl.Popup()
    .setLngLat(coordinates)
    .setHTML(description)
    .addTo(map);
});


// This changes the mouse icon
map.on('mouseenter', 'walking_map', () => {
    map.getCanvas().style.cursor = 'pointer';
});

// This changes the mouse icon
map.on('mouseleave', 'walking_map', () => {
    map.getCanvas().style.cursor = '';
});
