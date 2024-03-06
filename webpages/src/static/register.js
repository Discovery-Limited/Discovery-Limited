'use strict';

let pwInfo = document.querySelector('#pw-info');
let confirmInfo = document.querySelector('#confirm-info');

let password = document.querySelector('#password');
let confirmPassword = document.querySelector('#confirm');

pwInfo.addEventListener('keydown', passwordHandler());

confirmInfo.addEventListener('keydown', confirmPassword());

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

function passwordHandler() {
    if (password.value.length < 8) {
        pwInfo.innerHTML = 'Password must be at least 8 characters long';
    } else {
        return 'Password is valid';
    }
}

function confirmPassword() {
    if (password.value !== confirmPassword.value) {
        confirmInfo.innerHTML = 'Passwords do not match';
    } else {
        password.disabled = enabled;
    }
}