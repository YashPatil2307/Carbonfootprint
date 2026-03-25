const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");
const formTitle = document.getElementById("formTitle");
const message = document.getElementById("message");

// Backend URL
const BASE_URL = "";

// Show Register Form
if (showRegister) {
    showRegister.addEventListener("click", (e) => {
        e.preventDefault();
        loginForm.style.display = "none";
        registerForm.style.display = "block";
        formTitle.textContent = "Register";
        message.textContent = "";
    });
}

// Show Login Form
if (showLogin) {
    showLogin.addEventListener("click", (e) => {
        e.preventDefault();
        registerForm.style.display = "none";
        loginForm.style.display = "block";
        formTitle.textContent = "Login";
        message.textContent = "";
    });
}

// Register
if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("registerName")?.value.trim();
        const email = document.getElementById("registerEmail")?.value.trim();
        const password = document.getElementById("registerPassword")?.value;
        const confirmPassword = document.getElementById("confirmPassword")?.value;

        if (!name || !email || !password || !confirmPassword) {
            message.textContent = "Please fill all fields";
            message.style.color = "red";
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, email, password, confirmPassword })
            });

            let data;
            try {
                data = await response.json();
            } catch {
                throw new Error("Server did not return JSON");
            }

            message.textContent = data.message || "Response received";

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
            message.textContent = "Something went wrong while registering";
            message.style.color = "red";
        }
    });
}

// Login
if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("loginName")?.value.trim();
        const email = document.getElementById("loginEmail")?.value.trim();
        const password = document.getElementById("loginPassword")?.value;

        if (!email || !password) {
            message.textContent = "Please enter email and password";
            message.style.color = "red";
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ name, email, password })
            });

            let data;
            try {
                data = await response.json();
            } catch {
                throw new Error("Server did not return JSON");
            }

            message.textContent = data.message || "Response received";

            if (response.ok) {
                message.style.color = "green";

                // If dashboard is served by Express from public folder
                window.location.href = `${BASE_URL}/dashboard.html`;

                // If you want Live Server dashboard instead, use:
                // window.location.href = "dashboard.html";
            } else {
                message.style.color = "red";
            }
        } catch (error) {
            console.error("Login error:", error);
            message.textContent = "Something went wrong while logging in";
            message.style.color = "red";
        }
    });
}