// Course data and course-card filtering will be added in the next step.

const courses = [
    {
        subject: "CSE",
        number: 110,
        title: "Introduction to Programming",
        credits: 2,
        certificate: "Web and Computer Programming",
        description:
            "This course introduces students to programming using functions, variables, decisions, and loops.",
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
            "This course introduces students to HTML, CSS, responsive design, accessibility, and web development fundamentals.",
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
            "This course teaches students how to write organized programs using functions, testing, and problem-solving techniques.",
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
            "This course introduces object-oriented programming using classes and reusable software components.",
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
            "This course focuses on responsive design and dynamic web pages using HTML, CSS, and JavaScript.",
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
            "This course develops frontend web development skills using JavaScript, APIs, responsive design, and accessible interfaces.",
        technology: ["HTML", "CSS", "JavaScript"],
        completed: false
    }
];

const courseContainer = document.querySelector("#course-cards");
const totalCredits = document.querySelector("#total-credits");

const allButton = document.querySelector("#all");
const cseButton = document.querySelector("#cse");
const wddButton = document.querySelector("#wdd");

function displayCourses(courseList) {
    courseContainer.innerHTML = "";

    courseList.forEach((course) => {
        const courseCard = document.createElement("article");

        courseCard.classList.add("course-card");

        if (course.completed) {
            courseCard.classList.add("completed");
        }

        const courseName = document.createElement("h3");
        courseName.textContent = `${course.subject} ${course.number}`;

        const courseTitle = document.createElement("p");
        courseTitle.textContent = course.title;

        courseCard.append(courseName, courseTitle);
        courseContainer.appendChild(courseCard);
    });

    displayTotalCredits(courseList);
}

function displayTotalCredits(courseList) {
    const creditTotal = courseList.reduce(
        (total, course) => total + course.credits,
        0
    );

    totalCredits.textContent = creditTotal;
}

function setActiveFilter(selectedButton) {
    const filterButtons = [allButton, cseButton, wddButton];

    filterButtons.forEach((button) => {
        button.classList.remove("selected");
        button.removeAttribute("aria-pressed");
    });

    selectedButton.classList.add("selected");
    selectedButton.setAttribute("aria-pressed", "true");
}

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

displayCourses(courses);
setActiveFilter(allButton);