import React, { useState } from "react";
import { forwardGeocode } from "../../services/locationServices";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

function Search() {
  const [location, setLocation] = useState("");
  const [results, setResults] = useState([]);

  const landmarkIcon = new L.Icon({
    iconUrl: "/images/pic.jpg", // path in public/
    iconSize: [32, 32], // size of the icon
    iconAnchor: [16, 32], // point of the icon which corresponds to marker’s location
    popupAnchor: [0, -32], // where popup should open relative to iconAnchor
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await forwardGeocode(location);
      if (data && data.length > 0) {
        setResults(data);
      } else {
        alert("No results found");
      }
    } catch (err) {
      console.error("Error fetching location:", err);
    }
  };

  return (
    <div>
      <h1>Search</h1>
      <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Angeles City"
          className="border p-2 rounded w-full text-black"
        />
        <button
          type="submit"
          className="mt-2 bg-blue-600 text-white p-2 rounded"
        >
          Search
        </button>
      </form>

      {results.length > 0 && (
        <div className="mt-4">
          <h2 className="font-semibold mb-2">Results:</h2>
          <ul className="space-y-2 mb-4">
            {results.map((place, index) => (
              <li
                key={index}
                className="border rounded p-2 bg-gray-50 dark:bg-gray-800"
              >
                <p>
                  <strong>Display Name:</strong> {place.display_name}
                </p>
                <p>
                  <strong>Latitude:</strong> {place.lat}
                </p>
                <p>
                  <strong>Longitude:</strong> {place.lon}
                </p>
              </li>
            ))}
          </ul>

          {/* Map */}
          <MapContainer
            center={[results[0].lat, results[0].lon]} // center on first result
            zoom={12}
            style={{ height: "400px", width: "100%" }}
          >
            {/* Base tiles */}
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />

            {/* Markers for each result */}
            {results.map((place, index) => (
              <Marker
                key={index}
                position={[place.lat, place.lon]}
                icon={landmarkIcon}
              >
                <Popup>
                  {place.display_name}
                  <br />
                  Lat: {place.lat}, Lon: {place.lon}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}
    </div>
  );
}

export default Search;
