const signUpBtn = document.querySelector('#signUp');
const loginBtn = document.querySelector('#login');
const action = document.querySelector('#action');
let forgotPassword = document.querySelector('.forgot-password');
let headerText = '';

signUpBtn.addEventListener('click', (event) => {
    formatHeader(event);
    if (action.textContent) {
        nameInput.style.display = 'flex';
        forgotPassword.style.display = 'none';
        document.getElementById('signUp').classList.add('gray');
        document.getElementById('login').classList.remove('gray');
    }
    action.textContent = headerText;
});

loginBtn.addEventListener('click', (event) => {
    formatHeader(event);
    if (action.textContent) {
        nameInput.style.display = 'none';
        forgotPassword.style.display = 'flex';
        document.getElementById('login').classList.add('gray');
        document.getElementById('signUp').classList.remove('gray');
    }
    action.textContent = headerText;
})

function formatHeader(event){
    headerText = event.target.textContent;
    let words = headerText.split('-');

    for (let i = 0; i < words.length; i++) {
        words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }
    let formattedString = words.join(' ');
    headerText = formattedString;
}