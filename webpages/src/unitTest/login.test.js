// Update the import path to match the actual location of login.js
const { validateLogin } = require('../../src/static/login.js');


const email = {value: ''};
const password = {value: ''};
const button = {style: {cursor: '', opacity: ''}};

describe('validateLogin function', () => {
    // checks email and password are empty
    test('button should be disabled when both email and password is empty', () => {
        validateLogin();
        expect(button.style.cursor).toBe('not-allowed');
        expect(button.style.opacity).toBe('0.4');
    });
})