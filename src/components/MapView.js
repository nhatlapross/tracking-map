import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapView = () => {
  const [currentPosition, setCurrentPosition] = useState([51.505, -0.09]);
  const [destination, setDestination] = useState([51.515, -0.1]);
  const [route, setRoute] = useState([]);

  useEffect(() => {
    // Function to simulate real-time position updates
    const updatePosition = () => {
      // Update current position logic here
      // For example, move towards the destination
      const newPosition = [
        currentPosition[0] + (destination[0] - currentPosition[0]) * 0.01,
        currentPosition[1] + (destination[1] - currentPosition[1]) * 0.01,
      ];
      setCurrentPosition(newPosition);
      setRoute([...route, newPosition]);
    };

    const interval = setInterval(updatePosition, 1000);
    return () => clearInterval(interval);
  }, [currentPosition, destination, route]);

  return (
    <MapContainer center={currentPosition} zoom={13} style={{ height: '100vh' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={currentPosition} />
      <Marker position={destination} />
      <Polyline positions={route} color="blue" />
    </MapContainer>
  );
};

export default MapView;