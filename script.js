/* =====================================================
   1. TYPING ANIMATION
===================================================== */

const typingElement = document.getElementById("typing");

const words = [
    "BCA Student",
    "Web Developer",
    "AWS Learner",
    "Programmer"
];

let wordIndex = 0;
let characterIndex = 0;
let deleting = false;


function typeEffect() {

    const currentWord = words[wordIndex];

    if (!deleting) {

        typingElement.textContent =
            currentWord.substring(0, characterIndex + 1);

        characterIndex++;

        if (characterIndex === currentWord.length) {

            deleting = true;

            setTimeout(typeEffect, 1500);

            return;
        }

    } else {

        typingElement.textContent =
            currentWord.substring(0, characterIndex - 1);

        characterIndex--;

        if (characterIndex === 0) {

            deleting = false;

            wordIndex++;

            if (wordIndex >= words.length) {
                wordIndex = 0;
            }

        }
    }

    setTimeout(typeEffect, deleting ? 50 : 100);
}


typeEffect();


/* =====================================================
   2. DARK / LIGHT MODE
===================================================== */

const themeButton =
    document.getElementById("themeButton");


themeButton.addEventListener("click", function () {

    document.body.classList.toggle("dark-mode");


    if (document.body.classList.contains("dark-mode")) {

        themeButton.textContent = "☀️ Light Mode";

        localStorage.setItem("theme", "dark");

    } else {

        themeButton.textContent = "🌙 Dark Mode";

        localStorage.setItem("theme", "light");
    }

});


/* =====================================================
   3. REMEMBER THEME
===================================================== */

const savedTheme =
    localStorage.getItem("theme");


if (savedTheme === "dark") {

    document.body.classList.add("dark-mode");

    themeButton.textContent = "☀️ Light Mode";
}


/* =====================================================
   4. ANIMATED SKILL BARS
===================================================== */

const skillBars =
    document.querySelectorAll(".skill-progress");


window.addEventListener("load", function () {

    skillBars.forEach(function (bar) {

        const level =
            bar.getAttribute("data-level");

        setTimeout(function () {

            bar.style.width = level + "%";

        }, 300);

    });

});


/* =====================================================
   5. BACK TO TOP BUTTON
===================================================== */

const topButton =
    document.getElementById("topButton");


window.addEventListener("scroll", function () {

    if (window.scrollY > 300) {

        topButton.style.display = "block";

    } else {

        topButton.style.display = "none";
    }

});


topButton.addEventListener("click", function () {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});


/* =====================================================
   6. AUTOMATIC COPYRIGHT YEAR
===================================================== */

const yearElement =
    document.getElementById("year");


yearElement.textContent =
    new Date().getFullYear();


/* =====================================================
   7. AWS VISITOR COUNTER
===================================================== */

/*
   IMPORTANT:

   Do NOT change anything here yet if
   Member 5 has not created API Gateway.

   Later you will replace the URL below with
   your API Gateway URL.
*/

const VISITOR_API_URL =
    "YOUR_API_GATEWAY_URL";


async function loadVisitorCount() {

    const countElement =
        document.getElementById("visitor-count");

    const errorElement =
        document.getElementById("visitor-error");


    /* Check whether API has been configured */

    if (
        !VISITOR_API_URL ||
        VISITOR_API_URL === "YOUR_API_GATEWAY_URL"
    ) {

        countElement.textContent =
            "Not connected";

        return;
    }


    try {

        const response =
            await fetch(VISITOR_API_URL);


        if (!response.ok) {

            throw new Error(
                "HTTP error: " + response.status
            );

        }


        const data =
            await response.json();


        countElement.textContent =
            Number(data.count).toLocaleString();


    } catch (error) {

        console.error(
            "Visitor counter error:",
            error
        );


        countElement.textContent =
            "Unavailable";


        errorElement.hidden = false;
    }

}


/* Load visitor count */

loadVisitorCount();