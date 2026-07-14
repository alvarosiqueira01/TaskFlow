// Mock Vite's import.meta.env
Object.defineProperty(global, 'import.meta', {
  value: {
    env: {
      VITE_API_BASE_URL: 'http://localhost:3000/v1',
      VITE_APP_NAME: 'TaskFlow',
      VITE_APP_ENV: 'local',
      VITE_ENABLE_ADAPTIVE_STREAMING: 'false',
      VITE_ENABLE_REQUEST_LOGGING: 'false',
    },
  },
});

// Mock Web Crypto API (used by Idempotency-Key generation and Toast Plugin)
Object.defineProperty(window, 'crypto', {
  value: {
    randomUUID: () => 'mock-uuid-1234-5678',
  },
});

// Provide standard mocks for localStorage/sessionStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });
Object.defineProperty(window, 'sessionStorage', { value: localStorageMock });