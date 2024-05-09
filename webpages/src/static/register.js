'use strict';

document.addEventListener("DOMContentLoaded", () => {
    const username = document.querySelector('#username');
    const email = document.querySelector('#email');
    const password = document.querySelector('#password');
    const confirmPassword = document.querySelector('#confirmpassword');
    const usernameFeedback = document.querySelector("#username-feedback");
    const emailFeedback = document.querySelector("#email-feedback");
    const passwordFeedback = document.querySelector('#password-feedback');
    const confirmFeedback = document.querySelector('#confirm-feedback');
    const submitForm = document.querySelector(".submit-form");

    email.addEventListener('keyup', checkEmail);
    username.addEventListener('keyup', checkUsername);
    password.addEventListener('keyup', checkPassword);
    confirmPassword.addEventListener('keyup', checkPassword)

    let usernameChecked = false;
    let emailChecked = false;
    let passwordChecked = false;

    function checkUsername() {
        const rules = {
            length: username.value.length > 4,
            specialChar: /[!@#$%^&*(),.?";':{}|<>]/.test(username.value)
        };
        
        const messages = [];
        if (!rules.length) messages.push("Username must be longer than 4 characters.");
        if (rules.specialChar) messages.push("Username must not contain special character.");
        if (messages.length === 0) {
            usernameFeedback.style.display = 'none';
            usernameChecked = true;
        } else {
            usernameFeedback.style.display = 'block';
            usernameFeedback.innerHTML = messages.join('<br>');
            usernameChecked = false;
        }
        handleForm();
    }

    function checkEmail() {
        const emailVal = email.value;
        if (!emailVal.includes('@')) {
            emailFeedback.style.display = 'block';
            emailChecked = false;

        } else {
            emailFeedback.style.display = 'none';
            emailChecked = true;
        }
        handleForm();
    }

    function checkPassword(event) {
        const placeholder = event.target.placeholder;

        if (placeholder === "Password") {
            const rules = {
                length: password.value.length > 7,
                uppercase: /[A-Z]/.test(password.value),
                lowercase: /[a-z]/.test(password.value),
                number: /\d/.test(password.value),
                specialChar: /[£~`!@#$%^&*(),.?";':{}|<>]/.test(password.value)
            };
            
            const messages = [];
            if (!rules.length) messages.push("Password must be longer than 8 characters.");
            if (!rules.uppercase) messages.push("Password must contain at least one uppercase letter.");
            if (!rules.lowercase) messages.push("Password must contain at least one lowercase letter.");
            if (!rules.number) messages.push("Password must contain at least one number.");
            if (!rules.specialChar) messages.push("Password must contain at least one special character.");
            if (messages.length === 0) {
                passwordFeedback.style.display = 'none';
                if (confirmPassword.value.length > 0) {
                    if (password.value !== confirmPassword.value) {
                        confirmFeedback.style.display = 'block'
                        passwordChecked = false;
        
                    } else {
                        confirmFeedback.style.display = 'none';
                        passwordChecked = true;
                    }
                }
            } else {
                passwordFeedback.style.display = 'block';
                passwordFeedback.innerHTML = messages.join('<br>');
                passwordChecked = false;
            }
            return;     
        }
        if (password.value !== confirmPassword.value) {
            confirmFeedback.style.display = 'block'
            passwordChecked = false;

        } else {
            confirmFeedback.style.display = 'none';
            passwordChecked = true;

        }
        handleForm();
    }

    function handleForm() {
        if (usernameChecked && emailChecked && passwordChecked) {
            submitForm.classList.add("active");
            return submitForm.disabled = false;
        }
        submitForm.classList.remove("active");
        submitForm.disabled = true;
    }

    process.on('unhandledRejection', (reason, promise) => {
        console.error('Unhandled Rejection at:', promise, 'reason:', reason);
        // Handle or log the error here
        // You can also terminate the process if needed
        process.exit(1); // Exit with non-zero status code to indicate failure
    });
});