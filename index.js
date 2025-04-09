const form = document.querySelector(".search-form");
const searchInput = document.querySelector(".search_area");
const temperatureField = document.querySelector(".temp p");
const locationField = document.querySelector(".location");
const dateField = document.querySelector(".datetime");
const iconField = document.querySelector(".weather-icon");
const textField = document.querySelector(".weather-text");
const forecastContainer = document.querySelector(".forecast-cards");
const errorMessage = document.querySelector(".error-message");
const loader = document.querySelector(".loader");

let useFahrenheit = false;
const defaultLocation = "New Delhi";

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const target = searchInput.value.trim();
    if (target) {
        fetchResults(target);
        localStorage.setItem("lastCity", target);
        searchInput.value = "";
    }
});

document.getElementById("unitToggle").addEventListener("change", (e) => {
    useFahrenheit = e.target.checked;
    const city = locationField.innerText;
    if (city && city !== "City") {
        fetchResults(city);
    }
});

window.addEventListener("load", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                fetchResults(`${lat},${lon}`);
            },
            () => {
                const savedCity = localStorage.getItem("lastCity");
                fetchResults(savedCity || defaultLocation);
            }
        );
    } else {
        const savedCity = localStorage.getItem("lastCity");
        fetchResults(savedCity || defaultLocation);
    }
});

const fetchResults = async (targetLocation) => {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=9188839f48df47c0ab652839250604&q=${targetLocation}&days=3&aqi=no&alerts=no`;

    loader.style.display = "block";
    errorMessage.style.display = "none";

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Location not found.");
        }
        const data = await response.json();

        updateUI(data);
        updateForecast(data.forecast.forecastday);
    } catch (error) {
        errorMessage.innerText = error.message;
        errorMessage.style.display = "block";
    } finally {
        loader.style.display = "none";
    }
};

const updateUI = (data) => {
    const temp = data.current.temp_c;
    const condition = data.current.condition;
    const locationName = `${data.location.name}, ${data.location.country}`;
    const time = data.location.localtime;

    const convertedTemp = useFahrenheit ? (temp * 9 / 5 + 32).toFixed(1) : temp;
    const tempUnit = useFahrenheit ? "F" : "C";

    temperatureField.innerText = `${convertedTemp}°${tempUnit}`;
    locationField.innerText = locationName;
    dateField.innerText = time;
    iconField.src = condition.icon;
    textField.innerText = condition.text;
};

const updateForecast = (forecastData) => {
    forecastContainer.innerHTML = "";
    forecastData.forEach((day, index) => {
        if (index === 0) return;
        const card = document.createElement("div");
        card.classList.add("forecast-card");

        const convertedTemp = useFahrenheit ? (day.day.avgtemp_c * 9 / 5 + 32).toFixed(1) : day.day.avgtemp_c;
        const tempUnit = useFahrenheit ? "F" : "C";

        card.innerHTML = `
            <p><strong>${new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</strong></p>
            <img src="${day.day.condition.icon}" alt="${day.day.condition.text}" />
            <p>${convertedTemp}°${tempUnit}</p>
            <p>${day.day.condition.text}</p>
        `;
        forecastContainer.appendChild(card);
    });
};
