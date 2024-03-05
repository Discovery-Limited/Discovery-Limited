let password = document.getElementById('password');
let confirmPassword = document.getElementById('confirmPassword');

function validatePassword() {
    if (password.value == '') {
        password.innerHTML = '**Please fill the password field';
    }
    if (password.value.length < 8) {
        password.innerHTML = '**Password must be at least 8 characters long';
    }
    if (password.value != confirmPassword.value) {
        confirmPassword.innerHTML = '**Passwords does not match';
    } else {
        confirmPassword.innerHTML = '';
    }
}