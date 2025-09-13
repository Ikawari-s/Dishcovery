import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getRestaurants } from "../../api/restaurantsApi";
import Rating from "@mui/material/Rating";

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
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // landmark/building icon
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -25],
});

function NearMe() {
  const [restaurants, setRestaurants] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyRestaurants, setNearbyRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch restaurants from API
  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      const data = await getRestaurants();
      setRestaurants(data || []);
      setLoading(false);
    };

    fetchRestaurants();
  }, []);

  // Request user location
  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(loc);

          // compute nearby restaurants
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
          alert("Unable to get location. Please enable GPS in settings.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  if (loading) return <p>Loading restaurants...</p>;

  return (
    <div className="mt-24">
      <h2 className="text-4xl font-bold mb-4">Near Me (within 10km)</h2>

      {!userLocation ? (
        <div>
          <p className="mb-2">Click below to allow location access:</p>
          <button
            onClick={requestLocation}
            className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
          >
            Enable Location
          </button>
        </div>
      ) : nearbyRestaurants.length === 0 ? (
        <p>No restaurants found within 10km of your location.</p>
      ) : (
        <>
          <div className="flex justify-center my-6">
            <MapContainer
              center={[userLocation.lat, userLocation.lng]}
              zoom={13}
              className="h-[400px] w-[600px] rounded-lg shadow"
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
                    <strong
                      className="cursor-pointer text-blue-600 hover:underline"
                      onClick={() => navigate(`/restaurant/${r._id}`)}
                    >
                      {r.name}
                    </strong>
                    <br />⭐ {r.rating} | {r.cuisine}
                    <br />
                    {r.distance.toFixed(2)} km away
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
          <div
            class="flex items-center  p-4 text-sm text-gray-800 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-gray-300"
            role="alert"
          >
            <svg
              class="shrink-0 inline w-4 h-4 me-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <span class="sr-only">Info</span>
            <div>
              <span class="font-medium">Location not be accurate on PCs</span>
            </div>
          </div>
          <div className="flex justify-center">
            <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {nearbyRestaurants.map((r) => (
                <li key={r._id} className="shadow-xl bg-yellow-50 dark:bg-gray-800 rounded-lg p-2 transition-all duration-300 hover:bg-yellow-100 hover:dark:bg-gray-700 hover:-translate-y-1 min-h-80">
                  <img
                    src={r.image}
                    alt={r.name}
                    className="w-full h-28 object-cover rounded"
                  />
                  <h3 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">{r.name}</h3>
                  <p>{r.cuisine}</p>
                  <p>
                    📍 {r.address.street}, {r.address.city}
                  </p>
                  <div className="flex justify-center">
                    <Rating
                      name={`popup-rating-${r._id}`}
                      value={r.rating}
                      precision={0.5}
                      readOnly
                      size="small"
                    />
                    <p> {r.rating}</p>
                  </div>
                  <p>Distance: {r.distance.toFixed(2)} km</p>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default NearMe;
