import React, { useState, useEffect } from "react";
import { Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";

// Marker icon
const greenIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/190/190411.png", // green pin
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const redIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/190/190406.png", // red pin
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function DraggableMarker({ incident, setIncident, locationConfirmed, setLocationConfirmed }) {
  const [position, setPosition] = useState(
    incident.location
      ? [incident.location.latitude, incident.location.longitude]
      : [9.0820, 8.6753] // default center
  );

  const map = useMapEvents({
    click(e) {
      if (!locationConfirmed) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        setIncident((prev) => ({
          ...prev,
          location: { latitude: lat, longitude: lng },
          address: "Fetching...",
        }));
        reverseGeocode(lat, lng);
      }
    },
  });

  useEffect(() => {
    if (incident.location) {
      setPosition([incident.location.latitude, incident.location.longitude]);
    }
  }, [incident.location]);

  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      setIncident((prev) => ({
        ...prev,
        address: data.display_name || "Address not found",
      }));
    } catch (err) {
      console.error(err);
      setIncident((prev) => ({ ...prev, address: "Address fetch failed" }));
    }
  };

  return (
    <Marker
      draggable={!locationConfirmed}
      position={position}
      icon={locationConfirmed ? greenIcon : redIcon}
      eventHandlers={{
        dragend: (e) => {
          const { lat, lng } = e.target.getLatLng();
          setPosition([lat, lng]);
          setIncident((prev) => ({
            ...prev,
            location: { latitude: lat, longitude: lng },
            address: "Fetching...",
          }));
          reverseGeocode(lat, lng);
        },
      }}
    >
      <Popup>
        {locationConfirmed
          ? "Location Confirmed ✅"
          : "Drag or click to select incident location 📍"}
      </Popup>
    </Marker>
  );
}

export default DraggableMarker;
