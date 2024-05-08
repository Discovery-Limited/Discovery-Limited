const { chromium } = require('playwright');

(async () => {

    const browser = await chromium.launch();

    const page = await browser.newPage();

    const testCases = [
        { email: '', password: '', expectedCursor: 'not-allowed', expectedOpacity: 0.4 },
        { email: '', password: 'password', expectedCursor: 'not-allowed', expectedOpacity: 0.4 },
        { email: 'test@gmail.com', password: '', expectedCursor: 'not-allowed', expectedOpacity: 0.4 },
        { email: 'invalidemail', password: 'password', expectedCursor: 'not-allowed', expectedOpacity: 0.4 },
        { email: 'test@test@gmail.com', password: 'pass', expectedCursor: 'not-allowed', expectedOpacity: 0.4 },
        { email: 'test@gmail.com', password: 'password', expectedCursor: 'pointer', expectedOpacity: 1 },
        { email: 'test@gmail.com', password: 'password123', expectedCursor: 'pointer', expectedOpacity: 1 }
    ];

    // Run tests
    for (const testCase of testCases) {
        await page.setContent(`
            <html>
                <body>
                    <input id="email" type="text" value="${testCase.email}" />
                    <input id="password" type="password" value="${testCase.password}" />
                    <button class="submit-form">Submit</button>
                    <script>
                        // Define the validateLogin function
                        function validateLogin() {
                            const email = document.querySelector('#email');
                            const password = document.querySelector('#password');
                            const button = document.querySelector('.submit-form');

                            if (email.value.length == 0 && password.value.length == 0) {
                                button.style.cursor = 'not-allowed';
                                button.style.opacity = 0.4;
                            } else if (email.value == '' && password.value == '') {
                                button.style.cursor = 'not-allowed';
                                button.style.opacity = 0.4;
                            } else if (password.value.length >= 8) {
                                button.style.opacity = 1;
                                button.style.cursor = 'pointer';
                            } else {
                                button.style.cursor = 'not-allowed';
                                button.style.opacity = 0.4;
                            }
                        }

                        // Call the validateLogin function
                        validateLogin();
                    </script>
                </body>
            </html>
        `);

        await page.waitForLoadState('networkidle');

        const buttonStyle = await page.evaluate(() => {
            const button = document.querySelector('.submit-form');
            return {
                cursor: button.style.cursor,
                opacity: parseFloat(button.style.opacity) 
            };
        });

        console.log(`Test Case: Email=${testCase.email}, Password=${testCase.password}`);
        console.log('Expected cursor:', testCase.expectedCursor);
        console.log('Expected opacity:', testCase.expectedOpacity);
        console.log('Actual cursor:', buttonStyle.cursor);
        console.log('Actual opacity:', buttonStyle.opacity);
        console.log('Test Result:', buttonStyle.cursor === testCase.expectedCursor && buttonStyle.opacity === testCase.expectedOpacity ? 'Pass' : 'Fail');
        console.log('---------------------------');
    }

    // Close the browser
    await browser.close();
})();

