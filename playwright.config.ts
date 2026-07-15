import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    testMatch: ['e2e/**/*.spec.ts', 'accessibility/**/*.spec.ts', 'visual/**/*.spec.ts'],
    fullyParallel: true,
    forbidOnly: Boolean(process.env.CI),
    retries: process.env.CI ? 2 : 0,
    workers: 1,
    reporter: [['list'], ['html', { open: 'never' }]],
    use: {
        baseURL: 'http://127.0.0.1:3100',
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        serviceWorkers: 'block',
    },
    projects: [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
        { name: 'mobile', use: { ...devices['iPhone 13'], viewport: { width: 375, height: 812 } } },
    ],
    webServer: {
        command: 'npm run start -- --hostname 127.0.0.1 --port 3100',
        url: 'http://127.0.0.1:3100',
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
        env: { ...process.env, E2E_TEST: '1', NEXT_PUBLIC_SITE_URL: 'http://127.0.0.1:3100' },
    },
    outputDir: 'test-results',
});
