
// =========================================================================
// AWS Cloud Resume Challenge: API Gateway Endpoint
// Paste your deployed API Gateway invoke URL here when configured in AWS.
// Example: 'https://abc123xyz.execute-api.us-east-1.amazonaws.com/prod/visitor-count'
// =========================================================================
const API_GATEWAY_URL =
    'https://45hpinf8x8.execute-api.us-east-1.amazonaws.com/visitors';

// toggle icon navbar
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
}

// scroll sections
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 100;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if (top >= offset && top < offset + height) {
            // active navbar links
            navLinks.forEach(links => {
                links.classList.remove('active');
            });
            let targetLink = document.querySelector('header nav a[href*=' + id + ']');
            if (targetLink) {
                targetLink.classList.add('active');
            }
            // active sections for animation on scroll
            sec.classList.add('show-animate');
        }
        // if want to animation that repeats on scroll use this
        else {
            sec.classList.remove('show-animate');
        }
    });

    // sticky navbar
    let header = document.querySelector('header');

    header.classList.toggle('sticky', window.scrollY > 100);

    // remove toggle icon and navbar when click navbar links (scroll)
    menuIcon.classList.remove('bx-x');
    navbar.classList.remove('active');

    // animation footer on scroll
    let footer = document.querySelector('footer');

    footer.classList.toggle('show-animate', this.innerHeight + this.scrollY >= document.scrollingElement.scrollHeight);
}

// close mobile navbar on nav link click
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuIcon.classList.remove('bx-x');
        navbar.classList.remove('active');
    });
});

// contact form success alert
let contactForm = document.getElementById("contact-form");
if (contactForm) {
    contactForm.addEventListener("submit", function () {
        alert("Thanks, your message has been sent!");
    });
}

// ================= LIVE UPDATES SECTION LOGIC =================

// 1. Navbar Live Status Ticker
const liveTickerMsg = document.getElementById('navLiveTicker');
const liveTickerItems = [
    "Open to Work & Internships",
    "AWS Cloud Resume Challenge",
    "BCA @ Techno College Hooghly",
    "Web Dev & Cloud Enthusiast"
];
let currentTickerIndex = 0;

function rotateTicker() {
    if (!liveTickerMsg) return;
    liveTickerMsg.classList.add('fade-out');
    setTimeout(() => {
        currentTickerIndex = (currentTickerIndex + 1) % liveTickerItems.length;
        liveTickerMsg.textContent = liveTickerItems[currentTickerIndex];
        liveTickerMsg.classList.remove('fade-out');
    }, 300);
}

if (liveTickerMsg) {
    setInterval(rotateTicker, 3500);
}

// 2. Click Navbar Live Update Badge to Scroll to Section
const navLiveUpdate = document.getElementById('navLiveUpdate');
if (navLiveUpdate) {
    navLiveUpdate.addEventListener('click', () => {
        let updateSection = document.getElementById('updates');
        if (updateSection) {
            updateSection.scrollIntoView({ behavior: 'smooth' });
        }
        menuIcon.classList.remove('bx-x');
        navbar.classList.remove('active');
    });
}

// 3. Real-Time Live Clock (IST)
function updateLiveClock() {
    let clockEl = document.getElementById('liveClock');
    if (!clockEl) return;
    let now = new Date();
    clockEl.textContent = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
}
setInterval(updateLiveClock, 1000);
updateLiveClock();

// 4. Live Visitor Counter (AWS API Gateway + Lambda + DynamoDB)
async function updateVisitorCounter() {
    const counterEl = document.getElementById('pageVisitorCount');
    if (!counterEl) return;

    // Check if API Gateway URL has been configured
    if (!API_GATEWAY_URL || API_GATEWAY_URL.trim() === '') {
        counterEl.textContent = '--';
        console.info('[Cloud Resume] API_GATEWAY_URL is not yet configured. Paste your API Gateway URL into script.js once deployed.');
        return;
    }

    // Set loading placeholder
    counterEl.textContent = '...';

    try {
        const response = await fetch(API_GATEWAY_URL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`API Gateway returned HTTP ${response.status}`);
        }

        const data = await response.json();
        // Support either 'count' or 'views' field from JSON response
        const count = data.count !== undefined ? data.count : data.views;

        if (count !== undefined && count !== null) {
            counterEl.textContent = Number(count).toLocaleString();
        } else {
            throw new Error('Response JSON missing count field');
        }
    } catch (err) {
        console.error('[Cloud Resume] Error fetching visitor count:', err);
        // Fallback indicator on network or API error
        counterEl.textContent = '--';
    }
}

// Call on page load
updateVisitorCounter();
