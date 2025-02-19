document.addEventListener('DOMContentLoaded', function() {
    const apiKey = 'YOUR_API_KEY';

    // Function to get weather data
    function getWeather(lat, lon) {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const weatherInfo = `
                    <h2>${data.name}</h2>
                    <p>Temperature: ${data.main.temp}°C</p>
                    <p>Weather: ${data.weather[0].description}</p>
                `;
                document.getElementById('weatherInfo').innerHTML = weatherInfo;
                updateBackgroundImage(data.weather[0].main);
            })
            .catch(error => {
                document.getElementById('weatherInfo').innerHTML = '<p>City not found.</p>';
            });
    }

    // Function to update background image
    function updateBackgroundImage(weather) {
        const weatherBackgrounds = {
            Clear: 'url(clear-sky.jpg)',
            Clouds: 'url(cloudy.jpg)',
            Rain: 'url(rainy.jpg)',
            Snow: 'url(snowy.jpg)',
            Drizzle: 'url(drizzle.jpg)',
            Thunderstorm: 'url(thunderstorm.jpg)',
            Mist: 'url(mist.jpg)',
            Smoke: 'url(smoke.jpg)',
            Haze: 'url(haze.jpg)',
            Fog: 'url(fog.jpg)',
            Sand: 'url(sand.jpg)',
            Dust: 'url(dust.jpg)',
            Ash: 'url(ash.jpg)',
            Squall: 'url(squall.jpg)',
            Tornado: 'url(tornado.jpg)'
        };
        
        document.body.style.backgroundImage = weatherBackgrounds[weather] || 'url(default.jpg)';
    }

    // Get current location and weather
    navigator.geolocation.getCurrentPosition(
        position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            getWeather(lat, lon);
        },
        error => {
            document.getElementById('weatherInfo').innerHTML = '<p>Unable to get location.</p>';
        }
    );

    // Search weather by city
    document.getElementById('searchButton').addEventListener('click', function() {
        const city = document.getElementById('cityInput').value;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const weatherInfo = `
                    <h2>${data.name}</h2>
                    <p>Temperature: ${data.main.temp}°C</p>
                    <p>Weather: ${data.weather[0].description}</p>
                `;
                document.getElementById('weatherInfo').innerHTML = weatherInfo;
                updateBackgroundImage(data.weather[0].main);
            })
            .catch(error => {
                document.getElementById('weatherInfo').innerHTML = '<p>City not found.</p>';
            });
    });
});

