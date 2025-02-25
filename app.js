document.addEventListener('DOMContentLoaded', function () {
    const apiKey = 'Your_API_Key';
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
                const { name, main, wind, sys, weather, coord, timezone } = data;
                const sunriseTime = sys.sunrise;
                const sunsetTime = sys.sunset;
            
                // Debugging Logs
                console.log("City:", name);
                console.log("Sunrise (UTC):", sunriseTime);
                console.log("Sunset (UTC):", sunsetTime);
                console.log("Timezone Offset (seconds):", timezone);
            
                currentWeatherDiv.innerHTML = `
                    <h2>${name}</h2>
                    <p><strong>Temperature:</strong> ${main.temp}°C</p>
                    <p><strong>Humidity:</strong> ${main.humidity}%</p>
                    <p><strong>Wind Speed:</strong> ${wind.speed} m/s</p>
                    <p><strong>Sunrise:</strong> ${formatTime(sunriseTime)}</p>
                    <p><strong>Sunset:</strong> ${formatTime(sunsetTime)}</p>
                    <p><strong>Weather:</strong> ${weather[0].description}</p>
                `;
            
                updateBackgroundImage(sunriseTime, sunsetTime, timezone);
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
    
                for (let i = 0; i < 12; i += 2) {
                    const hourData = data.hourly[i];
                    const time = new Date(hourData.dt * 1000).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
                    const icon = `https://openweathermap.org/img/wn/${hourData.weather[0].icon}.png`;
    
                    forecastHTML += `
                        <div class="forecast-box">
                            <p><strong>${time}</strong></p>
                            <p>${hourData.temp.toFixed(1)}°C</p>
                            <img src="${icon}" alt="${hourData.weather[0].description}">
                            <p>${hourData.weather[0].description}</p>
                        </div>
                    `;
                }
    
                forecastHTML += `</div>`;
                hourlyForecastDiv.innerHTML = forecastHTML;
            })
            .catch(error => {
                hourlyForecastDiv.innerHTML = `<p>${error.message}</p>`;
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
                    const icon = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;
    
                    forecastHTML += `
                        <div class="forecast-box">
                            <p><strong>${date}</strong></p>
                            <p>${day.temp.day.toFixed(1)}°C</p>
                            <img src="${icon}" alt="${day.weather[0].description}">
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
    

    function updateBackgroundImage(sunrise, sunset, timezoneOffset) {
        const nowUTC = Math.floor(Date.now() / 1000); // Get current time in UTC
        const localTime = nowUTC + timezoneOffset; // Convert to local time
    
        console.log("Current UTC Time:", nowUTC);
        console.log("Local Time (Searched City):", localTime);
        console.log("Sunrise (Local):", sunrise);
        console.log("Sunset (Local):", sunset);
    
        let backgroundImage;
    
        if (localTime >= sunrise && localTime <= sunset) {
            backgroundImage = "day.jpg"; // Show day during daytime
        } else if (localTime >= (sunset - 1800) && localTime <= (sunset + 1800)) {
            backgroundImage = "sunset.jpg"; // Sunset time
        } else if (localTime >= (sunrise - 1800) && localTime <= (sunrise + 1800)) {
            backgroundImage = "sunrise.jpg"; // Sunrise time
        } else {
            backgroundImage = "night.jpg"; // Nighttime
        }
    
        console.log("Selected Background Image:", backgroundImage);
    
        // Update background image
        document.body.style.backgroundImage = `url('./images/${backgroundImage}?v=${Date.now()}')`;
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

