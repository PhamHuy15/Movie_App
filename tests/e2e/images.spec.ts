import { expect, test } from '@playwright/test';

for (const viewport of [
    { name: 'desktop', width: 1280, height: 720 },
    { name: 'mobile', width: 375, height: 812 },
]) {
    test(`banner và poster ${viewport.name} dùng đúng nguồn ảnh responsive chất lượng cao`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto('/');

        const hero = page.locator('section[aria-roledescription="carousel"] img').first();
        await expect(hero).toBeVisible();
        const heroImage = await hero.evaluate((image: HTMLImageElement) => ({
            currentSrc: image.currentSrc,
            naturalWidth: image.naturalWidth,
            clientWidth: image.clientWidth,
        }));
        expect(heroImage.currentSrc).toContain('phimimg.com');
        expect(heroImage.currentSrc).toContain('q=90');
        expect(heroImage.naturalWidth).toBeGreaterThanOrEqual(heroImage.clientWidth);

        const poster = page.locator('article img[alt^="Poster"]').first();
        await expect(poster).toBeVisible();
        const posterImage = await poster.evaluate((image: HTMLImageElement) => ({
            currentSrc: image.currentSrc,
            naturalWidth: image.naturalWidth,
            naturalHeight: image.naturalHeight,
            loading: image.loading,
            sizes: image.sizes,
        }));
        expect(decodeURIComponent(posterImage.currentSrc)).not.toMatch(/-1\.(?:jpg|jpeg|png|webp)/i);
        expect(posterImage.currentSrc).toContain('q=85');
        expect(posterImage.naturalHeight).toBeGreaterThan(posterImage.naturalWidth);
        expect(posterImage.loading).toBe('lazy');
        expect(posterImage.sizes).toContain('(max-width: 639px) 42vw');
    });
}
