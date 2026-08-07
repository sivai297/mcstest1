
/* ==========================================
   MCS HERO MODULE
========================================== */

"use strict";

/* ==========================================
   HERO INITIALIZATION
========================================== */

function initHero() {

    heroTyping();

    heroVideo();

    heroParallax();

    heroScrollButton();

}

/* ==========================================
   HERO VIDEO
========================================== */

function heroVideo() {

    const video = document.querySelector("#heroVideo");

    if (!video) return;

    video.muted = true;

    video.loop = true;

    video.autoplay = true;

    video.playsInline = true;

    video.play().catch(() => {

        console.log("Autoplay blocked");

    });

}

/* ==========================================
   TYPING EFFECT
========================================== */

function heroTyping() {

    const text = document.getElementById("typing");

    if (!text) return;

    const words = [

        "AC PCB Repair",

        "Refrigerator PCB",

        "Washing Machine PCB",

        "100% Genuine Service",

        "Warranty Available"

    ];

    let wordIndex = 0;

    let charIndex = 0;

    let deleting = false;

    function type() {

        const current = words[wordIndex];

        if (!deleting) {

            text.textContent = current.substring(0, charIndex++);

            if (charIndex > current.length) {

                deleting = true;

                setTimeout(type, 1500);

                return;

            }

        } else {

            text.textContent = current.substring(0, charIndex--);

            if (charIndex < 0) {

                deleting = false;

                wordIndex++;

                if (wordIndex >= words.length) {

                    wordIndex = 0;

                }

            }

        }

        setTimeout(type, deleting ? 40 : 80);

    }

    type();

}

/* ==========================================
   PARALLAX EFFECT
========================================== */

function heroParallax() {

    const hero = document.querySelector(".hero");

    if (!hero) return;

    hero.addEventListener("mousemove", e => {

        const img = hero.querySelector(".hero-right img");

        if (!img) return;

        const x = (window.innerWidth / 2 - e.pageX) / 40;

        const y = (window.innerHeight / 2 - e.pageY) / 40;

        img.style.transform =
            `translate(${x}px, ${y}px)`;

    });

}

/* ==========================================
   SCROLL BUTTON
========================================== */

function heroScrollButton() {

    const button = document.querySelector(".scroll-indicator");

    if (!button) return;

    button.addEventListener("click", () => {

        window.scrollTo({

            top: window.innerHeight,

            behavior: "smooth"

        });

    });

}

/* ==========================================
   HERO READY
========================================== */

console.log("Hero Module Loaded");
/* ==========================================
   HERO LOGO REVEAL
========================================== */

function heroLogoReveal() {

    const logo = document.querySelector(".hero-right img");

    if (!logo) return;

    logo.animate([
        {
            opacity:0,
            transform:"scale(.6) rotate(-10deg)"
        },
        {
            opacity:1,
            transform:"scale(1) rotate(0deg)"
        }
    ],{
        duration:1500,
        easing:"ease-out",
        fill:"forwards"
    });

}

/* ==========================================
   HERO BUTTON ANIMATION
========================================== */

function heroButtons() {

    const buttons =
    document.querySelectorAll(".hero-buttons a");

    buttons.forEach((button,index)=>{

        button.style.opacity="0";
        button.style.transform="translateY(40px)";

        setTimeout(()=>{

            button.style.transition=".6s";

            button.style.opacity="1";
            button.style.transform="translateY(0)";

        },500+(index*200));

    });

}

/* ==========================================
   HERO GLOW EFFECT
========================================== */

function heroGlow() {

    const hero=document.querySelector(".hero");

    if(!hero) return;

    hero.addEventListener("mousemove",(e)=>{

        hero.style.backgroundPosition=
        `${e.clientX/20}px ${e.clientY/20}px`;

    });

}

/* ==========================================
   HERO INITIALIZE EXTRA
========================================== */

window.addEventListener("load",()=>{

    heroLogoReveal();

    heroButtons();

    heroGlow();

});

console.log("Hero Part 2 Ready");
/* ==========================================
   HERO.JS PART 3
========================================== */

/* ==========================================
   HERO COUNTER
========================================== */

function heroCounter() {

    const counters =
    document.querySelectorAll(".hero-counter");

    counters.forEach(counter => {

        const target =
        Number(counter.dataset.target);

        let value = 0;

        const speed = target / 120;

        function update() {

            value += speed;

            if (value < target) {

                counter.textContent =
                Math.floor(value);

                requestAnimationFrame(update);

            } else {

                counter.textContent = target;

            }

        }

        update();

    });

}

/* ==========================================
   HERO MOUSE TILT
========================================== */

function heroTilt() {

    const card =
    document.querySelector(".hero-right");

    if (!card) return;

    card.addEventListener("mousemove", e => {

        const rect =
        card.getBoundingClientRect();

        const x =
        e.clientX - rect.left;

        const y =
        e.clientY - rect.top;

        const rotateX =
        ((y / rect.height) - .5) * -10;

        const rotateY =
        ((x / rect.width) - .5) * 10;

        card.style.transform =
        `perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)`;

    });

    card.addEventListener("mouseleave", () => {

        card.style.transform =
        "perspective(1000px) rotateX(0) rotateY(0)";

    });

}

/* ==========================================
   HERO CTA RIPPLE
========================================== */

function heroRipple() {

    const buttons =
    document.querySelectorAll(".hero-buttons a");

    buttons.forEach(button => {

        button.addEventListener("click", e => {

            const ripple =
            document.createElement("span");

            ripple.className = "ripple";

            ripple.style.left =
            `${e.offsetX}px`;

            ripple.style.top =
            `${e.offsetY}px`;

            button.appendChild(ripple);

            setTimeout(() => {

                ripple.remove();

            },600);

        });

    });

}

/* ==========================================
   SCROLL INDICATOR
========================================== */

function heroScrollVisibility() {

    const indicator =
    document.querySelector(".scroll-indicator");

    if (!indicator) return;

    window.addEventListener("scroll",()=>{

        if(window.scrollY > 200){

            indicator.style.opacity="0";

        }

        else{

            indicator.style.opacity="1";

        }

    });

}

/* ==========================================
   INITIALIZE PART 3
========================================== */

window.addEventListener("load",()=>{

    heroCounter();

    heroTilt();

    heroRipple();

    heroScrollVisibility();

});

console.log("Hero Part 3 Loaded");

