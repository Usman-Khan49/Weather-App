const weatherBackgrounds = {
    '01d': 'SunnyWeatherWallpaper.jpg',
     '01n': 'SunnyWeatherWallpaper.jpg',
     '02d': 'https://www.wallpaperflare.com/static/992/678/517/firewatch-video-games-landscape-artwork-wallpaper.jpg',
     '02n': 'https://www.wallpaperflare.com/static/992/678/517/firewatch-video-games-landscape-artwork-wallpaper.jpg',
     '03d': 'https://www.wallpaperflare.com/static/992/678/517/firewatch-video-games-landscape-artwork-wallpaper.jpg',
     '03n': 'https://www.wallpaperflare.com/static/992/678/517/firewatch-video-games-landscape-artwork-wallpaper.jpg',
     '04d': 'https://images3.alphacoders.com/135/thumb-1920-1352097.png',
     '04n': 'https://images3.alphacoders.com/135/thumb-1920-1352097.png',
     '09d': 'https://images3.alphacoders.com/135/thumb-1920-1352097.png',
     '09n': 'https://images3.alphacoders.com/135/thumb-1920-1352097.png',
     '10d': 'https://images3.alphacoders.com/135/thumb-1920-1352097.png',
     '10n': 'https://images3.alphacoders.com/135/thumb-1920-1352097.png',
     '11d': 'https://images7.alphacoders.com/133/thumb-1920-1338183.png',
     '11n': 'https://images7.alphacoders.com/133/thumb-1920-1338183.png',
     '13d': 'SunnyWeatherWallpaper.jpg',
     '13n': 'SunnyWeatherWallpaper.jpg',
     '50d': 'https://www.wallpaperflare.com/static/992/678/517/firewatch-video-games-landscape-artwork-wallpaper.jpg',
     '50n': 'https://www.wallpaperflare.com/static/992/678/517/firewatch-video-games-landscape-artwork-wallpaper.jpg',
     'default': 'SunnyWeatherWallpaper.jpg'
 };

 let barChart, doughnutChart, lineChart;
 let originalForecastData = [];
 let forecastData = [];
 let currentPage = 1;
 const itemsPerPage = 10;

 async function getWeather(city = 'Islamabad') {
     const apiKey = 'e58128565a95193493c6f340c9d9c3c4';
     const units = 'metric';
     const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`;
     const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${units}&appid=${apiKey}`;

     try {
         const weatherResponse = await fetch(weatherUrl);
         if (!weatherResponse.ok) {
             throw new Error('City not found');
         }
         const weatherData = await weatherResponse.json();
         displayWeather(weatherData, units);

         const forecastResponse = await fetch(forecastUrl);
         if (!forecastResponse.ok) {
             throw new Error('Forecast data not available');
         }
         const forecastData = await forecastResponse.json();
         displayForecast(forecastData, units);
         updateForecastTable(forecastData.list);
     } catch (error) {
         alert(error.message);
     }
 }

 function displayWeather(data, units) {
     document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°`;
     document.getElementById('location').textContent = `${data.name}, ${data.sys.country}`;
     document.getElementById('humidity').textContent = `${data.main.humidity}%`;
     document.getElementById('windSpeed').textContent = `${data.wind.speed} m/s`;
     document.getElementById('feelsLike').textContent = `${Math.round(data.main.feels_like)}°`;
     
     const now = new Date();
     document.getElementById('dateTime').innerHTML = `${now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}<br>${now.toLocaleDateString([], {weekday: 'long'})}`;

     const iconCode = data.weather[0].icon;
     const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
     document.getElementById('weatherIcon').src = iconUrl;
     document.getElementById('weatherIcon').alt = data.weather[0].description;

     const backgroundUrl = weatherBackgrounds[iconCode] || weatherBackgrounds['default'];
     document.getElementById('weatherCard').style.backgroundImage = `url('${backgroundUrl}')`;
 }

 function displayForecast(forecastData, units) {
     const forecastList = forecastData.list.filter(item => item.dt_txt.includes("12:00:00"));
     const dates = forecastList.map(day => new Date(day.dt_txt).toLocaleDateString('en-US', { weekday: 'short' }));
     const temperatures = forecastList.map(day => Math.round(day.main.temp));
     const weatherConditions = {};

     forecastList.forEach(day => {
         const condition = day.weather[0].main;
         weatherConditions[condition] = (weatherConditions[condition] || 0) + 1;
     });

     createBarChart(dates, temperatures, units);
     createDoughnutChart(weatherConditions);
     createLineChart(dates, temperatures, units);
 }

 function createBarChart(dates, temperatures, units) {
     const ctx = document.getElementById('barChart').getContext('2d');
     if (barChart) barChart.destroy();
     barChart = new Chart(ctx, {
         type: 'bar',
         data: {
             labels: dates,
             datasets: [{
                 label: `Temperature (${units === 'metric' ? '°C' : '°F'})`,
                 data: temperatures,
                 backgroundColor: 'rgba(76, 175, 80, 0.6)',
                 borderColor: 'rgba(76, 175, 80, 1)',
                 borderWidth: 1
             }]
         },
         options: {
             responsive: true,
             maintainAspectRatio: false,
             plugins: {
                 legend: {
                     display: false
                 },
                 title: {
                     display: true,
                     text: '5-Day Temperature Forecast',
                     color: '#1b5e20',
                     font: {
                         size: 16
                     }
                 }
             },
             scales: {
                 y: {
                     beginAtZero: false,
                     grid: {
                         color: 'rgba(0, 0, 0, 0.1)'
                     },
                     ticks: {
                         color: '#1b5e20'
                     }
                 },
                 x: {
                     grid: {
                         color: 'rgba(0, 0, 0, 0.1)'
                     },
                     ticks: {
                         color: '#1b5e20'
                     }
                 }
             },
             animation: {
                 delay: (context) => {
                     let delay = 0;
                     if (context.type === 'data' && context.mode === 'default') {
                         delay = context.dataIndex * 300 + context.datasetIndex * 100;
                     }
                     return delay;
                 },
             },
         }
     });
 }

 function createDoughnutChart(weatherConditions) {
     const ctx = document.getElementById('doughnutChart').getContext('2d');
     if (doughnutChart) doughnutChart.destroy();
     doughnutChart = new Chart(ctx, {
         type: 'doughnut',
         data: {
             labels: Object.keys(weatherConditions),
             datasets: [{
                 data: Object.values(weatherConditions),
                 backgroundColor: [
                     'rgba(76, 175, 80, 0.8)',
                     'rgba(33, 150, 243, 0.8)',
                     'rgba(255, 152, 0, 0.8)',
                     'rgba(244, 67, 54, 0.8)',
                     'rgba(156, 39, 176, 0.8)'
                 ],
                 borderColor: '#fff',
                 borderWidth: 1
             }]
         },
         options: {
             responsive: true,
             maintainAspectRatio: false,
             plugins: {
                 legend: {
                     position: 'right',
                     labels: {
                         color: '#1b5e20'
                     }
                 },
                 title: {
                     display: true,
                     text: 'Weather Conditions Distribution',
                     color: '#1b5e20',
                     font: {
                         size: 16
                     }
                 }
             },
             animation: {
                 delay: (context) => {
                     let delay = 0;
                     if (context.type === 'data' && context.mode === 'default') {
                         delay = context.dataIndex * 300;
                     }
                     return delay;
                 },
             },
         }
     });
 }

 function createLineChart(dates, temperatures, units) {
     const ctx = document.getElementById('lineChart').getContext('2d');
     if (lineChart) lineChart.destroy();
     lineChart = new Chart(ctx, {
         type: 'line',
         data: {
             labels: dates,
             datasets: [{
                 label: `Temperature (${units === 'metric' ? '°C' : '°F'})`,
                 data: temperatures,
                 fill: false,
                 borderColor: '#4caf50',
                 tension: 0.1
             }]
         },
         options: {
             responsive: true,
             maintainAspectRatio: false,
             plugins: {
                 legend: {
                     display: false
                 },
                 title: {
                     display: true,
                     text: 'Temperature Trend',
                     color: '#1b5e20',
                     font: {
                         size: 16
                     }
                 }
             },
             scales: {
                 y: {
                     beginAtZero: false,
                     grid: {
                         color: 'rgba(0, 0, 0, 0.1)'
                     },
                     ticks: {
                         color: '#1b5e20'
                     }
                 },
                 x: {
                     grid: {
                         color: 'rgba(0, 0, 0, 0.1)'
                     },
                     ticks: {
                         color: '#1b5e20'
                     }
                 }
             },
             animation: {
                 x: {
                     type: 'number',
                     easing: 'linear',
                     duration: 500,
                     from: NaN, // the point is initially skipped
                     delay(ctx) {
                         if (ctx.type !== 'data' || ctx.xStarted) {
                             return 0;
                         }
                         ctx.xStarted = true;
                         return ctx.index * 80;
                     }
                 },
                 y: {
                     type: 'number',
                     easing: 'linear',
                     duration: 500,
                     from: (ctx) => ctx.chart.scales.y.getPixelForValue(100),
                     delay(ctx) {
                         if (ctx.type !== 'data' || ctx.yStarted) {
                             return 0;
                         }
                         ctx.yStarted = true;
                         return ctx.index * 80;
                     }
                 }
             },
         }
     });
 }

 function updateForecastTable(data) {
     originalForecastData = data.map(item => ({
         date: new Date(item.dt * 1000).toLocaleDateString(),
         time: new Date(item.dt * 1000).toLocaleTimeString(),
         temperature: Math.round(item.main.temp),
         condition: item.weather[0].main
     }));
     forecastData = [...originalForecastData];
     currentPage = 1;
     renderTable();
 }

 function renderTable() {
     const tableBody = document.querySelector('#forecastTable tbody');
     tableBody.innerHTML = '';

     const startIndex = (currentPage - 1) * itemsPerPage;
     const endIndex = startIndex + itemsPerPage;
     const pageData = forecastData.slice(startIndex, endIndex);

     pageData.forEach(item => {
         const row = document.createElement('tr');
         row.innerHTML = `
             <td>${item.date}</td>
             <td>${item.time}</td>
             <td>${item.temperature}°C</td>
             <td>${item.condition}</td>
         `;
         tableBody.appendChild(row);
     });

     updatePagination();
 }

 function updatePagination() {
     const totalPages = Math.ceil(forecastData.length / itemsPerPage);
     document.getElementById('pageInfo').textContent = `Page ${currentPage} of ${totalPages}`;
     document.getElementById('prevPage').disabled = currentPage === 1;
     document.getElementById('nextPage').disabled = currentPage === totalPages;
 }

 document.getElementById('prevPage').addEventListener('click', () => {
     if (currentPage > 1) {
         currentPage--;
         renderTable();
     }
 });

 document.getElementById('nextPage').addEventListener('click', () => {
     const totalPages = Math.ceil(forecastData.length / itemsPerPage);
     if (currentPage < totalPages) {
         currentPage++;
         renderTable();
     }
 });

 document.querySelectorAll('input[name="filter"]').forEach(radio => {
     radio.addEventListener('change', applyFilter);
 });

 function applyFilter() {
     const filterValue = document.querySelector('input[name="filter"]:checked').value;
     forecastData = [...originalForecastData]; // Reset to original data before applying new filter

     switch (filterValue) {
         case 'ascending':
             forecastData.sort((a, b) => a.temperature - b.temperature);
             break;
         case 'descending':
             forecastData.sort((a, b) => b.temperature - a.temperature);
             break;
         case 'rain':
             forecastData = forecastData.filter(item => item.condition.toLowerCase().includes('rain'));
             break;
         case 'highest':
             const highestTemp = Math.max(...forecastData.map(item => item.temperature));
             forecastData = forecastData.filter(item => item.temperature === highestTemp);
             break;
     }

     currentPage = 1;
     renderTable();
 }

 function toggleMenu() {
     const sideMenu = document.getElementById('sideMenu');
     const mainContent = document.getElementById('mainContent');
     sideMenu.classList.toggle('closed');
     mainContent.classList.toggle('full-width');
 }

 function showDashboard() {
     document.getElementById('dashboard').style.display = 'block';
     document.getElementById('tables').style.display = 'none';
 }

 function showTables() {
     document.getElementById('dashboard').style.display = 'none';
     document.getElementById('tables').style.display = 'block';
 }

 // Chatbot functionality
 const API_KEY = 'AIzaSyBC6H8km3Z7B0kpCZy1yZwRwYa3Zj9WR74';
 let genAI;

 try {
     genAI = new GoogleGenerativeAI(API_KEY);
 } catch (error) {
     console.error('Error initializing GoogleGenerativeAI:', error);
 }

 // Fallback chatbot functionality
 function fallbackChatbotResponse(message) {
     const lowerMessage = message.toLowerCase();
     if (lowerMessage.includes('highest temperature')) {
         const highestTemp = Math.max(...originalForecastData.map(item => item.temperature));
         return `The highest temperature in the forecast is ${highestTemp}°C.`;
     } else if (lowerMessage.includes('lowest temperature')) {
         const lowestTemp = Math.min(...originalForecastData.map(item => item.temperature));
         return `The lowest temperature in the forecast is ${lowestTemp}°C.`;
     } else if (lowerMessage.includes('average temperature')) {
         const avgTemp = originalForecastData.reduce((sum, item) => sum + item.temperature, 0) / originalForecastData.length;
         return `The average temperature in the forecast is ${avgTemp.toFixed(1)}°C.`;
     } else if (lowerMessage.includes('rainy days') || lowerMessage.includes('rain')) {
         const rainyDays = originalForecastData.filter(item => item.condition.toLowerCase().includes('rain')).length;
         return `There are ${rainyDays} time slots with rain in the forecast.`;
     } else {
         return "I'm sorry, I don't have enough information to answer that question. You can ask about the highest, lowest, or average temperature, or about rainy days in the forecast.";
     }
 }

 async function sendChatbotMessage() {
     const input = document.getElementById('chatbotInput');
     const message = input.value.trim();
     if (message) {
         appendMessage('User', message);
         input.value = '';

         try {
             let response;
             if (genAI) {
                 console.log('Attempting to use GoogleGenerativeAI...');
                 const model = genAI.getGenerativeModel({ model: "gemini-pro"});
                 const prompt = `You are a weather assistant. Based on the following weather forecast data: ${JSON.stringify(originalForecastData)}, please answer this question: ${message}. Give a concise and relevant answer based only on the provided data.`;
                 const result = await model.generateContent(prompt);
                 response = await result.response;
                 console.log('GoogleGenerativeAI response:', response);
                 response = response.text();
             } else {
                 console.log('Using fallback chatbot...');
                 response = fallbackChatbotResponse(message);
             }
             appendMessage('Chatbot', response);
         } catch (error) {
             console.error('Error in sendChatbotMessage:', error);
             const fallbackResponse = fallbackChatbotResponse(message);
             appendMessage('Chatbot', 'I encountered an error with the AI service. Here\'s a basic response: ' + fallbackResponse);
         }
     }
 }

 function appendMessage(sender, message) {
     const messagesContainer = document.getElementById('chatbotMessages');
     const messageElement = document.createElement('div');
     messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
     messagesContainer.appendChild(messageElement);
     messagesContainer.scrollTop = messagesContainer.scrollHeight;
 }


 // Initial call to populate the dashboard with Islamabad weather
 window.onload = () => getWeather('Islamabad');

 // Event listener for the search button
 document.getElementById('searchBtn').addEventListener('click', () => {
     const city = document.getElementById('cityInput').value;
     if (city) {
         getWeather(city);
     }
 });

 // Event listener for the Enter key in the input field
 document.getElementById('cityInput').addEventListener('keypress', (e) => {
     if (e.key === 'Enter') {
         const city = e.target.value;
         if (city) {
             getWeather(city);
         }
     }
 });

 // Event listener for the chatbot input
 document.getElementById('chatbotInput').addEventListener('keypress', (e) => {
     if (e.key === 'Enter') {
         sendChatbotMessage();
     }
 });