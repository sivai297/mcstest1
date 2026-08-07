import { auth } from "./firebase-config.js";

import {
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ======================================
// DOM
// ======================================

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const message = document.getElementById("message");

// ======================================
// Already Logged In
// ======================================

onAuthStateChanged(auth, (user) => {
    if (user) {
        window.location.href = "dashboard.html";
    }
});

// ======================================
// Login
// ======================================

loginBtn.addEventListener("click", loginAdmin);

passwordInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        loginAdmin();
    }
});

emailInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        loginAdmin();
    }
});

async function loginAdmin() {

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    message.textContent = "";

    if (!email) {
        message.textContent = "Enter Admin Email";
        emailInput.focus();
        return;
    }

    if (!password) {
        message.textContent = "Enter Password";
        passwordInput.focus();
        return;
    }

    loginBtn.disabled = true;
    loginBtn.textContent = "Signing In...";

    try {

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        message.style.color = "#22c55e";
        message.textContent = "Login Successful";

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 600);

    } catch (error) {

        message.style.color = "#ffb4b4";

        switch (error.code) {

            case "auth/invalid-email":
                message.textContent = "Invalid Email Address";
                break;

            case "auth/user-not-found":
                message.textContent = "Admin Account Not Found";
                break;

            case "auth/wrong-password":
            case "auth/invalid-credential":
                message.textContent = "Incorrect Email or Password";
                break;

            case "auth/too-many-requests":
                message.textContent = "Too many attempts. Try again later.";
                break;

            default:
                message.textContent = "Login Failed. Please try again.";
        }

        console.error(error);

    } finally {

        loginBtn.disabled = false;
        loginBtn.textContent = "Login";

    }
          }
