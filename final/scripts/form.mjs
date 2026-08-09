const submittedInformation =
    document.querySelector("#submitted-information");

const parameters =
    new URLSearchParams(window.location.search);

const firstName = parameters.get("first");
const lastName = parameters.get("last");
const email = parameters.get("email");
const phone = parameters.get("phone");
const service = parameters.get("service");
const contactMethod = parameters.get("contact-method");
const selectedServices = parameters.get("selected-services");
const goals = parameters.get("goals");
const timestamp = parameters.get("timestamp");

function launchConfetti() {
    const container = document.querySelector("#confetti-container");

    if (!container) {
        return;
    }

    const colors = [
        "#226776",
        "#13989c",
        "#9ecdd4",
        "#f2b08b"
    ];

    for (let i = 0; i < 60; i++) {
        const confetti = document.createElement("span");

        confetti.classList.add("confetti-piece");

        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.backgroundColor =
            colors[Math.floor(Math.random() * colors.length)];

        confetti.style.animationDelay =
            `${Math.random() * 0.8}s`;

        confetti.style.animationDuration =
            `${2.8 + Math.random() * 1.5}s`;

        confetti.style.transform =
            `rotate(${Math.random() * 360}deg)`;

        container.appendChild(confetti);
    }

    setTimeout(() => {
        container.innerHTML = "";
    }, 5000);
}

launchConfetti();


function formatSubmissionDate(dateString) {
    if (!dateString) {
        return "Not provided";
    }

    const date = new Date(dateString);

    return new Intl.DateTimeFormat("en-US", {
        dateStyle: "long",
        timeStyle: "short"
    }).format(date);
}



submittedInformation.innerHTML = `
    <dl>
        <dt>Name</dt>
        <dd>${firstName} ${lastName}</dd>

        <dt>Email</dt>
        <dd>${email}</dd>

        <dt>Phone</dt>
        <dd>${phone || "Not provided"}</dd>

        <dt>Selected Services</dt>
        <dd>${selectedServices || "None selected"}</dd>

        <dt>Wellness Interest</dt>
        <dd>${service}</dd>

        <dt>Preferred Contact</dt>
        <dd>${contactMethod}</dd>

        <dt>Goals</dt>
        <dd>${goals}</dd>

        <dt>Submitted</dt>
        <dd>${formatSubmissionDate(timestamp)}</dd>
    </dl>
`;