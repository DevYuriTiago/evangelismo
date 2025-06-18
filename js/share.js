/* ========================================
   SHARE MODULE
   Clean Code Architecture - Evangelismo Online
   ======================================== */

window.Share = {
  // Share on WhatsApp
  whatsApp() {
    const message = this._createWhatsAppMessage();
    const url = this._buildWhatsAppURL(message);
    this._openInNewWindow(url);
  },

  // Share on Instagram (copy text)
  instagram() {
    const message = this._createInstagramMessage();
    const successMsg =
      'Texto copiado! Cole no seu story ou post do Instagram 📱';
    this._copyToClipboard(message, successMsg);
  },

  // Share on Facebook
  facebook() {
    const url = this._buildFacebookURL();
    this._openInNewWindow(url, 'width=600,height=400');
  },

  // Copy link to clipboard
  copyLink() {
    const url = CONFIG.share.baseUrl;
    const successMsg = 'Link copiado! Compartilhe com quem você ama ❤️';
    this._copyToClipboard(url, successMsg);
  },

  // Private Methods
  _createWhatsAppMessage() {
    const hashtags = this._formatHashtags();
    const url = CONFIG.share.baseUrl;

    return `🙏 Acabei de ter uma experiência transformadora! Descobri o amor incondicional de Deus através desta conversa especial. Que tal você também conhecer mais sobre o plano de salvação?\n\n✨ Acesse: ${url}\n\n${hashtags}`;
  },

  _createInstagramMessage() {
    const hashtags = this._formatHashtags();

    return `🙏 Acabei de ter uma experiência transformadora! Descobri o amor incondicional de Deus através desta conversa especial.\n\n✨ Link na bio ou acesse: evangelismo.netlify.app\n\n${hashtags} #Evangelismo #Deus #Cristo`;
  },

  _formatHashtags() {
    return CONFIG.share.hashtags.map(tag => `#${tag}`).join(' ');
  },

  _buildWhatsAppURL(message) {
    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  },

  _buildFacebookURL() {
    const url = CONFIG.share.baseUrl;
    return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  },

  _openInNewWindow(url, features = '_blank') {
    window.open(url, '_blank', features);
  },

  _copyToClipboard(text, successMessage) {
    if (this._isClipboardSupported()) {
      this._copyWithModernAPI(text, successMessage);
    } else {
      this._copyWithFallback(text, successMessage);
    }
  },

  _isClipboardSupported() {
    return navigator.clipboard && window.isSecureContext;
  },

  async _copyWithModernAPI(text, successMessage) {
    try {
      await navigator.clipboard.writeText(text);
      this._showSuccessMessage(successMessage);
    } catch (error) {
      this._copyWithFallback(text, successMessage);
    }
  },

  _copyWithFallback(text, successMessage) {
    const textArea = this._createTemporaryTextArea(text);

    try {
      this._selectAndCopy(textArea);
      this._showSuccessMessage(successMessage);
    } catch (error) {
      this._showErrorMessage();
    } finally {
      this._removeTemporaryElement(textArea);
    }
  },

  _createTemporaryTextArea(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    return textArea;
  },

  _selectAndCopy(textArea) {
    textArea.focus();
    textArea.select();
    document.execCommand('copy');
  },

  _removeTemporaryElement(element) {
    document.body.removeChild(element);
  },

  _showSuccessMessage(message) {
    alert(message);
    Effects.vibrateDevice();
  },

  _showErrorMessage() {
    alert('Não foi possível copiar. Tente novamente.');
  },
};

// Global functions for HTML onclick events
window.shareWhatsApp = () => Share.whatsApp();
window.shareInstagram = () => Share.instagram();
window.shareFacebook = () => Share.facebook();
window.copyLink = () => Share.copyLink();
