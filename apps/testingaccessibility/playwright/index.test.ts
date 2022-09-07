import {expect, test} from '@playwright/test'

test('page should render with an h1', async ({page}) => {
  await page.goto('http://localhost:3013/')
  await expect(
    page.locator(
      `text=Comprehensive Accessibility Training for Shipping High-Quality Web Applications`,
    ),
  ).toBeVisible()
})
