/* ==========================================
   MCS MAIN APPLICATION
   Meenakshi Control Systems
========================================== */

"use strict";

const MCS_APP_STATE = {
    initialized: false
};

/* ==========================================
   DOM READY
========================================== */

document.addEventListener("DOMContentLoaded", initializeWebsite);

if (document.readyState !== "loading") {
    initializeWebsite();
}

/* ==========================================
   INITIALIZE WEBSITE
========================================== */

function initializeWebsite() {
    if (MCS_APP_STATE.initialized) return;
    MCS_APP_STATE.initialized = true;

    initLoader();
    initNavbar();
    initHero();
    initSearch();
    initProducts();
    initReviews();
    initWarranty();
    initTheme();
    initScrollTop();
    initCurrentYear();

    initActiveNavigation();
    initLazyLoading();
    initConnectionStatus();
    initResize();

    console.log("=================================");
    console.log(" MCS WEBSITE STARTED ");
    console.log("=================================");
    console.log("Website Initialized Successfully");
}

/* ==========================================
   LOADER
========================================== */

function initLoader() {
    const loader = document.getElementById("loader");
    if (!loader) return;

    setTimeout(() => {
        loader.classList.add("loader-hide");
    }, 800);
}

/* ==========================================
   NAVBAR
========================================== */

function initNavbar() {
    const header = document.querySelector("header, #header");
    if (!header) return;

    const onScroll = () => {
        if (window.scrollY > 80) {
            header.classList.add("sticky");
        } else {
            header.classList.remove("sticky");
        }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
}

/* ==========================================
   HERO / INTRO CONTROL
========================================== */

function initHero() {
    const intro = document.getElementById("intro");
    const skipBtn = document.getElementById("skip");
    const video = document.querySelector("#heroVideo, .hero-video");

    if (video) {
        video.play().catch(() => {
            console.log("Video autoplay blocked");
        });
    }

    if (skipBtn && intro) {
        skipBtn.addEventListener("click", () => {
            intro.classList.add("hide");
        });
    }
}

/* ==========================================
   MODULE HOOKS
========================================== */

function initSearch() {
    if (window.MCSSearch && typeof window.MCSSearch.init === "function") {
        window.MCSSearch.init();
    }
}

function initProducts() {
    if (window.MCSProducts && typeof window.MCSProducts.init === "function") {
        window.MCSProducts.init();
    }
}

function initReviews() {
    if (window.MCSReviews && typeof window.MCSReviews.init === "function") {
        window.MCSReviews.init();
    }
}

function initWarranty() {
    if (window.MCSWarranty && typeof window.MCSWarranty.init === "function") {
        window.MCSWarranty.init();
    }
}

function initTheme() {
    if (window.MCSTheme && typeof window.MCSTheme.init === "function") {
        window.MCSTheme.init();
    }
}

/* ==========================================
   SCROLL TO TOP
========================================== */

function initScrollTop() {
    const button = document.getElementById("scrollTop");
    if (!button) return;

    const onScroll = () => {
        if (window.scrollY > 500) {
            button.style.display = "flex";
        } else {
            button.style.display = "none";
        }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    button.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    onScroll();
}

/* ==========================================
   CURRENT YEAR
========================================== */

function initCurrentYear() {
    const year = document.getElementById("year");
    if (!year) return;

    year.textContent = new Date().getFullYear();
}

/* ==========================================
   ACTIVE NAVIGATION
========================================== */

function initActiveNavigation() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll("nav a[href^='#']");

    if (!sections.length || !navLinks.length) return;

    const onScroll = () => {
        let current = "";

        sections.forEach((section) => {
            const top = section.offsetTop - 120;
            const bottom = top + section.offsetHeight;

            if (window.scrollY >= top && window.scrollY < bottom) {
                current = section.id;
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${current}`) {
                link.classList.add("active");
            }
        });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
}

/* ==========================================
   LAZY IMAGE LOADING
========================================== */

function initLazyLoading() {
    const images = document.querySelectorAll("img[data-src]");
    if (!images.length || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const image = entry.target;
                image.src = image.dataset.src;
                image.removeAttribute("data-src");
                observer.unobserve(image);
            }
        });
    });

    images.forEach((image) => observer.observe(image));
}

/* ==========================================
   CONNECTION STATUS
========================================== */

function initConnectionStatus() {
    window.addEventListener("offline", () => {
        console.warn("Internet Disconnected");
    });

    window.addEventListener("online", () => {
        console.log("Internet Connected");
    });
}

/* ==========================================
   WINDOW RESIZE
========================================== */

function initResize() {
    let resizeTimer = null;

    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            console.log("Width :", window.innerWidth);
        }, 150);
    });
}
