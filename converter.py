import json

def convert_esri_to_geojson(input_file, output_file):
    with open(input_file, "r") as f:
        esri_json = json.load(f)
    
    geojson = {
        "type": "FeatureCollection",
        "features": []
    }
    
    for feature in esri_json.get("features", []):
        attributes = feature.get("attributes", {})
        geometry = feature.get("geometry", {})
        
        # Convert ESRI geometry (rings) to GeoJSON format (Polygon)
        if "rings" in geometry:
            geojson_geometry = {
                "type": "Polygon",
                "coordinates": geometry["rings"]
            }
        else:
            geojson_geometry = None
        
        geojson_feature = {
            "type": "Feature",
            "properties": attributes,
            "geometry": geojson_geometry
        }
        
        geojson["features"].append(geojson_feature)
    
    with open(output_file, "w") as f:
        json.dump(geojson, f, indent=4)
    
    print(f"Converted {input_file} to {output_file}")

# Example usage
convert_esri_to_geojson("Isochrone_data.json", "GeoJson_Isochrone_Data.geojson")
