const memberContainer = document.querySelector("#member-container");
const gridButton = document.querySelector("#grid-button");
const listButton = document.querySelector("#list-button");
const menuButton = document.querySelector("#menu-button");
const navigation = document.querySelector("#primary-navigation");
const themeButton = document.querySelector("#theme-button");

const memberDataUrl = "data/members.json";

/**
 * Fetch the member information from the JSON file.
 */
async function getMemberData() {
    try {
        const response = await fetch(memberDataUrl);

        if (!response.ok) {
            throw new Error(`Unable to load members: ${response.status}`);
        }

        const data = await response.json();
        displayMembers(data.members);
    } catch (error) {
        console.error(error);

        memberContainer.innerHTML = `
            <p class="directory-error">
                The business directory could not be loaded.
                Please try again later.
            </p>
        `;
    }
}

/**
 * Create and display each Chamber member card.
 *
 * @param {Array} members - Array of member objects.
 */
function displayMembers(members) {
    memberContainer.innerHTML = "";

    members.forEach((member) => {
        const card = createMemberCard(member);
        memberContainer.appendChild(card);
    });
}

/**
 * Create one member card.
 *
 * @param {Object} member - Chamber member information.
 * @returns {HTMLElement} The completed member card.
 */
function createMemberCard(member) {
    const card = document.createElement("article");
    card.classList.add("member-card");

    const header = createMemberHeader(member);
    const body = createMemberBody(member);

    card.append(header, body);

    return card;
}

/**
 * Create the business name and tagline section.
 *
 * @param {Object} member - Chamber member information.
 * @returns {HTMLElement} The card header.
 */
function createMemberHeader(member) {
    const header = document.createElement("div");
    header.classList.add("member-card-header");

    const businessName = document.createElement("h2");
    businessName.textContent = member.name;

    const tagline = document.createElement("p");
    tagline.textContent = member.tagline;

    header.append(businessName, tagline);

    return header;
}

/**
 * Create the logo and business details section.
 *
 * @param {Object} member - Chamber member information.
 * @returns {HTMLElement} The card body.
 */
function createMemberBody(member) {
    const body = document.createElement("div");
    body.classList.add("member-card-body");

    const logoContainer = createLogoContainer(member);
    const details = createMemberDetails(member);
    const membership = createMembershipBadge(member);

    body.append(logoContainer, details, membership);

    return body;
}

/**
 * Create the business logo container.
 *
 * @param {Object} member - Chamber member information.
 * @returns {HTMLElement} The logo container.
 */
function createLogoContainer(member) {
    const logoContainer = document.createElement("div");
    logoContainer.classList.add("logo-container");

    const image = document.createElement("img");
    image.src = member.image;
    image.alt = `${member.name} business logo`;
    image.width = 200;
    image.height = 200;
    image.loading = "lazy";

    logoContainer.appendChild(image);

    return logoContainer;
}

/**
 * Create the address, phone, website, and membership information.
 *
 * @param {Object} member - Chamber member information.
 * @returns {HTMLElement} The member details container.
 */
function createMemberDetails(member) {
    const details = document.createElement("div");
    details.classList.add("member-details");

    const address = document.createElement("p");
    address.classList.add("member-address");
    address.innerHTML = `
        <strong>Address:</strong>
        ${member.address}
    `;

    const phone = document.createElement("p");
    phone.classList.add("member-phone");
    phone.innerHTML = `
        <strong>Phone:</strong>
        <a href="tel:${formatPhoneLink(member.phone)}">
            ${member.phone}
        </a>
    `;

    const website = document.createElement("p");
    website.classList.add("member-website");
    website.innerHTML = `
        <strong>Website:</strong>
        <a
            href="${member.website}"
            target="_blank"
            rel="noopener noreferrer"
        >
            Visit Website
        </a>
    `;

    details.append(address, phone, website);

    return details;
}

function createMembershipBadge(member) {
    const membership = document.createElement("span");
    membership.classList.add("membership-badge");

    membership.textContent =
        `${getMembershipName(member.membershipLevel)} Member`;

    return membership;
}


/**
 * Remove formatting from a phone number for a telephone link.
 *
 * @param {string} phone - Formatted phone number.
 * @returns {string} Telephone-link-compatible phone number.
 */
function formatPhoneLink(phone) {
    return phone.replace(/[^\d+]/g, "");
}

/**
 * Convert the numeric membership level to a membership name.
 *
 * @param {number} level - Numeric membership level.
 * @returns {string} Membership level name.
 */
function getMembershipName(level) {
    const membershipLevels = {
        1: "Standard",
        2: "Silver",
        3: "Gold"
    };

    return membershipLevels[level] ?? "Standard";
}

/**
 * Change the directory to the grid view.
 */
function setGridView() {
    memberContainer.classList.add("grid-view");
    memberContainer.classList.remove("list-view");

    gridButton.classList.add("active-view");
    listButton.classList.remove("active-view");

    gridButton.setAttribute("aria-pressed", "true");
    listButton.setAttribute("aria-pressed", "false");
}

/**
 * Change the directory to the list view.
 */
function setListView() {
    memberContainer.classList.add("list-view");
    memberContainer.classList.remove("grid-view");

    listButton.classList.add("active-view");
    gridButton.classList.remove("active-view");

    listButton.setAttribute("aria-pressed", "true");
    gridButton.setAttribute("aria-pressed", "false");
}

/**
 * Open or close the mobile navigation menu.
 */
function toggleNavigation() {
    const isOpen = navigation.classList.toggle("open");

    menuButton.setAttribute("aria-expanded", String(isOpen));

    menuButton.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
    );

    menuButton.textContent = isOpen ? "✕" : "☰";
}

/**
 * Close the mobile menu after a navigation link is selected.
 *
 * @param {Event} event - Navigation click event.
 */
function closeMobileNavigation(event) {
    if (!event.target.matches(".navigation a")) {
        return;
    }

    navigation.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");
    menuButton.textContent = "☰";
}

/**
 * Toggle between the light and dark themes.
 */
function toggleTheme() {
    document.body.classList.toggle("dark-theme");

    const darkThemeEnabled =
        document.body.classList.contains("dark-theme");

    themeButton.textContent = darkThemeEnabled ? "☀" : "◐";

    localStorage.setItem(
        "chamber-theme",
        darkThemeEnabled ? "dark" : "light"
    );
}

/**
 * Restore the user's previously selected theme.
 */
function loadSavedTheme() {
    const savedTheme = localStorage.getItem("chamber-theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-theme");
        themeButton.textContent = "☀";
    }
}

gridButton.addEventListener("click", setGridView);
listButton.addEventListener("click", setListView);
menuButton.addEventListener("click", toggleNavigation);
navigation.addEventListener("click", closeMobileNavigation);
themeButton.addEventListener("click", toggleTheme);

loadSavedTheme();
setGridView();
getMemberData();