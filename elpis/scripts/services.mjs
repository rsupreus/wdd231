const serviceGrid = document.querySelector("#service-grid");
const serviceMessage = document.querySelector("#service-message");
const filterButtons = document.querySelectorAll(".filter-button");

const serviceDialog = document.querySelector("#service-dialog");
const serviceDialogContent = document.querySelector(
    "#service-dialog-content"
);
const closeServiceDialog = document.querySelector(
    "#close-service-dialog"
);

const planDialog = document.querySelector("#plan-dialog");
const savedServicesContainer = document.querySelector("#saved-services");
const closePlanDialog = document.querySelector("#close-plan-dialog");
const viewPlanButton = document.querySelector("#view-plan-button");
const clearPlanButton = document.querySelector("#clear-plan-button");

const planCount = document.querySelector("#plan-count");

let services = [];

let wellnessPlan =
    JSON.parse(localStorage.getItem("elpisWellnessPlan")) || [];


/* ---------------------------------------
   FETCH SERVICES
--------------------------------------- */

async function getServices() {
    try {
        const response = await fetch("data/services.json");

        if (!response.ok) {
            throw new Error(
                `Unable to load services. Status: ${response.status}`
            );
        }

        services = await response.json();

        setInitialCategory();
        updatePlanCount();

    } catch (error) {
        console.error(error);

        serviceMessage.textContent =
            "We were unable to load the wellness services. Please try again later.";
    }
}


/* ---------------------------------------
   INITIAL CATEGORY
--------------------------------------- */

function setInitialCategory() {
    const parameters = new URLSearchParams(window.location.search);
    const requestedCategory = parameters.get("category");

    if (!requestedCategory) {
        displayServices(services);
        return;
    }

    let category = requestedCategory;

    if (requestedCategory === "Holistic") {
        category = "Holistic Health";
    }

    filterButtons.forEach((button) => {
        button.classList.toggle(
            "active",
            button.dataset.category === category
        );
    });

    filterServices(category);
}


/* ---------------------------------------
   DISPLAY SERVICES
--------------------------------------- */

function displayServices(serviceList) {
    serviceGrid.innerHTML = serviceList
        .map((service) => {
            const isSaved = wellnessPlan.includes(service.id);

            return `
                <article class="service-card">
                    <div class="service-card-content">

                        <p class="service-category">
                            ${service.category}
                        </p>

                        <h3>${service.name}</h3>

                        <p class="service-price">
                            ${service.price}
                        </p>

                        <p>
                            ${service.shortDescription}
                        </p>

                        <div class="service-meta">
                            <span>
                                <strong>Duration:</strong>
                                ${service.duration}
                            </span>

                            <span>
                                <strong>Format:</strong>
                                ${service.format}
                            </span>
                        </div>

                        <div class="service-actions">
                            <button
                                type="button"
                                class="button button-primary details-button"
                                data-id="${service.id}"
                            >
                                Learn More
                            </button>

                            <button
                                type="button"
                                class="button button-secondary save-button"
                                data-id="${service.id}"
                            >
                                ${isSaved ? "Saved ✓" : "Add to My Plan"}
                            </button>
                        </div>

                    </div>
                </article>
            `;
        })
        .join("");

    attachServiceEvents();
}


/* ---------------------------------------
   SERVICE CARD EVENTS
--------------------------------------- */

function attachServiceEvents() {
    const detailButtons =
        document.querySelectorAll(".details-button");

    const saveButtons =
        document.querySelectorAll(".save-button");

    detailButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const serviceId = Number(button.dataset.id);

            showServiceDetails(serviceId);
        });
    });

    saveButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const serviceId = Number(button.dataset.id);

            toggleSavedService(serviceId);
        });
    });
}


/* ---------------------------------------
   FILTER SERVICES
--------------------------------------- */

function filterServices(category) {
    if (category === "All") {
        displayServices(services);
        return;
    }

    const filteredServices = services.filter(
        (service) => service.category === category
    );

    displayServices(filteredServices);
}


filterButtons.forEach((button) => {
    button.addEventListener("click", () => {

        filterButtons.forEach((item) => {
            item.classList.remove("active");
        });

        button.classList.add("active");

        filterServices(button.dataset.category);
    });
});


/* ---------------------------------------
   SERVICE DETAILS DIALOG
--------------------------------------- */

function showServiceDetails(serviceId) {
    const service = services.find(
        (item) => item.id === serviceId
    );

    if (!service) {
        return;
    }

    serviceDialogContent.innerHTML = `
        <p class="eyebrow">
            ${service.category}
        </p>

        <h2>
            ${service.name}
        </h2>

        <p class="service-price">
            ${service.price}
        </p>

        <p>
            ${service.description}
        </p>

        <p>
            <strong>Duration:</strong>
            ${service.duration}
        </p>

        <p>
            <strong>Format:</strong>
            ${service.format}
        </p>

        <p>
            <strong>Best For:</strong>
            ${service.bestFor}
        </p>
    `;

    serviceDialog.showModal();
}


closeServiceDialog.addEventListener("click", () => {
    serviceDialog.close();
});


serviceDialog.addEventListener("click", (event) => {
    if (event.target === serviceDialog) {
        serviceDialog.close();
    }
});


/* ---------------------------------------
   ADD / REMOVE WELLNESS PLAN SERVICES
--------------------------------------- */

function toggleSavedService(serviceId) {

    if (wellnessPlan.includes(serviceId)) {

        wellnessPlan = wellnessPlan.filter(
            (id) => id !== serviceId
        );

        serviceMessage.textContent =
            "Service removed from your wellness plan.";

    } else {

        wellnessPlan.push(serviceId);

        serviceMessage.textContent =
            "Service added to your wellness plan.";
    }

    saveWellnessPlan();

    const activeCategory =
        document.querySelector(".filter-button.active")
            ?.dataset.category || "All";

    filterServices(activeCategory);
}


/* ---------------------------------------
   LOCAL STORAGE
--------------------------------------- */

function saveWellnessPlan() {
    localStorage.setItem(
        "elpisWellnessPlan",
        JSON.stringify(wellnessPlan)
    );

    updatePlanCount();
}


function updatePlanCount() {
    planCount.textContent = wellnessPlan.length;
}


/* ---------------------------------------
   WELLNESS PLAN DIALOG
--------------------------------------- */

function showSavedServices() {
    const savedServices = services.filter((service) =>
        wellnessPlan.includes(service.id)
    );

    if (savedServices.length === 0) {

        savedServicesContainer.innerHTML = `
            <p>
                You have not saved any services yet.
                Explore the services and add the ones
                that interest you.
            </p>
        `;

    } else {

        savedServicesContainer.innerHTML = savedServices
            .map(
                (service) => `
                    <article class="saved-service">

                        <h3>
                            ${service.name}
                        </h3>

                        <p class="service-price">
                            ${service.price}
                        </p>

                        <p>
                            <strong>Category:</strong>
                            ${service.category}
                        </p>

                        <p>
                            ${service.shortDescription}
                        </p>

                    </article>
                `
            )
            .join("");
    }

    planDialog.showModal();
}


viewPlanButton.addEventListener("click", () => {
    showSavedServices();
});


closePlanDialog.addEventListener("click", () => {
    planDialog.close();
});


planDialog.addEventListener("click", (event) => {
    if (event.target === planDialog) {
        planDialog.close();
    }
});


/* ---------------------------------------
   CLEAR WELLNESS PLAN
--------------------------------------- */

clearPlanButton.addEventListener("click", () => {
    wellnessPlan = [];

    saveWellnessPlan();

    savedServicesContainer.innerHTML = `
        <p>
            Your wellness plan is now empty.
        </p>
    `;

    const activeCategory =
        document.querySelector(".filter-button.active")
            ?.dataset.category || "All";

    filterServices(activeCategory);

    serviceMessage.textContent =
        "Your wellness plan has been cleared.";
});


/* ---------------------------------------
   START APPLICATION
--------------------------------------- */

getServices();