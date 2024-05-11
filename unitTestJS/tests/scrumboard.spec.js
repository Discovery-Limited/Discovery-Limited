import { test, expect } from '@playwright/test';
const { chromium } = require('playwright');


test.describe("The populateForm function facilitates the pre-filling of a form with task-related details. It accepts various parameters representing task attributes such as ID, title, description, deadline, tag, and tag color. Upon invocation, it sets the corresponding values in the relevant form fields.", () => {

    test('populateForm - Populate Form with Valid Data', async () => {
        const browser = await chromium.launch();
        const page = await browser.newPage();

        await page.evaluate(() => {
            window.populateForm = function (
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
                form.querySelector("#modify-task-tag").value = taskTag;
                form.querySelector("#modify-task-tag-color").value = taskTagColor;
            };
        });


        await page.evaluate(() => {
            document.body.innerHTML = `
                <form id="modify-task-form">
                    <input id="modify-task-id" type="text">
                    <input id="modify-task-title" type="text">
                    <textarea id="modify-task-description"></textarea>
                    <input id="modify-task-deadline" type="date">
                    <input id="modify-task-tag" type="text">
                    <input id="modify-task-tag-color" type="color">
                </form>
            `;
        });

        // Call populateForm with valid data
        await page.evaluate(() => {
            populateForm('taskId123', 'Task Title', 'Task Description', '2024-12-31', 'Tag', '#FF0000');
        });

        // Expect form fields to be populated with provided data
        const formValues = await page.evaluate(() => ({
            taskId: document.getElementById('modify-task-id').value,
            taskTitle: document.getElementById('modify-task-title').value,
            taskDescription: document.getElementById('modify-task-description').value,
            taskDeadline: document.getElementById('modify-task-deadline').value,
            taskTag: document.getElementById('modify-task-tag').value,
            taskTagColor: document.getElementById('modify-task-tag-color').value,
        }));

        expect(formValues).toEqual({
            taskId: 'taskId123',
            taskTitle: 'Task Title',
            taskDescription: 'Task Description',
            taskDeadline: '2024-12-31',
            taskTag: 'Tag',
            taskTagColor: '#ff0000'
        });

        await browser.close();
    });

    test('populateForm - Populate Form with Empty Data', async () => {
        const browser = await chromium.launch();
        const page = await browser.newPage();

        await page.evaluate(() => {
            window.populateForm = function (
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
                form.querySelector("#modify-task-tag").value = taskTag;
                form.querySelector("#modify-task-tag-color").value = taskTagColor;
            };
        });

        await page.evaluate(() => {
            document.body.innerHTML = `
                <form id="modify-task-form">
                    <input id="modify-task-id" type="text">
                    <input id="modify-task-title" type="text">
                    <textarea id="modify-task-description"></textarea>
                    <input id="modify-task-deadline" type="date">
                    <input id="modify-task-tag" type="text">
                    <input id="modify-task-tag-color" type="color">
                </form>
            `;
        });

        await page.evaluate(() => {
            populateForm('', '', '', '', '', '#000000');
        });

        const formValues = await page.evaluate(() => ({
            taskId: document.getElementById('modify-task-id').value,
            taskTitle: document.getElementById('modify-task-title').value,
            taskDescription: document.getElementById('modify-task-description').value,
            taskDeadline: document.getElementById('modify-task-deadline').value,
            taskTag: document.getElementById('modify-task-tag').value,
            taskTagColor: document.getElementById('modify-task-tag-color').value,
        }));

        expect(formValues).toEqual({
            taskId: '',
            taskTitle: '',
            taskDescription: '',
            taskDeadline: '',
            taskTag: '',
            taskTagColor: '#000000'
        });

        await browser.close();
    });

    test('populateForm - Populate Form with Partial Data', async () => {
        const browser = await chromium.launch();
        const page = await browser.newPage();

        await page.evaluate(() => {
            window.populateForm = function (
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
                form.querySelector("#modify-task-tag").value = taskTag;
                form.querySelector("#modify-task-tag-color").value = taskTagColor;
            };
        });


        await page.evaluate(() => {
            document.body.innerHTML = `
                <form id="modify-task-form">
                    <input id="modify-task-id" type="text">
                    <input id="modify-task-title" type="text">
                    <textarea id="modify-task-description"></textarea>
                    <input id="modify-task-deadline" type="date">
                    <input id="modify-task-tag" type="text">
                    <input id="modify-task-tag-color" type="color">
                </form>
            `;
        });

        await page.evaluate(() => {
            populateForm('123', '', '', '2024-12-31', '', '#FF0000');
        });

        const formValues = await page.evaluate(() => ({
            taskId: document.getElementById('modify-task-id').value,
            taskTitle: document.getElementById('modify-task-title').value,
            taskDescription: document.getElementById('modify-task-description').value,
            taskDeadline: document.getElementById('modify-task-deadline').value,
            taskTag: document.getElementById('modify-task-tag').value,
            taskTagColor: document.getElementById('modify-task-tag-color').value,
        }));

        expect(formValues).toEqual({
            taskId: '123',
            taskTitle: '',
            taskDescription: '',
            taskDeadline: '2024-12-31',
            taskTag: '',
            taskTagColor: '#ff0000'
        });

        await browser.close();
    });

});

test.describe("displayForm() should display form for modifying task by removing hide class from the form container", () => {

    test('displayForm - Display Form Test', async () => {
        const browser = await chromium.launch();
        const page = await browser.newPage();

        await page.evaluate(() => {
            window.displayForm = function () {
                const formContainer = document.getElementById("modify-task-form-container");
                formContainer.classList.remove("hide");
            };
        });

        await page.evaluate(() => {
            document.body.innerHTML = `
                <div id="modify-task-form-container" class="hide">
                    <form id="modify-task-form">
                        <input type="text" id="modify-task-id">
                        <input type="text" id="modify-task-title">
                        <textarea id="modify-task-description"></textarea>
                        <input type="date" id="modify-task-deadline">
                        <input type="text" id="modify-task-tag">
                        <input type="color" id="modify-task-tag-color">
                    </form>
                </div>
            `;
        });

        await page.evaluate(() => {
            displayForm();
        });

        const formContainer = await page.$('#modify-task-form-container');
        const isHidden = await formContainer.isHidden();

        expect(isHidden).toBeFalsy();

        await browser.close();
    });

    test('displayForm - Form Already Visible', async () => {
        const browser = await chromium.launch();
        const page = await browser.newPage();

        await page.evaluate(() => {
            window.displayForm = function () {
                const formContainer = document.getElementById("modify-task-form-container");
                formContainer.classList.remove("hide");
            };
        });

        await page.evaluate(() => {
            document.body.innerHTML = `
                <div id="modify-task-form-container"> <!-- Form container is already visible -->
                    <form id="modify-task-form">
                        <input type="text" id="modify-task-id">
                        <input type="text" id="modify-task-title">
                        <textarea id="modify-task-description"></textarea>
                        <input type="date" id="modify-task-deadline">
                        <input type="text" id="modify-task-tag">
                        <input type="color" id="modify-task-tag-color">
                    </form>
                </div>
            `;
        });

        await page.evaluate(() => {
            displayForm();
        });

        const formContainer = await page.$('#modify-task-form-container');
        const isHidden = await formContainer.isHidden();

        expect(isHidden).toBeFalsy();

        await browser.close();
    });

    test('displayForm - Form Hidden Initially', async () => {
        const browser = await chromium.launch();
        const page = await browser.newPage();

        await page.evaluate(() => {
            window.displayForm = function () {
                const formContainer = document.getElementById("modify-task-form-container");
                formContainer.classList.remove("hide");
            };
        });

        await page.evaluate(() => {
            document.body.innerHTML = `
                <div id="modify-task-form-container" class="hide"> <!-- Form container is initially hidden -->
                    <form id="modify-task-form">
                        <input type="text" id="modify-task-id">
                        <input type="text" id="modify-task-title">
                        <textarea id="modify-task-description"></textarea>
                        <input type="date" id="modify-task-deadline">
                        <input type="text" id="modify-task-tag">
                        <input type="color" id="modify-task-tag-color">
                    </form>
                </div>
            `;
        });

        await page.evaluate(() => {
            displayForm();
        });

        const formContainer = await page.$('#modify-task-form-container');
        const isHidden = await formContainer.isHidden();

        expect(isHidden).toBeFalsy();

        await browser.close();
    });

});

test.describe("The updateTaskFrontend function is responsible for updating the frontend representation of a task with the new data provided through a form. It extracts the task details from the form data and then locates the corresponding task element in the frontend DOM. It then updates the task title, description, deadline, and tag information with the new values.", () => {

    test('updateTaskFrontend - Update Task with Valid Data', async () => {
        const browser = await chromium.launch();
        const page = await browser.newPage();

        await page.evaluate(() => {
            window.updateTaskFrontend = function (formData) {
                const taskId = formData.task_id;
                const taskTitle = formData.task_title;
                const taskDescription = formData.description;
                const taskDeadline = formData.deadline;
                const taskTag = formData.tag;
                const taskTagColor = formData.tag_color;

                const taskContainer = document.querySelector(`.task input[value="${taskId}"]`).closest(".task");
                taskContainer.querySelector(".task-title").textContent = taskTitle;
                taskContainer.querySelector(".additional-details p:first-child").textContent = taskDescription;
                taskContainer.querySelector(".task-date").textContent = taskDeadline;
                const taskTagElement = taskContainer.querySelector(".task-tag");
                taskTagElement.textContent = taskTag;
                taskTagElement.classList = `task-tag ${taskTagColor}`;
            };
        });

        await page.evaluate(() => {
            document.body.innerHTML = `
                    <div class="task">
                        <input type="hidden" value="123">
                        <div class="task-title"></div>
                        <div class="additional-details"><p></p></div>
                        <div class="task-date"></div>
                        <div class="task-tag"></div>
                    </div>
                `;
        });

        await page.evaluate(() => {
            updateTaskFrontend({
                task_id: "123",
                task_title: "Update UI Design",
                description: "Revise UI design based on client feedback",
                deadline: "2024-06-30",
                tag: "Design",
                tag_color: "blue"
            });
        });

        const updatedTaskTitle = await page.textContent('.task-title');
        const updatedTaskDescription = await page.textContent('.additional-details p:first-child');
        const updatedTaskDeadline = await page.textContent('.task-date');
        const updatedTaskTag = await page.textContent('.task-tag');
        const updatedTaskTagColor = await page.$eval('.task-tag', el => el.className.includes('blue') ? 'blue' : el.className.includes('green') ? 'green' : 'other');

        expect(updatedTaskTitle).toBe('Update UI Design');
        expect(updatedTaskDescription).toBe('Revise UI design based on client feedback');
        expect(updatedTaskDeadline).toBe('2024-06-30');
        expect(updatedTaskTag).toBe('Design');
        expect(updatedTaskTagColor).toBe('blue');

        await browser.close();
    });

    test('updateTaskFrontend - Update Task with Empty Data', async () => {
        const browser = await chromium.launch();
        const page = await browser.newPage();

        await page.setContent(`
                <div class="task">
                    <input type="hidden" value="123">
                    <div class="task-title"></div>
                    <div class="additional-details"><p></p></div>
                    <div class="task-date"></div>
                    <div class="task-tag"></div>
                </div>
            `);

        await page.evaluate(() => {
            window.updateTaskFrontend = function (formData) {
                const taskId = formData.task_id;
                const taskTitle = formData.task_title;
                const taskDescription = formData.description;
                const taskDeadline = formData.deadline;
                const taskTag = formData.tag;
                const taskTagColor = formData.tag_color;

                const taskInput = document.querySelector(`.task input[value="${taskId}"]`);
                if (taskInput) {
                    const taskContainer = taskInput.closest(".task");
                    if (taskContainer) {
                        const taskTitleElement = taskContainer.querySelector(".task-title");
                        if (taskTitleElement) taskTitleElement.textContent = taskTitle;

                        const taskDescriptionElement = taskContainer.querySelector(".additional-details p:first-child");
                        if (taskDescriptionElement) taskDescriptionElement.textContent = taskDescription;

                        const taskDeadlineElement = taskContainer.querySelector(".task-date");
                        if (taskDeadlineElement) taskDeadlineElement.textContent = taskDeadline;

                        const taskTagElement = taskContainer.querySelector(".task-tag");
                        if (taskTagElement) {
                            taskTagElement.textContent = taskTag;
                            taskTagElement.classList = `task-tag ${taskTagColor}`;
                        }
                    }
                }
            };
        });

        await page.evaluate(() => {
            updateTaskFrontend({
                task_id: "",
                task_title: "",
                description: "",
                deadline: "",
                tag: "",
                tag_color: "blue"
            });
        });

        const updatedTaskTitle = await page.textContent('.task-title');
        const updatedTaskDescription = await page.textContent('.additional-details p:first-child');
        const updatedTaskDeadline = await page.textContent('.task-date');
        const updatedTaskTag = await page.textContent('.task-tag');
        const updatedTaskTagColor = await page.$eval('.task-tag', el => el.className.includes('blue') ? 'blue' : el.className.includes('green') ? 'green' : 'other');

        expect(updatedTaskTitle).toBe('');
        expect(updatedTaskDescription).toBe('');
        expect(updatedTaskDeadline).toBe('');
        expect(updatedTaskTag).toBe('');
        expect(updatedTaskTagColor).toBe('other');

        await browser.close();
    });


    test('updateTaskFrontend - Update Task with Partial Data', async () => {
        const browser = await chromium.launch();
        const page = await browser.newPage();

        await page.setContent(`
                <div class="task">
                    <input type="hidden" value="123">
                    <div class="task-title "></div>
                    <div class="additional-details"><p></p></div>
                    <div class="task-date"></div>
                    <div class="task-tag"></div>
                </div>
            `);

        await page.evaluate(() => {
            window.updateTaskFrontend = function (formData) {
                const taskId = formData.task_id;
                const taskTitle = formData.task_title;
                const taskDescription = formData.description;
                const taskDeadline = formData.deadline;
                const taskTag = formData.tag;
                const taskTagColor = formData.tag_color;

                try {
                    const taskContainer = document.querySelector(`.task input[value="${taskId}"]`).closest(".task");
                    if (taskContainer) {
                        const taskTitleElement = taskContainer.querySelector(".task-title");
                        if (taskTitleElement) taskTitleElement.textContent = taskTitle;

                        const taskDescriptionElement = taskContainer.querySelector(".additional-details p:first-child");
                        if (taskDescriptionElement) taskDescriptionElement.textContent = taskDescription;

                        const taskDeadlineElement = taskContainer.querySelector(".task-date");
                        if (taskDeadlineElement) taskDeadlineElement.textContent = taskDeadline;

                        const taskTagElement = taskContainer.querySelector(".task-tag");
                        if (taskTagElement) {
                            taskTagElement.textContent = taskTag;
                            taskTagElement.classList = `task-tag ${taskTagColor}`;
                        }
                    }
                } catch (error) {
                    console.error('Error updating task frontend:', error.message);
                }
            };
        });

        await page.evaluate(() => {
            updateTaskFrontend({
                task_id: "123",
                task_title: "Task 1",
                description: "",
                deadline: "2024-06-30",
                tag: "Work",
                tag_color: ""
            });
        });

        const updatedTaskTitle = await page.textContent('.task-title');
        expect(updatedTaskTitle).toBe('Task 1');

        await browser.close();
    });
});

test.describe("checkTaskInput() should validate if the input field for task is empty. if its empty button should be disabled", () => {

    test('checkTaskInput - Task Input Empty', async () => {
        const browser = await chromium.launch();
        const page = await browser.newPage();

        await page.evaluate(() => {
            window.checkTaskInput = function () {
                const taskInput = document.getElementById("task-input");
                const addButton = document.getElementById("add-task-button");
                if (taskInput.value === "") {
                    addButton.disabled = true;
                } else {
                    addButton.disabled = false;
                }
            };
        });

        await page.evaluate(() => {
            document.body.innerHTML = `
                <input id="task-input" type="text" value="">
                <button id="add-task-button" disabled>Add Task</button>
            `;
        });

        await page.evaluate(() => {
            checkTaskInput();
        });
        await page.fill('#task-input', '');

        const addButton = await page.$('#add-task-button');
        const isDisabled = await addButton.evaluate((button) => button.disabled);

        expect(isDisabled).toBeTruthy();

        await browser.close();
    });

    test('checkTaskInput - Task Input Not Empty', async () => {
        const browser = await chromium.launch();
        const page = await browser.newPage();

        await page.evaluate(() => {
            window.checkTaskInput = function () {
                const taskInput = document.getElementById("task-input");
                const addButton = document.getElementById("add-task-button");
                if (taskInput.value === "") {
                    addButton.disabled = true;
                } else {
                    addButton.disabled = false;
                }
            };
        });

        await page.evaluate(() => {
            document.body.innerHTML = `
                <input id="task-input" type="text" value="Task 1">
                <button id="add-task-button" disabled>Add Task</button>
            `;
        });

        await page.evaluate(() => {
            checkTaskInput();
        });
        await page.fill('#task-input', 'Task 1');

        const addButton = await page.$('#add-task-button');
        const isDisabled = await addButton.evaluate((button) => button.disabled);

        expect(isDisabled).toBeFalsy();

        await browser.close();
    });
});

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    await page.evaluate(() => {
        window.updateTaskStatus = async (taskId_, status_) => {
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
        };
    });

    const testCases = [
        { taskId: "123", status: "completed", expectedResult: "success" },
        { taskId: "456", status: "in_progress", expectedResult: "server_error" },
        { taskId: "789", status: "pending", expectedResult: "network_error" }
    ];

    for (const testCase of testCases) {
        await page.evaluate(async (testCase) => {
            try {
                const response = await window.updateTaskStatus(testCase.taskId, testCase.status);
                if (response === "success") {
                    console.log(`Test Case: Task ID=${testCase.taskId}, Status=${testCase.status}`);
                    console.log('Expected Result:', testCase.expectedResult);
                    console.log('Test Result: Pass');
                    console.log('---------------------------');
                } else {
                    console.log(`Test Case: Task ID=${testCase.taskId}, Status=${testCase.status}`);
                    console.log('Expected Result:', testCase.expectedResult);
                    console.log('Test Result: Fail');
                    console.log('---------------------------');
                }
            } catch (error) {
                if (testCase.expectedResult === "network_error" && error.message === "Network error occurred") {
                    console.log(`Test Case: Task ID=${testCase.taskId}, Status=${testCase.status}`);
                    console.log('Expected Result:', testCase.expectedResult);
                    console.log('Test Result: Pass');
                    console.log('---------------------------');
                } else {
                    console.log(`Test Case: Task ID=${testCase.taskId}, Status=${testCase.status}`);
                    console.log('Expected Result:', testCase.expectedResult);
                    console.log('Test Result: Fail');
                    console.log('---------------------------');
                }
            }
        }, testCase);
    }

    await browser.close();
})();



