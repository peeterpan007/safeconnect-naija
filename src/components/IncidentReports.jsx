import React, { useState, useEffect } from "react";
import { useIncident } from "./IncidentContext";
import { useUser } from "./UserContext";

export default function IncidentReports({ guest = false }) {
  const { addIncident, incidents } = useIncident();
  const { user } = useUser();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    state: "",
    lga: "",
    address: "",
    latitude: "",
    longitude: "",
    image: "",
  });

  const [locationPermission, setLocationPermission] = useState(false);

  const incidentTitles = [
    "Fire Outbreak",
    "Road Accident",
    "Flooding",
    "Building Collapse",
    "Crime or Robbery",
    "Public Disturbance",
    "Health Emergency",
    "Other",
  ];

  // Automatically detect geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData((prev) => ({
            ...prev,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          }));
          setLocationPermission(true);
        },
        () => setLocationPermission(false)
      );
    }
  }, []);

  // Handle changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Submit (allow empty fields)
  const handleSubmit = (e) => {
    e.preventDefault();

    const newIncident = {
      ...formData,
      id: Date.now(),
      user: user?.email || "Guest User",
      createdAt: new Date().toISOString(),
    };

    addIncident(newIncident);
    alert("Incident added successfully!");

    setFormData({
      title: "",
      description: "",
      state: "",
      lga: "",
      address: "",
      latitude: "",
      longitude: "",
      image: "",
    });
  };

  return (
    <div className="incident-report-container" style={{ padding: 16 }}>
      <h2 className="text-xl font-semibold mb-2">Report an Incident</h2>

      <form onSubmit={handleSubmit} className="incident-form">
        {/* Title Dropdown */}
        <label className="form-label">Incident Title</label>
        <select
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="form-input"
        >
          <option value="">-- Select Incident Type --</option>
          {incidentTitles.map((title) => (
            <option key={title} value={title}>
              {title}
            </option>
          ))}
        </select>

        {/* Description */}
        <label className="form-label">Description</label>
        <textarea
          name="description"
          placeholder="Describe the incident..."
          value={formData.description}
          onChange={handleChange}
          className="form-input"
        />

        {/* Location Info */}
        <label className="form-label">State</label>
        <input
          type="text"
          name="state"
          placeholder="Enter state"
          value={formData.state}
          onChange={handleChange}
          className="form-input"
        />

        <label className="form-label">LGA</label>
        <input
          type="text"
          name="lga"
          placeholder="Enter LGA"
          value={formData.lga}
          onChange={handleChange}
          className="form-input"
        />

        <label className="form-label">Address</label>
        <input
          type="text"
          name="address"
          placeholder="Enter address"
          value={formData.address}
          onChange={handleChange}
          className="form-input"
        />

        {/* Auto-location feedback */}
        <p className="text-sm text-gray-500 mt-1">
          {locationPermission
            ? `Location detected: ${formData.latitude}, ${formData.longitude}`
            : "Allow location access to automatically detect your position."}
        </p>

        {/* Image upload */}
        <label className="form-label">Attach Image (optional)</label>
        <input type="file" accept="image/*" name="image" onChange={handleChange} />

        <button type="submit" className="submit-btn mt-3">
          Add Incident
        </button>
      </form>

      {/* Existing incidents list */}
      <div className="incident-list mt-6">
        <h3 className="text-lg font-semibold mb-2">Recent Incidents</h3>
        {incidents.length === 0 ? (
          <p>No incidents reported yet.</p>
        ) : (
          <ul className="space-y-2">
            {incidents.map((incident) => (
              <li
                key={incident.id}
                className="border rounded-lg p-2 bg-gray-50 shadow-sm"
              >
                <strong>{incident.title || "Untitled Incident"}</strong>
                <p>{incident.description || "No description"}</p>
                <small>
                  {incident.state && incident.lga
                    ? `${incident.state}, ${incident.lga}`
                    : "No location"}
                </small>
                <br />
                <small>
                  Reported by:{" "}
                  {incident.user === "Guest User"
                    ? "Guest"
                    : incident.user}
                </small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
