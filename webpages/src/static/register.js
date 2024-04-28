'use strict';

// DOMContentLoaded event is fired when the initial HTML document has been completely loaded and parsed
// It helps us to run our code safely when we are in a coding enviroment with different files, programming languages,
// such as PHP.

document.addEventListener("DOMContentLoaded", () => {

    const username = document.querySelector('#username');
    const email = document.querySelector('#email');

    const pwInfo = document.querySelector('#pw-info');
    const confirmInfo = document.querySelector('#confirm-info');

    const password = document.querySelector('#password');
    const confirmPassword = document.querySelector('#confirmpassword');

    const button = document.querySelector('.submit-form');

    confirmPassword.addEventListener('keyup', validateInfo);
    password.addEventListener('keyup', passwordHandler);
    
    username.addEventListener('keydown', validateInfo);
    email.addEventListener('keydown', validateInfo);

    // I changed the textContent of confirmInfo inside the HTML file so only thing that we had to do is
    // toggling the hidden class:

    function passwordHandler() {
        if (password.value.length < 8) {
            pwInfo.classList.remove('hidden');
            pwInfo.textContent = 'Password must be at least 8 characters long';
        } else {
            pwInfo.classList.add('hidden');
            button.style.cursor = 'not-allowed';
        }
    }

    // function checkInfo() {
    //     if (username.value.length <= 0 && email.value.length <= 0) {
    //         // emailCheck = false;
    //         // usernameCheck = false;
    //         button.style.cursor = 'not-allowed';
    //         button.style.opacity = (0.4);
    //     } else {
    //         console.log(email.value);
    //         // emailCheck = true;
    //         // usernameCheck = true;
    //         button.style.opacity = (1);
    //         button.style.cursor = 'pointer';
    //     }
    // }

    function validateInfo() {
        // console.log(email.value);
        if (password.value != confirmPassword.value) {
            // .value means the value of the input which is better way to track the input values
            confirmInfo.classList.remove('hidden');
            confirmInfo.textContent = 'Passwords do not match';
            button.style.cursor = 'not-allowed';
            button.style.opacity = (0.4);
        } else if (username.value.length <= 0 && email.value.length <= 0) {
            button.style.cursor = 'not-allowed';
            button.style.opacity = (0.4);
        } else if (password.value <= '' && confirmPassword.value <= '') {
            button.style.cursor = 'not-allowed';
            button.style.opacity = (0.4);
        } else {
            confirmInfo.classList.add('hidden');
            // confirmInfo.textContent = 'Passwords match';
            button.disabled = false;
            button.style.opacity = (1);
            button.style.cursor = 'pointer';
        }
        // here's more simplified and efficient way to do it:
        // confirmInfo.classList.toggle('hidden', password.value !== confirmPassword.value); 
    }
});