const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");
const formTitle = document.getElementById("formTitle");
const message = document.getElementById("message");

// Backend URL
const BASE_URL = "http://localhost:3000";

// Show Register Form
showRegister.addEventListener("click", (e) => {
    e.preventDefault();
    loginForm.style.display = "none";
    registerForm.style.display = "block";
    formTitle.textContent = "Register";
    message.textContent = "";
});

// Show Login Form
showLogin.addEventListener("click", (e) => {
    e.preventDefault();
    registerForm.style.display = "none";
    loginForm.style.display = "block";
    formTitle.textContent = "Login";
    message.textContent = "";
});

// Register
registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    try {
        const response = await fetch(`${BASE_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, password, confirmPassword })
        });

        const data = await response.json();
        message.textContent = data.message;

        if (response.ok) {
            registerForm.reset();
            registerForm.style.display = "none";
            loginForm.style.display = "block";
            formTitle.textContent = "Login";
            message.style.color = "green";
        } else {
            message.style.color = "red";
        }
    } catch (error) {
        console.error("Register error:", error);
        message.textContent = "Something went wrong";
        message.style.color = "red";
    }
});

// Login
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("loginName").value.trim();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    try {
        const response = await fetch(`${BASE_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();
        message.textContent = data.message;

        if (response.ok) {
            message.style.color = "green";
            alert("Welcome, " + data.user.name + "!");
            loginForm.reset();
        } else {
            message.style.color = "red";
        }
    } catch (error) {
        console.error("Login error:", error);
        message.textContent = "Something went wrong";
        message.style.color = "red";
    }
});