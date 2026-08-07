
/* ==========================================
   MCS ANIMATION MODULE
========================================== */

"use strict";

/* ==========================================
   INITIALIZE
========================================== */

function initAnimations() {

    revealOnScroll();

    fadeCards();

    floatingAnimation();

    imageHoverAnimation();

}

document.addEventListener("DOMContentLoaded", () => {

    initAnimations();

});

/* ==========================================
   SCROLL REVEAL
========================================== */

function revealOnScroll() {

    const elements =
    document.querySelectorAll(".reveal");

    if (!elements.length) return;

    const observer =
    new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("active");

            }

        });

    },{

        threshold:0.15

    });

    elements.forEach(element=>{

        observer.observe(element);

    });

}

/* ==========================================
   CARD FADE
========================================== */

function fadeCards(){

    const cards=
    document.querySelectorAll(

        ".product-card,.service-card,.review-card,.about-card"

    );

    cards.forEach((card,index)=>{

        card.style.opacity="0";

        card.style.transform="translateY(40px)";

        setTimeout(()=>{

            card.style.transition=".7s";

            card.style.opacity="1";

            card.style.transform="translateY(0)";

        },index*120);

    });

}

/* ==========================================
   FLOATING ELEMENTS
========================================== */

function floatingAnimation(){

    const items=

    document.querySelectorAll(".floating");

    items.forEach(item=>{

        let direction=1;

        let y=0;

        setInterval(()=>{

            y+=direction;

            item.style.transform=

            `translateY(${y}px)`;

            if(y>=10) direction=-1;

            if(y<=0) direction=1;

        },40);

    });

}

/* ==========================================
   IMAGE HOVER
========================================== */

function imageHoverAnimation(){

    const images=

    document.querySelectorAll(".zoom-image");

    images.forEach(image=>{

        image.addEventListener("mouseenter",()=>{

            image.style.transform="scale(1.08)";

        });

        image.addEventListener("mouseleave",()=>{

            image.style.transform="scale(1)";

        });

    });

}

console.log("Animation Module Part 1 Loaded");
/* ==========================================
   ANIMATION.JS PART 2
========================================== */

/* ==========================================
   BUTTON RIPPLE EFFECT
========================================== */

function buttonRipple() {

    const buttons =
    document.querySelectorAll(
        ".btn-green,.btn-white,button"
    );

    buttons.forEach(button => {

        button.addEventListener("click", e => {

            const ripple =
            document.createElement("span");

            ripple.className = "ripple";

            const rect =
            button.getBoundingClientRect();

            ripple.style.left =
            `${e.clientX - rect.left}px`;

            ripple.style.top =
            `${e.clientY - rect.top}px`;

            button.appendChild(ripple);

            setTimeout(() => {

                ripple.remove();

            },600);

        });

    });

}

/* ==========================================
   SECTION FADE
========================================== */

function sectionFade() {

    const sections =
    document.querySelectorAll("section");

    sections.forEach(section => {

        section.style.opacity = "0";
        section.style.transition = "1s";

    });

    const observer =
    new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if(entry.isIntersecting){

                entry.target.style.opacity="1";

                entry.target.style.transform=
                "translateY(0)";

            }

        });

    },{

        threshold:.15

    });

    sections.forEach(section=>{

        section.style.transform=
        "translateY(40px)";

        observer.observe(section);

    });

}

/* ==========================================
   MAGNET BUTTON
========================================== */

function magneticButtons(){

    const buttons=
    document.querySelectorAll(".btn-green");

    buttons.forEach(button=>{

        button.addEventListener("mousemove",e=>{

            const rect=
            button.getBoundingClientRect();

            const x=
            e.clientX-rect.left;

            const y=
            e.clientY-rect.top;

            button.style.transform=
            `translate(
            ${(x-rect.width/2)/10}px,
            ${(y-rect.height/2)/10}px)`;

        });

        button.addEventListener("mouseleave",()=>{

            button.style.transform="translate(0,0)";

        });

    });

}

/* ==========================================
   TEXT REVEAL
========================================== */

function textReveal(){

    const titles=
    document.querySelectorAll(
        ".section-title h2"
    );

    const observer=
    new IntersectionObserver(entries=>{

        entries.forEach(entry=>{

            if(entry.isIntersecting){

                entry.target.classList.add("fade-in");

            }

        });

    });

    titles.forEach(title=>{

        observer.observe(title);

    });

}

/* ==========================================
   INITIALIZE PART 2
========================================== */

window.addEventListener("load",()=>{

    buttonRipple();

    sectionFade();

    magneticButtons();

    textReveal();

});

console.log("Animation Part 2 Ready");
/* ==========================================
   ANIMATION.JS PART 3
========================================== */

/* ==========================================
   MOUSE SPOTLIGHT
========================================== */

function mouseSpotlight() {

    const spotlight =
    document.querySelector(".mouse-glow");

    if (!spotlight) return;

    document.addEventListener("mousemove", e => {

        spotlight.style.left =
        `${e.clientX}px`;

        spotlight.style.top =
        `${e.clientY}px`;

    });

}

/* ==========================================
   GLASS CARD EFFECT
========================================== */

function glassHover() {

    const cards =
    document.querySelectorAll(

        ".product-card,.service-card,.about-card,.review-card"

    );

    cards.forEach(card => {

        card.addEventListener("mouseenter", () => {

            card.style.transform =
            "translateY(-12px) scale(1.02)";

            card.style.transition =
            ".35s";

        });

        card.addEventListener("mouseleave", () => {

            card.style.transform =
            "translateY(0) scale(1)";

        });

    });

}

/* ==========================================
   PAGE TRANSITION
========================================== */

function pageTransition() {

    document.body.classList.add("fade-in");

}

/* ==========================================
   PERFORMANCE MODE
========================================== */

function performanceMode() {

    document.addEventListener("visibilitychange", () => {

        if (document.hidden) {

            console.log("Animations Paused");

        } else {

            console.log("Animations Resumed");

        }

    });

}

/* ==========================================
   HERO GLOW
========================================== */

function heroGlowAnimation() {

    const hero =
    document.querySelector(".hero");

    if (!hero) return;

    let value = 0;

    setInterval(() => {

        value += 1;

        hero.style.backgroundPosition =
        `${value}px center`;

    }, 80);

}

/* ==========================================
   CARD TILT
========================================== */

function cardTilt() {

    const cards =
    document.querySelectorAll(".product-card");

    cards.forEach(card => {

        card.addEventListener("mousemove", e => {

            const rect =
            card.getBoundingClientRect();

            const x =
            e.clientX - rect.left;

            const y =
            e.clientY - rect.top;

            const rotateY =
            ((x / rect.width) - 0.5) * 12;

            const rotateX =
            ((y / rect.height) - 0.5) * -12;

            card.style.transform =
            `perspective(1000px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            scale(1.03)`;

        });

        card.addEventListener("mouseleave", () => {

            card.style.transform =
            "perspective(1000px) rotateX(0) rotateY(0) scale(1)";

        });

    });

}

/* ==========================================
   INITIALIZE PART 3
========================================== */

window.addEventListener("load", () => {

    mouseSpotlight();

    glassHover();

    pageTransition();

    performanceMode();

    heroGlowAnimation();

    cardTilt();

});

console.log("Animation Part 3 Loaded");

