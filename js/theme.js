
/* ==========================================
   MCS Theme Controller
========================================== */

const themeButton = document.getElementById("themeToggle");

const body = document.body;

/* ==========================================
Load Saved Theme
========================================== */

window.addEventListener("load", () => {

    const savedTheme =
        localStorage.getItem("mcsTheme");

    if (savedTheme === "dark") {

        body.classList.add("dark-mode");

        if (themeButton) {

            themeButton.innerHTML =
                '<i class="fa-solid fa-sun"></i>';

        }

    }

});

/* ==========================================
Theme Toggle
========================================== */

if (themeButton) {

    themeButton.addEventListener("click", () => {

        body.classList.toggle("dark-mode");

        if (body.classList.contains("dark-mode")) {

            localStorage.setItem("mcsTheme", "dark");

            themeButton.innerHTML =
                '<i class="fa-solid fa-sun"></i>';

        } else {

            localStorage.setItem("mcsTheme", "light");

            themeButton.innerHTML =
                '<i class="fa-solid fa-moon"></i>';

        }

    });

}

/* ==========================================
Smooth Theme Transition
========================================== */

document.documentElement.style.scrollBehavior = "smooth";

/* ==========================================
Auto Theme (Optional)
========================================== */

const prefersDark =
window.matchMedia("(prefers-color-scheme: dark)");

if (!localStorage.getItem("mcsTheme")) {

    if (prefersDark.matches) {

        body.classList.add("dark-mode");

    }

}

/* ==========================================
Watch System Theme Change
========================================== */

prefersDark.addEventListener("change", e => {

    if (!localStorage.getItem("mcsTheme")) {

        if (e.matches) {

            body.classList.add("dark-mode");

        } else {

            body.classList.remove("dark-mode");

        }

    }

});

/* ==========================================
End Theme Controller
========================================== */

console.log("Theme Module Ready");
