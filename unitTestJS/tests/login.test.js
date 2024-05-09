// @ts-check 

import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
    test('Check button CSS with empty email and password', async ({ page }) => {
        // Navigate to the login page
        await page.goto('https://discoveria.online/login.html');

        await page.fill('#email', '');
        await page.fill('#password', '');

        const submitButton = page.locator('.submit-form');

        const buttonStyle = await submitButton.evaluate((button) => {
            const { cursor, opacity } = getComputedStyle(button);
            return { cursor, opacity };
        });

        expect(buttonStyle.cursor).toBe('not-allowed');
        expect(parseFloat(buttonStyle.opacity)).toBe(0.4);
    });

    test('Check button CSS with empty email and valid password', async ({ page }) => {
        await page.goto('https://discoveria.online/login.html');

        await page.fill('#email', '');
        await page.fill('#password', 'password');

        const submitButton = page.locator('.submit-form');

        const buttonStyle = await submitButton.evaluate((button) => {
            const { cursor, opacity } = getComputedStyle(button);
            return { cursor, opacity };
        });

        expect(buttonStyle.cursor).toBe('not-allowed');
        expect(parseFloat(buttonStyle.opacity)).toBe(0.4);
    });

    test('Check button CSS with valid email and empty password', async ({ page }) => {
        await page.goto('https://discoveria.online/login.html');

        await page.fill('#email', 'test@gmail.com');
        await page.fill('#password', '');

        const submitButton = page.locator('.submit-form');

        const buttonStyle = await submitButton.evaluate((button) => {
            const { cursor, opacity } = getComputedStyle(button);
            return { cursor, opacity };
        });

        expect(buttonStyle.cursor).toBe('not-allowed');
        expect(parseFloat(buttonStyle.opacity)).toBe(0.4);
    });
});



// test("Check with valid email and empty password", async ({ page }) => {
//     await page.goto("https://discoveria.online/login.html");
//     await page.fill("#email", "test@gmail.com");
//     await page.fill("#password", "");
//     const button = await page.locator(".submit-form");
//     await expect(button).toHaveCSS("style", "cursor: not-allowed; opacity: 0.4;");
// });

// test("Check with invalid email and valid password", async ({ page }) => {
//     await page.goto("https://discoveria.online/login.html");
//     await page.fill("#email", "invalidemail");
//     await page.fill("#password", "password");
//     const button = await page.locator(".submit-form");
//     await expect(button).toHaveCSS("style", "cursor: not-allowed; opacity: 0.4;");
// });

// test("Check with invalid email format and invalid password", async ({ page }) => {
//     await page.goto("https://discoveria.online/login.html");
//     await page.fill("#email", "test@test@gmail.com");
//     await page.fill("#password", "pass");
//     const button = await page.locator(".submit-form");
//     await expect(button).toHaveCSS("style", "cursor: not-allowed; opacity: 0.4;");
// });

// test("Check with valid email and valid password", async ({ page }) => {
//     await page.goto("https://discoveria.online/login.html");
//     await page.fill("#email", "test@gmail.com");
//     await page.fill("#password", "password");
//     const button = await page.locator(".submit-form");
//     await expect(button).toHaveCSS("style", "cursor: pointer; opacity: 1;");
// });

// test("Check with valid email and strong password", async ({ page }) => {
//     await page.goto("https://discoveria.online/login.html");
//     await page.fill("#email", "test@gmail.com");
//     await page.fill("#password", "password123");
//     const button = await page.locator(".submit-form");
//     await expect(button).toHaveCSS("style", "cursor: pointer; opacity: 1;");
// });



// (async () => {
//     const browser = await chromium.launch();
//     const page = await browser.newPage();
//     page.goto("")

//     const testCases = [
//         { email: '', password: '', expectedCursor: 'not-allowed', expectedOpacity: 0.4 },
//         { email: '', password: 'password', expectedCursor: 'not-allowed', expectedOpacity: 0.4 },
//         { email: 'test@gmail.com', password: '', expectedCursor: 'not-allowed', expectedOpacity: 0.4 },
//         { email: 'invalidemail', password: 'password', expectedCursor: 'not-allowed', expectedOpacity: 0.4 },
//         { email: 'test@test@gmail.com', password: 'pass', expectedCursor: 'not-allowed', expectedOpacity: 0.4 },
//         { email: 'test@gmail.com', password: 'password', expectedCursor: 'pointer', expectedOpacity: 1 },
//         { email: 'test@gmail.com', password: 'password123', expectedCursor: 'pointer', expectedOpacity: 1 }
//     ];

//     for (const testCase of testCases) {
//         await page.setContent(`
//             <html>
//                 <body>
//                     <input id="email" type="text" value="${testCase.email}" />
//                     <input id="password" type="password" value="${testCase.password}" />
//                     <button class="submit-form">Submit</button>
//                     <script>
//                         function validateLogin() {
//                             const email = document.querySelector('#email');
//                             const password = document.querySelector('#password');
//                             const button = document.querySelector('.submit-form');

//                             if (email.value.length == 0 && password.value.length == 0) {
//                                 button.style.cursor = 'not-allowed';
//                                 button.style.opacity = 0.4;
//                             } else if (email.value == '' && password.value == '') {
//                                 button.style.cursor = 'not-allowed';
//                                 button.style.opacity = 0.4;
//                             } else if (password.value.length >= 8) {
//                                 button.style.opacity = 1;
//                                 button.style.cursor = 'pointer';
//                             } else {
//                                 button.style.cursor = 'not-allowed';
//                                 button.style.opacity = 0.4;
//                             }
//                         }

//                         validateLogin();
//                     </script>
//                 </body>
//             </html>
//         `);

//         await page.waitForLoadState('networkidle');

//         const buttonStyle = await page.evaluate(() => {
//             const button = document.querySelector('.submit-form');
//             return {
//                 cursor: button.style.cursor,
//                 opacity: parseFloat(button.style.opacity)
//             };
//         });

//         console.log(`Test Case: Email=${testCase.email}, Password=${testCase.password}`);
//         console.log('Expected cursor:', testCase.expectedCursor);
//         console.log('Expected opacity:', testCase.expectedOpacity);
//         console.log('Actual cursor:', buttonStyle.cursor);
//         console.log('Actual opacity:', buttonStyle.opacity);
//         console.log('Test Result:', buttonStyle.cursor === testCase.expectedCursor && buttonStyle.opacity === testCase.expectedOpacity ? 'Pass' : 'Fail');
//         console.log('---------------------------');
//     }

//     // await browser.close();
// })();
