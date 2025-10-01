import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useLoadScript,
} from "@react-google-maps/api";

// Map container styles
const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "8px",
  marginBottom: "20px",
};

// Default Nigeria center
const defaultCenter = {
  lat: 9.082,
  lng: 8.6753,
};

export default function IncidentMap({ incidents = [], currentIncident = null }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, // ✅ Your API key in .env
  });

  const [selectedIncident, setSelectedIncident] = useState(null);
  const [center, setCenter] = useState(defaultCenter);

  // Auto-center on latest incident
  useEffect(() => {
    if (currentIncident?.location) {
      setCenter({
        lat: currentIncident.location.latitude,
        lng: currentIncident.location.longitude,
      });
    } else if (incidents.length > 0) {
      const last = incidents[incidents.length - 1];
      if (last.location) {
        setCenter({
          lat: last.location.latitude,
          lng: last.location.longitude,
        });
      }
    }
  }, [currentIncident, incidents]);

  // Group incidents by state
  const groupedByState = incidents.reduce((groups, inc) => {
    if (!inc.state) return groups;
    if (!groups[inc.state]) groups[inc.state] = [];
    groups[inc.state].push(inc);
    return groups;
  }, {});

  if (loadError) return <p>Error loading maps</p>;
  if (!isLoaded) return <p>Loading Maps...</p>;

  return (
    <div>
      {/* Map */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={6}
      >
        {/* Render all incidents */}
        {incidents.map((inc) =>
          inc.location ? (
            <Marker
              key={inc.id}
              position={{
                lat: inc.location.latitude,
                lng: inc.location.longitude,
              }}
              onClick={() => setSelectedIncident(inc)}
              icon={{
                url:
                  currentIncident?.id === inc.id
                    ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                    : "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
              }}
            />
          ) : null
        )}

        {/* InfoWindow for selected incident */}
        {selectedIncident && (
          <InfoWindow
            position={{
              lat: selectedIncident.location.latitude,
              lng: selectedIncident.location.longitude,
            }}
            onCloseClick={() => setSelectedIncident(null)}
          >
            <div>
              <h4>{selectedIncident.title}</h4>
              <p>{selectedIncident.description}</p>
              <small>{selectedIncident.address}</small>
              <br />
              {selectedIncident.user && (
                <em>Reported by: {selectedIncident.user}</em>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Incident List by State */}
      <div style={{ marginTop: "20px" }}>
        <h3 style={{ color: "#066c4a" }}>Incidents by State</h3>
        {Object.keys(groupedByState).length === 0 ? (
          <p>No incidents reported yet.</p>
        ) : (
          Object.keys(groupedByState).map((state) => (
            <div key={state} style={{ marginBottom: "15px" }}>
              <h4 style={{ marginBottom: "5px", color: "#444" }}>{state}</h4>
              <ul style={{ paddingLeft: "20px" }}>
                {groupedByState[state].map((inc) => (
                  <li key={inc.id}>
                    <strong>{inc.title}</strong> — {inc.description} <br />
                    <small>{inc.address}</small>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
