import { useState, useEffect } from "react";
import axios from "axios";

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search";

export function useLocationSearch(query, debounceMs = 300) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let timeoutId;
    const controller = new AbortController();

    const fetchSuggestions = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!query.trim()) {
          setSuggestions([]);
          return;
        }

        const response = await axios.get(
          `${NOMINATIM_BASE_URL}?q=${encodeURIComponent(
            query
          )}&format=json&limit=5`,
          { signal: controller.signal }
        );

        setSuggestions(
          response.data.map((item) => ({
            place_id: item.place_id,
            display_name: item.display_name,
            lat: item.lat,
            lon: item.lon,
          }))
        );
      } catch (err) {
        if (err.name === "AbortError") return;
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    timeoutId = setTimeout(fetchSuggestions, debounceMs);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query, debounceMs]);

  return { suggestions, loading, error };
}
