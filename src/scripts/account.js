
function setAction(action) {
    document.getElementById('action').textContent = action;
    var nameInput = document.getElementById('nameInput');
    var forgotPassword = document.querySelector('.forgot_password');

    if (action === 'Login') {
        nameInput.style.display = 'none';
        forgotPassword.style.display = 'block';
        
    } else {
        nameInput.style.display = 'block';
        forgotPassword.style.display = 'none';
    }
}

    document.querySelector('#signUpButton').addEventListener('click', function () {
        setAction('Sign Up');
        document.getElementById('signUpButton').classList.add('gray');
        document.getElementById('loginButton').classList.remove('gray');
    });

    document.querySelector('#loginButton').addEventListener('click', function () {
        setAction('Login');
        document.getElementById('loginButton').classList.add('gray');
        document.getElementById('signUpButton').classList.remove('gray');
    });
