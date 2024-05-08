const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();

    // Intercept fetch requests
    await context.route('**/scrumboardTasks_update.php', route => {
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ success: true })
        });
    });

    const page = await context.newPage();

    const testCases = [
        { expectedClassAdded: true, expectedClassRemoved: false },
        { expectedClassAdded: false, expectedClassRemoved: true }
    ];

    // Function to mock the updateTaskStatus function
    const updateTaskStatus = async (taskId, status) => {
        const response = await fetch(`scrumboardTasks_update.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                taskId: taskId,
                status: status
            })
        });
        const data = await response.json();
        if (data.success) {
            console.log('Task status updated successfully');
        } else {
            console.error('Error updating task status:', data.error);
        }
    };

    // Run tests
    for (const testCase of testCases) {
        await page.setContent(`
            <html>
                <body>
                    <div class="draggable"></div>
                    <script>
                        const draggables = document.querySelectorAll('.draggable');

                        draggables.forEach((task) => {
                            task.addEventListener("dragstart", () => {
                                task.classList.add("is-dragging");
                            });
                            task.addEventListener("dragend", () => {
                                task.classList.remove("is-dragging");
                            });
                        });

                        function updateTaskStatus(taskId_, status_) {
                            fetch("scrumboardTasks_update.php", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    taskId: taskId_,
                                    status: status_,
                                }),
                            })
                                .then((response) => response.json())
                                .then((data) => {
                                    if (data.success) {
                                        console.log("Task status updated successfully");
                                    } else {
                                        console.error("Error updating task status:", data.error);
                                    }
                                })
                                .catch((error) => {
                                    console.error("Error updating task status:", error);
                                });
                        }
                    </script>
                </body>
            </html>
        `);

        await page.waitForLoadState('networkidle');

        // Simulate dragging task
        await page.$eval('.draggable', (task) => {
            task.dispatchEvent(new Event('dragstart'));
        });

        // Check if class 'is-dragging' is added
        const isDraggingClassAdded = await page.$eval('.draggable', (task) => task.classList.contains('is-dragging'));

        // Simulate stopping dragging task
        await page.$eval('.draggable', (task) => {
            task.dispatchEvent(new Event('dragend'));
        });

        // Check if class 'is-dragging' is removed
        const isDraggingClassRemoved = await page.$eval('.draggable', (task) => !task.classList.contains('is-dragging'));

        console.log('Test Case:');
        console.log('Expected Class Added:', testCase.expectedClassAdded);
        console.log('Actual Class Added:', isDraggingClassAdded);
        console.log('Expected Class Removed:', testCase.expectedClassRemoved);
        console.log('Actual Class Removed:', isDraggingClassRemoved);
        console.log('Test Result:', isDraggingClassAdded === testCase.expectedClassAdded && isDraggingClassRemoved === testCase.expectedClassRemoved ? 'Pass' : 'Fail');
        console.log('---------------------------');
    }

    // Close the browser after all tests are done
    await browser.close();
})();
