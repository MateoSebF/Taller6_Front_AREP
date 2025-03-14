const apiUrl = "https://arepmateo.duckdns.org:8080/auth";

const form = document.getElementById("auth-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const message = document.getElementById("message");
const formTitle = document.getElementById("form-title");
const toggleText = document.getElementById("toggle-text");
const toggleLink = document.getElementById("toggle-link");

let isLogin = true; // Indica si estamos en modo login o registro

toggleLink.addEventListener("click", (e) => {
    e.preventDefault();
    isLogin = !isLogin;
    formTitle.textContent = isLogin ? "Login" : "Register";
    toggleText.innerHTML = isLogin
        ? `Don't have an account? <a href="#" id="toggle-link">Register</a>`
        : `Already have an account? <a href="#" id="toggle-link">Login</a>`;
});

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const endpoint = isLogin ? "/login" : "/register";
    const url = apiUrl + endpoint;

    const payload = {
        email: emailInput.value,
        password: passwordInput.value
    };

    try {
	console.log(url);
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await response.text();

        if (response.ok) {
            message.style.color = "green";
            message.textContent = "Success! Redirecting...";
            setTimeout(() => {
                window.location.href = "/properties.html";
            }, 1000);
        } else {
            message.style.color = "red";
            message.textContent = data;
        }
    } catch (error) {
        message.style.color = "red";
        message.textContent = "An error occurred.";
	console.log(error);
    }
});

