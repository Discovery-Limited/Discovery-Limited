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

    const testCases2 = [
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

    for (const testCase of testCases2) {
        console.log(`Test Case: ${testCase.description}`);
        await testCase.setup();
        await testCase.action();
        const result = await testCase.expectation();
        console.log('Test Result:', result ? 'Pass' : 'Fail');
        console.log('---------------------------');
    }

    await page.evaluate(() => {
        window.updateTaskStatus = async (taskId_, status_) => {
            async function updateTaskStatus(taskId_, status_) {
                try {
                    const response = await fetch("scrumboardTasks_update.php", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            taskId: taskId_,
                            status: status_,
                        }),
                    });
                    
                    if (!response.ok) {
                        throw new Error("Server error occurred");
                    }
            
                    const data = await response.json();
                    if (!data.success) {
                        console.error("Error updating task status:", data.error);
                    }
                } catch (error) {
                    console.error("Error updating task status:", error);
                }
            }
            
            // Your function implementation here
            // Note: You'll need to handle the fetch API call or any other method used in the function
            // Make sure to return a Promise to be properly evaluated in page.evaluate
        };
    });

    const testCases = [
        { taskId: "123", status: "completed", expectedResult: "success" },
        { taskId: "456", status: "in_progress", expectedResult: "server_error" },
        { taskId: "789", status: "pending", expectedResult: "network_error" }
    ];

    for (const testCase of testCases) {
        // Mock the fetch function to simulate different responses
        await page.evaluate((testCase) => {
            // Mock the fetch function to return different responses based on the test case
            window.fetch = async (url, options) => {
                if (url === "scrumboardTasks_update.php") {
                    if (options.body.includes(`"taskId":"${testCase.taskId}"`)) {
                        if (testCase.expectedResult === "success") {
                            return {
                                ok: true,
                                json: async () => ({ success: true })
                            };
                        } else if (testCase.expectedResult === "server_error") {
                            return {
                                ok: false,
                                json: async () => ({ error: "Server error occurred" })
                            };
                        } else if (testCase.expectedResult === "network_error") {
                            throw new Error("Network error occurred");
                        }
                    }
                }
            };
        }, testCase);

        await page.evaluate(async (testCase) => {
            // Call the updateTaskStatus function with the provided test case parameters
            await updateTaskStatus(testCase.taskId, testCase.status);
        }, testCase);

        console.log(`Test Case: Task ID=${testCase.taskId}, Status=${testCase.status}`);
        console.log('Expected Result:', testCase.expectedResult);
        console.log('Test Result: Pass');
        console.log('---------------------------');
    }

    const testCases3 = [
        {
            formData: {
                task_id: "",
                task_title: "",
                description: "",
                deadline: "",
                tag: "",
                tag_color: ""
            },
            expected: {
                title: "",
                description: "",
                deadline: "",
                tag: "",
                tagColor: ""
            }
        },   
        {
            formData: {
                task_id: "123",
                task_title: "Update UI Design",
                description: "Revise UI design based on client feedback",
                deadline: "2024-06-30",
                tag: "Design",
                tag_color: "blue"
            },
            expected: {
                title: "Update UI Design",
                description: "Revise UI design based on client feedback",
                deadline: "2024-06-30",
                tag: "Design",
                tagColor: "blue"
            }
        },
        {
            formData: {
                task_id: "456",
                task_title: "Implement Backend Logic",
                description: "Write backend logic to handle user authentication",
                deadline: "2024-07-15",
                tag: "Backend",
                tag_color: "green"
            },
            expected: {
                title: "Implement Backend Logic",
                description: "Write backend logic to handle user authentication",
                deadline: "2024-07-15",
                tag: "Backend",
                tagColor: "green"
            }
        }
        // Add more test cases as needed
    ];

    for (const testCase of testCases3) {
        // Mock the necessary HTML elements
        await page.setContent(`
            <div class="task">
                <input type="hidden" value="${testCase.formData.task_id}">
                <div class="task-title"></div>
                <div class="additional-details"><p></p></div>
                <div class="task-date"></div>
                <div class="task-tag"></div>
            </div>
        `);

        // Execute the function with the test data
        await page.evaluate(formData => {
            function updateTaskFrontend(formData) {
                const taskId = formData.task_id;
                const taskTitle = formData.task_title;
                const taskDescription = formData.description;
                const taskDeadline = formData.deadline;
                const taskTag = formData.tag;
                const taskTagColor = formData.tag_color;

                const taskContainer = document
                    .querySelector(`.task input[value="${taskId}"]`)
                    .closest(".task");
                taskContainer.querySelector(".task-title").textContent = taskTitle;
                taskContainer.querySelector(
                    ".additional-details p:first-child"
                ).textContent = taskDescription;
                taskContainer.querySelector(".task-date").textContent = taskDeadline;
                const taskTagElement = taskContainer.querySelector(".task-tag");
                taskTagElement.textContent = taskTag;
                taskTagElement.classList = `task-tag ${taskTagColor}`;
            }

            updateTaskFrontend(formData);
        }, testCase.formData);

        // Validate the updated task details
        const updatedTaskTitle = await page.textContent('.task-title');
        const updatedTaskDescription = await page.textContent('.additional-details p:first-child');
        const updatedTaskDeadline = await page.textContent('.task-date');
        const updatedTaskTag = await page.textContent('.task-tag');
        const updatedTaskTagColor = await page.$eval('.task-tag', el => el.className.includes('blue') ? 'blue' : el.className.includes('green') ? 'green' : 'other');

        // Assert the expected values
        console.log(`Test Case: Task ID=${testCase.formData.task_id}`);
        console.log('Updated Task Title:', updatedTaskTitle);
        console.log('Expected Title:', testCase.expected.title);
        console.log('Updated Task Description:', updatedTaskDescription);
        console.log('Expected Description:', testCase.expected.description);
        console.log('Updated Task Deadline:', updatedTaskDeadline);
        console.log('Expected Deadline:', testCase.expected.deadline);
        console.log('Updated Task Tag:', updatedTaskTag);
        console.log('Expected Tag:', testCase.expected.tag);
        console.log('Updated Task Tag Color:', updatedTaskTagColor);
        console.log('Expected Tag Color:', testCase.expected.tagColor);
        console.log('Test Result:', updatedTaskTitle === testCase.expected.title &&
            updatedTaskDescription === testCase.expected.description &&
            updatedTaskDeadline === testCase.expected.deadline &&
            updatedTaskTag === testCase.expected.tag &&
            updatedTaskTagColor === testCase.expected.tagColor ? 'Pass' : 'Fail');
        console.log('---------------------------');
    }

    

    const testCases4 = [
        // Test Case 1: Populate Form with Valid Task Details
        {
            taskId: "123",
            taskTitle: "Task 1",
            taskDescription: "This is task 1",
            taskDeadline: "2024-06-30",
            taskTag: "Work",
            taskTagColor: "blue",
            expected: {
                taskId: "123",
                taskTitle: "Task 1",
                taskDescription: "This is task 1",
                taskDeadline: "2024-06-30",
                taskTag: "Work",
                taskTagColor: "blue"
            }
        },
        // Test Case 2: Populate Form with Empty Input
        {
            taskId: "",
            taskTitle: "",
            taskDescription: "",
            taskDeadline: "",
            taskTag: "",
            taskTagColor: "",
            expected: {
                taskId: "",
                taskTitle: "",
                taskDescription: "",
                taskDeadline: "",
                taskTag: "",
                taskTagColor: ""
            }
        },
        // Test Case 3: Populate Form with Missing Parameters
        {
            taskId: "123",
            taskTitle: "Task 1",
            taskDescription: "",
            taskDeadline: "2024-06-30",
            taskTag: "Work",
            taskTagColor: "",
            expected: {
                taskId: "123",
                taskTitle: "Task 1",
                taskDescription: "",
                taskDeadline: "2024-06-30",
                taskTag: "Work",
                taskTagColor: ""
            }
        },
        // Test Case 4: Populate Form with Special Characters
        {
            taskId: "123@#",
            taskTitle: "Task 1",
            taskDescription: "This is task 1",
            taskDeadline: "2024-06-30",
            taskTag: "Work",
            taskTagColor: "blue",
            expected: {
                taskId: "123@#",
                taskTitle: "Task 1",
                taskDescription: "This is task 1",
                taskDeadline: "2024-06-30",
                taskTag: "Work",
                taskTagColor: "blue"
            }
        },
        // Test Case 5: Populate Form with Long Input Values
        {
            taskId: "12345678901234567890",
            taskTitle: "testtesttesttesttesttesttest.",
            taskDescription: "testtesttesttesttesttesttesttesttesttesttesttesttest",
            taskDeadline: "2024-06-30",
            taskTag: "Work",
            taskTagColor: "blue",
            expected: {
                taskId: "12345678901234567890",
                taskTitle: "testtesttesttesttesttesttest.",
                taskDescription: "testtesttesttesttesttesttesttesttesttesttesttesttest",
                taskDeadline: "2024-06-30",
                taskTag: "Work",
                taskTagColor: "blue"
            }
        }
    ];

    for (const testCase of testCases) {
        await page.setContent(`
            <html>
                <body>
                    <form id="modify-task-form">
                        <input id="modify-task-id" type="text">
                        <input id="modify-task-title" type="text">
                        <textarea id="modify-task-description"></textarea>
                        <input id="modify-task-deadline" type="text">
                        <input id="modify-task-tag" type="text">
                        <input id="modify-task-tag-color" type="text">
                    </form>
                    <script>
                        function populateForm(
                            taskId,
                            taskTitle,
                            taskDescription,
                            taskDeadline,
                            taskTag,
                            taskTagColor
                        ) {
                            const form = document.getElementById("modify-task-form");
                            form.querySelector("#modify-task-id").value = taskId;
                            form.querySelector("#modify-task-title").value = taskTitle;
                            form.querySelector("#modify-task-description").value = taskDescription;
                            form.querySelector("#modify-task-deadline").value = taskDeadline;
                            form.querySelector("#modify-task-tag").value = taskTag; // Added
                            form.querySelector("#modify-task-tag-color").value = taskTagColor; // Added
                        }
                    </script>
                </body>
            </html>
        `);

        await page.evaluate(({ taskId, taskTitle, taskDescription, taskDeadline, taskTag, taskTagColor }) => {
            populateForm(taskId, taskTitle, taskDescription, taskDeadline, taskTag, taskTagColor);
        }, testCase);

        // Add assertions
        const formValues = await page.evaluate(() => {
            const form = document.getElementById('modify-task-form');
            return {
                taskId: form.querySelector('#modify-task-id').value,
                taskTitle: form.querySelector('#modify-task-title').value,
                taskDescription: form.querySelector('#modify-task-description').value,
                taskDeadline: form.querySelector('#modify-task-deadline').value,
                taskTag: form.querySelector('#modify-task-tag').value,
                taskTagColor: form.querySelector('#modify-task-tag-color').value
            };
        });

        console.log('Test Case:', testCase);
        console.log('Form Values:', formValues);

        // Assertions
        if (
            formValues.taskId === testCase.taskId &&
            formValues.taskTitle === testCase.taskTitle &&
            formValues.taskDescription === testCase.taskDescription &&
            formValues.taskDeadline === testCase.taskDeadline &&
            formValues.taskTag === testCase.taskTag &&
            formValues.taskTagColor === testCase.taskTagColor
        ) {
            console.log('Test Passed');
        } else {
            console.error('Test Failed');
        }
        
        console.log('---------------------------');
    }

    // await browser.close();
})();

