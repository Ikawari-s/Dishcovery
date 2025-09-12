import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import polyline from "@mapbox/polyline";
import "leaflet/dist/leaflet.css";

// Landmark icon
const landmarkIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [35, 35],
  iconAnchor: [17, 34],
  popupAnchor: [0, -28],
});

// User icon
const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1077/1077012.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -25],
});

function Map({ coordinates, name }) {
  const [userLocation, setUserLocation] = useState(null);
  const [route, setRoute] = useState(null);
  const LOCATIONIQ_KEY = process.env.REACT_APP_LOCATIONIQ_API_URL; // replace with your key
  const mapRef = useRef();

  // Get user location
  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (err) => {
        console.error("Error getting location:", err);
        alert("Unable to get your location. Please allow location access.");
      }
    );
  }, []);

  // Fetch directions from LocationIQ
  const handleGetDirections = async () => {
    if (!userLocation) {
      alert("User location not available yet.");
      return;
    }

    const url = `https://us1.locationiq.com/v1/directions/driving/${userLocation.lng},${userLocation.lat};${coordinates[1]},${coordinates[0]}?key=${LOCATIONIQ_KEY}&steps=true&alternatives=true&geometries=polyline&overview=full`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const points = polyline.decode(data.routes[0].geometry);
        setRoute(points);

        // Fit map to route bounds
        if (mapRef.current) {
          const bounds = L.latLngBounds(points);
          mapRef.current.fitBounds(bounds, { padding: [50, 50] });
        }
      } else {
        alert("No route found.");
      }
    } catch (err) {
      console.error(err);
      alert("Error fetching directions.");
    }
  };

  return (
    <div className="w-full">
      <div className="mb-2">
        <button
          onClick={handleGetDirections}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Get Directions
        </button>
      </div>

      {/* Map */}
      <div className="h-96 rounded-lg overflow-hidden shadow-lg">
        <MapContainer
          center={
            userLocation ? [userLocation.lat, userLocation.lng] : coordinates
          }
          zoom={15}
          className="w-full h-full"
          whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          />

          {/* Landmark marker */}
          <Marker position={coordinates} icon={landmarkIcon}>
            <Popup>{name || "Location"}</Popup>
          </Marker>

          {/* User marker */}
          {userLocation && (
            <Marker
              position={[userLocation.lat, userLocation.lng]}
              icon={userIcon}
            >
              <Popup>📍 You are here</Popup>
            </Marker>
          )}

          {/* Route polyline */}
          {route && <Polyline positions={route} color="blue" weight={5} />}
        </MapContainer>
      </div>
    </div>
  );
}

export default Map;
