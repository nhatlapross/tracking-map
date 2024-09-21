import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap,Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import customMarkerIcon from '../../assets/car.svg';
import huyHieu from '../../assets/huyhieudoan.png'
import * as Realm from "realm-web";
import dataTable from "../../assets/data";
// import 'leaflet.gridlayer.googlemutant';

const app = new Realm.App({ id: process.env.REACT_APP_MONGODB_APP_ID });

// const GoogleLayer = ({ mapType }) => {
//   const map = useMap();
  
//   useEffect(() => {
//     const googleMapLayer = L.gridLayer.googleMutant({
//       type: mapType,
//     });

//     map.addLayer(googleMapLayer);

//     return () => {
//       map.removeLayer(googleMapLayer);
//     };
//   }, [map, mapType]);

//   return null;
// };

const MapView = () => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [destination, setDestination] = useState([10.781419, 106.659566]);
  const [route, setRoute] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [intermediatePoints, setIntermediatePoints] = useState([]);
  const [currentPointIndex, setCurrentPointIndex] = useState(0);
  const [currentDestinationIndex, setCurrentDestinationIndex] = useState(0);

  const customIcon = L.icon({
    iconUrl: customMarkerIcon,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38]
  })

  const huyHieuIcon = L.icon({
    iconUrl: huyHieu,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38]
  })

  const hideAttribution = `
    .leaflet-control-attribution {
      display: none;
    }
  `;

  const mapRef = useRef(null);

  const finalDestinations = [
    [10.782625, 106.660678],
    [10.782586, 106.660697],

    [10.782680, 106.660936], //địa điểm 3

    [10.782586, 106.660697],
    [10.780549, 106.661763],

    [10.780407, 106.661324],//địa điểm 4

    [10.781883, 106.665206],
    [10.781464, 106.665980],
    [10.781662, 106.666115],
    [10.781761, 106.666378],
    [10.781488, 106.666611],
    [10.781883, 106.667084],
    [10.781864, 106.667177],
    [10.781095, 106.667868],
    [10.780802, 106.668389],
    [10.780947, 106.668584],

    [10.780767, 106.668718],//địa điểm 2

    [10.780507, 106.668913],
    [10.778306, 106.665999],
    [10.778291, 106.665922],
    [10.777689, 106.665139],
    [10.777609, 106.665128],
    [10.776390, 106.663551],
    [10.776363, 106.663626],
    [10.767750, 106.667024],
    [10.760788, 106.668615],

    [10.760326, 106.666343],//địa điểm 6

    [10.760108, 106.665384],
    [10.764913, 106.664284],

    [10.764557, 106.662581],//địa điểm 5

    [10.765099, 106.662421],
    [10.765954, 106.664037],
    [10.767226, 106.663274],
    [10.767433, 106.663212],
    [10.768048, 106.662901],
    [10.768471, 106.663699],
    [10.769147, 106.663459],
    [10.769752, 106.664856],

    [10.769784, 106.664992],

    [10.769371, 106.666349],
    [10.776366, 106.663623],
    [10.776457, 106.663613],
    [10.780775, 106.658964],

    [10.781419, 106.659566]
  ];
  const totalPointsPerDestination = 60;

  useEffect(() => {
    const handlePositionUpdate = (position) => {
      const { latitude, longitude } = position.coords;
      const newPosition = [latitude, longitude];
      setCurrentPosition(newPosition);
      // if (isDrawing) {
      //   setRoute((prevRoute) => [...prevRoute, newPosition]);
      // }
    };

    const handleError = (error) => {
      console.error("Error getting position: ", error);
    };

    // navigator.geolocation.getCurrentPosition(handlePositionUpdate, handleError, {
    //   enableHighAccuracy: true,
    //   timeout: 1000,
    //   maximumAge: 0,
    // });

    const watchId = navigator.geolocation.watchPosition(handlePositionUpdate, handleError, {
      enableHighAccuracy: true,
      timeout: 1000,
      maximumAge: 0,
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, [isDrawing]);

  useEffect(() => {
    console.log(dataTable);
  }, []);

  const calculateIntermediatePoints = (start, end, count) => {
    const points = [];
    for (let i = 0; i <= count; i++) {
      const lat = start[0] + (end[0] - start[0]) * (i / count);
      const lng = start[1] + (end[1] - start[1]) * (i / count);
      points.push([lat, lng]);
    }
    return points;
  };

  const MapCenterSetter = () => {
    const map = useMap();
    useEffect(() => {
      if (destination && isDrawing) {
        map.setView(destination, 18);
      }
      else{
        map.setView(destination, 14);
      }
    }, [destination, map, isDrawing, isMoving]);

    return null;
  };

  const handleStartButton = () => {
    if (!isMoving) {
      const points = calculateIntermediatePoints(
        destination, 
        finalDestinations[currentDestinationIndex], 
        totalPointsPerDestination
      );
      setIntermediatePoints(points);
      // setCurrentPointIndex(0);
      setIsMoving(true);
    } else {
      setIsMoving(false);
      // setCurrentPointIndex(0);
      // setCurrentDestinationIndex(0);
      // setDestination([10.7812385, 106.6595609]); 
    }
    setIsDrawing(true);
  };

  const resetRoute = () => {
    setRoute([]);
    setIsDrawing(true);
    setDestination([10.781419, 106.659566]);
  }

  useEffect(() => {
    let intervalId;
    if (isMoving) {
      intervalId = setInterval(() => {
        if (currentPointIndex < intermediatePoints.length) {
          setDestination(intermediatePoints[currentPointIndex]);
          setRoute(prevRoute => [...prevRoute, intermediatePoints[currentPointIndex]]);
          setCurrentPointIndex(prevIndex => prevIndex + 1);
        } else {
          // Reached current destination
          if (currentDestinationIndex < finalDestinations.length - 1) {
            // Move to next destination
            setCurrentDestinationIndex(prevIndex => prevIndex + 1);
            const newPoints = calculateIntermediatePoints(
              finalDestinations[currentDestinationIndex],
              finalDestinations[currentDestinationIndex + 1],
              totalPointsPerDestination
            );
            setIntermediatePoints(newPoints);
            setCurrentPointIndex(0);
          } else {
            // Finished all destinations
            setIsMoving(false);
            setIsDrawing(false);
            setCurrentDestinationIndex(0);
            clearInterval(intervalId);
          }
        }
      }, 200);
    }
    return () => clearInterval(intervalId);
  }, [isMoving, currentPointIndex, intermediatePoints, currentDestinationIndex]);

  return (
    <div className="flex flex-col h-screen">
      <style>{hideAttribution}</style>
      <div className='flex items-center'>
        <button 
          onClick={handleStartButton}
          className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded z-[1000] shadow-md"
        >
          {isMoving ? 'Dừng' : 'Bắt đầu'}
        </button>
        <button 
          onClick={resetRoute}
          className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded z-[1000] shadow-md"
        >
          Reset
        </button>
      </div>
      <MapContainer center={destination} zoom={14} style={{ height: '75vh' }}>
        {/* <GoogleLayer mapType="roadmap" /> */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution=""
        />
        <Marker position={destination} icon={customIcon} />
        {dataTable.map(location => (
          <Marker
            key={location.name}
            position={[location.position.lat, location.position.lng]}
            icon={huyHieuIcon}
          >
            <Popup>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <h3>{location.name}</h3>
                  <p>{location.job}</p>
                </div>
                <div className="w-full max-w-sm h-auto object-cover rounded">
                  {location.image && <img src={location.image} alt="Location" style={{width: '100%', maxWidth: '100px',maxHeight:'100px'}} />}
                  {location.pImage && <img src={location.pImage} alt="Location" style={{width: '100%', maxWidth: '100px',maxHeight:'100px'}} />}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        <Polyline positions={route} color="blue" />
        <MapCenterSetter />
      </MapContainer>
    </div>
  );
};

export default MapView;