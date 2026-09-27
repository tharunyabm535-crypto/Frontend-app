async function getWeather() {
    let city = document.getElementById("city").value;
    if (city == "") {
        alert("Please enter a city name");
        return;
    }
    let location = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
    );
    let data = await location.json();
    if (!data.results) {
        alert("City not found");
        return;
    }
    let latitude = data.results[0].latitude;
    let longitude = data.results[0].longitude;
    let result = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code`
    );
    let weather = await result.json();
    document.getElementById("name").innerText =
        data.results[0].name;
    document.getElementById("temp").innerText =
        weather.current.temperature_2m + " °C";
    document.getElementById("humidity").innerText =
        weather.current.relative_humidity_2m + "%";
    document.getElementById("feels").innerText =
        weather.current.apparent_temperature + " °C";
    document.getElementById("weather").innerText =
        getWeatherName(weather.current.weather_code);
    document.getElementById("icon").innerText =
        getWeatherIcon(weather.current.weather_code);
}
function getWeatherName(code) {
    if (code == 0) {
        return "Clear Sky";
    }
    if (code <= 3) {
        return "Partly Cloudy";
    }
    if (code <= 48) {
        return "Foggy";
    }
    if (code <= 67) {
        return "Rainy";
    }
    if (code <= 77) {
        return "Snowy";
    }
    if (code <= 82) {
        return "Rain Showers";
    }
    return "Thunderstorm";
}
function getWeatherIcon(code) {
    if (code == 0) {
        return "☀️";
    }
    if (code <= 3) {
        return "⛅";
    }
    if (code <= 48) {
        return "🌫️";
    }
    if (code <= 67) {
        return "🌧️";
    }
    if (code <= 77) {
        return "❄️";
    }
    if (code <= 82) {
        return "🌦️";
    }
    return "⛈️";
}