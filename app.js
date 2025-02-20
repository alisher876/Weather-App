document.addEventListener('DOMContentLoaded', function () {
    const apiKey = 'd51a2f8920a694dc7f4b7e797107e605';
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
                weatherInfoDiv.innerHTML = `
                    <h2>${data.name}</h2>
                    <p>Temperature: ${data.main.temp}°C</p>
                    <p>Weather: ${data.weather[0].description}</p>
                `;
                updateBackgroundImage(data.weather[0].main);
            })
            .catch(error => {
                weatherInfoDiv.innerHTML = `<p>${error.message}</p>`;
            });
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
        error => (weatherInfoDiv.innerHTML = '<p>Unable to get location.</p>')
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

