/**
 * Testes para o módulo State
 * Gerenciamento de estado da aplicação
 */

describe('AppState Module', () => {
  beforeEach(() => {
    // Reset state antes de cada teste
    if (window.AppState) {
      window.AppState.reset();
    }

    // Limpar DOM
    document.body.innerHTML = '';
  });

  describe('User Name Management', () => {
    test('should set and get user name', () => {
      const testName = 'João Silva';
      window.AppState.setUserName(testName);

      expect(window.AppState.getUserName()).toBe(testName);
    });

    test('should update user name in DOM elements', () => {
      // Criar elementos no DOM
      document.body.innerHTML = `
        <span class="user-name"></span>
        <div class="user-name"></div>
      `;

      const testName = 'Maria Santos';
      window.AppState.setUserName(testName);

      const elements = document.querySelectorAll('.user-name');
      elements.forEach(element => {
        expect(element.textContent).toBe(testName);
      });
    });
  });

  describe('User Data Management', () => {
    test('should set and get user data', () => {
      const testData = { age: 30, city: 'São Paulo' };
      window.AppState.setUserData(testData);

      const userData = window.AppState.getUserData();
      expect(userData).toEqual(testData);
      expect(userData).not.toBe(testData); // Should be a copy
    });

    test('should update user data incrementally', () => {
      const initialData = { name: 'João', age: 25 };
      const updates = { age: 26, city: 'Rio de Janeiro' };

      window.AppState.setUserData(initialData);
      window.AppState.updateUserData(updates);

      const userData = window.AppState.getUserData();
      expect(userData).toEqual({
        name: 'João',
        age: 26,
        city: 'Rio de Janeiro',
      });
    });

    test('should initialize user data with current state', () => {
      const testName = 'Pedro Silva';
      window.AppState.setUserName(testName);
      window.AppState.initializeUserData();

      const userData = window.AppState.getUserData();
      expect(userData.name).toBe(testName);
      expect(userData.step).toBe('started');
      expect(userData.started_at).toBeDefined();
    });
  });

  describe('User Record ID Management', () => {
    test('should set and get user record ID', () => {
      const testId = 'record_123';
      window.AppState.setUserRecordId(testId);

      expect(window.AppState.getUserRecordId()).toBe(testId);
    });
  });

  describe('Supabase Client Management', () => {
    test('should set and get Supabase client', () => {
      const mockClient = { from: jest.fn() };
      window.AppState.setSupabaseClient(mockClient);

      expect(window.AppState.getSupabaseClient()).toBe(mockClient);
    });
  });

  describe('State Reset', () => {
    test('should reset all data except Supabase client', () => {
      const mockClient = { from: jest.fn() };

      // Configurar estado
      window.AppState.setUserName('João');
      window.AppState.setUserData({ age: 30 });
      window.AppState.setUserRecordId('record_123');
      window.AppState.setSupabaseClient(mockClient);

      // Reset
      window.AppState.reset();

      // Verificar reset
      expect(window.AppState.getUserName()).toBe('');
      expect(window.AppState.getUserData()).toEqual({});
      expect(window.AppState.getUserRecordId()).toBe(null);
      expect(window.AppState.getSupabaseClient()).toBe(mockClient); // Preservado
    });
  });
});
