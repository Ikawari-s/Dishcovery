import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getRestaurants } from "../../api/restaurantsApi";

// Haversine formula to calculate distance in km
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

// Custom icons
const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1077/1077012.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -25],
});

const restaurantIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -25],
});

function NearMe() {
  const [restaurants, setRestaurants] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyRestaurants, setNearbyRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      const data = await getRestaurants();
      setRestaurants(data || []);
      setLoading(false);
    };

    fetchRestaurants();
  }, []);

  useEffect(() => {
    if (!restaurants.length) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(loc);

          // compute distances & filter within 10 km
          const withDistances = restaurants
            .filter((r) => r.location?.coordinates)
            .map((r) => {
              const [lat, lng] = r.location.coordinates;
              const distance = getDistanceFromLatLonInKm(
                loc.lat,
                loc.lng,
                lat,
                lng
              );
              return { ...r, distance };
            })
            .filter((r) => r.distance <= 10)
            .sort((a, b) => a.distance - b.distance);

          setNearbyRestaurants(withDistances);
        },
        (err) => {
          console.error("Error getting location:", err);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }, [restaurants]);

  if (loading) return <p>Loading restaurants...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Near Me (within 10km)</h2>
      {!userLocation ? (
        <p>Allow location access to see nearby restaurants.</p>
      ) : nearbyRestaurants.length === 0 ? (
        <p>No restaurants found within 10km of your location.</p>
      ) : (
        <>
          {/* List */}
          <ul className="mb-6">
            {nearbyRestaurants.map((r) => (
              <li key={r._id} className="mb-4 border p-2 rounded">
                <h3 className="font-semibold">{r.name}</h3>
                <p>{r.cuisine}</p>
                <p>
                  📍 {r.address.street}, {r.address.city}
                </p>
                <p>⭐ {r.rating}</p>
                <p>Distance: {r.distance.toFixed(2)} km</p>
                <img
                  src={r.image}
                  alt={r.name}
                  className="w-40 h-28 object-cover rounded"
                />
              </li>
            ))}
          </ul>

          {/* Map */}
          <MapContainer
            center={[userLocation.lat, userLocation.lng]}
            zoom={13}
            className="h-[400px] w-full rounded-lg shadow"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            />

            {/* User marker */}
            <Marker
              position={[userLocation.lat, userLocation.lng]}
              icon={userIcon}
            >
              <Popup>📍 You are here</Popup>
            </Marker>

            {/* Nearby restaurants */}
            {nearbyRestaurants.map((r) => (
              <Marker
                key={r._id}
                position={[
                  r.location.coordinates[0],
                  r.location.coordinates[1],
                ]}
                icon={restaurantIcon}
              >
                <Popup>
                  <strong>{r.name}</strong>
                  <br />⭐ {r.rating} | {r.cuisine}
                  <br />
                  {r.distance.toFixed(2)} km away
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </>
      )}
    </div>
  );
}

export default NearMe;
