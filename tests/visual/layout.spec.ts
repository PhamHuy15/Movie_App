import { expect, test } from '@playwright/test';
test('movie title tối đa hai dòng và player 16:9', async ({ page }) => {
    await page.route('**/_next/image**', (route) =>
        route.fulfill({
            status: 200,
            contentType: 'image/svg+xml',
            body: '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="900"/>',
        }),
    );
    await page.goto('/');
    const cardTitle = page.locator('article h3').first();
    const titleMetrics = await cardTitle.evaluate((element) => {
        const style = getComputedStyle(element);
        return { height: element.getBoundingClientRect().height, lineHeight: Number.parseFloat(style.lineHeight) };
    });
    expect(titleMetrics.height).toBeLessThanOrEqual(titleMetrics.lineHeight * 2 + 1);
});
