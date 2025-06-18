/**
 * Testes para o módulo Database
 * Integração com Supabase e persistência de dados
 */

// Mock do Supabase client
const mockSupabaseClient = {
  from: jest.fn(() => ({
    insert: jest.fn(() => ({
      select: jest.fn(() =>
        Promise.resolve({ data: [{ id: 'test-id' }], error: null })
      ),
    })),
    update: jest.fn(() => ({
      eq: jest.fn(() => Promise.resolve({ data: [], error: null })),
    })),
    select: jest.fn(() => ({
      eq: jest.fn(() => Promise.resolve({ data: [], error: null })),
    })),
  })),
};

describe('Database Module', () => {
  beforeEach(() => {
    // Mock das dependências
    window.AppState = {
      getUserName: jest.fn(() => 'João Silva'),
      getUserData: jest.fn(() => ({
        name: 'João Silva',
        phone: '11987654321',
      })),
      getUserRecordId: jest.fn(() => null),
      setUserRecordId: jest.fn(),
      getSupabaseClient: jest.fn(() => mockSupabaseClient),
      updateUserData: jest.fn(),
    };

    // Limpar mocks
    jest.clearAllMocks();
  });

  describe('User Data Save', () => {
    test('should save new user data successfully', async () => {
      const userData = {
        name: 'João Silva',
        phone: '11987654321',
        step: 'started',
      };

      const result = await window.Database.saveUserData(userData);

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('evangelismo_leads');
      expect(result.success).toBe(true);
      expect(window.AppState.setUserRecordId).toHaveBeenCalledWith('test-id');
    });

    test('should handle save error gracefully', async () => {
      mockSupabaseClient.from.mockReturnValue({
        insert: jest.fn(() => ({
          select: jest.fn(() =>
            Promise.resolve({
              data: null,
              error: { message: 'Database error' },
            })
          ),
        })),
      });

      const userData = { name: 'João Silva' };
      const result = await window.Database.saveUserData(userData);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Database error');
    });

    test('should prevent duplicate submissions', async () => {
      window.AppState.getUserRecordId.mockReturnValue('existing-id');

      const userData = { name: 'João Silva' };
      const result = await window.Database.saveUserData(userData);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Dados já foram salvos');
    });
  });

  describe('Journey Step Tracking', () => {
    test('should save journey step successfully', async () => {
      window.AppState.getUserRecordId.mockReturnValue('user-id');

      const result = await window.Database.saveJourneyStep('card2');

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('evangelismo_leads');
      expect(result.success).toBe(true);
    });

    test('should handle missing user record ID', async () => {
      window.AppState.getUserRecordId.mockReturnValue(null);

      const result = await window.Database.saveJourneyStep('card2');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Usuário não identificado');
    });
  });

  describe('Decision Tracking', () => {
    test('should save acceptance decision', async () => {
      window.AppState.getUserRecordId.mockReturnValue('user-id');

      const result = await window.Database.saveDecision('accepted');

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('evangelismo_leads');
      expect(result.success).toBe(true);
    });

    test('should save decline decision', async () => {
      window.AppState.getUserRecordId.mockReturnValue('user-id');

      const result = await window.Database.saveDecision('declined');

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('evangelismo_leads');
      expect(result.success).toBe(true);
    });

    test('should handle invalid decision value', async () => {
      window.AppState.getUserRecordId.mockReturnValue('user-id');

      const result = await window.Database.saveDecision('invalid');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Decisão inválida');
    });
  });

  describe('Phone Formatting', () => {
    test('should format complete Brazilian phone number', () => {
      const formatted = window.Database._formatPhone('11987654321');
      expect(formatted).toBe('(11) 9.8765-4321');
    });

    test('should format landline phone number', () => {
      const formatted = window.Database._formatPhone('1134567890');
      expect(formatted).toBe('(11) 3456-7890');
    });

    test('should return original for invalid phone', () => {
      const invalidPhone = '123';
      const formatted = window.Database._formatPhone(invalidPhone);
      expect(formatted).toBe(invalidPhone);
    });

    test('should handle empty phone', () => {
      expect(window.Database._formatPhone('')).toBe('');
      expect(window.Database._formatPhone(null)).toBe('');
      expect(window.Database._formatPhone(undefined)).toBe('');
    });
  });

  describe('Data Validation', () => {
    test('should validate required user data', () => {
      const validData = {
        name: 'João Silva',
        phone: '11987654321',
      };

      expect(window.Database._validateUserData(validData)).toBe(true);
    });

    test('should reject data without name', () => {
      const invalidData = {
        phone: '11987654321',
      };

      expect(window.Database._validateUserData(invalidData)).toBe(false);
    });

    test('should accept data without phone (optional)', () => {
      const validData = {
        name: 'João Silva',
      };

      expect(window.Database._validateUserData(validData)).toBe(true);
    });
  });

  describe('Error Handling', () => {
    test('should handle network errors', async () => {
      mockSupabaseClient.from.mockImplementation(() => {
        throw new Error('Network error');
      });

      const userData = { name: 'João Silva' };
      const result = await window.Database.saveUserData(userData);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Erro inesperado');
    });

    test('should handle missing Supabase client', async () => {
      window.AppState.getSupabaseClient.mockReturnValue(null);

      const userData = { name: 'João Silva' };
      const result = await window.Database.saveUserData(userData);

      expect(result.success).toBe(false);
      expect(result.error).toContain(
        'Cliente de banco de dados não inicializado'
      );
    });
  });

  describe('Contact Info Collection', () => {
    test('should collect and save contact information', async () => {
      document.body.innerHTML = `
        <input id="phone" value="11987654321">
        <select id="communication">
          <option value="whatsapp" selected>WhatsApp</option>
        </select>
      `;

      const result = await window.Database.saveContactInfo();

      expect(result.success).toBe(true);
      expect(window.AppState.updateUserData).toHaveBeenCalledWith({
        phone: '(11) 9.8765-4321',
        communication_preference: 'whatsapp',
      });
    });

    test('should handle missing form elements', async () => {
      document.body.innerHTML = '';

      const result = await window.Database.saveContactInfo();

      expect(result.success).toBe(false);
    });
  });
});
