import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [location, setLocation] = useState({ lat: null, lon: null });
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState(null);
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    setLocation({ lat, lon });
                    getWeatherByCoords(lat, lon);
                },
                error => {
                    setError("Unable to retrieve location.");
                }
            );
        } else {
            setError("Geolocation is not supported by this browser.");
        }
    }, []);

    const getWeatherByCoords = (lat, lon) => {
        const apiKey = 'YOUR_API_KEY'; // Замените на ваш реальный API ключ
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

        axios.get(url)
            .then(response => {
                setWeather(response.data);
            })
            .catch(error => {
                setError("Unable to retrieve weather data.");
            });
    };

    const getWeatherByCity = (city, country) => {
        const apiKey = 'c7724a85dd7503a1842f6ba8c5cdcb6e'; // Замените на ваш реальный API ключ
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${apiKey}&units=metric`;

        axios.get(url)
            .then(response => {
                setWeather(response.data);
                setError(null);
            })
            .catch(error => {
                setError("Unable to retrieve weather data for the specified location.");
            });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (city && country) {
            getWeatherByCity(city, country);
        } else {
            setError("Please enter both city and country.");
        }
    };

    return (
        <div className="App">
            <div className="weather-container">
                <h1>Weather App</h1>
                {error && <p>{error}</p>}
                <form onSubmit={handleFormSubmit}>
                    <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Enter city"
                    />
                    <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="Enter country"
                    />
                    <button type="submit">Get Weather</button>
                </form>
                {location.lat && location.lon && (
                    <p>Latitude: {location.lat}, Longitude: {location.lon}</p>
                )}
                {weather && (
                    <div>
                        <p>City: {weather.name}</p>
                        <p>Temperature: {weather.main.temp}°C</p>
                        <p>Description: {weather.weather[0].description}</p>
                    </div>
                )}
                {!error && !weather && <p>Fetching weather...</p>}
            </div>
        </div>
    );
}

export default App;
