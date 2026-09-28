const form = document.getElementById("form");
const city = document.getElementById("city");
const unit = document.getElementById("unit");
const status = document.getElementById("status");
form.addEventListener("submit", getWeather);
async function getWeather(e) {
    e.preventDefault();
    let place = city.value.trim();
    if (place == "") {
        status.innerText = "Enter city name";
        return;
    }
    status.innerText = "Loading...";
    try {
        let a = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(place)}&count=1`
        );
        let location = await a.json();
        if (!location.results) {
            throw new Error("City not found");
        }
        let x = location.results[0];
        let b = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${x.latitude}&longitude=${x.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&temperature_unit=${unit.value}&wind_speed_unit=kmh`
        );
        let data = await b.json();
        let w = data.current;
        document.getElementById("name").innerText = x.name;
        document.getElementById("temp").innerText =
            w.temperature_2m + (unit.value == "celsius" ? " °C" : " °F");
        document.getElementById("humidity").innerText =
            w.relative_humidity_2m + "%";
        document.getElementById("wind").innerText =
            w.wind_speed_10m + " km/h";
        document.getElementById("condition").innerText =
            getCondition(w.weather_code);
        document.getElementById("icon").innerText =
            getIcon(w.weather_code);
        status.innerText = "Weather updated ✔";
        saveHistory(x.name);
    } catch (error) {
        status.innerText = "❌ " + error.message;
    }
}
function getCondition(code) {
    if (code == 0) return "Clear Sky";
    if (code <= 3) return "Cloudy";
    if (code <= 48) return "Foggy";
    if (code <= 67) return "Rainy";
    if (code <= 77) return "Snowy";
    if (code <= 82) return "Rain Showers";
    return "Thunderstorm";
}
function getIcon(code) {
    if (code == 0) return "☀️";
    if (code <= 3) return "⛅";
    if (code <= 48) return "🌫️";
    if (code <= 67) return "🌧️";
    if (code <= 77) return "❄️";
    if (code <= 82) return "🌦️";
    return "⛈️";
}
function saveHistory(name) {
    let history = JSON.parse(localStorage.getItem("history")) || [];
    history = history.filter(x => x != name);
    history.unshift(name);
    localStorage.setItem("history", JSON.stringify(history.slice(0, 5)));
    showHistory();
}
function showHistory() {
    let history = JSON.parse(localStorage.getItem("history")) || [];
    let list = document.getElementById("list");
    list.innerHTML = "";
    history.forEach(name => {
        let li = document.createElement("li");
        li.innerText = "📍 " + name;
        li.onclick = () => {
            city.value = name;
            form.dispatchEvent(new Event("submit"));
        };
        list.appendChild(li);
    });
}
document.getElementById("clear").onclick = () => {
    localStorage.removeItem("history");
    showHistory();
    status.innerText = "History cleared";
};
showHistory();