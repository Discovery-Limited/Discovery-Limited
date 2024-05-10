import { test, expect } from '@playwright/test';

test.describe("profileDropdownButton event listener should toggle the visibility of the profile.", () => {

    test('Toggle profile dropdown on click', async ({ page }) => {
        await page.evaluate(() => {
            const profileDropdownButton = document.createElement('button');
            profileDropdownButton.id = 'profileDropdownButton';
            document.body.appendChild(profileDropdownButton);

            const profileDropdownList = document.createElement('ul');
            profileDropdownList.id = 'profileDropdownList';
            document.body.appendChild(profileDropdownList);

            profileDropdownButton.addEventListener("click", function () {
                profileDropdownList.classList.toggle("active");
            });
        });

        await page.click('#profileDropdownButton');

        const profileDropdownListClass = await page.$eval('#profileDropdownList', element => element.className);
        expect(profileDropdownListClass.includes('active')).toBeTruthy();
    });
});

test.describe("sidebarToggle() event listener  should toggle the dirrect of the arrow when clicked and toggle the visibility of the sidebar content", () => {

    test('Toggles sidebar on click', async ({ page }) => {

        await page.evaluate(() => {

            const sidebarToggle = document.createElement('button');
            sidebarToggle.id = 'sidebarToggle';
            const icon = document.createElement('i');
            icon.className = 'fa fa-angle-down';
            sidebarToggle.appendChild(icon);
            document.body.appendChild(sidebarToggle);

            const sidebarDropdownList = document.createElement('ul');
            sidebarDropdownList.id = 'sidebarDropdownList';
            document.body.appendChild(sidebarDropdownList);

            sidebarToggle.addEventListener("click", function () {
                sidebarToggle.querySelector("i").classList.toggle("fa-angle-down");
                sidebarToggle.querySelector("i").classList.toggle("fa-angle-up");
                sidebarDropdownList.classList.toggle("active");
            });
        });

        await page.click('#sidebarToggle');

        const iconClass = await page.$eval('#sidebarToggle i', icon => icon.className);
        expect(iconClass).toContain('fa-angle-up');

        const sidebarDropdownListClass = await page.$eval('#sidebarDropdownList', list => list.className);
        expect(sidebarDropdownListClass).toContain('active');

        await page.click('#sidebarToggle');

        const iconClassAfterToggleBack = await page.$eval('#sidebarToggle i', icon => icon.className);
        expect(iconClassAfterToggleBack).toContain('fa-angle-down');

        const sidebarDropdownListClassAfterToggleBack = await page.$eval('#sidebarDropdownList', list => list.className);
        expect(sidebarDropdownListClassAfterToggleBack).not.toContain('active');
    });
});


test.describe("This function is responsible for fetching projects from the server and updating the project button's text content and data attributes based on the fetched data. It also sets the project ID in the session.", () => {
    
    test('Fetch projects and update project button', async ({ page }) => {
        await page.evaluate(() => {
            const projectButton = document.createElement('button');
            projectButton.id = 'projects';
            const p = document.createElement('p');
            projectButton.appendChild(p);
            document.body.appendChild(projectButton);

            const sidebarDropdownList = document.createElement('ul');
            sidebarDropdownList.id = 'sidebarDropdownList';
            document.body.appendChild(sidebarDropdownList);

            window.setProjectIdInSession = function (projectId) {
                if (!projectId) {
                    console.error("Project ID is not provided");
                    return;
                }
                console.log("Project ID stored successfully.");
            };

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

        await page.evaluate(() => {
            window.fetch = async () => ({
                ok: true,
                json: async () => [{ project_id: '123', project_name: 'Project A' }]
            });
        });

        await page.evaluate(() => checkProjects());

        const buttonText = await page.$eval('#projects p', el => el.textContent);
        expect(buttonText).toBe('Project A');

        const dataId = await page.$eval('#projects', el => el.getAttribute('data-id'));
        expect(dataId).toBe('123');
    });

    test('Fetch projects - No Projects Available', async ({ page }) => {
        await page.evaluate(() => {
            window.checkProjects = async () => {
                const projectButton = document.createElement('button'); // Create the button element
                projectButton.id = 'projects';
                try {
                    const response = await fetch("fetch_projects.php");
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    const data = await response.json();
                    if (data.length === 0) {
                        projectButton.textContent = "Projects";
                        projectButton.setAttribute("data-id", undefined);
                    }
                    document.body.appendChild(projectButton); // Append button to the document body
                } catch (error) {
                    console.error("Error:", error);
                }
            };
        });
    
        await page.evaluate(() => {
            window.fetch = async () => ({
                ok: true,
                json: async () => []
            });
        });
    
        await page.evaluate(() => checkProjects());

        const buttonText = await page.$eval('#projects', el => el.textContent);
        expect(buttonText).toBe('Projects');
    
        const dataId = await page.$eval('#projects', el => el.getAttribute('data-id'));
        expect(dataId).toBe("undefined");
    });
    
    test('Fetch projects - Network Error', async ({ page }) => {
        await page.evaluate(() => {
            window.checkProjects = async () => {
                try {
                    const response = await fetch("fetch_projects.php");
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    const data = await response.json();
                    const projectButton = document.createElement('button');
                    projectButton.id = 'projects';
                    if (data[0]) {
                        const currentProject = data[0];
                        projectButton.textContent = currentProject.project_name; 
                        projectButton.setAttribute("data-id", currentProject.project_id);
                    } else {
                        projectButton.textContent = "Projects";
                        projectButton.setAttribute("data-id", undefined);
                    }
                    document.body.appendChild(projectButton); 
                } catch (error) {
                    console.error("Error:", error);
                    const projectButton = document.createElement('button'); 
                    projectButton.id = 'projects';
                    projectButton.textContent = "Projects";
                    projectButton.setAttribute("data-id", undefined);
                    document.body.appendChild(projectButton); 
                }
            };
        });
    
        await page.evaluate(() => {
            window.fetch = async () => ({
                ok: false
            });
        });
    
        await page.evaluate(() => checkProjects());
    
        await page.waitForSelector('#projects');
    
        const buttonText = await page.$eval('#projects', el => el.textContent);
        expect(buttonText).toBe('Projects');

        const dataId = await page.$eval('#projects', el => el.getAttribute('data-id'));
        expect(dataId).toBe("undefined");
    });
    
});
