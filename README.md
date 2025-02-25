# Weather App

## Overview
This is a simple Weather App that allows users to search for a city and get real-time weather updates, including temperature, humidity, wind speed, sunrise, and sunset times. The app also displays an hourly forecast and an 8-day forecast. The background image changes dynamically based on the time of day in the searched location.

## Features
- Search for any city and get current weather details.
- Display hourly and 8-day weather forecasts.
- Background changes dynamically based on the time of day (morning, afternoon, evening, night).
- Responsive and visually appealing UI.

## Technologies Used
- HTML
- CSS
- JavaScript
- OpenWeatherMap API

## Installation
1. Clone the repository:
   ```sh
   [git clone https://github.com/your-username/weather-app.git](https://github.com/alisher876/Weather-App.git)
   ```
2. Navigate to the project directory:
   ```sh
   Weather-App
   ```
3. Open `index.html` in a browser or use Live Server in VS Code.

## Setting Up API Key
This app requires an API key from [OpenWeatherMap](https://openweathermap.org/api).

1. Sign up on OpenWeatherMap and get your API key.
2. Open `app.js` and locate the following line:
   ```js
   const apiKey = 'Your_API_Key';
   ```
3. Replace `'Your_API_Key'` with your actual API key.

## Known Issues & Improvements
- The currentWeather section takes more space than expected.
- The Next 8 Days Forecast title is misaligned
- UI responsiveness needs further optimization.
- Integrate a background image based on weather conditions.


## Contributions
Feel free to fork this repository and submit pull requests with improvements!

