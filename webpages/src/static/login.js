document.addEventListener("DOMContentLoaded", () => {
    const email = document.querySelector('#email');
    const password = document.querySelector('#password');
    const button = document.querySelector('.submit-form');
    const errorMsg = document.querySelector('.error');

    email.addEventListener('keydown', validateLogin);
    password.addEventListener('keydown', validateLogin);
    password.addEventListener('keyup', validateLogin);

    function validateLogin() {
        if (email.value.length == 0 && password.value.length == 0 ) {
            button.style.cursor = 'not-allowed';
            button.style.opacity = (0.4);
        } else if(email.value == '' && password.value == ''){
            button.style.cursor = 'not-allowed';
            button.style.opacity = (0.4);
        } else if (password.value.length >= 8) {
            button.style.opacity = (1);
            button.style.cursor = 'pointer';
        } else {
            button.style.cursor = 'not-allowed';
            button.style.opacity = (0.4);
        }
    }
})