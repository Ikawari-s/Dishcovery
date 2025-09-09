import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";

// Custom landmark icon
const landmarkIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [35, 35],
  iconAnchor: [17, 34],
  popupAnchor: [0, -28],
});

function Map() {
  const key = "pk.47e097faba068ad1f4f542818037bd7e";

  const start = [15.163700599999999, 120.61020063750719]; // Starting point
  const end = [15.13252305, 120.59019049856542]; // Landmark

  const [route, setRoute] = useState([]);

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const url = `https://us1.locationiq.com/v1/directions/driving/${start[1]},${start[0]};${end[1]},${end[0]}?key=${key}&overview=full&geometries=geojson`;

        const res = await axios.get(url);
        const coords = res.data.routes[0].geometry.coordinates;

        // Convert [lng, lat] → [lat, lng] for Leaflet
        const latlngs = coords.map((c) => [c[1], c[0]]);
        setRoute(latlngs);
      } catch (err) {
        console.error("Error fetching route:", err);
      }
    };

    fetchRoute();
  }, []);

  return (
    <div className="w-full max-w-md h-96 rounded-lg overflow-hidden shadow-lg">
      <MapContainer center={start} zoom={14} className="w-full h-full">
        <TileLayer
          url={`https://tile.openstreetmap.org/{z}/{x}/{y}.png?key=${key}`}
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> | <a href="https://locationiq.com/">LocationIQ</a>'
        />

        {/* Start marker */}
        <Marker position={start}>
          <Popup>📍 Start</Popup>
        </Marker>

        {/* End marker */}
        <Marker position={end} icon={landmarkIcon}>
          <Popup>🏛️ Landmark</Popup>
        </Marker>

        {/* Route line */}
        {route.length > 0 && (
          <Polyline positions={route} color="blue" weight={4} />
        )}
      </MapContainer>
    </div>
  );
}

export default Map;
