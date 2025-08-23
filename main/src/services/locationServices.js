import axios from "axios";

const LOCATION_IQ_API_KEY = process.env.REACT_APP_LOCATION_IQ_API_KEY;

// Create an axios instance for LocationIQ
const locationAPI = axios.create({
  baseURL: "https://us1.locationiq.com/v1",
});

// Forward geocoding function
export const forwardGeocode = (query) =>
  locationAPI.get("/search", {
    params: {
      key: LOCATION_IQ_API_KEY,
      q: query,
      format: "json",
    },
  });
