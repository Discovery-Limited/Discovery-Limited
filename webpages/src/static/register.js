'use strict';

// DOMContentLoaded event is fired when the initial HTML document has been completely loaded and parsed
// It helps us to run our code safely when we are in a coding enviroment with different files, programming languages,
// such as PHP.

document.addEventListener("DOMContentLoaded", () => {

    const pwInfo = document.querySelector('#pw-info');
    const confirmInfo = document.querySelector('#confirm-info');

    const password = document.querySelector('#password');
    const confirmPassword = document.querySelector('#confirmpassword');

    const button = document.querySelector('.submit-form');

    confirmPassword.addEventListener('keyup', validatePassword);
    password.addEventListener('keyup', passwordHandler);
    // I changed the textContent of confirmInfo inside the HTML file so only thing that we had to do is
    // toggling the hidden class:

    function passwordHandler() {
        if (password.value.length < 8) {
            pwInfo.classList.remove('hidden');
            pwInfo.textContent = 'Password must be at least 8 characters long';
        } else if (password.value == null) {
            pwInfo.classList.add('hidden');
        }
        else {
            pwInfo.textContent = 'Password is valid';
            button.style.cursor = 'not-allowed';
        }
    }

    function validatePassword() {
        if (password.value != confirmPassword.value) {
            // .value means the value of the input which is better way to track the input values
            confirmInfo.classList.remove('hidden');
            confirmInfo.textContent = 'Passwords do not match';
            button.style.cursor = 'not-allowed';
            button.style.opacity = (0.4);
        } else {
            confirmInfo.classList.add('hidden');
            confirmInfo.textContent = 'Passwords match';
            button.disabled = false;
            button.style.opacity = (1);
            button.style.cursor = 'pointer';

        }
        // here's more simplified and efficient way to do it:
        // confirmInfo.classList.toggle('hidden', password.value !== confirmPassword.value); 
    }
});


// pwInfo.addEventListener('keydown', passwordHandler());

// confirmInfo.addEventListener('keydown', confirmPassword());

// function passwordHandler() {
//     let password = document.querySelector('#password').value;
//     let passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;

//     if (passwordRegex.test(password)) {
//         pwInfo.innerHTML = 'Password is valid';
//     } else {
//         pwInfo.innerHTML = 'Password is invalid';
//     }
// }

// function confirmPassword() {

// }

// function passwordHandler() {
//     if (password.value.length < 8) {
//         pwInfo.innerHTML = 'Password must be at least 8 characters long';
//     } else {
//         return 'Password is valid';
//     }
// }

// function confirmPassword() {
//     if (password.value !== confirmPassword.value) {
//         confirmInfo.innerHTML = 'Passwords do not match';
//     } else {
//         password.disabled = enabled;
//     }
// }

// let password = document.getElementById('password');
