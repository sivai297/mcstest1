
/* ==========================================
   MCS WEBSITE
   WHATSAPP.JS
   Meenakshi Control System
========================================== */

"use strict";

/* ==========================================
   GLOBAL VARIABLES
========================================== */

const WHATSAPP_NUMBER = "91XXXXXXXXXX";

/* ==========================================
   DOM READY
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    initializeWhatsApp();

});

/* ==========================================
   INITIALIZE
========================================== */

function initializeWhatsApp() {

    floatingWhatsApp();

    productWhatsApp();

    contactWhatsApp();

}

/* ==========================================
   FLOATING BUTTON
========================================== */

function floatingWhatsApp() {

    const button =
        document.querySelector(".floating-whatsapp");

    if (!button) return;

    button.addEventListener("click", (event) => {

        event.preventDefault();

        const message =
`Hello MCS,

I would like to know more about your PCB repair services.`;

        openWhatsApp(message);

    });

}

/* ==========================================
   PRODUCT ENQUIRY
========================================== */

function productWhatsApp() {

    const buttons =
        document.querySelectorAll(".product-whatsapp");

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            const product =
                button.dataset.product || "PCB Board";

            const message =
`Hello MCS,

I am interested in this product:

${product}

Please share the price, warranty and availability.`;

            openWhatsApp(message);

        });

    });

}

/* ==========================================
   CONTACT BUTTON
========================================== */

function contactWhatsApp() {

    const button =
        document.querySelector(".contact-whatsapp");

    if (!button) return;

    button.addEventListener("click", () => {

        const message =
`Hello MCS,

I need assistance regarding PCB repair.`;

        openWhatsApp(message);

    });

}

/* ==========================================
   OPEN WHATSAPP
========================================== */

function openWhatsApp(message) {

    const url =
`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");

}

/* ==========================================
   END OF PART 1
========================================== */
/* ==========================================
   WHATSAPP.JS PART 2
========================================== */

/* ==========================================
   REPAIR REQUEST
========================================== */

function repairRequest() {

    const buttons =
        document.querySelectorAll(".repair-whatsapp");

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            const board =
                button.dataset.board || "PCB Board";

            const brand =
                button.dataset.brand || "Unknown Brand";

            const message =
`Hello MCS,

I need PCB Repair.

Board : ${board}
Brand : ${brand}

Please let me know the repair cost, warranty and estimated delivery time.

Thank you.`;

            openWhatsApp(message);

        });

    });

}

/* ==========================================
   WARRANTY ENQUIRY
========================================== */

function warrantyEnquiry() {

    const button =
        document.getElementById("warrantyWhatsApp");

    if (!button) return;

    button.addEventListener("click", () => {

        const warranty =
            document.getElementById("warrantyNumber");

        const number =
            warranty ? warranty.value.trim() : "";

        const message =
`Hello MCS,

I would like to verify my warranty.

Warranty Number : ${number}

Please check and confirm the warranty status.`;

        openWhatsApp(message);

    });

}

/* ==========================================
   CUSTOM ENQUIRY
========================================== */

function customEnquiry() {

    const form =
        document.getElementById("contactForm");

    if (!form) return;

    form.addEventListener("submit", e => {

        e.preventDefault();

        const name =
            form.querySelector("#name").value;

        const phone =
            form.querySelector("#phone").value;

        const messageBox =
            form.querySelector("#message").value;

        const message =
`Hello MCS,

Customer Name : ${name}

Phone : ${phone}

Message :
${messageBox}`;

        openWhatsApp(message);

    });

}

/* ==========================================
   INITIALIZE PART 2
========================================== */

window.addEventListener("load", () => {

    repairRequest();

    warrantyEnquiry();

    customEnquiry();

});

console.log("WhatsApp Part 2 Loaded");
/* ==========================================
   WHATSAPP.JS PART 3
========================================== */

/* ==========================================
   BUSINESS HOURS
========================================== */

function businessHoursMessage() {

    const buttons =
        document.querySelectorAll(".business-whatsapp");

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            const message =
`Hello MCS,

I would like to contact your service team.

Kindly share your working hours and available service timings.

Thank you.`;

            openWhatsApp(message);

        });

    });

}

/* ==========================================
   BOARD IMAGE REMINDER
========================================== */

function boardImageReminder() {

    const buttons =
        document.querySelectorAll(".image-whatsapp");

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            const message =
`Hello MCS,

I need PCB repair.

I will send:

 Board Image
️ Brand Name
 Model Number
⚠️ Fault Description

Please check and provide the repair cost.`;

            openWhatsApp(message);

        });

    });

}

/* ==========================================
   LOCATION REQUEST
========================================== */

function locationRequest() {

    const buttons =
        document.querySelectorAll(".location-whatsapp");

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            const message =
`Hello MCS,

Please share your shop location.

I would like to visit your service center.

Thank you.`;

            openWhatsApp(message);

        });

    });

}

/* ==========================================
   WARRANTY CLAIM
========================================== */

function warrantyClaim() {

    const buttons =
        document.querySelectorAll(".claim-whatsapp");

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            const message =
`Hello MCS,

I would like to claim warranty for my repaired PCB.

Please let me know the required details.

Thank you.`;

            openWhatsApp(message);

        });

    });

}

/* ==========================================
   INITIALIZE PART 3
========================================== */

window.addEventListener("load", () => {

    businessHoursMessage();

    boardImageReminder();

    locationRequest();

    warrantyClaim();

});

console.log("WhatsApp Module Fully Loaded");


