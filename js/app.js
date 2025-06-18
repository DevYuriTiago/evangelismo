/* ========================================
   APP MODULE - MAIN APPLICATION
   Clean Code Architecture - Evangelismo Online
   ======================================== */

window.App = {
  // Initialize the entire application
  async initialize() {
    await this._initializeDatabase();
    this._setupEventListeners();
    this._setupEffects();
    this._logInitializationSuccess();
  },

  // Private Initialization Methods
  async _initializeDatabase() {
    const success = await Database.initialize();
    if (!success) {
      console.warn('⚠️ Supabase não configurado ou falha na conexão');
    }
  },

  _setupEventListeners() {
    this._setupButtonVibration();
    this._setupPageLoadAnimation();
  },

  _setupEffects() {
    Effects.setupDynamicStyles();
  },

  _setupButtonVibration() {
    document.addEventListener('click', e => {
      if (this._isActionButton(e.target)) {
        Effects.vibrateDevice();
      }
    });
  },

  _setupPageLoadAnimation() {
    document.addEventListener('DOMContentLoaded', () => {
      Effects.setupPageLoadAnimation();
    });
  },

  _isActionButton(element) {
    return (
      element.classList.contains('option-btn') ||
      element.classList.contains('share-btn')
    );
  },

  _logInitializationSuccess() {
    console.log('✅ Evangelismo Online iniciado com sucesso!');
  },
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => App.initialize());
} else {
  App.initialize();
}
