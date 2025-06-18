/* ========================================
   DATABASE MODULE
   Clean Code Architecture - Evangelismo Online
   ======================================== */

window.Database = {
  // Initialize Supabase Connection
  async initialize() {
    try {
      if (this._isConfigValid()) {
        const { createClient } = supabase;
        const client = createClient(CONFIG.supabase.url, CONFIG.supabase.key, {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
          global: {
            headers: { 'X-Client-Info': 'evangelismo-online-v1' },
          },
        });

        AppState.setSupabaseClient(client);
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Erro ao conectar com Supabase:', error);
      return false;
    }
  },

  // Save Journey Step
  async saveJourneyStep(step) {
    const userData = AppState.getUserData();
    userData.step = step;
    AppState.setUserData(userData);

    return await this.saveToSupabase(userData);
  },

  // Save Decision
  async saveDecision(decision) {
    const userData = AppState.getUserData();
    userData.decision = decision;
    userData[`${decision}_at`] = new Date().toISOString();
    AppState.setUserData(userData);

    return await this.saveToSupabase(userData);
  },

  // Save Phone
  async savePhone(phone) {
    const userData = AppState.getUserData();
    userData.phone = phone;
    userData.completed_at = new Date().toISOString();
    AppState.setUserData(userData);

    return await this.saveToSupabase(userData);
  },

  // Main Save Function
  async saveToSupabase(data) {
    const client = AppState.getSupabaseClient();

    if (!client) {
      return this._simulateSuccess(data);
    }

    if (!this._validateData(data)) {
      return false;
    }

    try {
      const recordData = await this._prepareRecordData(data);
      const recordId = AppState.getUserRecordId();

      if (!recordId) {
        return await this._createRecord(client, recordData);
      } else {
        return await this._updateRecord(client, recordData, recordId);
      }
    } catch (error) {
      return false; // Silent failure
    }
  },

  // Get User IP
  async getUserIP() {
    try {
      const response = await fetch(CONFIG.api.ipService);
      const data = await response.json();
      return data.ip;
    } catch (error) {
      return null; // Silent failure
    }
  },

  // Private Methods
  _isConfigValid() {
    return (
      CONFIG.supabase.url !== 'YOUR_SUPABASE_URL' &&
      CONFIG.supabase.key !== 'YOUR_SUPABASE_ANON_KEY'
    );
  },

  _simulateSuccess(data) {
    console.log('💾 Dados que seriam salvos (Supabase não configurado):', data);
    return true;
  },

  _validateData(data) {
    if (
      !data.name ||
      data.name.trim().length < CONFIG.validation.minNameLength
    ) {
      console.error('❌ Nome é obrigatório e deve ter pelo menos 2 caracteres');
      return false;
    }
    return true;
  },

  async _prepareRecordData(data) {
    const userIP = await this.getUserIP();

    return {
      name: data.name.trim(),
      phone: data.phone ? data.phone.trim() : null,
      decision: data.decision || null,
      step: data.step || 'started',
      started_at: data.started_at,
      accepted_at: data.accepted_at || null,
      declined_at: data.declined_at || null,
      completed_at: data.completed_at || null,
      ip_address: userIP,
      user_agent: navigator.userAgent.substring(0, 500),
    };
  },

  async _createRecord(client, recordData) {
    const response = await client
      .from('evangelismo_leads')
      .insert([recordData])
      .select();

    if (response.error) {
      return false;
    }

    if (response.data && response.data.length > 0) {
      AppState.setUserRecordId(response.data[0].id);
    }

    return true;
  },

  async _updateRecord(client, recordData, recordId) {
    const response = await client
      .from('evangelismo_leads')
      .update(recordData)
      .eq('id', recordId)
      .select();

    return !response.error;
  },
};
