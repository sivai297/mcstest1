
/* ==========================================
   MCS Navbar Controller
========================================== */

const header = document.querySelector("header");
const menuBtn = document.getElementById("menu");
const mobileMenu = document.getElementById("mobileMenu");
const closeBtn = document.getElementById("closeMenu");

/* ==========================
Sticky Navbar
========================== */

window.addEventListener("scroll", () => {

    if (window.scrollY > 80) {

        header.classList.add("sticky");

    } else {

        header.classList.remove("sticky");

    }

});

/* ==========================
Open Mobile Menu
========================== */

if (menuBtn) {

    menuBtn.addEventListener("click", () => {

        mobileMenu.classList.add("active");

    });

}

/* ==========================
Close Mobile Menu
========================== */

if (closeBtn) {

    closeBtn.addEventListener("click", () => {

        mobileMenu.classList.remove("active");

    });

}

/* ==========================
Close Menu After Click
========================== */

const mobileLinks = document.querySelectorAll("#mobileMenu a");

mobileLinks.forEach(link => {

    link.addEventListener("click", () => {

        mobileMenu.classList.remove("active");

    });

});

/* ==========================
Smooth Scroll
========================== */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function (e) {

        e.preventDefault();

        const target = document.querySelector(this.getAttribute("href"));

        if (target) {

            target.scrollIntoView({

                behavior: "smooth"

            });

        }

    });

});

/* ==========================
Active Navigation
========================== */

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("nav a");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const top = section.offsetTop - 120;
        const height = section.clientHeight;

        if (pageYOffset >= top) {

            current = section.getAttribute("id");

        }

    });

    navLinks.forEach(link => {

        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + current) {

            link.classList.add("active");

        }

    });

});

/* ==========================
Scroll Progress Bar
========================== */

const progress = document.createElement("div");

progress.id = "progressBar";

document.body.appendChild(progress);

window.addEventListener("scroll", () => {

    const totalHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

    const progressHeight =
        (window.pageYOffset / totalHeight) * 100;

    progress.style.width = progressHeight + "%";

});

/* ==========================
Hide Navbar on Scroll Down
========================== */
/* ==========================
Keep Navbar Always Visible
========================== */

header.style.top = "0";
/* ==========================
End Navbar
========================== */
