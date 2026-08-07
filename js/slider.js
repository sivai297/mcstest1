
/* ==========================================
   MCS WEBSITE
   SLIDER.JS
   Meenakshi Control System
========================================== */

"use strict";

/* ==========================================
   GLOBAL VARIABLES
========================================== */

let productAutoSlide = null;
let reviewAutoSlide = null;

let currentProductIndex = 0;
let currentReviewIndex = 0;

let startX = 0;
let endX = 0;

/* ==========================================
   DOM READY
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    initializeSlider();

});

/* ==========================================
   INITIALIZE SLIDER
========================================== */

function initializeSlider() {

    productSlider();

    reviewSlider();

    initProductControls();

    pauseSliderHover();

    reviewHoverPause();

    enableSwipe();

}

/* ==========================================
   PRODUCT SLIDER
========================================== */

function productSlider() {

    // Product slider code here

}

/* ==========================================
   REVIEW SLIDER
========================================== */

function reviewSlider() {

    // Review slider code here

}

/* ==========================================
   PRODUCT CONTROLS
========================================== */

function initProductControls() {

    // Previous / Next buttons

}

/* ==========================================
   PAUSE ON HOVER
========================================== */

function pauseSliderHover() {

    // Hover pause logic

}

/* ==========================================
   REVIEW HOVER
========================================== */

function reviewHoverPause() {

    // Review hover logic

}

/* ==========================================
   MOBILE SWIPE
========================================== */

function enableSwipe() {

    // Swipe logic

}

/* ==========================================
   END OF PART 1
========================================== */
/* ==========================================
   PRODUCT SLIDER
========================================== */

function productSlider() {

    const slider = document.querySelector(".product-grid");

    if (!slider) return;

    const cards = slider.querySelectorAll(".product-card");

    if (!cards.length) return;

    const cardWidth = cards[0].offsetWidth + 20;

    clearInterval(productAutoSlide);

    productAutoSlide = setInterval(() => {

        currentProductIndex++;

        if (currentProductIndex >= cards.length) {

            currentProductIndex = 0;

        }

        slider.scrollTo({

            left: currentProductIndex * cardWidth,

            behavior: "smooth"

        });

    }, 3500);

}

/* ==========================================
   REVIEW SLIDER
========================================== */

function reviewSlider() {

    const slider = document.querySelector(".review-grid");

    if (!slider) return;

    const cards = slider.querySelectorAll(".review-card");

    if (!cards.length) return;

    const cardWidth = cards[0].offsetWidth + 20;

    clearInterval(reviewAutoSlide);

    reviewAutoSlide = setInterval(() => {

        currentReviewIndex++;

        if (currentReviewIndex >= cards.length) {

            currentReviewIndex = 0;

        }

        slider.scrollTo({

            left: currentReviewIndex * cardWidth,

            behavior: "smooth"

        });

    }, 4000);

}

/* ==========================================
   PRODUCT BUTTONS
========================================== */

function initProductControls() {

    const slider = document.querySelector(".product-grid");

    const next = document.getElementById("productNext");

    const prev = document.getElementById("productPrev");

    if (!slider || !next || !prev) return;

    const width = slider.querySelector(".product-card").offsetWidth + 20;

    next.addEventListener("click", () => {

        currentProductIndex++;

        slider.scrollBy({

            left: width,

            behavior: "smooth"

        });

    });

    prev.addEventListener("click", () => {

        currentProductIndex--;

        if (currentProductIndex < 0) {

            currentProductIndex = 0;

        }

        slider.scrollBy({

            left: -width,

            behavior: "smooth"

        });

    });

}
/* ==========================================
   TOUCH SWIPE SUPPORT
========================================== */

function enableSwipe() {

    const sliders = document.querySelectorAll(
        ".product-grid, .review-grid"
    );

    sliders.forEach(slider => {

        slider.addEventListener("touchstart", e => {

            startX = e.touches[0].clientX;

        });

        slider.addEventListener("touchend", e => {

            endX = e.changedTouches[0].clientX;

            handleSwipe(slider);

        });

    });

}

function handleSwipe(slider) {

    const distance = startX - endX;

    if (Math.abs(distance) < 50) return;

    const card = slider.firstElementChild;

    if (!card) return;

    const width = card.offsetWidth + 20;

    if (distance > 0) {

        slider.scrollBy({

            left: width,

            behavior: "smooth"

        });

    } else {

        slider.scrollBy({

            left: -width,

            behavior: "smooth"

        });

    }

}

/* ==========================================
   PAUSE AUTO SLIDER
========================================== */

function pauseSliderHover() {

    const product =
        document.querySelector(".product-grid");

    if (!product) return;

    product.addEventListener("mouseenter", () => {

        clearInterval(productAutoSlide);

    });

    product.addEventListener("mouseleave", () => {

        productSlider();

    });

}

function reviewHoverPause() {

    const review =
        document.querySelector(".review-grid");

    if (!review) return;

    review.addEventListener("mouseenter", () => {

        clearInterval(reviewAutoSlide);

    });

    review.addEventListener("mouseleave", () => {

        reviewSlider();

    });

}

/* ==========================================
   NAVIGATION DOTS
========================================== */

function initializeDots() {

    const dots =
        document.querySelectorAll(".slider-dot");

    dots.forEach((dot, index) => {

        dot.addEventListener("click", () => {

            currentProductIndex = index;

            const slider =
                document.querySelector(".product-grid");

            const card =
                slider.querySelector(".product-card");

            slider.scrollTo({

                left: index * (card.offsetWidth + 20),

                behavior: "smooth"

            });

        });

    });

}

/* ==========================================
   INITIALIZE PART 3
========================================== */

window.addEventListener("load", () => {

    enableSwipe();

    pauseSliderHover();

    reviewHoverPause();

    initializeDots();

});

console.log("Slider Part 3 Loaded");

