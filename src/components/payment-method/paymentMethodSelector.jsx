import React from 'react';

import NewOneTimeCard from './newOneTimeCard';
import PaymentMethod from './paymentMethod';

import Icon from '../common/icon';

import Constants from '../../constants';
import { NotMobile } from '../common/responsive';

function PaymentMethodSelector({
  hideLabel,
  labelText,
  displayStoredOnly,
  paymentMethods,
  selectedPaymentMethod,
  updatePaymentMethod,
  handleAddNewPaymentMethod,
}) {
  if (paymentMethods) {
    paymentMethods = paymentMethods.sort((a, b) => a.category.localeCompare(b.category));
  }

  const handleChange = ({ target }) => {
    let paymentMethod;
    if (target.name === 'paymentMethod') {
      paymentMethod = paymentMethods.find(t => t.id === target.value);
    } else if (target.name === 'isStored') {
      paymentMethod = { isStored: target.value, isPreview: 'N' };
      if (target.value === 'N') {
        paymentMethod.category = Constants.CARD;
      }
    }
    paymentMethod.collectionConfirmed = 'N';
    updatePaymentMethod(paymentMethod);
  };

  return (
    <React.Fragment>
      {!hideLabel && (
        <label className="mb-3" htmlFor="paymentMethods">
          {labelText ? labelText : 'Select Payment Method:'}
        </label>
      )}

      {!displayStoredOnly && (
        <div className="radio-line mb-3">
          <input
            type="radio"
            id="isStored"
            name="isStored"
            checked={selectedPaymentMethod.isStored === 'Y'}
            value="Y"
            onChange={handleChange}
          />
          <label htmlFor="isStored">
            Use a <strong>stored</strong> payment method:
          </label>
        </div>
      )}

      {selectedPaymentMethod.isStored === 'Y' && (
        <div id="paymentMethods" className="ms-4">
          {paymentMethods
            .filter(t => t.category === Constants.CARD || t.category === Constants.ACH)
            .map((t, i) => {
              return (
                <div
                  key={i}
                  className={`payment-method ${
                    t.id === selectedPaymentMethod.id ? ' selected' : ''
                  }`}
                >
                  <div className="payment-method-info">
                    <input
                      type="radio"
                      id={t.id}
                      name="paymentMethod"
                      checked={t.id === selectedPaymentMethod.id}
                      value={t.id}
                      onChange={handleChange}
                    />
                    <label htmlFor={t.id}>
                      <NotMobile>
                        <Icon name="check_mark" className="check-mark" />
                      </NotMobile>
                      <PaymentMethod paymentMethod={t} />
                    </label>
                  </div>
                </div>
              );
            })}
          <div className="payment-method" onClick={handleAddNewPaymentMethod}>
            <div className="add-payment-method">
              <Icon name="add" />
              New Payment Method
            </div>
          </div>
        </div>
      )}

      {!displayStoredOnly && (
        <div className="radio-line my-3">
          <input
            type="radio"
            id="isNotStored"
            name="isStored"
            checked={selectedPaymentMethod.isStored === 'N'}
            value="N"
            onChange={handleChange}
          />
          <label htmlFor="isNotStored">
            Use a <strong>one-time</strong> payment method
          </label>
        </div>
      )}

      {selectedPaymentMethod.isStored === 'N' && selectedPaymentMethod.isPreview === 'N' && (
        <div className="ms-4">
          <NewOneTimeCard updatePaymentMethod={updatePaymentMethod} />
        </div>
      )}

      {selectedPaymentMethod.isStored === 'N' && selectedPaymentMethod.isPreview === 'Y' && (
        <div className="flex-row-aligned justify-content-between ms-4">
          <div className="payment-method selected py-2 ps-2 pe-4 m-0">
            <PaymentMethod paymentMethod={selectedPaymentMethod} />
          </div>
          <button
            className="btn-text-primary align-self-end mb-2 ms-2"
            type="button"
            onClick={() =>
              updatePaymentMethod({
                category: Constants.CARD,
                isStored: 'N',
                isPreview: 'N',
                collectionConfirmed: 'N',
              })
            }
          >
            Replace
          </button>
        </div>
      )}
    </React.Fragment>
  );
}

export default PaymentMethodSelector;
