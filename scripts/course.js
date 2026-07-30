const courses = [
    {
        subject: "CSE",
        number: 110,
        title: "Introduction to Programming",
        credits: 2,
        certificate: "Web and Computer Programming",
        description:
            "This course introduces students to programming using variables, decisions, loops, functions, and problem-solving techniques.",
        technology: ["Python"],
        completed: true
    },
    {
        subject: "WDD",
        number: 130,
        title: "Web Fundamentals",
        credits: 2,
        certificate: "Web and Computer Programming",
        description:
            "This course introduces students to HTML, CSS, responsive design, accessibility, and foundational web development practices.",
        technology: ["HTML", "CSS"],
        completed: true
    },
    {
        subject: "CSE",
        number: 111,
        title: "Programming with Functions",
        credits: 2,
        certificate: "Web and Computer Programming",
        description:
            "This course teaches students how to write organized programs using functions, testing, debugging, and problem-solving techniques.",
        technology: ["Python"],
        completed: true
    },
    {
        subject: "CSE",
        number: 210,
        title: "Programming with Classes",
        credits: 2,
        certificate: "Web and Computer Programming",
        description:
            "This course introduces object-oriented programming using classes, encapsulation, inheritance, polymorphism, and abstraction.",
        technology: ["C#"],
        completed: false
    },
    {
        subject: "WDD",
        number: 131,
        title: "Dynamic Web Fundamentals",
        credits: 2,
        certificate: "Web and Computer Programming",
        description:
            "This course focuses on responsive web design and dynamic webpages using HTML, CSS, JavaScript, APIs, and accessible interfaces.",
        technology: ["HTML", "CSS", "JavaScript"],
        completed: true
    },
    {
        subject: "WDD",
        number: 231,
        title: "Frontend Web Development I",
        credits: 2,
        certificate: "Web and Computer Programming",
        description:
            "This course develops frontend web development skills using JavaScript, JSON, APIs, responsive design, and modern web standards.",
        technology: ["HTML", "CSS", "JavaScript"],
        completed: false
    }
];

// DOM selections
const courseCards = document.querySelector("#course-cards");
const totalCredits = document.querySelector("#total-credits");

const allButton = document.querySelector("#all");
const cseButton = document.querySelector("#cse");
const wddButton = document.querySelector("#wdd");

const courseDetails = document.querySelector("#course-details");

/**
 * Displays the selected course's information in the dialog.
 * @param {Object} course
 */
function displayCourseDetails(course) {
    courseDetails.innerHTML = `
        <button
            type="button"
            id="close-modal"
            aria-label="Close course details"
        >
            ✕
        </button>

        <h2>${course.subject} ${course.number}</h2>
        <h3>${course.title}</h3>

        <p>
            <strong>Credits:</strong>
            ${course.credits}
        </p>

        <p>${course.description}</p>

        <p>
            <strong>Certificate:</strong>
            ${course.certificate}
        </p>

        <p>
            <strong>Technology:</strong>
            ${course.technology.join(", ")}
        </p>
    `;

    const closeButton = courseDetails.querySelector("#close-modal");

    closeButton.addEventListener("click", () => {
        courseDetails.close();
    });

    courseDetails.showModal();
}

/**
 * Calculates and displays the total credits for the visible courses.
 * @param {Array} courseList
 */
function displayTotalCredits(courseList) {
    const creditTotal = courseList.reduce(
        (total, course) => total + course.credits,
        0
    );

    totalCredits.textContent = creditTotal;
}

/**
 * Creates and displays the course cards.
 * @param {Array} courseList
 */
function displayCourses(courseList) {
    courseCards.innerHTML = "";

    courseList.forEach((course) => {
        const card = document.createElement("article");
        const courseName = document.createElement("h3");
        const courseTitle = document.createElement("p");

        card.classList.add("course-card");
        card.setAttribute("tabindex", "0");
        card.setAttribute("role", "button");
        card.setAttribute(
            "aria-label",
            `View details for ${course.subject} ${course.number}`
        );

        if (course.completed) {
            card.classList.add("completed");
        }

        courseName.textContent =
            `${course.subject} ${course.number}`;

        courseTitle.textContent = course.title;

        card.appendChild(courseName);
        card.appendChild(courseTitle);

        card.addEventListener("click", () => {
            displayCourseDetails(course);
        });

        card.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                displayCourseDetails(course);
            }
        });

        courseCards.appendChild(card);
    });

    displayTotalCredits(courseList);
}

/**
 * Marks the selected filter button as active.
 * @param {HTMLButtonElement} selectedButton
 */
function setActiveFilter(selectedButton) {
    const filterButtons = [allButton, cseButton, wddButton];

    filterButtons.forEach((button) => {
        const isSelected = button === selectedButton;

        button.classList.toggle("selected", isSelected);
        button.setAttribute("aria-pressed", isSelected);
    });
}

// Course-filter event listeners
allButton.addEventListener("click", () => {
    displayCourses(courses);
    setActiveFilter(allButton);
});

cseButton.addEventListener("click", () => {
    const cseCourses = courses.filter(
        (course) => course.subject === "CSE"
    );

    displayCourses(cseCourses);
    setActiveFilter(cseButton);
});

wddButton.addEventListener("click", () => {
    const wddCourses = courses.filter(
        (course) => course.subject === "WDD"
    );

    displayCourses(wddCourses);
    setActiveFilter(wddButton);
});

// Close the dialog when the user clicks its backdrop.
courseDetails.addEventListener("click", (event) => {
    const dialogBounds = courseDetails.getBoundingClientRect();

    const clickedOutside =
        event.clientX < dialogBounds.left ||
        event.clientX > dialogBounds.right ||
        event.clientY < dialogBounds.top ||
        event.clientY > dialogBounds.bottom;

    if (clickedOutside) {
        courseDetails.close();
    }
});

// Initial page display
displayCourses(courses);
setActiveFilter(allButton);