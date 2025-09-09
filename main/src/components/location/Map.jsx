import React, { useState, useEffect } from "react";
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

// User icon
const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1077/1077012.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -25],
});

function Map({ coordinates, name }) {
  const [route, setRoute] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const LOCATIONIQ_KEY = "YOUR_LOCATIONIQ_KEY"; // replace with your key

  // Get user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
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
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }, []);

  const handleGetDirections = async () => {
    if (!userLocation) {
      alert("User location not available yet.");
      return;
    }

    try {
      const response = await fetch(
        `https://us1.locationiq.com/v1/directions/driving/${userLocation.lng},${userLocation.lat};${coordinates[1]},${coordinates[0]}?key=${LOCATIONIQ_KEY}&steps=true&alternatives=true&geometries=polyline&overview=full`
      );
      const data = await response.json();

      if (data && data.routes && data.routes.length > 0) {
        const polylinePoints = decodePolyline(data.routes[0].geometry);
        setRoute(polylinePoints);
      } else {
        alert("No route found.");
      }
    } catch (err) {
      console.error(err);
      alert("Error fetching directions.");
    }
  };

  // Decode polyline string to LatLng array
  const decodePolyline = (encoded) => {
    // simple polyline decoder without plugins
    const coords = [];
    let index = 0,
      lat = 0,
      lng = 0;

    while (index < encoded.length) {
      let b,
        shift = 0,
        result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      coords.push([lat / 1e5, lng / 1e5]);
    }

    return coords;
  };

  if (!coordinates || coordinates.length !== 2) {
    return <p className="p-4 text-red-600">No location available</p>;
  }

  return (
    <div className="w-full max-w-md h-96 rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={
          userLocation ? [userLocation.lat, userLocation.lng] : coordinates
        }
        zoom={15}
        className="w-full h-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        />

        {/* Landmark marker */}
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
        {route && <Polyline positions={route} color="blue" />}
      </MapContainer>
    </div>
  );
}

export default Map;
