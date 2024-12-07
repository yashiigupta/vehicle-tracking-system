import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, useMap } from 'react-leaflet';
import car from '../assets/orange-car.png';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const carIcon = new L.Icon({
  iconUrl: car,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 35],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const DEFAULT_CENTER = [20.5937, 78.9629]; // Center of India
const DEFAULT_ZOOM = 5;

function Map({ route, currentPosition }) {
  const positions = route?.coordinates.map((coord, index) => ({
    latLng: [coord.latitude, coord.longitude],
    key: `${coord.latitude}-${coord.longitude}-${index}`
  })) || [];
  const bounds = L.latLngBounds(positions.map(pos => pos.latLng));

  const MapPanner = () => {
    const map = useMap();
    useEffect(() => {
      if (positions.length > 0) {
        map.fitBounds(bounds);
      }
    }, [map, bounds]);
    return null;
  };

  return (
    <div style={{ height: '500px', width: '100%', position: 'relative' }}>
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        style={{ height: '100%', width: '100%', borderRadius: '8px' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {positions.length > 0 && (
          <>
            <Polyline positions={positions.map(pos => pos.latLng)} color="blue" />
            <Marker 
              position={[currentPosition.latitude, currentPosition.longitude]} 
              icon={carIcon}
              key={`current-${currentPosition.latitude}-${currentPosition.longitude}`}
            />
            <Marker position={positions[0].latLng} key={positions[0].key} />
            <Marker position={positions[positions.length - 1].latLng} key={positions[positions.length - 1].key} />
            <MapPanner />
          </>
        )}
      </MapContainer>
    </div>
  );
}

export default Map;