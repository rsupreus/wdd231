// ========================================
// Header Navigation
// ========================================

const menuButton = document.querySelector("#menu-button");
const navigation = document.querySelector("#primary-navigation");

menuButton.addEventListener("click", () => {
    navigation.classList.toggle("open");

    const isOpen = navigation.classList.contains("open");

    menuButton.setAttribute("aria-expanded", isOpen);

    menuButton.setAttribute(
        "aria-label",
        isOpen
            ? "Close navigation menu"
            : "Open navigation menu"
    );

    menuButton.textContent = isOpen ? "✕" : "☰";
});


// Close mobile menu after selecting a link

navigation.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
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
});


// ========================================
// Dark / Light Theme
// ========================================

const themeButton = document.querySelector("#theme-button");

function setTheme(theme) {
    if (theme === "dark") {
        document.body.classList.add("dark-theme");
        themeButton.textContent = "☀";
        themeButton.setAttribute(
            "aria-label",
            "Switch to light mode"
        );
    } else {
        document.body.classList.remove("dark-theme");
        themeButton.textContent = "◐";
        themeButton.setAttribute(
            "aria-label",
            "Switch to dark mode"
        );
    }
}


// Load saved theme

const savedTheme = localStorage.getItem("chamber-theme");

if (savedTheme === "dark") {
    setTheme("dark");
} else {
    setTheme("light");
}


// Toggle theme

themeButton.addEventListener("click", () => {
    const isDark =
        document.body.classList.contains("dark-theme");

    const newTheme = isDark ? "light" : "dark";

    setTheme(newTheme);

    localStorage.setItem(
        "chamber-theme",
        newTheme
    );
});


// ========================================
// Join Form Timestamp
// ========================================

const timestamp = document.querySelector("#timestamp");

if (timestamp) {
    timestamp.value = new Date().toISOString();
}


// ========================================
// Membership Modals
// ========================================

const modalButtons =
    document.querySelectorAll("[data-modal]");

const closeButtons =
    document.querySelectorAll(".modal-close");

const dialogs =
    document.querySelectorAll(".membership-modal");


modalButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const dialog = document.querySelector(
            `#${button.dataset.modal}`
        );

        if (dialog) {
            dialog.showModal();
        }
    });
});


closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const dialog = button.closest("dialog");

        if (dialog) {
            dialog.close();
        }
    });
});


dialogs.forEach((dialog) => {
    dialog.addEventListener("click", (event) => {
        if (event.target === dialog) {
            dialog.close();
        }
    });
});


// ========================================
// Update Timestamp on Form Submit
// ========================================

const joinForm = document.querySelector(".join-form");

if (joinForm) {
    joinForm.addEventListener("submit", () => {
        if (timestamp) {
            timestamp.value =
                new Date().toISOString();
        }
    });
}