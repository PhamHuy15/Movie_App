import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

for (const path of ['/', '/movies', '/movie/detective-conan-movie-22-zero-the-enforcer', '/search?q=conan']) {
    test(`không có lỗi a11y serious/critical tại ${path}`, async ({ page }) => {
        await page.route('**/_next/image**', (route) =>
            route.fulfill({
                status: 200,
                contentType: 'image/svg+xml',
                body: '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="900"/>',
            }),
        );
        await page.goto(path);
        const results = await new AxeBuilder({ page }).analyze();
        const violations = results.violations.filter((item) => item.impact === 'serious' || item.impact === 'critical');
        expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
    });
}
