import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
 testDir:'tests/e2e', fullyParallel:false, workers:1,
 use:{baseURL:'http://127.0.0.1:4173/Stack_attack_c45/', headless:true, launchOptions:{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,args:['--no-sandbox']}, ...devices['Desktop Chrome']},
 webServer:{command:'npm run preview -- --port 4173 --strictPort --base=/Stack_attack_c45/',url:'http://127.0.0.1:4173/Stack_attack_c45/',reuseExistingServer:false},
 reporter:'list'
});
