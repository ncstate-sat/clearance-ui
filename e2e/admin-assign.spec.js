import { test, expect } from "@playwright/test";

test.describe("Login to clearance page", () => {
  test.beforeEach(async ({ page }) => {
    // const refreshToken = process.env["E2E_REFRESH_TOKEN"];
    const refreshToken = process.env["E2E_REFRESH_TOKEN_ADMIN"];

    await page.addInitScript((rt) => {
      window.localStorage.setItem("refresh-token", rt);
    }, refreshToken);
  });

  test("assign invalid clearances to valid user", async ({ page }) => {
    // await page.goto("https://clearance.test.ehps.ncsu.edu/manage");
    await page.goto("/manage");    

    await page.locator('#TagInput-1').fill('jtchampi@ncsu.edu');
    await page
      .locator("text=John Champion (jtchampi@ncsu.edu) [200103374]")
      .click();    
    await page.locator('#TagInput-2').fill('clearanceD');

    await expect.soft(page.getByText('No Clearances Found')).toBeVisible();
    await expect.soft(page.locator('[test-id="assign-clearance-btn"]')).toBeDisabled();
   // await expect.soft(page.locator('xpath=//*[@id="root"]/div[3]/div[2]/button')).toBeDisabled();
  });

  test("assign valid clearance to invalid user", async ({ page }) => {
    // await page.goto("https://clearance.test.ehps.ncsu.edu/manage");
    await page.goto("/manage"); 

    await page.locator('#TagInput-1').fill('peter');

    await expect.soft(page.getByText('No Personnel Found')).toBeVisible();
    // await expect.soft(page.locator('xpath=//*[@id="root"]/div[3]/div[2]/button')).toBeDisabled();
  });

  test("assign one clearance to one user", async ({ page }) => {
    // await page.goto("https://clearance.test.ehps.ncsu.edu/manage");
    await page.goto("/manage"); 

    await page
      .locator('[test-id="personnel-input"] input')
      .fill("jtchampi@ncsu.edu");

    await page
      .locator("text=John Champion (jtchampi@ncsu.edu) [200103374]")
      .click();

    await page.locator('#TagInput-2').fill('clearanceB');
    await page.getByRole('option', { name: 'ClearanceB' }).locator('div').first().click();

    await page.locator('[test-id="assign-clearance-btn"]').click()

    await expect.soft(page.getByRole('heading', { name: 'Clearance(s) Assigned Successfully' })).toBeVisible();
  });

  test("assign multiple clearances to one user", async ({ page }) => {
    // await page.goto("https://clearance.test.ehps.ncsu.edu/manage");
    await page.goto("/manage"); 

    await page.locator('#TagInput-1').fill('jtchampi');
    await page.getByText('John Champion (jtchampi@ncsu.edu) [200103374]').click();

    await page.locator('#TagInput-2').fill('clearanceA');
    await page.getByRole('option', { name: 'ClearanceA' }).locator('div').first().click();

    await page.locator('#TagInput-2').fill('ClearanceB');
    await page.getByText('ClearanceB').click();

    //await page.getByRole('button', { name: 'Assign' }).click();
    await page.locator('[test-id="assign-clearance-btn"]').click()

    await expect.soft(page.getByRole('heading', { name: 'Clearance(s) Assigned Successfully' })).toBeVisible();
  });

  test("assign one clearance to multiple users", async ({ page }) => {
    // await page.goto("https://clearance.test.ehps.ncsu.edu/manage");
    await page.goto("/manage"); 

    await page.locator('#TagInput-1').fill('jtchampi');
    await page.getByText('John Champion (jtchampi@ncsu.edu) [200103374]').click();

    await page.locator('#TagInput-1').fill('rsemmle');
    await page.getByText('Ryan Semmler (rsemmle@ncsu.edu) [001132807]').click();

    await page.locator('#TagInput-2').fill('clearanceC');
    await page.getByRole('option', { name: 'ClearanceC' }).locator('div').first().click();

    await page.locator('#TagInput-2').fill('VRB-SAT-Module 1 B104 IT Specialist');
    await page.getByRole('option', { name: 'VRB-SAT-Module 1 B104 IT Specialist' }).locator('div').first().click();    

    //await page.getByRole('button', { name: 'Assign' }).click();
    await page.locator('[test-id="assign-clearance-btn"]').click()

    await expect.soft(page.getByRole('heading', { name: 'Clearance(s) Assigned Successfully' })).toBeVisible();
  });

  test("assign multiple clearances to multiple users", async ({ page }) => {
    // await page.goto("https://clearance.test.ehps.ncsu.edu/manage");
    await page.goto("/manage"); 

    await page.locator('#TagInput-1').fill('jtchampi');
    await page.getByText('John Champion (jtchampi@ncsu.edu) [200103374]').click();

    await page.locator('#TagInput-1').fill('rsemmle');
    await page.getByText('Ryan Semmler (rsemmle@ncsu.edu) [001132807]').click();

    await page.locator('#TagInput-2').fill('clearanceB');
    await page.getByRole('option', { name: 'ClearanceB' }).locator('div').first().click();

    await page.locator('#TagInput-2').fill('clearanceC');
    await page.getByRole('option', { name: 'ClearanceC' }).locator('div').first().click();

    //await page.getByRole('button', { name: 'Assign' }).click();
    await page.locator('[test-id="assign-clearance-btn"]').click()

    await expect.soft(page.getByRole('heading', { name: 'Clearance(s) Assigned Successfully' })).toBeVisible();
  });

  test("assign clearance - already assigned to the user", async ({page}) =>{
    // await page.goto("https://clearance.test.ehps.ncsu.edu/manage");
    await page.goto("/manage"); 

    await page
      .locator('[test-id="personnel-input"] input')
      .fill("jtchampi@ncsu.edu");

    await page
      .locator("text=John Champion (jtchampi@ncsu.edu) [200103374]")
      .click();

    await page.locator('#TagInput-2').fill('clearanceB');
    await page.getByRole('option', { name: 'ClearanceB' }).locator('div').first().click();

    await page.locator('[test-id="assign-clearance-btn"]').click()

    await expect.soft(page.getByRole('heading', { name: 'Clearance(s) Assigned Successfully' })).toBeVisible();    
  })

  
  });