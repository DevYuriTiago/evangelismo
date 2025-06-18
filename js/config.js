/* ========================================
   CONFIGURATION MODULE
   Clean Code Architecture - Evangelismo Online
   ======================================== */

window.CONFIG = {
  // Supabase Configuration
  supabase: {
    url: 'https://zgdmkokrmchwfvtbcbbw.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnZG1rb2tybWNod2Z2dGJjYmJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyNTUyNjcsImV4cCI6MjA2NTgzMTI2N30.JpRqsTCvkc2fN4SoJI6Rbjsw7f4BT1IJu9IpOK5avNE',
  },

  // Sharing Configuration
  share: {
    baseUrl: window.location.href,
    title: 'Uma Decisão que Muda Tudo',
    description:
      'Descubra o amor incondicional de Deus. Uma conversa que pode mudar sua vida para sempre.',
    hashtags: [
      'Jesus',
      'Salvação',
      'VidaEterna',
      'PalavraDaFé',
      'Evangelismo',
      'Deus',
      'Cristo',
    ],
  },

  // Animation Configuration
  animations: {
    cardTransition: 600,
    exitDelay: 400,
    confettiDuration: 5000,
  },

  // Validation Rules
  validation: {
    minNameLength: 2,
    phonePattern: /^\(\d{2}\)\s\d\.\d{4}-\d{4}$/,
    dddRange: { min: 11, max: 99 },
  },

  // API Endpoints
  api: {
    ipService: 'https://api.ipify.org?format=json',
  },
};
