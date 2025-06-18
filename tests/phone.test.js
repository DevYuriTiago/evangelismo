/**
 * Testes para o módulo Phone
 * Validação e formatação de números de telefone brasileiros
 */

describe('Phone Module', () => {
  beforeEach(() => {
    // Limpar DOM antes de cada teste
    document.body.innerHTML = '';
  });

  describe('Phone Input Value', () => {
    test('should get phone input value', () => {
      document.body.innerHTML = '<input id="phone" value="(11) 9.8765-4321">';

      expect(window.Phone.getInputValue()).toBe('(11) 9.8765-4321');
    });

    test('should return empty string when input not found', () => {
      expect(window.Phone.getInputValue()).toBe('');
    });

    test('should trim phone input value', () => {
      document.body.innerHTML =
        '<input id="phone" value="  (11) 9.8765-4321  ">';

      expect(window.Phone.getInputValue()).toBe('(11) 9.8765-4321');
    });
  });

  describe('Phone Validation', () => {
    test('should validate empty phone as valid (optional field)', () => {
      expect(window.Phone.isValid('')).toBe(true);
      expect(window.Phone.isValid(null)).toBe(true);
      expect(window.Phone.isValid(undefined)).toBe(true);
    });

    test('should validate correct Brazilian phone numbers', () => {
      const validPhones = [
        '(11) 9.8765-4321',
        '11987654321',
        '(21) 3456-7890',
        '2134567890',
      ];

      validPhones.forEach(phone => {
        expect(window.Phone.isValid(phone)).toBe(true);
      });
    });

    test('should invalidate incorrect phone numbers', () => {
      const invalidPhones = [
        '123456789', // Muito curto
        '123456789012', // Muito longo
        '(01) 9.8765-4321', // DDD inválido (01)
        '(99) 9.8765-4321', // DDD inválido (99)
      ];

      invalidPhones.forEach(phone => {
        expect(window.Phone.isValid(phone)).toBe(false);
      });
    });
  });

  describe('Phone Formatting', () => {
    let input;

    beforeEach(() => {
      input = document.createElement('input');
      input.id = 'phone';
      document.body.appendChild(input);
    });

    test('should format phone number with DDD only', () => {
      input.value = '11';
      window.Phone.formatNumber(input);
      expect(input.value).toBe('(11');
    });

    test('should format phone number with DDD and first digit', () => {
      input.value = '119';
      window.Phone.formatNumber(input);
      expect(input.value).toBe('(11) 9');
    });

    test('should format partial phone number', () => {
      input.value = '1198765';
      window.Phone.formatNumber(input);
      expect(input.value).toBe('(11) 9.8765');
    });

    test('should format complete phone number', () => {
      input.value = '11987654321';
      window.Phone.formatNumber(input);
      expect(input.value).toBe('(11) 9.8765-4321');
    });

    test('should limit phone number to 11 digits', () => {
      input.value = '119876543219999';
      window.Phone.formatNumber(input);
      expect(input.value).toBe('(11) 9.8765-4321');
    });
  });

  describe('Key Validation', () => {
    test('should allow control keys', () => {
      const controlKeys = [8, 9, 27, 13, 46]; // backspace, tab, escape, enter, delete

      controlKeys.forEach(keyCode => {
        const evt = { which: keyCode };
        expect(window.Phone.isAllowedKey(evt)).toBe(true);
      });
    });

    test('should allow number keys', () => {
      for (let i = 48; i <= 57; i++) {
        // Keys 0-9
        const evt = { which: i };
        expect(window.Phone.isAllowedKey(evt)).toBe(true);
      }
    });

    test('should allow Ctrl shortcuts', () => {
      const shortcuts = [65, 67, 86, 88]; // Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X

      shortcuts.forEach(keyCode => {
        const evt = { which: keyCode, ctrlKey: true };
        expect(window.Phone.isAllowedKey(evt)).toBe(true);
      });
    });

    test('should block invalid keys', () => {
      const invalidKeys = [65, 83, 68]; // A, S, D without Ctrl

      invalidKeys.forEach(keyCode => {
        const evt = { which: keyCode, ctrlKey: false };
        expect(window.Phone.isAllowedKey(evt)).toBe(false);
      });
    });
  });

  describe('Error Handling', () => {
    test('should show error and focus input', () => {
      document.body.innerHTML = '<input id="phone">';
      const input = document.getElementById('phone');
      const focusSpy = jest.spyOn(input, 'focus');
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

      window.Phone.showError();

      expect(alertSpy).toHaveBeenCalledWith(
        'Por favor, digite um telefone válido ou deixe em branco.'
      );
      expect(focusSpy).toHaveBeenCalled();

      alertSpy.mockRestore();
      focusSpy.mockRestore();
    });
  });

  describe('Global Functions', () => {
    test('should expose global formatPhoneNumber function', () => {
      expect(typeof window.formatPhoneNumber).toBe('function');
    });

    test('should expose global isNumberKey function', () => {
      expect(typeof window.isNumberKey).toBe('function');
    });

    test('should expose global isValidBrazilianPhone function', () => {
      expect(typeof window.isValidBrazilianPhone).toBe('function');
    });
  });
});
