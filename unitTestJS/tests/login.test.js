// @ts-check 

import { test, expect } from '@playwright/test';

test.describe('users should only be able to click the login button if both the email and password field is filled in', () => {
    let submitButton;
    test.beforeEach(async ({ page }) => {
        await page.goto('https://discoveria.online/login.html');
        submitButton = page.locator('.submit-form').first();

    })
    test('Check button CSS with empty email and password', async ({ page }) => {
        await page.fill('#email', '');
        await page.fill('#password', '');

        const buttonStyle = await submitButton.evaluate((button) => {
            const { cursor, opacity } = getComputedStyle(button);
            return { cursor, opacity };
        });


        expect(buttonStyle.cursor).toBe('not-allowed');
        expect(parseFloat(buttonStyle.opacity)).toBe(0.4);
    });

    test('Check button CSS with empty email and valid password', async ({ page }) => {
        await page.fill('#email', '');
        await page.fill('#password', 'password');

        const buttonStyle = await submitButton.evaluate((button) => {
            const { cursor, opacity } = getComputedStyle(button);
            return { cursor, opacity };
        });

        expect(buttonStyle.cursor).toBe('not-allowed');
        expect(parseFloat(buttonStyle.opacity)).toBe(0.4);
    });

    test('Check button CSS with valid email and empty password', async ({ page }) => {
        await page.fill('#email', 'test@gmail.com');
        await page.fill('#password', '');
        const buttonStyle = await submitButton.evaluate((button) => {
            const { cursor, opacity } = getComputedStyle(button);
            return { cursor, opacity };
        });
        expect(buttonStyle.cursor).toBe('not-allowed');
        expect(parseFloat(buttonStyle.opacity)).toBe(0.4);
    });

    test('Check button CSS with invalid email and valid password', async ({ page }) => {
        await page.fill('#email', 'testgmail.com');
        await page.locator("#password").pressSequentially('password');
        const buttonStyle = await submitButton.evaluate((button) => {
            const { cursor, opacity } = getComputedStyle(button);
            return { cursor, opacity };
        })
        expect(buttonStyle.cursor).toBe('pointer');
        expect(parseFloat(buttonStyle.opacity)).toBe(1);
    });


    test('Check button CSS with valid email and valid password', async ({ page }) => {
        await page.locator("#email").pressSequentially('test@test@gmail.com');
        await page.locator("#password").pressSequentially('pass');

        const buttonStyle = await submitButton.evaluate((button) => {
            const { cursor, opacity } = getComputedStyle(button);
            return { cursor, opacity };
        });

        expect(buttonStyle.cursor).toBe('not-allowed');
        expect(parseFloat(buttonStyle.opacity)).toBe(0.4); 
    });
});