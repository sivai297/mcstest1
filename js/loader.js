
/* ==========================================
   MCS - Loader & Intro Controller
========================================== */



  

/* ==========================================
   Skip Intro
========================================== */



/* ==========================================
   Intro Auto Close
========================================== */



/* ==========================================
   Hero Fade Animation
========================================== */

const hero = document.querySelector(".hero");

if(hero){

hero.classList.add("hero-active");

}

/* ==========================================
   Logo Hover Animation
========================================== */

const logos=document.querySelectorAll("img");

logos.forEach((logo)=>{

logo.addEventListener("mouseenter",()=>{

logo.style.transform="scale(1.05) rotate(2deg)";

});

logo.addEventListener("mouseleave",()=>{

logo.style.transform="scale(1)";

});

});

/* ==========================================
   Loader Progress Animation
========================================== */



/* ==========================================
   Welcome Message
========================================== */

console.log("===================================");

console.log("MCS Website Initialized");

console.log("Meenakshi Control System");

console.log("Professional PCB Solutions");

console.log("===================================");

/* ==========================================
   End
========================================== */
