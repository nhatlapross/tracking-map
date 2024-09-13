import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import customMarkerIcon from '../assets/car.svg';
import axios from 'axios';

const MapView = () => {
  const [currentPosition, setCurrentPosition] = useState([51.505, -0.09]);
  const [destination, setDestination] = useState([51.515, -0.1]);
  const [route, setRoute] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);

  const customIcon = L.icon({
    iconUrl: customMarkerIcon,
    iconSize: [38, 38], // size of the icon
    iconAnchor: [19, 38], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -38] // point from which the popup should open relative to the iconAnchor
  })

  useEffect(() => {
    const handlePositionUpdate = (position) => {
      const { latitude, longitude } = position.coords;
      const newPosition = [latitude, longitude];
      setCurrentPosition(newPosition);
      if (isDrawing) {
        setRoute((prevRoute) => [...prevRoute, newPosition]);
      }
    };

    const handleError = (error) => {
      console.error("Error getting position: ", error);
    };

    const watchId = navigator.geolocation.watchPosition(handlePositionUpdate, handleError, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, [isDrawing]);

  const handleStartStop = () => {
    if (isDrawing) {
      // Send route data to MongoDB
      // axios.post('/api/saveRoute', { route })
      //   .then(response => {
      //     console.log('Route saved:', response.data);
      //   })
      //   .catch(error => {
      //     console.error('Error saving route:', error);
      //   });
    }
    setIsDrawing(!isDrawing);
  };

  useEffect(() => {
    // Fetch route data from MongoDB when the component mounts
    // axios.get('/api/getRoute')
    //   .then(response => {
    //     setRoute(response.data.route);
    //   })
    //   .catch(error => {
    //     console.error('Error fetching route:', error);
    //   });
  }, []);

  return (
    <div>
    <button onClick={handleStartStop}>
      {isDrawing ? 'Stop' : 'Start'}
    </button>
    <MapContainer center={currentPosition} zoom={13} style={{ height: '100vh' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={currentPosition} icon={customIcon} />
      <Marker position={destination} icon={customIcon} />
      <Polyline positions={route} color="blue" />
    </MapContainer>
  </div>
  );
};

export default MapView;