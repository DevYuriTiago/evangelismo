/**
 * Testes para o módulo Share
 * Funcionalidades de compartilhamento
 */

describe('Share Module', () => {
  beforeEach(() => {
    // Mock do navigator.share
    Object.defineProperty(navigator, 'share', {
      value: jest.fn(() => Promise.resolve()),
      writable: true,
    });

    // Mock do clipboard
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: jest.fn(() => Promise.resolve()),
      },
      writable: true,
    });

    // Mock do window.open
    window.open = jest.fn();

    // Mock do console
    console.log = jest.fn();
    console.error = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Native Share API', () => {
    test('should use native share when available', async () => {
      await window.Share.shareTestimony();

      expect(navigator.share).toHaveBeenCalledWith({
        title: 'Evangelismo Online - Palavra da Fé',
        text: 'Descobri algo incrível sobre a vida eterna! Venha conhecer Jesus comigo.',
        url: expect.any(String),
      });
    });

    test('should handle native share error gracefully', async () => {
      navigator.share.mockRejectedValue(new Error('Share failed'));

      await window.Share.shareTestimony();

      expect(console.error).toHaveBeenCalledWith(
        'Erro ao compartilhar:',
        expect.any(Error)
      );
    });
  });

  describe('Fallback Share Methods', () => {
    beforeEach(() => {
      // Remover suporte ao navigator.share
      delete navigator.share;
    });

    test('should fallback to WhatsApp share', async () => {
      await window.Share.shareTestimony();

      expect(window.open).toHaveBeenCalledWith(
        expect.stringContaining('https://wa.me/?text='),
        '_blank'
      );
    });

    test('should share via specific WhatsApp method', () => {
      window.Share.shareWhatsApp();

      expect(window.open).toHaveBeenCalledWith(
        expect.stringContaining('https://wa.me/?text='),
        '_blank'
      );
    });

    test('should share via Facebook', () => {
      window.Share.shareFacebook();

      expect(window.open).toHaveBeenCalledWith(
        expect.stringContaining('https://www.facebook.com/sharer/sharer.php'),
        '_blank'
      );
    });

    test('should share via Twitter', () => {
      window.Share.shareTwitter();

      expect(window.open).toHaveBeenCalledWith(
        expect.stringContaining('https://twitter.com/intent/tweet'),
        '_blank'
      );
    });

    test('should share via email', () => {
      window.Share.shareEmail();

      expect(window.open).toHaveBeenCalledWith(
        expect.stringContaining('mailto:'),
        '_blank'
      );
    });
  });

  describe('Copy to Clipboard', () => {
    test('should copy URL to clipboard successfully', async () => {
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

      await window.Share.copyToClipboard();

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        expect.any(String)
      );
      expect(alertSpy).toHaveBeenCalledWith(
        'Link copiado para a área de transferência!'
      );

      alertSpy.mockRestore();
    });

    test('should handle clipboard error gracefully', async () => {
      navigator.clipboard.writeText.mockRejectedValue(
        new Error('Clipboard failed')
      );
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

      await window.Share.copyToClipboard();

      expect(alertSpy).toHaveBeenCalledWith(
        'Erro ao copiar link. Tente novamente.'
      );
      expect(console.error).toHaveBeenCalledWith(
        'Erro ao copiar:',
        expect.any(Error)
      );

      alertSpy.mockRestore();
    });

    test('should handle missing clipboard API', async () => {
      delete navigator.clipboard;
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

      await window.Share.copyToClipboard();

      expect(alertSpy).toHaveBeenCalledWith(
        'Erro ao copiar link. Tente novamente.'
      );

      alertSpy.mockRestore();
    });
  });

  describe('URL Generation', () => {
    test('should generate current page URL', () => {
      const url = window.Share._getCurrentUrl();
      expect(url).toBe(window.location.href);
    });

    test('should generate share text', () => {
      const text = window.Share._getShareText();
      expect(text).toContain('Descobri algo incrível sobre a vida eterna!');
    });

    test('should encode text for URL', () => {
      const text = 'Olá mundo! Como está?';
      const encoded = window.Share._encodeText(text);
      expect(encoded).toBe(encodeURIComponent(text));
    });
  });

  describe('Browser Compatibility', () => {
    test('should detect native share support', () => {
      navigator.share = jest.fn();
      expect(window.Share._hasNativeShare()).toBe(true);

      delete navigator.share;
      expect(window.Share._hasNativeShare()).toBe(false);
    });

    test('should detect clipboard support', () => {
      navigator.clipboard = { writeText: jest.fn() };
      expect(window.Share._hasClipboard()).toBe(true);

      delete navigator.clipboard;
      expect(window.Share._hasClipboard()).toBe(false);
    });
  });

  describe('Global Functions', () => {
    test('should expose global shareTestimony function', () => {
      expect(typeof window.shareTestimony).toBe('function');
    });

    test('should expose global copyLink function', () => {
      expect(typeof window.copyLink).toBe('function');
    });

    test('should expose individual share platform functions', () => {
      expect(typeof window.shareWhatsApp).toBe('function');
      expect(typeof window.shareFacebook).toBe('function');
      expect(typeof window.shareTwitter).toBe('function');
      expect(typeof window.shareEmail).toBe('function');
    });
  });
});
