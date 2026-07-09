import { expect, test } from '@playwright/test';

const viewports = [
    { name: 'mobile', width: 375, height: 812 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'laptop', width: 1280, height: 720 },
    { name: 'desktop', width: 1440, height: 900 },
];

for (const viewport of viewports) {
    test(`responsive và typography ${viewport.name} ${viewport.width}x${viewport.height}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.route('**/_next/image**', (route) =>
            route.fulfill({
                status: 200,
                contentType: 'image/svg+xml',
                body: '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="900"/>',
            }),
        );
        await page.goto('/');
        const metrics = await page.evaluate(() => ({
            overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
            lang: document.documentElement.lang,
            titleFont: getComputedStyle(document.querySelector('h1')!).fontFamily,
        }));
        expect(metrics.overflow).toBe(false);
        expect(metrics.lang).toBe('vi');
        expect(metrics.titleFont).toMatch(/Oswald/i);
        await expect(page.getByRole('heading', { level: 1 })).toHaveCSS('line-height', /.+/);
        const bottomNav = page.locator('body > nav').last();
        const sidebar = page.locator('aside');
        if (viewport.width < 768) {
            await expect(bottomNav).toBeVisible();
            await expect(sidebar).toBeHidden();
        } else {
            await expect(bottomNav).toBeHidden();
            await expect(sidebar).toBeVisible();
        }
    });
}
