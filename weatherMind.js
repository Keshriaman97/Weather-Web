const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAcessContainer = document.querySelector(".grant-location-container");
const searchFrom = document.querySelector("[data-searchFrom]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const grantAccessButton = document.querySelector("[data-grantAccess-btn]");
const searchInput = document.querySelector("[data-searchInput]");
const wrongCityInput = document.querySelector("[wrong-cityName]");


let currentTab = userTab;
const API_KEY = "a1585bdb32f1e7731d8c5145631fc89c";
currentTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(clickTab) {
    if (clickTab != currentTab) {
        currentTab.classList.remove("current-tab");
        currentTab = clickTab;
        currentTab.classList.add("current-tab");

        if (!searchFrom.classList.contains("active")) {
            userInfoContainer.classList.remove("active");
            grantAcessContainer.classList.remove("active");
            searchFrom.classList.add("active");
        } else {
            wrongCityInput.classList.remove("active");
            searchFrom.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener("click", function () {
    //pass clicked tab as input parameter
    switchTab(userTab);
});

searchTab.addEventListener("click", function () {
    //pass clicked tab as input parameter
    switchTab(searchTab);
});

//checking cordinate are already present in session storage
function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if (!localCoordinates) {
        //agar hamare pass apna location off ho
        grantAcessContainer.classList.add("active");
    } else {
        const coordinates = JSON.parse(localCoordinates);//object from of JSON
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates) {
    const { lat, lon } = coordinates;
    grantAcessContainer.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");

    //API call

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();//string from of JSON

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");

        renderWeatherInfo(data);
    }
    catch (err) {
        loadingScreen.classList.remove("active");
        //HW kuchh likhana hai error 404 found

    }
}

function renderWeatherInfo(weatherData) {
    //firstly we have to fetch element

    const cityName = document.querySelector("[data-cityname]");
    const countryIcon = document.querySelector("[data-countryIcon");
    const desc = document.querySelector("[data-weatherDecsription]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity");
    const cloudiness = document.querySelector("[data-cloudiness");

    cityName.innerText = weatherData?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherData?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherData?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${weatherData?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherData?.main?.temp}°C`;
    windspeed.innerText = `${weatherData?.wind?.speed}m/s`;
    humidity.innerText = `${weatherData?.main?.humidity}%`;
    cloudiness.innerText = `${weatherData?.clouds?.all}%`;

    
    if(cityName.innerText==="undefined"){
        userInfoContainer.classList.remove("active");
        wrongCityInput.classList.add("active");
    }
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("Geolocation not found");
    }
}
function showPosition(Position) {

    const userCoordinates = {
        lat: Position.coords.latitude,
        lon: Position.coords.longitude,
    };
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates)); //my own location save rahe 
    fetchUserWeatherInfo(userCoordinates);
}

grantAccessButton.addEventListener("click", getLocation);


searchFrom.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if (cityName === "") {
        return;
    } else {
        fetchSearchWeatherInfo(cityName);
    }
});

async function fetchSearchWeatherInfo(city) {
    wrongCityInput.classList.remove("active");
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAcessContainer.classList.remove("active");

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");

        renderWeatherInfo(data);
    } catch (err) {
        console.log("error founded");
    }
}
