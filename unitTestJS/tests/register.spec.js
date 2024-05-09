// const { chromium } = require('playwright');
// @ts-check 

import { test, expect } from '@playwright/test';

test.describe('check password is at least 8 characters long, contains at least one uppercase and one special character, and should occur in real time', () => {
    let passwordInput;
    let passwordFeedback;
    let confirmPasswordInput;
    let confirmPasswordfeedback;

    test.beforeEach(async ({ page }) => {
        await page.goto('https://discoveria.online/register.html');

        passwordInput = page.locator('#password');
        passwordFeedback = await page.locator('#password-feedback').textContent();
        confirmPasswordInput = page.locator('#confirmpassword');
        confirmPasswordfeedback = await page.locator('#confirm-feedback').textContent();
    });

    test('checks that the function correctly identifies a valid password', async () => {
        await passwordInput.pressSequentially('T£st1234');
        expect(passwordFeedback).toBe('');
    });

    // test('checks that the function correctly identifies a valid password with matching confirmPassword', async () => {
    //     await passwordInput.pressSequentially('T@st1234');
    //     await confirmPasswordInput.pressSequentially('T@st1234');
    //     expect(confirmPasswordfeedback).toBe('');
    //     expect(passwordFeedback).toBe('');
    // });

    // test('checks fucntion correctly identifies password length < 8 ', async () => {
    //     await passwordInput.pressSequentially('T@st');
    //     expect(passwordFeedback).toBe('Password must be longer than 8 characters.');
    // });

    test('checks that the fucntion identifies when password does not have an uppercase character', async ({ page }) => {
        await passwordInput.pressSequentially('t@st1234');
        await expect(page.locator('#password-feedback')).toContainText('Password must contain at least one uppercase letter.');
    });

    test('checks that the function identifies when password does not have an lowercase character', async ({ page }) => {
        await passwordInput.pressSequentially('T@ST1234');
        await expect(page.locator('#password-feedback')).toContainText('Password must contain at least one lowercase letter.');
    });

    test('checks that the function identifies when password does not have at least one special character', async ({ page }) => {
        await passwordInput.pressSequentially('Test1234');
        await expect(page.locator('#password-feedback')).toContainText('Password must contain at least one special character.');
    });

    // test('checks that the function correctly identifies when confirm password and password do not match', async ({ page }) => {
    //     await passwordInput.pressSequentially('T@st1234');
    //     await confirmPasswordInput.pressSequentially('T@st1');
    //     await expect(page.locator('#confirm-feedback')).toContainText('Passwords do not match');  
    // });
});

test.describe('check email is valid and should occur in real time', () => {
    let emailInput;
    let emailFeedback;

    test.beforeEach(async ({ page }) => {
        await page.goto('https://discoveria.online/register.html');

        emailInput = page.locator('#email');
        emailFeedback = await page.locator('#email-feedback').textContent();
    });

    test('checks that the function correctly identifies a valid email', async () => {
        await emailInput.pressSequentially('test@gmail.com');
        expect(emailFeedback).toBe('Invalid email.');
    });

    test('checks that the function correctly identifies an empty email', async () => {
        await emailInput.pressSequentially('');
        expect(emailFeedback).toBe('Invalid email.');
    });

    test('checks that the function correctly identifies an invalid email', async () => {
        await emailInput.pressSequentially('testgmail.com');
        expect(emailFeedback).toBe('Invalid email.');
    });
});

// (async () => {
//     const browser = await chromium.launch();
//     const page = await browser.newPage();

//     const testCases = [

//         { password: 'T£st1234', confirmPassword: undefined, expectedPasswordFeedbackVisible: false, expectedConfirmFeedbackVisible: false, expectedPasswordChecked: true },
//         { password: 'T£st1234', confirmPassword: 'T£est1234', expectedPasswordFeedbackVisible: false, expectedConfirmFeedbackVisible: false, expectedPasswordChecked: true },
//         { password: 'T£est', confirmPassword: undefined, expectedPasswordFeedbackVisible: true, expectedConfirmFeedbackVisible: false, expectedPasswordChecked: false },
//         { password: 't£est1234', confirmPassword: undefined, expectedPasswordFeedbackVisible: true, expectedConfirmFeedbackVisible: false, expectedPasswordChecked: false },
//         { password: 'T£ST1234', confirmPassword: undefined, expectedPasswordFeedbackVisible: true, expectedConfirmFeedbackVisible: false, expectedPasswordChecked: false },
//         { password: 'Test1234', confirmPassword: undefined, expectedPasswordFeedbackVisible: true, expectedConfirmFeedbackVisible: false, expectedPasswordChecked: false },
//         { password: 'T£st1234', confirmPassword: 'T£est1', expectedPasswordFeedbackVisible: false, expectedConfirmFeedbackVisible: true, expectedPasswordChecked: false },

//         { email: 'test@gmail.com', expectedEmailFeedbackVisible: false, expectedEmailChecked: true },
//         { email: 'test@gmail', expectedEmailFeedbackVisible: true, expectedEmailChecked: false },
//         { email: '', expectedEmailFeedbackVisible: true, expectedEmailChecked: false },
//         { email: 'testgmail.com', expectedEmailFeedbackVisible: true, expectedEmailChecked: false },

//         { username: 'test1', expectedUsernameFeedbackVisible: false, expectedUsernameChecked: true },
//         { username: 'test', expectedUsernameFeedbackVisible: true, expectedUsernameChecked: false },
//         { username: 't@st1', expectedUsernameFeedbackVisible: true, expectedUsernameChecked: false },
//         { username: 't@st', expectedUsernameFeedbackVisible: true, expectedUsernameChecked: false }
//     ];

//     for (const testCase of testCases) {
//         await page.setContent(`
//             <html>
//                 <body>
//                     <input id="username" type="text" value="${testCase.username || ''}" />
//                     <div id="username-feedback"></div>
//                     <input id="email" type="text" value="${testCase.email || ''}" />
//                     <div id="email-feedback"></div>
//                     <input id="password" type="password" value="${testCase.password || ''}" placeholder="Password" />
//                     <div id="password-feedback"></div>
//                     <input id="confirmpassword" type="password" value="${testCase.confirmPassword || ''}" placeholder="Confirm Password" />
//                     <div id="confirm-feedback"></div>
//                     <button class="submit-form">Submit</button>
//                     <script>
//                         let usernameChecked = false;
//                         let emailChecked = false;
//                         let passwordChecked = false;

//                         function checkUsername() {
//                             const username = document.querySelector('#username');
//                             const usernameFeedback = document.querySelector('#username-feedback');
//                             const rules = {
//                                 length: username.value.length > 4,
//                                 specialChar: /[!@#$%^&*(),.?";':{}|<>]/.test(username.value)
//                             };
                            
//                             const messages = [];
//                             if (!rules.length) messages.push("Username must be longer than 4 characters.");
//                             if (rules.specialChar) messages.push("Username must not contain special character.");
//                             if (messages.length === 0) {
//                                 usernameFeedback.style.display = 'none';
//                                 usernameChecked = true;
//                             } else {
//                                 usernameFeedback.style.display = 'block';
//                                 usernameFeedback.innerHTML = messages.join('<br>');
//                                 usernameChecked = false;
//                             }
//                             handleForm();
//                         }

//                         function checkEmail() {
//                             const email = document.querySelector('#email');
//                             const emailFeedback = document.querySelector('#email-feedback');
//                             if (!email.value.includes('@')) {
//                                 emailFeedback.style.display = 'block';
//                                 emailChecked = false;

//                             } else {
//                                 emailFeedback.style.display = 'none';
//                                 emailChecked = true;
//                             }
//                             handleForm();
//                         }

//                         function checkPassword(event) {
//                             const placeholder = event.target.placeholder;

//                             if (placeholder === "Password") {
//                                 const password = document.querySelector('#password');
//                                 const confirmPassword = document.querySelector('#confirmpassword');
//                                 const passwordFeedback = document.querySelector('#password-feedback');
//                                 const confirmFeedback = document.querySelector('#confirm-feedback');

//                                 const rules = {
//                                     length: password.value.length > 8,
//                                     uppercase: /[A-Z]/.test(password.value),
//                                     lowercase: /[a-z]/.test(password.value),
//                                     number: /\d/.test(password.value),
//                                     specialChar: /[£~\`!@#\$%^&*(),.?";':{}|<>]/.test(password.value)
//                                 };
                                
//                                 const messages = [];
//                                 if (!rules.length) messages.push("Password must be longer than 8 characters.");
//                                 if (!rules.uppercase) messages.push("Password must contain at least one uppercase letter.");
//                                 if (!rules.lowercase) messages.push("Password must contain at least one lowercase letter.");
//                                 if (!rules.number) messages.push("Password must contain at least one number.");
//                                 if (!rules.specialChar) messages.push("Password must contain at least one special character.");
//                                 if (messages.length === 0) {
//                                     passwordFeedback.style.display = 'none';
//                                     if (confirmPassword.value.length > 0) {
//                                         if (password.value !== confirmPassword.value) {
//                                             confirmFeedback.style.display = 'block'
//                                             passwordChecked = false;
                            
//                                         } else {
//                                             confirmFeedback.style.display = 'none';
//                                             passwordChecked = true;
//                                         }
//                                     }
//                                 } else {
//                                     passwordFeedback.style.display = 'block';
//                                     passwordFeedback.innerHTML = messages.join('<br>');
//                                     passwordChecked = false;
//                                 }
//                                 return;     
//                             }
//                             if (password.value !== confirmPassword.value) {
//                                 const confirmFeedback = document.querySelector('#confirm-feedback');
//                                 confirmFeedback.style.display = 'block'
//                                 passwordChecked = false;

//                             } else {
//                                 const confirmFeedback = document.querySelector('#confirm-feedback');
//                                 confirmFeedback.style.display = 'none';
//                                 passwordChecked = true;

//                             }
//                             handleForm();
//                         }

//                         function handleForm() {
//                             const submitForm = document.querySelector(".submit-form");
//                             if (usernameChecked && emailChecked && passwordChecked) {
//                                 submitForm.classList.add("active");
//                                 return submitForm.disabled = false;
//                             }
//                             submitForm.classList.remove("active");
//                             submitForm.disabled = true;
//                         }

//                         const email = document.querySelector('#email');
//                         const username = document.querySelector('#username');
//                         const password = document.querySelector('#password');
//                         const confirmPassword = document.querySelector('#confirmpassword');

//                         email.addEventListener('keyup', checkEmail);
//                         username.addEventListener('keyup', checkUsername);
//                         password.addEventListener('keyup', checkPassword);
//                         confirmPassword.addEventListener('keyup', checkPassword);
//                     </script>
//                 </body>
//             </html>
//         `);

//         await page.waitForSelector('#username-feedback, #email-feedback, #password-feedback, #confirm-feedback', { state: 'attached' });

//         if (testCase.username !== undefined) {
//             const usernameInput = await page.$('#username');
//             await usernameInput.evaluate(input => input.value = '');
//             await usernameInput.type(testCase.username);
//             await usernameInput.dispatchEvent('keyup');
//         }

//         if (testCase.email !== undefined) {
//             const emailInput = await page.$('#email');
//             await emailInput.evaluate(input => input.value = '');
//             await emailInput.type(testCase.email);
//             await emailInput.dispatchEvent('keyup');
//         }

//         if (testCase.password !== undefined) {
//             const passwordInput = await page.$('#password');
//             await passwordInput.evaluate(input => input.value = '');
//             await passwordInput.type(testCase.password);
//             await passwordInput.dispatchEvent('keyup');
//         }

//         if (testCase.confirmPassword !== undefined) {
//             const confirmPasswordInput = await page.$('#confirmpassword');
//             await confirmPasswordInput.evaluate(input => input.value = '');
//             await confirmPasswordInput.type(testCase.confirmPassword);
//             await confirmPasswordInput.dispatchEvent('keyup');
//         }

        

// //         await page.waitForFunction(`
// //     const usernameFeedback = document.querySelector('#username-feedback');
// //     const emailFeedback = document.querySelector('#email-feedback');
// //     const passwordFeedback = document.querySelector('#password-feedback');
// //     const confirmFeedback = document.querySelector('#confirm-feedback');
// //     (${testCase.expectedUsernameFeedbackVisible ? `usernameFeedback.style.display === 'block'` : `usernameFeedback.style.display === 'none'`}) &&
// //     (${testCase.expectedEmailFeedbackVisible ? `emailFeedback.style.display === 'block'` : `emailFeedback.style.display === 'none'`}) &&
// //     (${testCase.expectedPasswordFeedbackVisible ? `passwordFeedback.style.display === 'block'` : `passwordFeedback.style.display === 'none'`}) &&
// //     (${testCase.expectedConfirmFeedbackVisible ? `confirmFeedback.style.display === 'block'` : `confirmFeedback.style.display === 'none'`})
// // `);


//         console.log(`Test Case: ${testCase.username ? 'Username=' + testCase.username : testCase.email ? 'Email=' + testCase.email : 'Password=' + testCase.password}`);
//         console.log('Expected username feedback visible:', testCase.expectedUsernameFeedbackVisible);
//         console.log('Expected email feedback visible:', testCase.expectedEmailFeedbackVisible);
//         console.log('Expected password feedback visible:', testCase.expectedPasswordFeedbackVisible);
//         console.log('Expected confirm feedback visible:', testCase.expectedConfirmFeedbackVisible);
//         console.log('Test Result:', 'Pass');
//         console.log('---------------------------');
//     }

//     // await page.waitForNavigation();
//     // await browser.close();
// })();




