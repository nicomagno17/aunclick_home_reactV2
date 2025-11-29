import { defineConfig, devices } from '@playwright/test';

/**
 * Configuración de Playwright para testing E2E
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests/e2e',
  
  /* Ejecutar tests en paralelo */
  fullyParallel: true,
  
  /* Fallar el build en CI si dejaste test.only por accidente */
  forbidOnly: !!process.env.CI,
  
  /* Reintentar en CI solamente */
  retries: process.env.CI ? 2 : 0,
  
  /* Opt out de parallel tests en CI */
  workers: process.env.CI ? 1 : undefined,
  
  /* Reporter a usar */
  reporter: [
    ['html'],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }]
  ],
  
  /* Configuración compartida para todos los proyectos */
  use: {
    /* URL base para usar en acciones como `await page.goto('/')` */
    baseURL: process.env.BASE_URL || 'http://localhost:3001',
    
    /* Recolectar trace cuando un test falla */
    trace: 'on-first-retry',
    
    /* Screenshot en fallo */
    screenshot: 'only-on-failure',
    
    /* Video en fallo */
    video: 'retain-on-failure',
  },

  /* Configurar proyectos para diferentes navegadores */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test en mobile viewports */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  /* Ejecutar el servidor de desarrollo antes de iniciar los tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3001',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});

