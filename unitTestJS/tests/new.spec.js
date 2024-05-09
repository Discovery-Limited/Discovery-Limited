const { test, expect } = require('@playwright/test');

test.describe("going to websiote",()=>{

    test("loading webpage",async ({page})=>{
        await page.goto("https://discoveria.online/")
        await expect(page.getByText("About").first()).toBeAttached()
        page.getByText("sign in").click()
        page.locator("#email").fill("fbhdsfhsdjkfhblkj")
        page.locator("#password").dispatchEvent("input4")


    })
})



