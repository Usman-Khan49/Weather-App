async function getWeather() {
    const city = document.getElementById('CityInput').value;
    const apiKey = 'e58128565a95193493c6f340c9d9c3c4';
    const units = 'metric'; // Use 'imperial' for Fahrenheit, 'metric' for Celsius
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${units}&appid=${apiKey}`;

    try {
        // Fetch current weather data
        const weatherResponse = await fetch(weatherUrl);
        if (!weatherResponse.ok) {
            throw new Error('City not found');
        }
        const weatherData = await weatherResponse.json();
        displayWeather(weatherData, units);

        // Fetch 5-day forecast data
        const forecastResponse = await fetch(forecastUrl);
        if (!forecastResponse.ok) {
            throw new Error('Forecast data not available');
        }
        const forecastData = await forecastResponse.json();
        displayForecast(forecastData, units);
    } catch (error) {
        document.getElementById('WeatherToday').innerHTML = `<p>${error.message}</p>`;
        document.getElementById('WeatherWeekly').innerHTML = `<p>${error.message}</p>`;
    }
}

function displayWeather(data, units) {
    const cityName = data.name;
    const temperature = data.main.temp;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const description = data.weather[0].description;
    const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    const tempUnit = units === 'metric' ? '°C' : '°F';

    document.getElementById('WeatherToday').innerHTML = `
        <h2>Weather in ${cityName}</h2>
        <img src="${icon}" alt="${description}" class="weather-icon">
        <p><strong>Temperature:</strong> ${temperature} ${tempUnit}</p>
        <p><strong>Humidity:</strong> ${humidity}%</p>
        <p><strong>Wind Speed:</strong> ${windSpeed} m/s</p>
        <p><strong>Description:</strong> ${description}</p>
    `;
}

function displayForecast(forecastData, units) {
    const tempUnit = units === 'metric' ? '°C' : '°F';
    const forecastContainer = document.getElementById('WeatherWeekly');
    forecastContainer.innerHTML = '<h2>5-Day Forecast</h2>';

    // Extract forecast data for each day at 12:00 PM (Noon)
    const forecastList = forecastData.list.filter(item => item.dt_txt.includes("12:00:00"));

    forecastContainer.innerHTML += '<div class="forecast-grid"></div>';
    const gridContainer = document.querySelector('.forecast-grid');

    forecastList.forEach(day => {
        const date = new Date(day.dt_txt).toLocaleDateString();
        const temperature = day.main.temp;
        const description = day.weather[0].description;
        const icon = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;

        gridContainer.innerHTML += `
            <div class="forecast-item">
                <h3>${date}</h3>
                <img src="${icon}" alt="${description}" class="weather-icon">
                <p><strong>Temp:</strong> ${temperature} ${tempUnit}</p>
                <p><strong>${description}</strong></p>
            </div>
        `;
    });
}
