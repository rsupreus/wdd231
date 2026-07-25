const menuButton = document.querySelector("#menu-button");
const navigation = document.querySelector("#primary-navigation");
const themeButton = document.querySelector("#theme-button");

const weatherContent = document.querySelector("#weather-content");
const spotlightContainer = document.querySelector("#spotlight-container");

const memberDataUrl = "data/members.json";

/* Replace with your OpenWeatherMap API key */
const weatherApiKey = "771041cf6f3bc944bd1d35ff2d75599a";

/* St. George, Utah */
const latitude = 37.0965;
const longitude = -113.5684;

const currentWeatherUrl =
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=${weatherApiKey}`;

const forecastUrl =
    `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=imperial&appid=${weatherApiKey}`;


/* ------------------------------
   Navigation
--------------------------------*/

function toggleNavigation() {
    const isOpen = navigation.classList.toggle("open");

    menuButton.setAttribute("aria-expanded", isOpen);
    menuButton.textContent = isOpen ? "✕" : "☰";
}

function closeMobileNavigation(event) {
    if (!event.target.matches(".navigation a")) return;

    navigation.classList.remove("open");
    menuButton.setAttribute("aria-expanded", false);
    menuButton.textContent = "☰";
}


/* ------------------------------
   Theme Toggle
--------------------------------*/

function toggleTheme() {
    document.body.classList.toggle("dark-theme");

    const darkMode =
        document.body.classList.contains("dark-theme");

    themeButton.textContent = darkMode ? "☀" : "◐";

    localStorage.setItem(
        "chamber-theme",
        darkMode ? "dark" : "light"
    );
}

function loadSavedTheme() {
    if (localStorage.getItem("chamber-theme") === "dark") {
        document.body.classList.add("dark-theme");
        themeButton.textContent = "☀";
    }
}


/* ------------------------------
   Weather
--------------------------------*/

async function getWeatherData() {

    if (weatherApiKey === "YOUR_OPENWEATHERMAP_API_KEY") {
        weatherContent.innerHTML =
            "<p>Add your OpenWeatherMap API key.</p>";
        return;
    }

    try {

        const [currentResponse, forecastResponse] =
            await Promise.all([
                fetch(currentWeatherUrl),
                fetch(forecastUrl)
            ]);

        const current =
            await currentResponse.json();

        const forecast =
            await forecastResponse.json();

        displayWeather(current, forecast);

    } catch (error) {

        weatherContent.innerHTML =
            "<p>Unable to load weather.</p>";

        console.error(error);
    }
}

function displayWeather(currentData, forecastData) {
    const currentTemperature = Math.round(currentData.main.temp);
    const description = currentData.weather[0].description;
    const iconCode = currentData.weather[0].icon;

    const forecasts = getThreeDayForecast(forecastData.list);

    weatherContent.innerHTML = `
        <div class="current-weather">
            <img
                src="https://openweathermap.org/img/wn/${iconCode}@2x.png"
                alt="${description}"
                width="90"
                height="90"
            >

            <div>
                <p class="current-temperature">
                    ${currentTemperature}°F
                </p>

                <p class="current-description">
                    ${description}
                </p>
            </div>
        </div>

        <h3 class="forecast-title">
            Three-Day Forecast
        </h3>

        <div class="forecast-grid">
            ${forecasts.map(createForecastMarkup).join("")}
        </div>
    `;
}


/* ------------------------------
   Three-Day Forecast
--------------------------------*/

function getThreeDayForecast(forecastList) {
    const dailyForecasts = [];
    const usedDates = new Set();

    for (const forecast of forecastList) {
        const forecastDate =
            new Date(forecast.dt * 1000);

        const dateKey =
            forecastDate.toLocaleDateString("en-CA");

        const hour =
            forecastDate.getHours();

        /*
         * The OpenWeather forecast returns data
         * every three hours.
         *
         * This selects one forecast near noon
         * for each upcoming day.
         */
        if (
            !usedDates.has(dateKey) &&
            hour >= 11 &&
            hour <= 14
        ) {
            usedDates.add(dateKey);

            dailyForecasts.push({
                date: forecastDate,
                temperature:
                    Math.round(forecast.main.temp)
            });
        }

        if (dailyForecasts.length === 3) {
            break;
        }
    }

    return dailyForecasts;
}


/* ------------------------------
   Forecast Card Markup
--------------------------------*/

function createForecastMarkup(forecast) {
    const dayName =
        new Intl.DateTimeFormat("en-US", {
            weekday: "short"
        }).format(forecast.date);

    return `
        <article class="forecast-day">
            <p class="forecast-day-name">
                ${dayName}
            </p>

            <p class="forecast-temperature">
                ${forecast.temperature}°F
            </p>
        </article>
    `;
}


/* ------------------------------
   Weather Error Message
--------------------------------*/

function displayWeatherError(message) {
    weatherContent.innerHTML = `
        <p class="status-message">
            ${message}
        </p>
    `;
}

/* ------------------------------
   Member Spotlights
--------------------------------*/

async function getSpotlightMembers() {
    try {
        const response = await fetch(memberDataUrl);

        if (!response.ok) {
            throw new Error(
                `Unable to load members: ${response.status}`
            );
        }

        const data = await response.json();

        /*
         * Only Gold and Silver members are eligible.
         * Level 2 = Silver
         * Level 3 = Gold
         */
        const eligibleMembers = data.members.filter(
            (member) =>
                member.membershipLevel === 2 ||
                member.membershipLevel === 3
        );

        /*
         * Shuffle the eligible members and select
         * the first three for the spotlights.
         */
        const spotlightMembers =
            shuffleMembers(eligibleMembers).slice(0, 3);

        displaySpotlights(spotlightMembers);

    } catch (error) {
        console.error(error);

        spotlightContainer.innerHTML = `
            <p class="status-message">
                Featured members could not be loaded.
            </p>
        `;

        spotlightContainer.setAttribute(
            "aria-busy",
            "false"
        );
    }
}


/* ------------------------------
   Shuffle Members
--------------------------------*/

function shuffleMembers(members) {
    const shuffledMembers = [...members];

    /*
     * Fisher-Yates shuffle
     */
    for (
        let index = shuffledMembers.length - 1;
        index > 0;
        index--
    ) {
        const randomIndex =
            Math.floor(Math.random() * (index + 1));

        [
            shuffledMembers[index],
            shuffledMembers[randomIndex]
        ] = [
            shuffledMembers[randomIndex],
            shuffledMembers[index]
        ];
    }

    return shuffledMembers;
}


/* ------------------------------
   Display Spotlight Cards
--------------------------------*/

function displaySpotlights(members) {
    spotlightContainer.innerHTML = "";

    members.forEach((member, index) => {
        const spotlightCard =
            createSpotlightCard(member, index);

        spotlightContainer.appendChild(
            spotlightCard
        );
    });

    spotlightContainer.setAttribute(
        "aria-busy",
        "false"
    );
}


/* ------------------------------
   Create One Spotlight Card
--------------------------------*/

function createSpotlightCard(member, index) {
    const card =
        document.createElement("article");

    card.classList.add("spotlight-card");

    const membershipName =
        member.membershipLevel === 3
            ? "Gold"
            : "Silver";

    const membershipIcon =
        member.membershipLevel === 3
            ? "🥇"
            : "🥈";

    card.innerHTML = `
        <div class="spotlight-card-header">
            <h3>${member.name}</h3>
            <p>${member.tagline}</p>
        </div>

        <div class="spotlight-card-body">
            <div class="spotlight-logo">
                <img
                    src="${member.image}"
                    alt="${member.name} logo"
                    width="160"
                    height="120"
                    loading="${
                        index === 0
                            ? "eager"
                            : "lazy"
                    }"
                    decoding="async"
                >
            </div>

            <div class="spotlight-information">
                <p>
                    <strong>Phone:</strong>
                    <a
                        href="tel:${
                            formatPhoneLink(
                                member.phone
                            )
                        }"
                    >
                        ${member.phone}
                    </a>
                </p>

                <p>
                    <strong>Address:</strong>
                    ${member.address}
                </p>

                <p>
                    <strong>Website:</strong>
                    <a
                        href="${member.website}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Visit Website
                    </a>
                </p>
            </div>

            <span
                class="
                    spotlight-badge
                    ${membershipName.toLowerCase()}
                "
            >
                ${membershipIcon}
                ${membershipName} Member
            </span>
        </div>
    `;

    return card;
}

/* ------------------------------
   Phone Link Helper
--------------------------------*/

function formatPhoneLink(phone) {
    return phone.replace(/[^\d+]/g, "");
}


/* ------------------------------
   Event Listeners
--------------------------------*/

menuButton.addEventListener(
    "click",
    toggleNavigation
);

navigation.addEventListener(
    "click",
    closeMobileNavigation
);

themeButton.addEventListener(
    "click",
    toggleTheme
);


/* ------------------------------
   Start the Page
--------------------------------*/

loadSavedTheme();
getWeatherData();
getSpotlightMembers();