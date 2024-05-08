// Update the import path to match the actual location of login.js
const { validateLogin } = require('../../src/static/login.js');

const email = {value: ''};
const password = {value: ''};
const button = global.document.querySelector('.submit-form');

describe('validateLogin function', () => {
    // checks email and password are empty
    test('button should be disabled when both email and password is empty', () => {
        validateLogin(email, password, button);
        expect(button.style.cursor).toBe('not-allowed');
        expect(button.style.opacity).toBe('0.4');
    });
})

// const { validateLogin } = require('../../src/static/login.js');
// const { JSDOM } = require('jsdom');

// // Mock the DOM environment
// document.body.innerHTML = `
//     <input id="email" />
//     <input id="password" />
//     <button class="submit-form"></button>
//     <div class="error"></div>
// `;

// // Mock the necessary elements
// const email = document.getElementById('email');
// const password = document.getElementById('password');
// const button = document.querySelector('.submit-form');

// describe('validateLogin function', () => {
//     // checks email and password are empty
//     test('button should be disabled when both email and password is empty', () => {
//         validateLogin(email, password, button);
//         expect(button.style.cursor).toBe('not-allowed');
//         expect(button.style.opacity).toBe('0.4');
//     });
//     // checks email and password are empty
    
// })
