const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    const testCases = [
        { username: 'test1', expectedFeedbackVisible: false },
        { username: 'test', expectedFeedbackVisible: true },
        { username: 'T@st1', expectedFeedbackVisible: true },
        { username: 'T@st', expectedFeedbackVisible: true}
    ];

    for (const testCase of testCases) {
        await page.setContent(`
            <html>
                <body>
                    <input id="username" type="text" value="${testCase.username}" />
                    <div id="username-feedback"></div>
                    <script>
                        function checkUsername() {
                            const username = document.querySelector('#username');
                            const usernameFeedback = document.querySelector('#username-feedback');
                            const rules = {
                                length: username.value.length > 4,
                                specialChar: /[!@#$%^&*(),.?";':{}|<>]/.test(username.value)
                            };
                            
                            const messages = [];
                            if (!rules.length) messages.push("Username must be longer than 4 characters.");
                            if (rules.specialChar) messages.push("Username must not contain special character.");
                            if (messages.length === 0) {
                                usernameFeedback.style.display = 'none';
                            } else {
                                usernameFeedback.style.display = 'block';
                                usernameFeedback.innerHTML = messages.join('<br>');
                            }
                        }
                        checkUsername();
                    </script>
                </body>
            </html>
        `);

        await page.waitForSelector('#username-feedback', { state: 'attached' });
        const usernameInput = await page.$('#username');

        await usernameInput.evaluate(input => input.value = '');

        await usernameInput.type(testCase.username);

        await usernameInput.dispatchEvent('keyup');

        await page.waitForFunction(`document.querySelector('#username-feedback').style.display === '${testCase.expectedFeedbackVisible ? 'block' : 'none'}'`);

        const actualFeedbackVisible = await page.evaluate(() => {
            const usernameFeedback = document.querySelector('#username-feedback');
            return window.getComputedStyle(usernameFeedback).display === 'block';
        });

        console.log(`Test Case: Username=${testCase.username}`);
        console.log('Expected feedback visible:', testCase.expectedFeedbackVisible);
        console.log('Actual feedback visible:', actualFeedbackVisible);
        console.log('Test Result:', actualFeedbackVisible === testCase.expectedFeedbackVisible ? 'Pass' : 'Fail');
        console.log('---------------------------');
    }

    await browser.close();
})();
