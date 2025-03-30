// Set the Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhbm5pNDIiLCJhIjoiY201cjdmdmJxMDdodTJycHc2a3ExMnVqaiJ9.qKDYRE5K3C9f05Cj_JNbWA'; // Add default public map token from your Mapbox account


// Create a new map with Mapbox
const map = new mapboxgl.Map({
  container: 'my-map', // container id
  style: 'mapbox://styles/mapbox/standard-satellite',  // ****ADD MAP STYLE HERE *****
  center: [-79.39514670504386, 43.661694006349904],
  zoom: 12 // starting zoom
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
            'fill-color': '#FFFFFF',
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

let iso_data;

fetch('https://raw.githubusercontent.com/chann15/CANUE_School_Points/refs/heads/main/GeoJson_Isochrone_Data.geojson')
  .then(response => response.json())
  .then(response => {
    console.log(response); //Check response in console
    iso_data = response; // Store geojson as variable using URL from fetch response

  });

map.on('click', 'walking_map', (e) => {
    const properties = e.features[0].properties;
    const coordinates = e.lngLat;

    console.log(properties.Name);
    console.log(iso_data.features[1].properties.Name);
    console.log(iso_data.features[0].properties.Name === properties.Name);
    console.log(iso_data.features.length);
    
    let ARank;
    let Street_Name;
    let treeCanopy;
    let airPollution;
    let noiseLevel;
    let treeCount;
    let healthy_food;


    for (let i = 0; i < iso_data.features.length; i++) {
        console.log(iso_data.features[i].properties.Name);
        if (iso_data.features[i].properties.Name === properties.Name) {
            console.log(iso_data.features[i].properties.Name);
            console.log(properties.Name);

            ARank = iso_data.features[i].properties.Rank || "N/A";
            Street_Name = iso_data.features[i].properties.Name || "No school name available";
            treeCanopy = iso_data.features[i].properties.TCanmean || "N/A";
            airPollution = iso_data.features[i].properties.APmean || "N/A";
            noiseLevel = iso_data.features[i].properties.NPmean || "N/A";
            treeCount = iso_data.features[i].properties.Treepoint || "N/A";
            healthy_food = iso_data.features[i].properties.HFpoint || "N/A";
        }
    }

    const info = `
        <strong>${Street_Name} minute walk</strong><br>
        🏫 1B Rank: ${ARank}<br>
        🌳 Tree Canopy: ${treeCanopy} m²<br>
        🌫️ Air Pollution: ${airPollution} ppb<br>
        🔊 Noise Level: ${noiseLevel} dB<br>
        🌲 Tree Count: ${treeCount}<br>
        🥦 Healthy Food Outlets Count: ${healthy_food}<br>
    `;

    const description = `
        <div style="display: flex;">
            <div style="flex: 1;">
                ${info}
            </div>  
        </div>
    `;

    // Show the popup
    new mapboxgl.Popup({ className: 'walking-map-popup' })
        .setLngLat(coordinates)
        .setHTML(description)
        .addTo(map);
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
        🌫️ Air Pollution: ${airPollution} ppb<br>
        🔊 Noise Level: ${noiseLevel} dB<br>
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
                <b>Street View</b>
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

map.on('mouseenter', 'walking_map', () => {
    map.getCanvas().style.cursor = 'pointer';
});

// Change it back to a pointer when it leaves.
map.on('mouseleave', 'walking_map', () => {
    map.getCanvas().style.cursor = '';
});