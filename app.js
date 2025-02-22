document.addEventListener('DOMContentLoaded', function () {
    const apiKey = 'APIKey';
    const weatherInfoDiv = document.getElementById('weatherInfo');
    const currentWeatherDiv = document.getElementById('currentWeather');
    const hourlyForecastDiv = document.getElementById('hourlyForecast');
    const dailyForecastDiv = document.getElementById('dailyForecast');

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
                const { name, main, wind, sys, weather, coord } = data;
                const sunriseTime = formatTime(sys.sunrise);
                const sunsetTime = formatTime(sys.sunset);

                currentWeatherDiv.innerHTML = `
                    <h2>${name}</h2>
                    <p><strong>Temperature:</strong> ${main.temp}°C</p>
                    <p><strong>Humidity:</strong> ${main.humidity}%</p>
                    <p><strong>Wind Speed:</strong> ${wind.speed} m/s</p>
                    <p><strong>Sunrise:</strong> ${sunriseTime}</p>
                    <p><strong>Sunset:</strong> ${sunsetTime}</p>
                    <p><strong>Weather:</strong> ${weather[0].description}</p>
                `;

                updateBackgroundImage(weather[0].main);
                getHourlyForecast(coord);
                getDailyForecast(coord);
            })
            .catch(error => {
                weatherInfoDiv.innerHTML = `<p>${error.message}</p>`;
            });
    }
    

    function getHourlyForecast(coord) {
        const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${coord.lat}&lon=${coord.lon}&exclude=current,minutely,daily,alerts&appid=${apiKey}&units=metric`;
    
        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error('Unable to fetch hourly forecast');
                return response.json();
            })
            .then(data => {
                let forecastHTML = `<h3>Today's Hourly Forecast</h3>`;
                forecastHTML += `<div style="display: flex; justify-content: center; gap: 10px; overflow-x: auto;">`;
    
                // Get only 6 time slots (next 12 hours, every 2 hours)
                for (let i = 0; i < 12; i += 2) {
                    const hourData = data.hourly[i];
                    const time = new Date(hourData.dt * 1000).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
                    forecastHTML += `
                        <div class="forecast-box">
                            <p><strong>${time}</strong></p>
                            <p>${hourData.temp.toFixed(1)}°C</p>
                            <p>${hourData.weather[0].description}</p>
                        </div>
                    `;
                }
    
                forecastHTML += `</div>`;
                document.getElementById('hourlyForecast').innerHTML = forecastHTML;
            })
            .catch(error => {
                document.getElementById('hourlyForecast').innerHTML = `<p>${error.message}</p>`;
            });
    }
    

    function getDailyForecast(coord) {
        const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${coord.lat}&lon=${coord.lon}&exclude=current,minutely,hourly,alerts&appid=${apiKey}&units=metric`;
    
        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error('Unable to fetch daily forecast');
                return response.json();
            })
            .then(data => {
                let forecastHTML = `<h3>Next 8 Days Forecast</h3>`;
                forecastHTML += `<div style="display: flex; justify-content: center; gap: 10px; overflow-x: auto;">`;
    
                data.daily.forEach((day, index) => {
                    const date = new Date(day.dt * 1000).toLocaleDateString(undefined, { weekday: 'short' });
                    forecastHTML += `
                        <div class="forecast-box">
                            <p><strong>${date}</strong></p>
                            <p>${day.temp.day.toFixed(1)}°C</p>
                            <p>${day.weather[0].description}</p>
                        </div>
                    `;
                });
    
                forecastHTML += `</div>`;
                dailyForecastDiv.innerHTML = forecastHTML;
            })
            .catch(error => {
                dailyForecastDiv.innerHTML = `<p>${error.message}</p>`;
            });
    }
    

    function updateBackgroundImage(weather) {
        const weatherBackgrounds = {
            Clear: 'clear-sky.jpg',
            Clouds: 'cloudy.jpg',
            Rain: 'rainy.jpg',
            Snow: 'snowy.jpg',
            Drizzle: 'drizzle.jpg',
            Thunderstorm: 'thunderstorm.jpg',
            Mist: 'mist.jpg',
            Smoke: 'smoke.jpg',
            Haze: 'haze.jpg',
            Fog: 'fog.jpg',
            Sand: 'sand.jpg',
            Dust: 'dust.jpg',
            Ash: 'ash.jpg',
            Squall: 'squall.jpg',
            Tornado: 'tornado.jpg'
        };
    
        const imageUrl = weatherBackgrounds[weather] || 'default.jpg'; // Fallback to 'default.jpg'
        document.body.style.backgroundImage = `url('${imageUrl}')`;
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
        document.body.style.backgroundRepeat = "no-repeat";
    }
    

    function formatTime(unixTimestamp) {
        const date = new Date(unixTimestamp * 1000);
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; 
        return `${hours}:${minutes} ${ampm}`;
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
