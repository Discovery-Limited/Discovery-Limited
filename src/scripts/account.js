// 'use strict'

// function setAction(action) {
//     document.getElementById('action').textContent = action;
//     let nameInput = document.getElementById('nameInput');
//     let forgotPassword = document.querySelector('.forgot_password');

//     if (action === 'Login') {
//         nameInput.style.display = 'none';
//         forgotPassword.style.display = 'flex';

//     } else {
//         nameInput.style.display = 'flex';
//         forgotPassword.style.display = 'none';
//     }
// }

// document.querySelector('#signUpButton').addEventListener('click', function () {
//     setAction('Sign Up');
//     document.getElementById('signUpButton').classList.add('gray');
//     document.getElementById('loginButton').classList.remove('gray');
// });

// document.querySelector('#loginButton').addEventListener('click', function () {
//     setAction('Login');
//     document.getElementById('loginButton').classList.add('gray');
//     document.getElementById('signUpButton').classList.remove('gray');
// });

const signUpBtn = document.querySelector('#signUp');
const loginBtn = document.querySelector('#login');
const action = document.querySelector('#action');
let forgotPassword = document.querySelector('.forgot_password');

signUpBtn.addEventListener('click', () => {
    action.textContent = signUpBtn.textContent;
    if (action.textContent) {
        nameInput.style.display = 'flex';
        forgotPassword.style.display = 'none';
        document.getElementById('signUp').classList.add('gray');
        document.getElementById('login').classList.remove('gray');
    }
});

loginBtn.addEventListener('click', () => {
    action.textContent = loginBtn.textContent;
    if (action.textContent) {
        nameInput.style.display = 'none';
        forgotPassword.style.display = 'flex';
        document.getElementById('login').classList.add('gray');
        document.getElementById('signUp').classList.remove('gray');
    }
})

