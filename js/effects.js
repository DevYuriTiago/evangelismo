/* ========================================
   EFFECTS MODULE
   Clean Code Architecture - Evangelismo Online
   ======================================== */

window.Effects = {
  // Create confetti animation
  createConfetti() {
    const confettiCount = 50;
    const colors = this._getConfettiColors();

    for (let i = 0; i < confettiCount; i++) {
      this._createSingleConfetti(colors);
    }
  },

  // Create multiple confetti bursts
  createMultipleConfetti() {
    this.createConfetti();
    setTimeout(() => this.createConfetti(), 1000);
    setTimeout(() => this.createConfetti(), 2000);
  },

  // Vibrate device for feedback
  vibrateDevice() {
    if (this._isVibrationSupported()) {
      navigator.vibrate(100);
    }
  },

  // Setup dynamic CSS animations
  setupDynamicStyles() {
    const style = this._createStyleElement();
    style.textContent = this._getConfettiCSS();
    document.head.appendChild(style);
  },

  // Setup page load animation
  setupPageLoadAnimation() {
    this._hideBodyInitially();

    setTimeout(() => {
      this._animateBodyEntry();
    }, 100);
  },

  // Private Methods
  _getConfettiColors() {
    return [
      '#ff6b6b',
      '#4ecdc4',
      '#45b7d1',
      '#f9ca24',
      '#f0932b',
      '#eb4d4b',
      '#6c5ce7',
    ];
  },

  _createSingleConfetti(colors) {
    const confetti = this._createConfettiElement(colors);
    this._positionConfetti(confetti);
    this._animateConfetti(confetti);
    this._scheduleConfettiRemoval(confetti);
  },

  _createConfettiElement(colors) {
    const confetti = document.createElement('div');
    this._styleConfettiElement(confetti, colors);
    document.body.appendChild(confetti);
    return confetti;
  },

  _styleConfettiElement(confetti, colors) {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    Object.assign(confetti.style, {
      position: 'fixed',
      width: '10px',
      height: '10px',
      backgroundColor: randomColor,
      borderRadius: '50%',
      zIndex: '1000',
      pointerEvents: 'none',
    });
  },

  _positionConfetti(confetti) {
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.top = '-10px';
  },

  _animateConfetti(confetti) {
    const duration = Math.random() * 3 + 2; // 2-5 seconds
    confetti.style.animation = `confettiFall ${duration}s linear forwards`;
  },

  _scheduleConfettiRemoval(confetti) {
    setTimeout(() => {
      if (confetti.parentNode) {
        confetti.remove();
      }
    }, CONFIG.animations.confettiDuration);
  },

  _isVibrationSupported() {
    return navigator.vibrate !== undefined;
  },

  _createStyleElement() {
    return document.createElement('style');
  },

  _getConfettiCSS() {
    return `
            @keyframes confettiFall {
                0% {
                    transform: translateY(-10px) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: translateY(100vh) rotate(720deg);
                    opacity: 0;
                }
            }
        `;
  },

  _hideBodyInitially() {
    document.body.style.opacity = '0';
  },

  _animateBodyEntry() {
    Object.assign(document.body.style, {
      transition: 'opacity 0.5s ease-in',
      opacity: '1',
    });
  },
};
