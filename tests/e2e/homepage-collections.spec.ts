import { expect, test } from '@playwright/test';

test('các bộ sưu tập trang chủ hiển thị 7 cột và vẫn cuộn bằng next/prev', async ({ page }) => {
    test.setTimeout(60_000);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Đề Xuất Cho Bạn' })).toBeVisible({ timeout: 20_000 });
    await expect(page.getByRole('heading', { name: 'Điện Ảnh Âu Mỹ' })).toBeAttached();

    const carousel = page.locator('[data-movie-carousel="Đề Xuất Cho Bạn"]');
    await expect(carousel.locator('article')).toHaveCount(10);
    const layout = await carousel.evaluate((element) => {
        const cards = Array.from(element.querySelectorAll('article')).slice(0, 7);
        const bounds = element.getBoundingClientRect();
        const seventh = cards[6]?.getBoundingClientRect();
        return { containerRight: bounds.right, seventhRight: seventh?.right ?? Number.POSITIVE_INFINITY };
    });
    expect(layout.seventhRight).toBeLessThanOrEqual(layout.containerRight + 1);

    const next = page.getByRole('button', { name: 'Xem phim tiếp theo trong Đề Xuất Cho Bạn' });
    const previous = page.getByRole('button', { name: 'Xem phim trước trong Đề Xuất Cho Bạn' });
    await expect(next).toBeVisible();
    await expect(previous).toBeVisible();
    await next.click();
    await expect.poll(() => carousel.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
    await previous.click();
    await expect.poll(() => carousel.evaluate((element) => element.scrollLeft)).toBe(0);
});

