/**
 * Testes para o módulo Effects
 * Efeitos visuais e animações
 */

describe('Effects Module', () => {
  beforeEach(() => {
    // Limpar DOM antes de cada teste
    document.body.innerHTML = '';

    // Mock do setTimeout para testes síncronos
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Confetti Effect', () => {
    test('should create confetti container', () => {
      window.Effects.createConfetti();

      const confettiContainer = document.querySelector('.confetti-container');
      expect(confettiContainer).toBeTruthy();
    });

    test('should create multiple confetti pieces', () => {
      window.Effects.createConfetti();

      const confettiPieces = document.querySelectorAll('.confetti');
      expect(confettiPieces.length).toBeGreaterThan(0);
    });

    test('should remove confetti after animation', () => {
      window.Effects.createConfetti();

      // Avançar tempo para completar animação
      jest.advanceTimersByTime(4000);

      const confettiContainer = document.querySelector('.confetti-container');
      expect(confettiContainer).toBeFalsy();
    });

    test('should not create duplicate confetti containers', () => {
      window.Effects.createConfetti();
      window.Effects.createConfetti();

      const confettiContainers = document.querySelectorAll(
        '.confetti-container'
      );
      expect(confettiContainers.length).toBe(1);
    });
  });

  describe('Smooth Scroll Effect', () => {
    test('should scroll to element smoothly', () => {
      document.body.innerHTML = '<div id="testElement">Test</div>';
      const element = document.getElementById('testElement');

      // Mock scrollIntoView
      element.scrollIntoView = jest.fn();

      window.Effects.smoothScrollTo('testElement');

      expect(element.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start',
      });
    });

    test('should handle invalid element ID gracefully', () => {
      expect(() => {
        window.Effects.smoothScrollTo('invalidElement');
      }).not.toThrow();
    });
  });

  describe('Card Transition Effects', () => {
    test('should fade out and fade in cards', () => {
      document.body.innerHTML = `
        <div id="card1" class="card active">Card 1</div>
        <div id="card2" class="card">Card 2</div>
      `;

      const card1 = document.getElementById('card1');
      const card2 = document.getElementById('card2');

      window.Effects.transitionCards(card1, card2);

      // Verificar classes aplicadas
      expect(card1.classList.contains('fade-out')).toBe(true);

      // Avançar tempo para completar transição
      jest.advanceTimersByTime(300);

      expect(card1.classList.contains('active')).toBe(false);
      expect(card2.classList.contains('active')).toBe(true);
    });
  });

  describe('Loading Animation', () => {
    test('should show loading animation', () => {
      window.Effects.showLoading();

      const loader = document.querySelector('.loader');
      expect(loader).toBeTruthy();
      expect(loader.style.display).toBe('flex');
    });

    test('should hide loading animation', () => {
      window.Effects.showLoading();
      window.Effects.hideLoading();

      const loader = document.querySelector('.loader');
      expect(loader.style.display).toBe('none');
    });
  });

  describe('Pulse Animation', () => {
    test('should add pulse animation to element', () => {
      document.body.innerHTML = '<button id="testButton">Test</button>';
      const button = document.getElementById('testButton');

      window.Effects.pulseElement('testButton');

      expect(button.classList.contains('pulse')).toBe(true);

      // Avançar tempo para remover animação
      jest.advanceTimersByTime(1000);

      expect(button.classList.contains('pulse')).toBe(false);
    });

    test('should handle invalid element ID for pulse', () => {
      expect(() => {
        window.Effects.pulseElement('invalidElement');
      }).not.toThrow();
    });
  });

  describe('Shake Animation', () => {
    test('should add shake animation to element', () => {
      document.body.innerHTML = '<input id="testInput" />';
      const input = document.getElementById('testInput');

      window.Effects.shakeElement('testInput');

      expect(input.classList.contains('shake')).toBe(true);

      // Avançar tempo para remover animação
      jest.advanceTimersByTime(500);

      expect(input.classList.contains('shake')).toBe(false);
    });
  });

  describe('Typewriter Effect', () => {
    test('should create typewriter effect', () => {
      document.body.innerHTML = '<div id="typewriter"></div>';
      const element = document.getElementById('typewriter');

      const text = 'Hello World';
      window.Effects.typewriter('typewriter', text, 50);

      // Avançar tempo para completar digitação
      jest.advanceTimersByTime(text.length * 50 + 100);

      expect(element.textContent).toBe(text);
    });

    test('should handle invalid element for typewriter', () => {
      expect(() => {
        window.Effects.typewriter('invalidElement', 'test', 50);
      }).not.toThrow();
    });
  });
});
