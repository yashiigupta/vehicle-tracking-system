import axios from "axios";
import polyline from "@mapbox/polyline";

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search";
const OSRM_BASE_URL = "https://router.project-osrm.org/route/v1/driving";

export async function geocodeLocation(query) {
  const response = await axios.get(
    `${NOMINATIM_BASE_URL}?q=${encodeURIComponent(query)}&format=json`
  );
  if (response.data.length === 0) {
    throw new Error("Location not found");
  }
  return {
    latitude: parseFloat(response.data[0].lat),
    longitude: parseFloat(response.data[0].lon),
  };
}

export async function calculateRoute(origin, destination) {
  const originCoords = await geocodeLocation(origin);
  const destCoords = await geocodeLocation(destination);

  const response = await axios.get(
    `${OSRM_BASE_URL}/${originCoords.longitude},${originCoords.latitude};${destCoords.longitude},${destCoords.latitude}?overview=full&geometries=polyline`
  );

  if (!response.data.routes || response.data.routes.length === 0) {
    throw new Error("No route found");
  }

  const route = response.data.routes[0];
  const decodedPolyline = polyline.decode(route.geometry);
  const coordinates = decodedPolyline.map(([lat, lng]) => ({
    latitude: lat,
    longitude: lng,
  }));

  return {
    id: Date.now(),
    name: `${origin} to ${destination}`,
    date: new Date().toISOString(),
    coordinates,
    duration: route.duration,
    distance: route.distance,
  };
}