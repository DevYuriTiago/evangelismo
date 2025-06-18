/**
 * Testes para o módulo Journey
 * Navegação e lógica da jornada de evangelismo
 */

// Mock das dependências
const mockDatabase = {
  saveJourneyStep: jest.fn(),
  saveDecision: jest.fn(),
  saveUserData: jest.fn(),
};

const mockEffects = {
  createConfetti: jest.fn(),
};

describe('Journey Module', () => {
  beforeEach(() => {
    // Limpar DOM e mocks
    document.body.innerHTML = '';
    jest.clearAllMocks();

    // Mock das dependências globais
    window.Database = mockDatabase;
    window.Effects = mockEffects;
    window.AppState = {
      setUserName: jest.fn(),
      initializeUserData: jest.fn(),
    };

    // Setup básico do DOM
    document.body.innerHTML = `
      <div id="card1" class="card active">
        <input id="userName" value="">
      </div>
      <div id="card2" class="card">Card 2</div>
      <div id="card3" class="card">Card 3</div>
    `;
  });

  describe('Journey Start', () => {
    test('should start journey with valid name', () => {
      const nameInput = document.getElementById('userName');
      nameInput.value = 'João Silva';

      window.Journey.start();

      expect(window.AppState.setUserName).toHaveBeenCalledWith('João Silva');
      expect(window.AppState.initializeUserData).toHaveBeenCalled();
      expect(mockDatabase.saveJourneyStep).toHaveBeenCalledWith('card2');
    });

    test('should not start journey with empty name', () => {
      const nameInput = document.getElementById('userName');
      nameInput.value = '';
      const focusSpy = jest.spyOn(nameInput, 'focus');
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

      window.Journey.start();

      expect(alertSpy).toHaveBeenCalledWith(
        'Por favor, digite seu nome para continuar.'
      );
      expect(focusSpy).toHaveBeenCalled();
      expect(window.AppState.setUserName).not.toHaveBeenCalled();

      alertSpy.mockRestore();
      focusSpy.mockRestore();
    });

    test('should not start journey with name too short', () => {
      const nameInput = document.getElementById('userName');
      nameInput.value = 'A';
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

      window.Journey.start();

      expect(alertSpy).toHaveBeenCalledWith(
        'Por favor, digite seu nome para continuar.'
      );
      expect(window.AppState.setUserName).not.toHaveBeenCalled();

      alertSpy.mockRestore();
    });
  });

  describe('Card Navigation', () => {
    test('should navigate to specific card', () => {
      window.Journey.navigateToCard(3);

      expect(mockDatabase.saveJourneyStep).toHaveBeenCalledWith('card3');
    });

    test('should handle navigation when no current card found', () => {
      document.body.innerHTML = '<div>No cards</div>';

      // Não deve gerar erro
      expect(() => {
        window.Journey.navigateToCard(2);
      }).not.toThrow();
    });
  });

  describe('Jesus Acceptance', () => {
    test('should handle Jesus acceptance', () => {
      window.Journey.acceptJesus();

      expect(mockDatabase.saveDecision).toHaveBeenCalledWith('accepted');
      expect(mockEffects.createConfetti).toHaveBeenCalled();
    });
  });

  describe('Decision Decline', () => {
    test('should handle respectful decline', () => {
      window.Journey.showRespect();

      expect(mockDatabase.saveDecision).toHaveBeenCalledWith('declined');
    });
  });

  describe('Name Validation', () => {
    test('should validate correct names', () => {
      const validNames = [
        'João Silva',
        'Maria',
        'Ana Paula',
        'José da Silva Santos',
      ];

      validNames.forEach(name => {
        expect(window.Journey._validateName(name)).toBe(true);
      });
    });

    test('should invalidate incorrect names', () => {
      const invalidNames = ['', '   ', 'A', '12', null, undefined];

      invalidNames.forEach(name => {
        expect(window.Journey._validateName(name)).toBe(false);
      });
    });
  });

  describe('Card Management', () => {
    test('should find current active card', () => {
      const activeCard = window.Journey._getCurrentCard();
      expect(activeCard).toBeTruthy();
      expect(activeCard.id).toBe('card1');
    });

    test('should return null when no active card', () => {
      document.querySelectorAll('.card').forEach(card => {
        card.classList.remove('active');
      });

      const activeCard = window.Journey._getCurrentCard();
      expect(activeCard).toBe(null);
    });
  });

  describe('Phone Validation Integration', () => {
    beforeEach(() => {
      // Mock do módulo Phone
      window.Phone = {
        getInputValue: jest.fn(() => '(11) 9.8765-4321'),
        isValid: jest.fn(() => true),
        showError: jest.fn(),
      };
    });

    test('should validate phone when collecting contact info', () => {
      document.body.innerHTML += '<input id="phone" value="(11) 9.8765-4321">';

      // Simular coleta de dados de contato
      window.Journey.collectContactInfo();

      expect(window.Phone.getInputValue).toHaveBeenCalled();
      expect(window.Phone.isValid).toHaveBeenCalledWith('(11) 9.8765-4321');
    });

    test('should show error for invalid phone', () => {
      window.Phone.isValid.mockReturnValue(false);

      window.Journey.collectContactInfo();

      expect(window.Phone.showError).toHaveBeenCalled();
    });
  });

  describe('Global Functions', () => {
    test('should expose global startJourney function', () => {
      expect(typeof window.startJourney).toBe('function');
    });

    test('should expose global gotoCard function', () => {
      expect(typeof window.gotoCard).toBe('function');
    });

    test('should expose global acceptJesus function', () => {
      expect(typeof window.acceptJesus).toBe('function');
    });

    test('should expose global showRespect function', () => {
      expect(typeof window.showRespect).toBe('function');
    });
  });
});
