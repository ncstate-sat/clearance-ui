import { test, expect } from "@playwright/test";

test.describe("Login to clearance page", () => {
  test.beforeEach(async ({ page }) => {
    // const refreshToken = process.env["E2E_REFRESH_TOKEN"];
    const refreshToken = process.env["E2E_REFRESH_TOKEN_ADMIN"];

    await page.addInitScript((rt) => {
      window.localStorage.setItem("refresh-token", rt);
    }, refreshToken);
  });

  // test("manage clearances - view clearances for a user", async ({page}) =>{
  //   // await page.goto("https://clearance.test.ehps.ncsu.edu/manage");
  //   await page.goto("/manage"); 

  //   await page
  //     .locator('[test-id="personnel-input"] input')
  //     .fill("jtchampi@ncsu.edu");

  //   await page
  //     .locator("text=John Champion (jtchampi@ncsu.edu) [200103374]")
  //     .click();
  //   await expect.soft(page.locator('xpath=//*[@id="root"]/div[3]/div[2]/div[3]/div[2]')).toBeVisible();    
  // })
  
  // test("revoke_clearance - one clearance from one user", async ({page}) =>{
  //   // await page.goto("https://clearance.test.ehps.ncsu.edu/manage");
  //   await page.goto("/manage"); 

  //   await page
  //     .locator('[test-id="personnel-input"] input')
  //     .fill("jtchampi@ncsu.edu");

  //   await page
  //     .locator("text=John Champion (jtchampi@ncsu.edu) [200103374]")
  //     .click();
  //   ////*[@id="root"]/div[3]/div[2]/div[3]/div[2]/div[1]/div[2]/span/button
  //   await page.locator('xpath=//*[@id="root"]/div[3]/div[2]/div[3]/div[2]/div[1]/div[2]/span/button').click();    
   

  //   await expect.soft(page.getByRole('heading', { name: 'Revoke Succeeded' })).toBeVisible();    
  // })

  // test("revoke_clearance - multiple clearances from one user", async ({page}) =>{
  //   // await page.goto("https://clearance.test.ehps.ncsu.edu/manage");
  //   await page.goto("/manage"); 

  //   await page
  //     .locator('[test-id="personnel-input"] input')
  //     .fill("jtchampi@ncsu.edu");

  //   await page
  //     .locator("text=John Champion (jtchampi@ncsu.edu) [200103374]")
  //     .click();

  //   //await expect(page.locator('div > span').toContainText(['ClearanceA', 'ClearanceB']))
  //   await page.locator('xpath=//*[@id="root"]/div[3]/div[2]/div[3]/div[2]/div[1]/div[2]/span/button').click();    
  //   await page.locator('xpath=//*[@id="root"]/div[3]/div[2]/div[3]/div[2]/div[1]/div[2]/span/button').click();     

  //   await expect.soft(page.getByRole('heading', { name: 'Revoke Succeeded' })).toBeVisible();    
  // })

  // test("revoke_clearance_using_filter", async ({page}) =>{
  //   await page.goto("https://clearance.test.ehps.ncsu.edu/manage");

  //   await page
  //     .locator('[test-id="personnel-input"] input')
  //     .fill("jtchampi@ncsu.edu");

  //   await page
  //     .locator("text=John Champion (jtchampi@ncsu.edu) [200103374]")
  //     .click();

  //   await page
  //     .locator('xpath=//*[@id="root"]/div[3]/div[2]/div[2]/div[1]/div[1]/input')
  //     .fill("vrb");

  //   //await expect(page.locator('div > span').toContainText(['ClearanceA', 'ClearanceB']))
  //   await page.locator('xpath=//*[@id="root"]/div[3]/div[2]/div[2]/div[2]/div[1]/div[2]/span/button').click();    
  //   // const elements = page.locator('div').filter({ hasText: 'ClearanceCRevoke' }).getByRole('button', { name: 'Revoke' })
  //   // if (elements && typeof elements[Symbol.iterator] === 'function') {
  //   //   for (const element of elements) {
  //   //     await element.click()
  //   //   }
  //   // } else {
  //   //   console.error('No elements found or elements is not iterable')
  //   // }

  //   //await page.locator('[test-id="revoke-clearance-btn"]').click()

  //   await expect.soft(page.getByRole('heading', { name: 'Revoke Succeeded' })).toBeVisible();    
  // })
  // await page.locator('#TagInput-1').fill('jtch');
  // await page.getByText('John Champion (jtchampi@ncsu.edu) [200103374]').click();

  // await page.getByText('ClearanceB').click();
  // await page.locator('div').filter({ hasText: 'ClearanceCRevoke' }).getByRole('button', { name: 'Revoke' }).click();
  // await page.locator('div').filter({ hasText: 'Security Applications' }).getByRole('button').click();
  // await page.locator('div').filter({ hasText: 'Security Applications' }).getByRole('button').click();
});