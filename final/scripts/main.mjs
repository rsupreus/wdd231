const menuButton = document.querySelector("#menu-button");
const navigation = document.querySelector("#primary-navigation");

if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
        const isOpen = navigation.classList.toggle("open");

        menuButton.setAttribute("aria-expanded", isOpen);

        menuButton.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );
    });

    navigation.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navigation.classList.remove("open");
            menuButton.setAttribute("aria-expanded", "false");
            menuButton.setAttribute(
                "aria-label",
                "Open navigation menu"
            );
        });
    });
}

const themeButton = document.querySelector("#theme-button");

function applySavedTheme() {
    const savedTheme = localStorage.getItem("elpisTheme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");

        if (themeButton) {
            themeButton.textContent = "☀";
            themeButton.setAttribute(
                "aria-label",
                "Switch to light mode"
            );
        }
    }
}

if (themeButton) {
    themeButton.addEventListener("click", () => {
        const darkModeEnabled =
            document.body.classList.toggle("dark-mode");

        if (darkModeEnabled) {
            localStorage.setItem("elpisTheme", "dark");

            themeButton.textContent = "☀";
            themeButton.setAttribute(
                "aria-label",
                "Switch to light mode"
            );

        } else {
            localStorage.setItem("elpisTheme", "light");

            themeButton.textContent = "☾";
            themeButton.setAttribute(
                "aria-label",
                "Switch to dark mode"
            );
        }
    });
}

applySavedTheme();

const yearElements = document.querySelectorAll("#current-year");

yearElements.forEach((element) => {
    element.textContent = new Date().getFullYear();
});