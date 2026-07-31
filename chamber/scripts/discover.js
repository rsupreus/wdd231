import { places } from "../data/discover.mjs";

const discoverGrid = document.querySelector("#discover-grid");
const visitorMessage = document.querySelector("#visitor-message");

const millisecondsPerDay = 1000 * 60 * 60 * 24;

/**
 * Create and display the attraction cards.
 */
function displayPlaces(placeList) {
    if (!discoverGrid) {
        return;
    }

    discoverGrid.innerHTML = "";

    placeList.forEach((place, index) => {
        const card = document.createElement("article");
        const heading = document.createElement("h2");
        const figure = document.createElement("figure");
        const image = document.createElement("img");
        const address = document.createElement("address");
        const description = document.createElement("p");
        const link = document.createElement("a");

        card.classList.add("discover-card");

        heading.textContent = place.name;

        image.src = place.image;
        image.alt = place.alt;
        image.width = 300;
        image.height = 200;
        image.decoding = "async";

        /*
         * Load the first two images immediately because they
         * may be visible when the page first opens. Lazy-load
         * the remaining images.
         */
        if (index === 0) {
            image.loading = "eager";
            image.fetchPriority = "high";
        } else {
            image.loading = "lazy";
            image.fetchPriority = "low";
        }

        figure.appendChild(image);

        address.textContent = place.address;

        description.textContent = place.description;

        link.classList.add("learn-more");
        link.href = place.website;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = `Learn about ${place.name}`;
        link.setAttribute(
            "aria-label",
            `Learn more about ${place.name}`
        );

        card.appendChild(heading);
        card.appendChild(figure);
        card.appendChild(address);
        card.appendChild(description);
        card.appendChild(link);

        discoverGrid.appendChild(card);
    });
}

/**
 * Display a message based on the visitor's previous visit.
 */
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

displayPlaces(places);
displayVisitorMessage();