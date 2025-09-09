import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
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
  const [route, setRoute] = useState(null);
  const LOCATIONIQ_KEY = "YOUR_LOCATIONIQ_KEY"; // replace with your key

  if (!coordinates || coordinates.length !== 2) {
    return <p className="p-4 text-red-600">No location available</p>;
  }

  const handleGetDirections = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://us1.locationiq.com/v1/directions/driving/${longitude},${latitude};${coordinates[1]},${coordinates[0]}?key=${LOCATIONIQ_KEY}&steps=true&alternatives=true&geometries=polyline&overview=full`
          );
          const data = await response.json();

          if (data && data.routes && data.routes.length > 0) {
            // Decode polyline to LatLng array
            const polylinePoints = decodePolyline(data.routes[0].geometry);
            setRoute(polylinePoints);
          } else {
            alert("No route found.");
          }
        } catch (err) {
          console.error(err);
          alert("Error fetching directions.");
        }
      },
      () => {
        alert("Unable to get your location. Please allow location access.");
      }
    );
  };

  // Decode polyline string to LatLng array
  const decodePolyline = (encoded) => {
    let points = L.Polyline.fromEncoded(encoded).getLatLngs();
    return points;
  };

  return (
    <div className="w-full max-w-md h-96 rounded-lg overflow-hidden shadow-lg">
      <MapContainer center={coordinates} zoom={15} className="w-full h-full">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        />
        <Marker position={coordinates} icon={landmarkIcon}>
          <Popup>
            {name || "Location"} <br />
            <button
              onClick={handleGetDirections}
              className="mt-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Get Directions
            </button>
          </Popup>
        </Marker>

        {route && <Polyline positions={route} color="blue" />}
      </MapContainer>
    </div>
  );
}

export default Map;
