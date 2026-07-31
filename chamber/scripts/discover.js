import { places } from "../data/discover.mjs";

const discoverGrid = document.querySelector("#discover-grid");
const visitorMessage = document.querySelector("#visitor-message");

const menuButton = document.querySelector("#menu-button");
const navigation = document.querySelector("#primary-navigation");
const themeButton = document.querySelector("#theme-button");

const currentYear = document.querySelector("#current-year");
const lastModified = document.querySelector("#last-modified");

const millisecondsPerDay = 1000 * 60 * 60 * 24;


/* --------------------------------
   Discover cards
-------------------------------- */

/**
 * Create cards 2–8.
 *
 * The first attraction is already written in the HTML,
 * so this function skips the first item in the array.
 *
 * @param {Array} placeList - Array of attraction objects.
 */
function displayPlaces(placeList) {
    if (!discoverGrid) {
        return;
    }

    /*
     * Do not clear discoverGrid.innerHTML.
     * Clearing it would remove the first static card.
     */
    const remainingPlaces = placeList.slice(1);

    remainingPlaces.forEach((place) => {
        const card = createPlaceCard(place);
        discoverGrid.appendChild(card);
    });
}


/**
 * Create one Discover attraction card.
 *
 * @param {Object} place - Attraction information.
 * @returns {HTMLElement} Completed attraction card.
 */
function createPlaceCard(place) {
    const card = document.createElement("article");
    card.classList.add("discover-card");

    const heading = document.createElement("h2");
    heading.textContent = place.name;

    const figure = document.createElement("figure");

    const image = document.createElement("img");
    image.src = place.image;
    image.alt = place.alt;
    image.width = 300;
    image.height = 200;
    image.loading = "lazy";
    image.decoding = "async";

    figure.appendChild(image);

    const address = document.createElement("address");
    address.textContent = place.address;

    const description = document.createElement("p");
    description.textContent = place.description;

    const link = document.createElement("a");
    link.classList.add("learn-more");
    link.href = place.website;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    /*
     * Descriptive link text fixes the Lighthouse SEO warning
     * caused by eight links all saying "Learn More."
     */
    link.textContent = `Explore ${place.name}`;

    link.setAttribute(
        "aria-label",
        `Explore more information about ${place.name}`
    );

    card.append(
        heading,
        figure,
        address,
        description,
        link
    );

    return card;
}


/* --------------------------------
   Visitor message
-------------------------------- */

function displayVisitorMessage() {
    if (!visitorMessage) {
        return;
    }

    const currentVisit = Date.now();

    const previousVisit = Number(
        localStorage.getItem("discoverLastVisit")
    );

    if (!previousVisit) {
        visitorMessage.textContent =
            "Welcome! Let us know if you have any questions.";
    } else {
        const timeDifference = currentVisit - previousVisit;

        const daysBetween = Math.floor(
            timeDifference / millisecondsPerDay
        );

        if (daysBetween < 1) {
            visitorMessage.textContent =
                "Back so soon! Awesome!";
        } else if (daysBetween === 1) {
            visitorMessage.textContent =
                "You last visited 1 day ago.";
        } else {
            visitorMessage.textContent =
                `You last visited ${daysBetween} days ago.`;
        }
    }

    localStorage.setItem(
        "discoverLastVisit",
        currentVisit.toString()
    );
}


/* --------------------------------
   Mobile navigation
-------------------------------- */

function toggleNavigation() {
    if (!navigation || !menuButton) {
        return;
    }

    const isOpen = navigation.classList.toggle("open");

    menuButton.setAttribute(
        "aria-expanded",
        String(isOpen)
    );

    menuButton.setAttribute(
        "aria-label",
        isOpen
            ? "Close navigation menu"
            : "Open navigation menu"
    );

    menuButton.textContent = isOpen ? "✕" : "☰";
}


function closeMobileNavigation(event) {
    if (
        !navigation ||
        !menuButton ||
        !event.target.matches(".navigation a")
    ) {
        return;
    }

    navigation.classList.remove("open");

    menuButton.setAttribute(
        "aria-expanded",
        "false"
    );

    menuButton.setAttribute(
        "aria-label",
        "Open navigation menu"
    );

    menuButton.textContent = "☰";
}


/* --------------------------------
   Theme
-------------------------------- */

function toggleTheme() {
    document.body.classList.toggle("dark-theme");

    const darkThemeEnabled =
        document.body.classList.contains("dark-theme");

    if (themeButton) {
        themeButton.textContent =
            darkThemeEnabled ? "☀" : "◐";
    }

    localStorage.setItem(
        "chamber-theme",
        darkThemeEnabled ? "dark" : "light"
    );
}


function loadSavedTheme() {
    const savedTheme =
        localStorage.getItem("chamber-theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-theme");

        if (themeButton) {
            themeButton.textContent = "☀";
        }
    }
}


/* --------------------------------
   Footer dates
-------------------------------- */

function displayFooterDates() {
    if (currentYear) {
        currentYear.textContent =
            new Date().getFullYear();
    }

    if (lastModified) {
        lastModified.textContent =
            `Last Modified: ${document.lastModified}`;
    }
}


/* --------------------------------
   Event listeners
-------------------------------- */

if (menuButton) {
    menuButton.addEventListener(
        "click",
        toggleNavigation
    );
}

if (navigation) {
    navigation.addEventListener(
        "click",
        closeMobileNavigation
    );
}

if (themeButton) {
    themeButton.addEventListener(
        "click",
        toggleTheme
    );
}


/* --------------------------------
   Start the page
-------------------------------- */

loadSavedTheme();
displayFooterDates();
displayVisitorMessage();
displayPlaces(places);

