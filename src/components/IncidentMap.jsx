import React from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

function IncidentMap({ incidents = [], height = "400px" }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // Ensure your key is set
  });

  // Center map on first incident or default location
  const mapCenter =
    incidents.length > 0
      ? incidents[0].location
      : { lat: 6.5244, lng: 3.3792 }; // Default to Lagos

  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <GoogleMap
      center={mapCenter}
      zoom={6}
      mapContainerStyle={{ width: "100%", height }}
    >
      {incidents.map((incident, idx) => (
        <Marker
          key={idx}
          position={incident.location}
          title={incident.title}
        />
      ))}
    </GoogleMap>
  );
}

export default IncidentMap;
