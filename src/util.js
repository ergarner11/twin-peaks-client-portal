import moment from 'moment-timezone';

import Constants from './constants';

export const formatCurrency = currency => {
  return isNaN(Number(currency))
    ? ''
    : '$' + (currency / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const formatDate = dateString => {
  return !dateString ? '' : moment(dateString, 'YYYY-MM-DD').utc().format('MM/DD/YYYY');
};

export const formatPaymentMethod = (paymentMethod, isShortened) => {
  if (paymentMethod.category === Constants.CASH) {
    return 'Cash';
  }

  if (paymentMethod.category === Constants.CARE_CREDIT) {
    return 'CareCredit';
  }

  if (paymentMethod.category === Constants.CHECK) {
    return `Check, #${paymentMethod.checkNumber}`;
  }

  if (isShortened) {
    return `x-${paymentMethod.last4}`;
  }

  let paymentMethodString = `${paymentMethod.institutionName} (x-${paymentMethod.last4})`;

  if (paymentMethod.category === Constants.CARD) {
    paymentMethodString += `, ${paymentMethod.expirationDate}`;
  }

  return paymentMethodString;
};

export const validateCurrency = string => {
  return /^(\d{0,3})(\.\d{0,2})?$/.test(string);
};
