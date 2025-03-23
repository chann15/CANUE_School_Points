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
            'fill-color': [
                'case',
                ['==', ['get', 'Rank1A'], 1], '#00FF00', // Green for Rank 1
                ['==', ['get', 'Rank1A'], 2], '#ADFF2F', // Green-yellow for Rank 2
                ['==', ['get', 'Rank1A'], 3], '#FFFF00', // Yellow for Rank 3
                ['==', ['get', 'Rank1A'], 4], '#FFD700', // Gold for Rank 4
                ['==', ['get', 'Rank1A'], 5], '#FFA500', // Orange for Rank 5
                ['==', ['get', 'Rank1A'], 6], '#FF8C00', // Dark orange for Rank 6
                ['==', ['get', 'Rank1A'], 7], '#FF4500', // Orange-red for Rank 7
                ['==', ['get', 'Rank1A'], 8], '#FF0000', // Red for Rank 8
                ['==', ['get', 'Rank1A'], 9], '#8B0000', // Dark red for Rank 9
                ['==', ['get', 'Rank1A'], 10], '#800080', // Purple for Rank 10
                '#808080' // Default color (Gray) if no rank is found
            ],
            'fill-opacity': 0.6
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
    const ARank = properties.Rank1A || "N/A";
    const schoolName = properties.SITE_NAME || "No school name available";
    const treeCanopy = properties.TreeCanM || "N/A";
    const airPollution = properties.AirPolMea || "N/A";
    const noiseLevel = properties.NoiseMean || "N/A";
    const treeCount = properties.TreeCoun || "N/A";

    // Create the popup content
    const info = `
        <strong>${schoolName}</strong><br>
        🏫 1A Rank: ${ARank}<br>
        🌳 Tree Canopy: ${treeCanopy} m²<br>
        🌫️ Air Pollution: ${airPollution}<br>
        🔊 Noise Level: ${noiseLevel}<br>
        🌲 Tree Count: ${treeCount}
    `;
    const image_info = `Pictures/${schoolName}.jpeg`; // No extra quotes
    console.log(image_info);

    const imageHtml = `
    <img src="${image_info}" alt="${schoolName}" style="width: 300px; height: auto;">
`;

    const description = `
        <div style="display: flex;">
            <div style="flex: 1;">
                ${info}
            </div>  
            <div style="flex: 1;">
                <b>${schoolName}</b>
                ${imageHtml}
            </div>
        </div>
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