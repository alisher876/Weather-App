document.addEventListener('DOMContentLoaded', function () {
    const apiKey = 'API_Key';
    const weatherInfoDiv = document.getElementById('weatherInfo');

    function getWeather(query) {
        let url;
        if (typeof query === 'string') {
            url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=metric`;
        } else {
            url = `https://api.openweathermap.org/data/2.5/weather?lat=${query.lat}&lon=${query.lon}&appid=${apiKey}&units=metric`;
        }

        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error('City not found');
                return response.json();
            })
            .then(data => {
                const { name, main, wind, sys, weather } = data;

                // Convert sunrise & sunset times to 12-hour format (AM/PM)
                const sunriseTime = formatTime(sys.sunrise);
                const sunsetTime = formatTime(sys.sunset);

                weatherInfoDiv.innerHTML = `
                    <h2>${name}</h2>
                    <p><strong>Temperature:</strong> ${main.temp}°C</p>
                    <p><strong>Humidity:</strong> ${main.humidity}%</p>
                    <p><strong>Wind Speed:</strong> ${wind.speed} m/s</p>
                    <p><strong>Sunrise:</strong> ${sunriseTime}</p>
                    <p><strong>Sunset:</strong> ${sunsetTime}</p>
                    <p><strong>Weather:</strong> ${weather[0].description}</p>
                `;
                updateBackgroundImage(weather[0].main);
            })
            .catch(error => {
                weatherInfoDiv.innerHTML = `<p>${error.message}</p>`;
            });
    }

    function formatTime(unixTimestamp) {
        const date = new Date(unixTimestamp * 1000);
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // Convert 0 to 12
        return `${hours}:${minutes} ${ampm}`;
    }

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

    navigator.geolocation.getCurrentPosition(
        position => getWeather({ lat: position.coords.latitude, lon: position.coords.longitude }),
        error => (weatherInfoDiv.innerHTML = '<p>Unable to get location. Please enter a city manually.</p>')
    );

    document.getElementById('searchButton').addEventListener('click', function () {
        const city = document.getElementById('cityInput').value.trim();
        if (city) {
            getWeather(city);
        } else {
            weatherInfoDiv.innerHTML = '<p>Please enter a city.</p>';
        }
    });
});

