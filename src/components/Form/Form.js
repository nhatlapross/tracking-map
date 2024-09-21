import React, { useState, useEffect } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Form.css';
import customMarkerIcon from '../../assets/car.svg';
import * as Realm from "realm-web";

const app = new Realm.App({ id: process.env.REACT_APP_MONGODB_APP_ID });

const Form = () => {
  const userName = JSON.parse(localStorage.getItem('user'));
  const [currentPosition, setCurrentPosition] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [route, setRoute] = useState([]);
  const [location, setLocation] = useState({ lat: 10.762622, lng: 106.660172 });
  const [formData, setFormData] = useState({
    content: ''
  });

  const customIcon = L.icon({
    iconUrl: customMarkerIcon,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38]
  })

  const [user, setUser] = useState(null);

  useEffect(() => {
    const loginAnonymous = async () => {
      try {
        // Attempt to log in anonymously
        const user = await app.logIn(Realm.Credentials.anonymous());
        setUser(user);
        console.log("Successfully logged in!", user);
      } catch (error) {
        console.error("Failed to log in", error);
      }
    };
    loginAnonymous();
  }, []);

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

    navigator.geolocation.getCurrentPosition(handlePositionUpdate, handleError, {
      enableHighAccuracy: true,
      timeout: 2000,
      maximumAge: 0,
    });

    const watchId = navigator.geolocation.watchPosition(handlePositionUpdate, handleError, {
      enableHighAccuracy: true,
      timeout: 2000,
      maximumAge: 0,
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, [isDrawing]);

  useEffect(() => {
    const getRoute = async () => {
      const user = await app.logIn(Realm.Credentials.anonymous());
      const mongodb = user.mongoClient("mongodb-atlas");
      const collection = mongodb.db("hanhtrinhxanh").collection("recordRoad");
      const locationsData = await collection.find();
      console.log(locationsData);
    }

    getRoute();
  }, []);

  const MapCenterSetter = () => {
    const map = useMap();

    useEffect(() => {
      if (currentPosition && isDrawing) {
        map.setView(currentPosition, 15);
      }
    }, [currentPosition, map, isDrawing]);

    return null;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      console.error("No user logged in");
      return;
    }

    if (isDrawing) {
      try {
        const mongodb = app.currentUser.mongoClient("mongodb-atlas");
        const collection = mongodb.db("hanhtrinhxanh").collection("recordRoad");
        await collection.insertOne({
          route: route
        });
        alert("Ghi dữ liệu hành trình thành công!");
      } catch (error) {
        alert("Lỗi thêm dữ liệu: ", error);
      }
    }
    else {
      try {
        const mongodb = app.currentUser.mongoClient("mongodb-atlas");
        const collection = mongodb.db("hanhtrinhxanh").collection("locations");
        await collection.insertOne({
          content: formData.content,
          name: userName,
          position: currentPosition,
        });

        alert("Lưu địa điểm bắt đầu thành công! Bắt đầu ghi hành trình...");
      } catch (error) {
        alert("Lỗi thêm dữ liệu: ", error);
      }
    }
    setIsDrawing(!isDrawing);

  };

  return (
    <form onSubmit={handleSubmit} className="form-display-container">
      <div className="display-container ml-3">
        <div>
          <label>Ghi chú địa điểm</label>
          <input type="text" name="content" value={formData.content} onChange={handleInputChange} />
        </div>
        <button type="submit">{isDrawing ? "Dừng và lưu hành trình" : "Bắt đầu hành trình"}</button>
      </div>
      <div className="map-container">
        <MapContainer center={currentPosition || [51.505, -0.09]} zoom={13} style={{ height: '60vh' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {currentPosition && <Marker position={currentPosition} icon={customIcon} />}
          <Polyline positions={route} color="blue" />
          <MapCenterSetter />
        </MapContainer>
        <p>Vị trí hiện tại = Kinh độ: {location.lat.toFixed(6)}, Vĩ độ: {location.lng.toFixed(6)}</p>
      </div>


    </form>
  );
};

export default Form;