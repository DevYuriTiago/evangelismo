/* ========================================
   JOURNEY MODULE
   Clean Code Architecture - Evangelismo Online
   ======================================== */

window.Journey = {
  // Start the evangelism journey
  start() {
    const nameInput = document.getElementById('userName');
    const name = nameInput.value.trim();

    if (!this._validateName(name)) {
      this._showNameError(nameInput);
      return;
    }

    this._initializeJourney(name);
    this.navigateToCard(2);
  },

  // Navigate to specific card
  navigateToCard(cardNumber) {
    const currentCard = this._getCurrentCard();
    if (!currentCard) {return;}

    this._transitionCards(currentCard, cardNumber);
    Database.saveJourneyStep(`card${cardNumber}`);
  },

  // Handle Jesus acceptance
  acceptJesus() {
    Database.saveDecision('accepted');
    this._showCelebration();
    Effects.createConfetti();
  },

  // Handle decision decline with respect
  showRespect() {
    Database.saveDecision('declined');
    this._transitionToSpecialCard('respect');
  },

  // Finalize journey with phone
  finalizePage() {
    const phone = Phone.getInputValue();

    if (phone && !Phone.isValid(phone)) {
      Phone.showError();
      return;
    }

    Database.savePhone(phone);
    this._showFinalCard();
  },

  // Skip phone collection
  skipPhone() {
    Database.savePhone(null);
    this._showFinalCard();
  },

  // Restart entire journey
  restart() {
    this._resetState();
    this._resetDOM();
    this._showFirstCard();
  },

  // Private Methods
  _validateName(name) {
    return name && name.length >= CONFIG.validation.minNameLength;
  },

  _showNameError(input) {
    alert('Por favor, digite seu nome para continuar.');
    input.focus();
  },

  _initializeJourney(name) {
    AppState.setUserName(name);
    AppState.initializeUserData();
  },

  _getCurrentCard() {
    return document.querySelector('.card:not(.hidden)');
  },

  _transitionCards(currentCard, cardNumber) {
    this._prepareCardExit(currentCard);

    setTimeout(() => {
      this._hideCard(currentCard);
      this._showCard(cardNumber);
      this._scrollToTop();
    }, CONFIG.animations.exitDelay);
  },

  _prepareCardExit(card) {
    card.classList.remove('card-enter', 'card-exit');
    card.offsetHeight; // Force reflow
    card.classList.add('card-exit');
  },

  _hideCard(card) {
    card.classList.add('hidden');
    card.classList.remove('card-exit', 'card-enter');
  },

  _showCard(cardNumber) {
    const nextCard = document.getElementById(`card${cardNumber}`);
    if (!nextCard) {return;}

    this._prepareCardEntry(nextCard);
    this._animateCardEntry(nextCard);
  },

  _prepareCardEntry(card) {
    card.classList.remove('card-enter', 'card-exit');
    card.offsetHeight; // Force reflow
    card.classList.remove('hidden');
  },

  _animateCardEntry(card) {
    card.classList.add('card-enter');

    setTimeout(() => {
      card.classList.remove('card-enter');
    }, CONFIG.animations.cardTransition);
  },

  _scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  _showCelebration() {
    this._transitionToSpecialCard('card9');
  },

  _transitionToSpecialCard(cardId) {
    const currentCard = this._getCurrentCard();
    if (!currentCard) {return;}

    this._prepareCardExit(currentCard);

    setTimeout(() => {
      this._hideCard(currentCard);
      this._showSpecialCard(cardId);
      this._scrollToTop();
    }, CONFIG.animations.exitDelay);
  },

  _showSpecialCard(cardId) {
    const specialCard = document.getElementById(cardId);
    if (!specialCard) {return;}

    this._prepareCardEntry(specialCard);
    this._animateCardEntry(specialCard);
  },

  _showFinalCard() {
    this._transitionToSpecialCard('card-final');
    Effects.createMultipleConfetti();
  },

  _resetState() {
    AppState.reset();
  },

  _resetDOM() {
    this._hideAllCards();
    this._clearInputs();
  },

  _hideAllCards() {
    document.querySelectorAll('.card').forEach(card => {
      card.classList.add('hidden');
      card.classList.remove('card-enter', 'card-exit');
    });
  },

  _clearInputs() {
    document.getElementById('userName').value = '';
    document.getElementById('phone').value = '';
  },

  _showFirstCard() {
    const firstCard = document.getElementById('card1');
    firstCard.classList.remove('hidden');
    firstCard.classList.add('card-enter');

    setTimeout(() => {
      firstCard.classList.remove('card-enter');
    }, 700);

    this._scrollToTop();
  },
};

// Global functions for HTML onclick events
window.startJourney = () => Journey.start();
window.nextCard = cardNumber => Journey.navigateToCard(cardNumber);
window.acceptJesus = () => Journey.acceptJesus();
window.showRespect = () => Journey.showRespect();
window.finalizePage = () => Journey.finalizePage();
window.skipPhone = () => Journey.skipPhone();
window.restartJourney = () => Journey.restart();
