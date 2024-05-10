import { test, expect } from '@playwright/test';

test.describe("be able to toggle the visibility of a popup element on the web page by clicking a button. The popup should appear when it's hidden, and disappear when it's visible", () => {

    test('Toggle popup from hidden to visible', async ({ page }) => {
        // Set up the initial state of the DOM using page.evaluate
        await page.evaluate(() => {
            const popup = document.createElement('div');
            popup.id = 'popup';
            popup.textContent = 'Popup Content';
            document.body.appendChild(popup);

            const toggleButton = document.createElement('button');
            toggleButton.id = 'toggleButton';
            toggleButton.textContent = 'Toggle Popup';
            document.body.appendChild(toggleButton);
        });

        // Simulate clicking the toggle button
        await page.click('#toggleButton');

        // Wait for animation or rendering to complete
        await page.waitForTimeout(100);

        // Verify that the popup becomes visible
        const popupVisibility = await page.$eval('#popup', popup => getComputedStyle(popup).display);
        expect(popupVisibility).toBe('block');
    });

});