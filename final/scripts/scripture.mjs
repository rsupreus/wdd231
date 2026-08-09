const scriptureText = document.querySelector("#scripture-text");
const scriptureReference = document.querySelector("#scripture-reference");

const pageScriptures = {
    "index.html": [
        {
            book: "philippians",
            chapter: 4,
            verse: 13
        },
        {
            book: "isaiah",
            chapter: 40,
            verse: 31
        },
        {
            book: "proverbs",
            chapter: 3,
            verse: 5
        },
        {
            book: "psalms",
            chapter: 46,
            verse: 10
        }
    ],

    "services.html": [
        {
            book: "alma",
            chapter: 32,
            verse: 21
        },
        {
            book: "mosiah",
            chapter: 2,
            verse: 17
        },
        {
            book: "ether",
            chapter: 12,
            verse: 27
        },
        {
            book: "doctrine-and-covenants",
            chapter: 10,
            verse: 4
        }
    ],

    "contact.html": [
        {
            book: "proverbs",
            chapter: 16,
            verse: 3
        },
        {
            book: "matthew",
            chapter: 11,
            verse: 28
        },
        {
            book: "john",
            chapter: 14,
            verse: 27
        },
        {
            book: "james",
            chapter: 1,
            verse: 5
        }
    ]
};


function getCurrentPage() {
    const page = window.location.pathname.split("/").pop();

    return page || "index.html";
}


function getRandomScripture(scriptures) {
    const randomIndex = Math.floor(
        Math.random() * scriptures.length
    );

    return scriptures[randomIndex];
}


async function loadScripture() {
    if (!scriptureText || !scriptureReference) {
        return;
    }

    const currentPage = getCurrentPage();

    const scripturePool =
        pageScriptures[currentPage] || pageScriptures["index.html"];

    const selectedScripture =
        getRandomScripture(scripturePool);

    const apiUrl =
        `https://openscriptureapi.org/api/scriptures/v1/lds/en/book/` +
        `${selectedScripture.book}/` +
        `${selectedScripture.chapter}/` +
        `${selectedScripture.verse}`;

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(
                `Scripture request failed: ${response.status}`
            );
        }

        const data = await response.json();

        scriptureText.textContent = `“${data.text}”`;
        scriptureReference.textContent = data.reference;

    } catch (error) {
        console.error("Unable to load scripture:", error);

        scriptureText.textContent =
            "“I can do all things through Christ which strengtheneth me.”";

        scriptureReference.textContent =
            "Philippians 4:13";
    }
}


loadScripture();