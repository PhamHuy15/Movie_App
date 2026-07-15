import { expect, test } from '@playwright/test';

const movieSlug = 'detective-conan-movie-22-zero-the-enforcer';
const movieTitle = 'Detective Conan Movie 22: Zero The Enforcer';
const streamSources = [
    { id: 'qa-1', serverName: 'QA Server 1', type: 'mp4', url: '/test-media/qa.mp4', quality: '720p' },
    { id: 'qa-2', serverName: 'QA Server 2', type: 'mp4', url: '/test-media/backup.mp4', quality: '480p' },
];

test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
        Object.defineProperty(HTMLMediaElement.prototype, 'play', {
            configurable: true,
            value() {
                Object.defineProperty(this, 'paused', { configurable: true, value: false });
                this.dispatchEvent(new Event('play'));
                return Promise.resolve();
            },
        });
        Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
            configurable: true,
            value() {
                Object.defineProperty(this, 'paused', { configurable: true, value: true });
                this.dispatchEvent(new Event('pause'));
            },
        });
        Object.defineProperty(HTMLMediaElement.prototype, 'duration', { configurable: true, get: () => 120 });
        Object.defineProperty(HTMLMediaElement.prototype, 'src', {
            configurable: true,
            get() {
                return this.dataset.qaSrc ?? '';
            },
            set(value: string) {
                this.dataset.qaSrc = value;
            },
        });
    });
    await page.route('**/_next/image**', (route) =>
        route.fulfill({
            status: 200,
            contentType: 'image/svg+xml',
            body: '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="900"/>',
        }),
    );
});

test('mở trang chủ, điều hướng và không có lỗi console nghiêm trọng', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));

    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByText(/Phim mới cập nhật/i)).toBeVisible();
    await page.getByRole('link', { name: 'Khám phá' }).first().click();
    await expect(page).toHaveURL(/discover/);
    expect(errors).toEqual([]);
});

test('tìm kiếm phim và mở trang chi tiết', async ({ page }) => {
    await page.goto('/');
    const search = page.getByRole('banner').getByRole('combobox', { name: 'Tìm kiếm phim, diễn viên' });
    await search.fill('conan');
    await search.press('Enter');

    await expect(page).toHaveURL(/search\?q=conan/);
    await expect(page.getByText(movieTitle).first()).toBeVisible();
    await page.getByRole('main').getByRole('combobox', { name: 'Tìm kiếm phim, diễn viên' }).press('Escape');
    await page.locator('article').filter({ hasText: movieTitle }).getByRole('link').click();
    await expect(page).toHaveURL(new RegExp(`/movie/${movieSlug}$`));
    await expect(page.getByRole('heading', { level: 1, name: movieTitle })).toBeVisible();
});

test('lọc theo thể loại và quốc gia đồng bộ URL', async ({ page }) => {
    test.setTimeout(60_000);
    await page.goto('/discover');
    await expect(page.getByLabel('Thể loại')).toBeEnabled({ timeout: 15_000 });

    await page.getByLabel('Thể loại').selectOption('tam-ly');
    await expect(page).toHaveURL(/genre=tam-ly/, { timeout: 15_000 });

    await page.getByLabel('Quốc gia').selectOption('han-quoc');
    await expect(page).toHaveURL(/country=han-quoc/, { timeout: 15_000 });
});

test('thêm và xóa yêu thích', async ({ page }) => {
    await page.goto(`/movie/${movieSlug}`);
    const favorite = page.getByRole('button', { name: 'Yêu thích', exact: true });
    await favorite.click();
    await expect(page.getByRole('button', { name: 'Đã yêu thích' })).toBeVisible();

    await page.goto('/library');
    await expect(page.getByText(movieTitle)).toBeVisible();

    await page.goto(`/movie/${movieSlug}`);
    await page.getByRole('button', { name: 'Đã yêu thích' }).click();
    await expect(page.getByRole('button', { name: 'Yêu thích', exact: true })).toBeVisible();
});

test('player đổi server và reload không lỗi', async ({ page }) => {
    await page.route('**/api/stream/**', (route) =>
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ sources: streamSources }),
        }),
    );

    await page.goto(`/watch/${movieSlug}`);
    const video = page.locator('video');
    await expect(video).toBeVisible();
    await page.getByLabel('Server').selectOption('1');
    await expect(page.getByLabel('Server')).toHaveValue('1');
    await page.reload();
    await expect(page.locator('video')).toBeVisible();
});

test('nguồn lỗi có fallback và trang 404 hoạt động', async ({ page }) => {
    await page.route('**/api/stream/**', (route) =>
        route.fulfill({
            status: 502,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'Nguồn lỗi', sources: [] }),
        }),
    );

    await page.goto(`/watch/${movieSlug}`);
    await expect(page.getByText('Chưa có nguồn phát')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Thử lại' })).toBeVisible();
    await page.goto('/khong-ton-tai');
    await expect(page.getByRole('heading', { name: 'Cảnh phim này không tồn tại' })).toBeVisible();
});
