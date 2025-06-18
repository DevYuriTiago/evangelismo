/* ========================================
   PHONE MODULE
   Clean Code Architecture - Evangelismo Online
   ======================================== */

window.Phone = {
  // Get phone input value
  getInputValue() {
    const input = document.getElementById('phone');
    return input ? input.value.trim() : '';
  },

  // Show validation error
  showError() {
    alert('Por favor, digite um telefone válido ou deixe em branco.');
    const input = document.getElementById('phone');
    if (input) {input.focus();}
  },

  // Validate Brazilian phone number
  isValid(phone) {
    if (!phone) {return true;} // Optional field

    const numbers = this._extractNumbers(phone);

    return this._hasValidLength(numbers) && this._hasValidDDD(numbers);
  },

  // Format phone number automatically
  formatNumber(input) {
    const value = this._extractNumbers(input.value);
    const limitedValue = this._limitDigits(value);
    const formattedValue = this._applyFormat(limitedValue);

    input.value = formattedValue;
  },

  // Check if key is allowed (numbers and control keys)
  isAllowedKey(evt) {
    const charCode = evt.which || evt.keyCode;

    return (
      this._isControlKey(charCode) ||
      this._isShortcutKey(evt, charCode) ||
      this._isNumberKey(charCode)
    );
  },

  // Private Methods
  _extractNumbers(value) {
    return value.replace(/\D/g, '');
  },

  _hasValidLength(numbers) {
    return numbers.length >= 10 && numbers.length <= 11;
  },

  _hasValidDDD(numbers) {
    const ddd = parseInt(numbers.substring(0, 2));
    const { min, max } = CONFIG.validation.dddRange;
    return ddd >= min && ddd <= max;
  },

  _limitDigits(value) {
    const maxLength = 11; // 2 DDD + 9 number
    return value.length > maxLength ? value.substring(0, maxLength) : value;
  },

  _applyFormat(value) {
    if (value.length <= 2) {
      return this._formatDDD(value);
    } else if (value.length <= 3) {
      return this._formatDDDWithFirstDigit(value);
    } else if (value.length <= 7) {
      return this._formatPartialNumber(value);
    } else {
      return this._formatFullNumber(value);
    }
  },

  _formatDDD(value) {
    return value.replace(/(\d{0,2})/, '($1');
  },

  _formatDDDWithFirstDigit(value) {
    return value.replace(/(\d{2})(\d{0,1})/, '($1) $2');
  },

  _formatPartialNumber(value) {
    return value.replace(/(\d{2})(\d{1})(\d{0,4})/, '($1) $2.$3');
  },

  _formatFullNumber(value) {
    return value.replace(/(\d{2})(\d{1})(\d{4})(\d{0,4})/, '($1) $2.$3-$4');
  },

  _isControlKey(charCode) {
    const controlKeys = [8, 9, 27, 13, 46]; // backspace, tab, escape, enter, delete
    return controlKeys.indexOf(charCode) !== -1;
  },

  _isShortcutKey(evt, charCode) {
    const shortcuts = [65, 67, 86, 88]; // Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    return evt.ctrlKey && shortcuts.includes(charCode);
  },

  _isNumberKey(charCode) {
    return charCode >= 48 && charCode <= 57; // 0-9
  },
};

// Global functions for HTML events
window.formatPhoneNumber = input => Phone.formatNumber(input);
window.isNumberKey = evt => Phone.isAllowedKey(evt);
window.isValidBrazilianPhone = phone => Phone.isValid(phone);
