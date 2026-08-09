const selectedServicesSummary =
    document.querySelector("#selected-services-summary");

const selectedServicesInput =
    document.querySelector("#selected-services");

const serviceSelect =
    document.querySelector('select[name="service"]');

const wellnessPlan =
    JSON.parse(localStorage.getItem("elpisWellnessPlan")) || [];


async function loadSelectedServices() {
    if (wellnessPlan.length === 0) {
        displayEmptyPlan();
        return;
    }

    try {
        const response = await fetch("data/services.json");

        if (!response.ok) {
            throw new Error(
                `Unable to load services. Status: ${response.status}`
            );
        }

        const services = await response.json();

        const selectedServices = services.filter((service) =>
            wellnessPlan.includes(service.id)
        );

        displaySelectedServices(selectedServices);
        updateHiddenField(selectedServices);
        prefillPrimaryCategory(selectedServices);

    } catch (error) {
        console.error(error);

        selectedServicesSummary.innerHTML = `
            <p>
                We were unable to load your saved wellness services.
                You can still complete the consultation form below.
            </p>
        `;
    }
}

const consultationForm = document.querySelector(".consultation-form");

if (consultationForm) {
    consultationForm.addEventListener("submit", () => {
        const timestamp = document.querySelector("#timestamp");

        if (timestamp) {
            timestamp.value = new Date().toISOString();
        }
    });
}


function displaySelectedServices(selectedServices) {
    if (selectedServices.length === 0) {
        displayEmptyPlan();
        return;
    }

    selectedServicesSummary.innerHTML = `
        <p class="selected-services-intro">
            You selected the following services:
        </p>

        <ul class="selected-services-list">
            ${selectedServices
                .map(
                    (service) => `
                        <li>
                            <strong>${service.name}</strong>
                            <span>${service.price}</span>
                        </li>
                    `
                )
                .join("")}
        </ul>
    `;
}


function updateHiddenField(selectedServices) {
    selectedServicesInput.value = selectedServices
        .map((service) => service.name)
        .join(", ");
}


function prefillPrimaryCategory(selectedServices) {
    if (!serviceSelect || selectedServices.length === 0) {
        return;
    }

    const categories = [
        ...new Set(
            selectedServices.map((service) => service.category)
        )
    ];

    if (categories.length === 1) {
        serviceSelect.value = categories[0];
    } else {
        serviceSelect.value = "Not Sure";
    }
}


function displayEmptyPlan() {
    selectedServicesSummary.innerHTML = `
        <p>
            No services have been added to your wellness plan yet.
            You can still choose an area of interest below.
        </p>
    `;

    selectedServicesInput.value = "";
}


loadSelectedServices();
