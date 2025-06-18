/* ========================================
   STATE MANAGEMENT MODULE
   Clean Code Architecture - Evangelismo Online
   ======================================== */

window.AppState = {
  // Private state
  _data: {
    userName: '',
    userData: {},
    userRecordId: null,
    supabaseClient: null,
  },

  // User Name Management
  getUserName() {
    return this._data.userName;
  },

  setUserName(name) {
    this._data.userName = name;
    this.updateUserNameInDOM();
  },

  updateUserNameInDOM() {
    const elements = document.querySelectorAll('.user-name');
    elements.forEach(element => {
      element.textContent = this._data.userName;
    });
  },

  // User Data Management
  getUserData() {
    return { ...this._data.userData };
  },

  setUserData(data) {
    this._data.userData = { ...data };
  },

  updateUserData(updates) {
    this._data.userData = { ...this._data.userData, ...updates };
  },

  // User Record ID Management
  getUserRecordId() {
    return this._data.userRecordId;
  },

  setUserRecordId(id) {
    this._data.userRecordId = id;
  },

  // Supabase Client Management
  getSupabaseClient() {
    return this._data.supabaseClient;
  },

  setSupabaseClient(client) {
    this._data.supabaseClient = client;
  },

  // State Reset
  reset() {
    this._data = {
      userName: '',
      userData: {},
      userRecordId: null,
      supabaseClient: this._data.supabaseClient, // Preserve Supabase client
    };
    this.updateUserNameInDOM();
  },

  // Initialize User Data
  initializeUserData() {
    this._data.userData = {
      name: this._data.userName,
      started_at: new Date().toISOString(),
      step: 'started',
    };
  },
};
