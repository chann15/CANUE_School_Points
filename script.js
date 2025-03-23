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

    map.addSource('school_sites', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/chann15/CANUE_School_Points/refs/heads/main/Data/10School_Sites.geojson'
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
        'id': 'school_sites',
        'type': 'fill',
        'source': 'school_sites',
        'paint': {
            'fill-color': '#f00',
            'fill-opacity': 0.6,
        }
    });
    map.addLayer({
        'id': 'school_sites_outline',
        'type': 'line',
        'source': 'school_sites',
        'paint': {
            'line-color': '#000', // Black outline
            'line-width': 2 // Thicker outline
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

map.on('click', 'school_sites', (e) => {
    const properties = e.features[0].properties;
    const coordinates = e.lngLat;

    // Extracting environmental data
    const schoolName = properties.SITE_NAME || "No school name available";
    const treeCanopy = properties.TreeCanM || "N/A";
    const airPollution = properties.AirPolMea || "N/A";
    const noiseLevel = properties.NoiseMean || "N/A";
    const treeCount = properties.TreeCoun || "N/A";

    // Create the popup content
    const description = `
        <strong>${schoolName}</strong><br>
        🌳 Tree Canopy: ${treeCanopy} m²<br>
        🌫️ Air Pollution: ${airPollution}<br>
        🔊 Noise Level: ${noiseLevel}<br>
        🌲 Tree Count: ${treeCount}
    `;

    // Show the popup
    new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(description)
        .addTo(map);
});



// Change the cursor to a pointer when the mouse is over the places layer.
map.on('mouseenter', 'school_sites', () => {
    map.getCanvas().style.cursor = 'pointer';
});

// Change it back to a pointer when it leaves.
map.on('mouseleave', 'school_sites', () => {
    map.getCanvas().style.cursor = '';
});