/**
 * Setup global para testes Jest
 * Configura ambiente JSDOM para simular browser
 */

// Mock do navigator.share
Object.defineProperty(navigator, 'share', {
  value: jest.fn(() => Promise.resolve()),
  writable: true,
});

// Mock do console para reduzir logs durante testes
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock básico do localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock básico dos módulos globais para que os testes não falhem
// Os testes devem importar ou mockar os módulos específicos que testam
global.window = window;
