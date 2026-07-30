const params = new URLSearchParams(window.location.search);

const first = params.get("first");
const last = params.get("last");
const email = params.get("email");
const phone = params.get("phone");
const organization = params.get("organization");
const timestamp = params.get("timestamp");

const summary = document.querySelector("#application-summary");

summary.innerHTML = `
    <h2>Application Details</h2>
    <p><strong>First Name:</strong> ${first}</p>
    <p><strong>Last Name:</strong> ${last}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Business:</strong> ${organization}</p>
    <p><strong>Submitted:</strong> ${new Date(timestamp).toLocaleString()}</p>
`;