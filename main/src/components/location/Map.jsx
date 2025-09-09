import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom landmark icon
const landmarkIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [35, 35],
  iconAnchor: [17, 34],
  popupAnchor: [0, -28],
});

function Map({ coordinates, name }) {
  const key = "pk.47e097faba068ad1f4f542818037bd7e";

  if (!coordinates || coordinates.length !== 2) {
    return <p className="p-4 text-red-600">No location available</p>;
  }

  return (
    <div className="w-full max-w-md h-96 rounded-lg overflow-hidden shadow-lg">
      <MapContainer center={coordinates} zoom={15} className="w-full h-full">
        <TileLayer
          url={`https://tile.openstreetmap.org/{z}/{x}/{y}.png?key=${key}`}
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> | <a href="https://locationiq.com/">LocationIQ</a>'
        />

        {/* Restaurant marker */}
        <Marker position={coordinates} icon={landmarkIcon}>
          <Popup>{name || "Restaurant"}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default Map;
