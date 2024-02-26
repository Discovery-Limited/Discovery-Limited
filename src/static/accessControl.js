'use strict'

const urlParams = new URLSearchParams(window.location.search);
let accessParam = urlParams.get('access');
const signUpBtn = document.querySelector('#signUp');
const logInBtn = document.querySelector('#logIn');
const signUpForm = document.querySelector('#signupform');
const logInForm = document.querySelector('#loginform');
const headerText = document.querySelector('#header-text')

function checkAccessParam() {
    if (accessParam == "signUp") {
        signUpBtn.classList.toggle('selected');
        logInForm.classList.toggle('hidden');
        headerText.textContent = "Sign Up";

        if (signUpForm.classList.contains('hidden')) {
            signUpForm.classList.toggle('hidden');
            logInBtn.classList.toggle('selected');
        }

    } else {
        logInBtn.classList.toggle('selected');
        signUpForm.classList.toggle('hidden');
        headerText.textContent = "Log In";

        if (logInForm.classList.contains('hidden')) {
            logInForm.classList.toggle('hidden');
            signUpBtn.classList.toggle('selected');
        }
    }
}


signUpBtn.addEventListener("click", () => {
    if (signUpBtn.classList.contains('selected')) {
        console.log('post data');
    } else {
        accessParam = "signUp";
        checkAccessParam();
    };
});

logInBtn.addEventListener("click", () => {
    if (logInBtn.classList.contains('selected')) {
        console.log('post data');
    } else {
        accessParam = "logIn";
        checkAccessParam();
    };
});

checkAccessParam();
