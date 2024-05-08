const { test, expect } = require('@playwright/test');

test.describe('Form Submission Tests', () => {
  let page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await page.setContent(`
      <form id="modify-task-form">
        <!-- Form fields -->
        <input type="text" id="task" value="Sample Task">
      </form>
      <div id="modify-task-form-container"></div>
    `);
    await page.route('**/scrumboardTasks_modify.php', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });
  });

  test('should handle successful form submission', async () => {
    await page.click('#modify-task-form [type="submit"]');
    await page.waitForSelector('text="Task details updated on the frontend."');
    const formContainerClass = await page.$eval('#modify-task-form-container', el => el.className);
    expect(formContainerClass).toContain('hide');
  });

  test('should handle server error', async () => {
    await page.route('**/scrumboardTasks_modify.php', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Server Error' }),
      });
    });

    // Mock console.error function
    page.on('console', async msg => {
      expect(msg.text()).toContain('Error updating task details:');
    });

    await page.click('#modify-task-form [type="submit"]');
  });

  test('should handle network error', async () => {
    await page.route('**/scrumboardTasks_modify.php', route => {
      route.abort();
    });

    // Mock console.error function
    page.on('console', async msg => {
      expect(msg.text()).toContain('Error updating task details:');
    });

    await page.click('#modify-task-form [type="submit"]');
  });
});

