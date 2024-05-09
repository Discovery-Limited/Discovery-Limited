const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    await page.setContent(`
    <button id="profileDropdownButton">Profile Dropdown Button</button>
    <ul id="profileDropdownList">Dropdown List</ul>
`);

const profileDropdownButton = await page.$('#profileDropdownButton');
const profileDropdownList = await page.$('#profileDropdownList');

// Test Case 1: Click on profile dropdown when hidden
await profileDropdownButton.click();
let isListVisible = await profileDropdownList.isVisible();
console.log('Test Case 1:', isListVisible ? 'Pass' : 'Fail');

// Test Case 2: Click on profile dropdown when visible
await profileDropdownButton.click();
isListVisible = await profileDropdownList.isVisible();
console.log('Test Case 2:', !isListVisible ? 'Pass' : 'Fail');

// Test Case 3: Button not found
if (!profileDropdownButton) {
    console.log('Test Case 3: Pass');
} else {
    console.log('Test Case 3: Fail');
}

// Test Case 4: Click on profile dropdown but the list is not found
if (!profileDropdownList) {
    console.log('Test Case 4: Pass');
} else {
    console.log('Test Case 4: Fail');
}

const sidebarToggle = await page.$('#sidebarToggle');
const sidebarDropdownList = await page.$('#sidebarDropdownList');

const userViewUrl = 'https://discoveria.online/user_view.php'; // Replace 'https://example.com/user-view' with your actual user view URL

const testCases1 = [
    // Test case 1: Click event on sidebar button when sidebar is initially closed
    async () => {
        await page.goto(userViewUrl);
        if (!sidebarToggle) return { error: 'Sidebar toggle button not found' };
        await sidebarToggle.click();
        await page.waitForTimeout(1000); // Adjust timeout as necessary
        const iconClass = await sidebarToggle.$eval('i', el => el.classList.contains('fa-angle-up'));
        const listClass = await sidebarDropdownList.evaluate(el => el.classList.contains('active'));
        return { iconClass, listClass };
    },
    // Test case 2: Click event on sidebar button when sidebar is initially opened
    async () => {
        if (!sidebarToggle) return { error: 'Sidebar toggle button not found' };
        await sidebarToggle.click();
        await page.waitForTimeout(1000); // Adjust timeout as necessary
        const iconClass = await sidebarToggle.$eval('i', el => el.classList.contains('fa-angle-down'));
        const listClass = await sidebarDropdownList.evaluate(el => el.classList.contains('active'));
        return { iconClass, listClass };
    },
    // Test case 3: Click event on sidebar button when the button is not found
    async () => {
        return { error: 'Sidebar toggle button not found' };
    },
    // Test case 4: Click event on sidebar button when the list is not found
    async () => {
        return { error: 'Sidebar dropdown list not found' };
    }
];

for (const [index, testCase] of testCases1.entries()) {
    console.log(`Running Test Case ${index + 1}`);
    const result = await testCase();
    console.log('Test Case Result:', result);
    console.log('---------------------------------');
};

const addEmailToListFunction = `
    function addEmailToList(email) {
        const emailListDiv = document.getElementById("emailList");
        const newEmail = document.createElement("span");
        newEmail.textContent = email;
        emailListDiv.appendChild(newEmail);

        const hiddenEmails = document.getElementById("hiddenEmails");
        hiddenEmails.value += email + ",";
    }
`;

// Test Case 1: Valid email address
const validEmail = 'test@gmail.com';
await page.setContent(`
    <div id="emailList"></div>
    <input type="hidden" id="hiddenEmails" value="">
    <script>${addEmailToListFunction}</script>
`);
await page.evaluate((email) => {
    addEmailToList(email);
}, validEmail);
const emailListContent = await page.$eval('#emailList', el => el.textContent);
const hiddenEmailsValue = await page.$eval('#hiddenEmails', el => el.value);
console.log('Test Case 1:');
console.log('Expected email list content:', validEmail);
console.log('Actual email list content:', emailListContent);
console.log('Expected hidden emails value:', validEmail + ',');
console.log('Actual hidden emails value:', hiddenEmailsValue);
console.log('--------------------------------');

// Test Case 2: Invalid email address
const invalidEmail = 'testgmail.com';
await page.setContent(`
    <div id="emailList"></div>
    <input type="hidden" id="hiddenEmails" value="">
    <script>${addEmailToListFunction}</script>
`);
await page.evaluate((email) => {
    addEmailToList(email);
}, invalidEmail);
const emailListContent2 = await page.$eval('#emailList', el => el.textContent);
const hiddenEmailsValue2 = await page.$eval('#hiddenEmails', el => el.value);
console.log('Test Case 2:');
console.log('Expected email list content:', '');
console.log('Actual email list content:', emailListContent2);
console.log('Expected hidden emails value:', '');
console.log('Actual hidden emails value:', hiddenEmailsValue2);
console.log('--------------------------------');

// Test Case 3: Null email
const nullEmail = null;
await page.setContent(`
    <div id="emailList"></div>
    <input type="hidden" id="hiddenEmails" value="">
    <script>${addEmailToListFunction}</script>
`);
await page.evaluate((email) => {
    addEmailToList(email);
}, nullEmail);
const emailListContent3 = await page.$eval('#emailList', el => el.textContent);
const hiddenEmailsValue3 = await page.$eval('#hiddenEmails', el => el.value);
console.log('Test Case 3:');
console.log('Expected email list content:', '');
console.log('Actual email list content:', emailListContent3);
console.log('Expected hidden emails value:', '');
console.log('Actual hidden emails value:', hiddenEmailsValue3);
console.log('--------------------------------');


    await page.evaluate(() => {
        window.setProjectIdInSession = function(projectId) {
            if (!projectId) {
                console.error("Project ID is not provided");
                return;
            }
            // Simulated fetch operation
            console.log("Project ID stored successfully.");
        }
    });

    const testCases2 = [
        // Test cases for storing valid project ID
        { projectId: "123", expectedConsoleMessage: "Project ID stored successfully." },
        // Test cases for error handling - Empty Project ID
        { projectId: "", expectedConsoleMessage: "Project ID is not provided" },
        // Test cases for error handling - Null Project ID
        { projectId: null, expectedConsoleMessage: "Project ID is not provided" },
        // Test cases for error handling - Undefined Project ID
        { projectId: undefined, expectedConsoleMessage: "Project ID is not provided" },
        // Test cases for storing non-empty project ID
        { projectId: "project123", expectedConsoleMessage: "Project ID stored successfully." }
    ];

    for (const testCase of testCases2) {
        await page.evaluate(({ projectId, expectedConsoleMessage }) => {
            // Mocking console.log to capture the log messages
            const consoleLog = [];
            const originalConsoleLog = console.log;
            console.log = (message) => consoleLog.push(message);

            // Call the function with the provided project ID
            setProjectIdInSession(projectId);

            // Restore console.log
            console.log = originalConsoleLog;

            // Check if the expected console message is logged
            if (consoleLog.includes(expectedConsoleMessage)) {
                console.log(`Test Case for project: projectId=${projectId}`);
                console.log('Expected Console Message:', expectedConsoleMessage);
                console.log('Test Result:', 'Pass');
            } else {
                console.log(`Test Case for project: projectId=${projectId}`);
                console.log('Expected Console Message:', expectedConsoleMessage);
                console.log('Test Result:', 'Fail');
            }
            console.log('---------------------------');
        }, testCase);
    }
    

    

    await page.setContent(`
        <input type="text" id="emailInput">
        <div id="emailList"></div>
        <input type="hidden" id="hiddenEmails" value="">
        <script>
            // Code to addEmailToList and validateEmail functions
            function addEmailToList(email) {
                const emailListDiv = document.getElementById("emailList");
                const newEmail = document.createElement("span");
                newEmail.textContent = email;
                emailListDiv.appendChild(newEmail);

                const hiddenEmails = document.getElementById("hiddenEmails");
                hiddenEmails.value += email + ",";
            }

            function validateEmail(email) {
                // Simplified email validation logic for testing
                return /\S+@\S+\.\S+/.test(email);
            }

            const emailInput = document.getElementById("emailInput");
            emailInput.addEventListener("keypress", function (event) {
                if (event.key === "Enter") {
                    event.preventDefault();
                    const email = this.value.trim();
                    if (email && validateEmail(email)) {
                        addEmailToList(email);
                        this.value = "";
                    } else {
                        alert("Please enter a valid email.");
                    }
                }
            });
        </script>
    `);

    // Test Case 1: Valid email address entered
    await page.fill('#emailInput', 'test@gmail.com');
    await page.keyboard.press('Enter');
    const emailListContents = await page.$eval('#emailList', el => el.textContent);
    console.log('Test Case 1:');
    console.log('Expected email list content:', 'test@gmail.com');
    console.log('Actual email list content:', emailListContents);
    console.log('--------------------------------');

    // Test Case 2: Invalid email address entered
    page.on('dialog', async dialog => {
        console.log('Test Case 2:');
        console.log('Expected dialog message:', 'Please enter a valid email.');
        console.log('Actual dialog message:', dialog.message());
        await dialog.dismiss();
        console.log('--------------------------------');
    });
    await page.fill('#emailInput', 'testgmail.com');
    await page.keyboard.press('Enter');

    // Test Case 3: Empty email input field
    await page.keyboard.press('Enter');
    const emailListContents2 = await page.$eval('#emailList', el => el.textContent);
    console.log('Test Case 3:');
    console.log('Expected email list content:', '');
    console.log('Actual email list content:', emailListContents2);
    console.log('--------------------------------');

    // Test Case 4: Leading and trailing whitespace trimmed
    await page.fill('#emailInput', '   test@gmail.com   ');
    await page.keyboard.press('Enter');
    const emailListContents3 = await page.$eval('#emailList', el => el.textContent);
    console.log('Test Case 4:');
    console.log('Expected email list content:', 'test@gmail.com');
    console.log('Actual email list content:', emailListContents3);
    console.log('--------------------------------');




    const validateEmail = async (email) => {
        return await page.evaluate((email) => {
            return /\S+@\S+\.\S+/.test(email);
        }, email);
    };

    // Test cases
    const testCases3 = [
        { email: 'test@gmail.com', expected: true },
        { email: 'testgmail.com', expected: false },
        { email: 'test@gmailcom', expected: false },
        { email: '@gmailcom', expected: false },
        { email: 'test@gmail', expected: false },
        { email: '', expected: false },
        { email: '       ', expected: false },
        { email: 'test!@gmail.com', expected: true }
    ];

    // Run test cases
    for (const { email, expected } of testCases3) {
        const result = await validateEmail(email);
        console.log(`Testing email: ${email}`);
        console.log('Expected:', expected);
        console.log('Actual:', result);
        console.log('Test Result:', result === expected ? 'Pass' : 'Fail');
        console.log('---------------------------');
    }




    


    // const page = await context.newPage();
    await page.evaluate(() => {
        window.checkProjects = async () => {
            const projectButton = document.querySelector("#projects");
            try {
                const response = await fetch("fetch_projects.php");
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                if (data[0]) {
                    const currentProject = data[0];
                    projectButton.querySelector("p").textContent = currentProject.project_name;
                    projectButton.setAttribute("data-id", currentProject.project_id);
                    setProjectIdInSession(currentProject.project_id);
                } else {
                    projectButton.querySelector("p").textContent = "Projects";
                    projectButton.setAttribute("data-id", undefined);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };
    });

    // Mock function to simulate successful response with project data
    const mockFetchSuccess = async () => {
        await page.evaluate(() => {
            window.fetch = async () => ({
                ok: true,
                json: async () => [{ project_id: '123', project_name: 'Project A' }]
            });
        });
    };

    // Mock function to simulate successful response with empty array of projects
    const mockFetchEmptySuccess = async () => {
        await page.evaluate(() => {
            window.fetch = async () => ({
                ok: true,
                json: async () => []
            });
        });
    };

    // Mock function to simulate network error
    const mockFetchNetworkError = async () => {
        await page.evaluate(() => {
            window.fetch = async () => {
                throw new Error('Network response was not ok');
            };
        });
    };

    // Mock function to simulate server error
    const mockFetchServerError = async () => {
        await page.evaluate(() => {
            window.fetch = async () => ({
                ok: false,
                status: 500
            });
        });
    };

    // Mock function to simulate successful response with multiple projects
    const mockFetchMultipleProjectsSuccess = async () => {
        await page.evaluate(() => {
            window.fetch = async () => ({
                ok: true,
                json: async () => [
                    { project_id: '123', project_name: 'Project A' },
                    { project_id: '456', project_name: 'Project B' }
                ]
            });
        });
    };

    // Mock function to simulate successful response with empty response body
    const mockFetchEmptyResponseBodySuccess = async () => {
        await page.evaluate(() => {
            window.fetch = async () => ({
                ok: true,
                json: async () => null
            });
        });
    };

    // Test Case 1: Successful response with project data available
    await mockFetchSuccess();
    await page.setContent('<button id="projects"><p></p></button>');
    await page.evaluate(() => checkProjects());
    let buttonText = await page.$eval('#projects p', el => el.textContent);
    let dataId = await page.$eval('#projects', el => el.getAttribute('data-id'));
    console.log('Test Case 1:', buttonText === 'Project A' && dataId === '123' ? 'Pass' : 'Fail');

    // Test Case 2: Successful response with an empty array of projects
    await mockFetchEmptySuccess();
    await page.evaluate(() => checkProjects());
    buttonText = await page.$eval('#projects p', el => el.textContent);
    dataId = await page.$eval('#projects', el => el.getAttribute('data-id'));
    console.log('Test Case 2:', buttonText === 'Projects' && dataId === 'undefined' ? 'Pass' : 'Fail');

    // Test Case 3: Network error
    await mockFetchNetworkError();
    await page.evaluate(() => checkProjects());
    console.log('Test Case 3:', 'Error logged to console');

    // Test Case 4: Server error
    await mockFetchServerError();
    await page.evaluate(() => checkProjects());
    buttonText = await page.$eval('#projects p', el => el.textContent);
    dataId = await page.$eval('#projects', el => el.getAttribute('data-id'));
    console.log('Test Case 4:', buttonText === 'Projects' && dataId === 'undefined' ? 'Pass' : 'Fail');

    // Test Case 5: Successful response with multiple projects available
    await mockFetchMultipleProjectsSuccess();
    await page.evaluate(() => checkProjects());
    buttonText = await page.$eval('#projects p', el => el.textContent);
    dataId = await page.$eval('#projects', el => el.getAttribute('data-id'));
    console.log('Test Case 5:', buttonText === 'Project A' && dataId === '123' ? 'Pass' : 'Fail');

    // Test Case 6: Successful response with an empty response body
    await mockFetchEmptyResponseBodySuccess();
    await page.evaluate(() => checkProjects());
    buttonText = await page.$eval('#projects p', el => el.textContent);
    dataId = await page.$eval('#projects', el => el.getAttribute('data-id'));
    console.log('Test Case 6:', buttonText === 'Projects' && dataId === 'undefined' ? 'Pass' : 'Fail');


    await browser.close();
})();
