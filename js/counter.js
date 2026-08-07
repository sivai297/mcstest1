/* ==========================================
   COUNTER.JS PART 1
========================================== */

"use strict";

/* ==========================================
   INITIALIZE COUNTERS
========================================== */

function initCounters() {

    const counters = document.querySelectorAll(".counter");

    if (!counters.length) return;

    const observer = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                startCounter(entry.target);

                observer.unobserve(entry.target);

            }

        });

    }, {

        threshold: 0.5

    });

    counters.forEach(counter => {

        observer.observe(counter);

    });

}

/* ==========================================
   START COUNTER
========================================== */

function startCounter(counter) {

    const rawTarget = counter.dataset.target;
    const target = Number(rawTarget);

    // FIX: Check if data-target is missing or not a number
    if (isNaN(target) || rawTarget === undefined) {
        return;
    }

    const duration = 2000;

    const increment = target / (duration / 16);

    let current = 0;

    function update() {

        current += increment;

        if (current < target) {

            counter.textContent = Math.floor(current).toLocaleString();

            requestAnimationFrame(update);

        } else {

            counter.textContent = target.toLocaleString();

        }

    }

    update();

}

/* ==========================================
   INITIALIZE
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    initCounters();

});

console.log("Counter Module Part 1 Loaded");


/* ==========================================
   COUNTER.JS PART 2
========================================== */

/* ==========================================
   FORMAT NUMBER
========================================== */

function formatCounter(counter, value) {

    const suffix = counter.dataset.suffix || "";
    const prefix = counter.dataset.prefix || "";

    // FIX: Ensure value is valid number to prevent "NaN"
    const safeValue = isNaN(value) ? 0 : Math.floor(value);

    counter.textContent =
        prefix +
        safeValue.toLocaleString() +
        suffix;

}

/* ==========================================
   ADVANCED COUNTER
========================================== */

function advancedCounter(counter) {

    const rawTarget = counter.dataset.target;
    const target = Number(rawTarget);

    // FIX: If element doesn't have valid data-target, skip it!
    if (isNaN(target) || rawTarget === undefined) {
        return;
    }

    const duration =
        Number(counter.dataset.duration) || 2500;

    const start = 0;

    let startTime = null;

    function animate(timestamp) {

        if (!startTime)
            startTime = timestamp;

        const progress =
            Math.min(
                (timestamp - startTime) / duration,
                1
            );

        const value =
            start +
            (target - start) * progress;

        formatCounter(counter, value);

        if (progress < 1) {

            requestAnimationFrame(animate);

        }

    }

    requestAnimationFrame(animate);

}

/* ==========================================
   RESET COUNTERS
========================================== */

function resetCounters() {

    document
        .querySelectorAll(".counter")
        .forEach(counter => {

            counter.textContent = "0";

        });

}

/* ==========================================
   REPLAY BUTTON
========================================== */

function replayCounters() {

    const replay =
        document.getElementById("counterReplay");

    if (!replay) return;

    replay.addEventListener("click", () => {

        resetCounters();

        document
            .querySelectorAll(".counter")
            .forEach(counter => {

                advancedCounter(counter);

            });

    });

}

/* ==========================================
   AUTO UPDATE
========================================== */

function autoRefreshCounters() {

    setInterval(() => {

        console.log("Counter refresh check");

        /* Firebase values
           later update pannuvom */

    }, 60000);

}

/* ==========================================
   INITIALIZE PART 2
========================================== */

window.addEventListener("load", () => {

    document
        .querySelectorAll(".counter")
        .forEach(counter => {

            // Runs safely only on items with valid targets
            if (counter.dataset.target !== undefined) {
                advancedCounter(counter);
            }

        });

    replayCounters();

    autoRefreshCounters();

});

console.log("Counter Module Part 2 Loaded");

