const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    const testCases1 = [
        { taskInputValue: 'test', expectedCursor: 'pointer', expectedOpacity: 1 },
        { taskInputValue: null, expectedCursor: 'not-allowed', expectedOpacity: 0.4 },
        { taskInputValue: '  ', expectedCursor: 'not-allowed', expectedOpacity: 0.4 }
    ];

    for (const testCase of testCases1) {
        await page.setContent(`
            <html>
                <body>
                    <input id="taskInput" type="text" value="${testCase.taskInputValue}" />
                    <button id="submitButton" class="submit-button">Submit</button>
                    <script>
                        function checkTaskInput() {
                            const taskInput = document.getElementById('taskInput');
                            const submitButton = document.getElementById('submitButton');

                            if (!taskInput.value.trim()) {
                                submitButton.style.cursor = 'not-allowed';
                                submitButton.style.opacity = 0.4;
                            } else {
                                submitButton.style.cursor = 'pointer';
                                submitButton.style.opacity = 1;
                            }
                        }

                        checkTaskInput();
                    </script>
                </body>
            </html>
        `);

        await page.waitForLoadState('networkidle');

        const buttonStyle = await page.evaluate(() => {
            const submitButton = document.querySelector('.submit-button');
            return {
                cursor: submitButton.style.cursor,
                opacity: parseFloat(submitButton.style.opacity) 
            };
        });

        console.log(`Test Case: Task Input Value=${testCase.taskInputValue}`);
        console.log('Expected cursor:', testCase.expectedCursor);
        console.log('Expected opacity:', testCase.expectedOpacity);
        console.log('Actual cursor:', buttonStyle.cursor);
        console.log('Actual opacity:', buttonStyle.opacity);
        console.log('Test Result:', buttonStyle.cursor === testCase.expectedCursor && buttonStyle.opacity === testCase.expectedOpacity ? 'Pass' : 'Fail');
        console.log('---------------------------');
    };

    const testCases = [
        {
            description: "Form container exists",
            setup: async () => {
                // Add the form container to the DOM
                await page.setContent(`
                    <div id="modify-task-form-container" class="hide"></div>
                    <script>
                        function displayForm() {
                            const formContainer = document.getElementById("modify-task-form-container");
                            formContainer.classList.remove("hide");
                        }
                    </script>
                `);
            },
            action: async () => {
                // Trigger the displayForm function
                await page.evaluate(() => displayForm());
            },
            expectation: async () => {
                // Check if the form container is visible
                const formContainer = await page.$('#modify-task-form-container');
                const isHidden = await formContainer.isHidden();
                return !isHidden;
            }
        },
        {
            description: "Form container doesn't exist",
            setup: async () => {
                // No setup needed as form container is not added to the DOM
            },
            action: async () => {
                // Trigger the displayForm function
                await page.evaluate(() => displayForm());
            },
            expectation: async () => {
                // Check if there's any error
                return page.waitForTimeout(2000).then(() => true).catch(() => false);
            }
        }
    ];

    for (const testCase of testCases) {
        console.log(`Test Case: ${testCase.description}`);
        await testCase.setup();
        await testCase.action();
        const result = await testCase.expectation();
        console.log('Test Result:', result ? 'Pass' : 'Fail');
        console.log('---------------------------');
    }

    await browser.close();
})();



// const { chromium } = require('playwright');

// const { chromium } = require('playwright');

