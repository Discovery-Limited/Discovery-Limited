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

    test('checks that the function correctly identifies a valid password with matching confirmPassword', async ({page}) => {
        await passwordInput.fill('T@st1234');
        await confirmPasswordInput.fill('T@st1234');
        await expect(page.locator('#confirm-feedback')).toContainText('');
        await expect(page.locator('#password-feedback')).toContainText('');
    });

    test('checks fucntion correctly identifies password length < 8 ', async ({page}) => {
        await passwordInput.pressSequentially('T@st');
        await expect(page.locator('#password-feedback')).toContainText('Password must be longer than 8 characters.');
        await expect(page.locator('#password-feedback')).toContainText('Password must contain at least one number.');
    });

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

    test('checks that the function correctly identifies when confirm password and password do not match', async ({ page }) => {
        await passwordInput.pressSequentially('T@st1234');
        await confirmPasswordInput.pressSequentially('T@st1');
        await expect(page.locator('#confirm-feedback')).toContainText('Passwords are not matching');  
    });
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

test.describe('username should not have bspecial characters and must be at least 5 characters long', () => {
    let usernameInput;
    // let usernameFeedback;

    test.beforeEach(async ({ page }) => {
        await page.goto('https://discoveria.online/register.html');

        usernameInput = page.locator('#username');
    });

    test('checks that the function correctly identifies a valid username', async ({ page }) => {
        await usernameInput.pressSequentially('test1');
        await expect(page.locator('#username-feedback')).toContainText('Username must be longer than 4 characters.');
    });

    test('checks that the function correctly identifies an invalid username', async ({ page }) => {
        await usernameInput.pressSequentially('test');
        await expect(page.locator('#username-feedback')).toContainText('Username must be longer than 4 characters.');
    });

    test('checks when username has special characters and is > 5', async ({ page }) => {
        await usernameInput.pressSequentially('t@st1');
        await expect(page.locator('#username-feedback')).toContainText('Username must not contain special character.');
    });

    test('checks when username is < 5 and has special charaters', async ({ page }) => {
        await usernameInput.pressSequentially('t@st');
        await expect(page.locator('#username-feedback')).toContainText('Username must not contain special character.');
    });
});