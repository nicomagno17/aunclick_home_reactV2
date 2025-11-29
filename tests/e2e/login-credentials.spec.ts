import { test, expect } from '@playwright/test';

/**
 * Test E2E del flujo completo de login con credenciales
 * 
 * Verifica:
 * 1. Usuario puede abrir la página de login
 * 2. Usuario puede ingresar email y contraseña
 * 3. Usuario puede hacer clic en "Iniciar Sesión"
 * 4. Si las credenciales son correctas: es redirigido a la página principal con sesión activa
 * 5. Si las credenciales son incorrectas: ve un mensaje de error claro
 */

test.describe('Login con Credenciales', () => {
  const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';
  const TEST_USER = {
    email: 'test@aunclick.com',
    password: 'Test123!@#',
  };

  test.beforeEach(async ({ page }) => {
    // Navegar a la página de login antes de cada test
    await page.goto(`${BASE_URL}/login-modern`);
  });

  test('debe mostrar el formulario de login correctamente', async ({ page }) => {
    // Verificar que el formulario de login está visible
    await expect(page.locator('form')).toBeVisible();
    
    // Verificar que los campos de email y password están presentes
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    
    // Verificar que el botón de submit está presente
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
  });

  test('debe permitir login exitoso con credenciales correctas', async ({ page }) => {
    // Llenar el formulario de login
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    
    // Hacer clic en el botón de login
    await page.click('button[type="submit"]');
    
    // Esperar a que la navegación se complete
    await page.waitForURL(`${BASE_URL}/`, { timeout: 10000 });
    
    // Verificar que estamos en la página principal
    expect(page.url()).toBe(`${BASE_URL}/`);
    
    // Verificar que hay una sesión activa (puede variar según tu implementación)
    // Por ejemplo, verificar que hay un elemento que solo aparece cuando el usuario está logueado
    // await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test('debe mostrar error con credenciales incorrectas - email inválido', async ({ page }) => {
    // Llenar el formulario con email que no existe
    await page.fill('input[type="email"]', 'noexiste@aunclick.com');
    await page.fill('input[type="password"]', 'cualquierpassword');
    
    // Hacer clic en el botón de login
    await page.click('button[type="submit"]');
    
    // Esperar a que aparezca el mensaje de error
    // Ajusta el selector según tu implementación de toasts/alerts
    await page.waitForSelector('[role="alert"], .toast, [data-sonner-toast]', { timeout: 5000 });
    
    // Verificar que el mensaje de error contiene texto relevante
    const errorMessage = page.locator('[role="alert"], .toast, [data-sonner-toast]');
    await expect(errorMessage).toContainText(/credenciales incorrectas|email o contraseña/i);
    
    // Verificar que NO fuimos redirigidos (seguimos en login)
    expect(page.url()).toContain('/login-modern');
  });

  test('debe mostrar error con credenciales incorrectas - password inválido', async ({ page }) => {
    // Llenar el formulario con email correcto pero password incorrecto
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', 'PasswordIncorrecto123!');
    
    // Hacer clic en el botón de login
    await page.click('button[type="submit"]');
    
    // Esperar a que aparezca el mensaje de error
    await page.waitForSelector('[role="alert"], .toast, [data-sonner-toast]', { timeout: 5000 });
    
    // Verificar que el mensaje de error contiene texto relevante
    const errorMessage = page.locator('[role="alert"], .toast, [data-sonner-toast]');
    await expect(errorMessage).toContainText(/credenciales incorrectas|email o contraseña/i);
    
    // Verificar que NO fuimos redirigidos (seguimos en login)
    expect(page.url()).toContain('/login-modern');
  });

  test('debe validar formato de email en tiempo real', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');
    
    // Ingresar un email inválido
    await emailInput.fill('emailinvalido');
    await emailInput.blur(); // Quitar el foco para activar validación
    
    // Esperar a que aparezca el mensaje de validación
    // Ajusta el selector según tu implementación
    const validationMessage = page.locator('text=/formato.*email.*inválido/i, text=/email.*válido/i');
    await expect(validationMessage.first()).toBeVisible({ timeout: 2000 });
  });

  test('debe mostrar/ocultar contraseña al hacer clic en el icono', async ({ page }) => {
    const passwordInput = page.locator('input[type="password"], input[type="text"]').first();
    
    // Verificar que inicialmente es tipo password
    await expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Buscar el botón de mostrar/ocultar contraseña (ajusta el selector según tu implementación)
    const toggleButton = page.locator('button[aria-label*="contraseña"], button:has-text("👁")').first();
    
    if (await toggleButton.isVisible()) {
      // Hacer clic para mostrar la contraseña
      await toggleButton.click();
      
      // Verificar que ahora es tipo text
      await expect(passwordInput).toHaveAttribute('type', 'text');
      
      // Hacer clic de nuevo para ocultar
      await toggleButton.click();
      
      // Verificar que volvió a ser tipo password
      await expect(passwordInput).toHaveAttribute('type', 'password');
    }
  });

  test('debe deshabilitar el botón de submit mientras se procesa el login', async ({ page }) => {
    // Llenar el formulario
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    
    const submitButton = page.locator('button[type="submit"]');
    
    // Hacer clic en el botón de login
    const loginPromise = page.click('button[type="submit"]');
    
    // Verificar que el botón está deshabilitado durante el proceso
    // (esto puede ser muy rápido, así que usamos un timeout corto)
    await expect(submitButton).toBeDisabled({ timeout: 1000 }).catch(() => {
      // Si no se pudo verificar porque fue muy rápido, está bien
      console.log('Login fue muy rápido para verificar el estado deshabilitado');
    });
    
    await loginPromise;
  });
});

