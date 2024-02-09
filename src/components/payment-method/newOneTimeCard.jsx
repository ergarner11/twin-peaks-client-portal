import React, { useState } from 'react';
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
  Elements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import Constants from '../../constants';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function AddOneTimeCard({ updatePaymentMethod }) {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (isSaving) return;

    setIsSaving(true);
    setErrorMessage('');

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded
      setErrorMessage('Error. Please contact technical support.');
      setIsSaving(false);
      return;
    }

    let result = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardNumberElement),
    });

    if (result.error) {
      setIsSaving(false);
      setErrorMessage(result.error.message);
      return;
    }

    result.paymentMethod.isStored = 'N';
    result.paymentMethod.isPreview = 'Y';
    result.paymentMethod.category = Constants.CARD;
    result.paymentMethod.last4 = result.paymentMethod.card.last4;
    result.paymentMethod.institutionName = result.paymentMethod.card.brand.replace(
      /\w\S*/g,
      txt => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
    result.paymentMethod.expirationDate = `${result.paymentMethod.card.exp_month}/${result.paymentMethod.card.exp_year}`;
    updatePaymentMethod(result.paymentMethod);
  };

  return (
    <div>
      {errorMessage && <p className="error">{errorMessage}</p>}
      <div className="d-flex flex-column mt-3">
        <div className="form-floating w-100">
          <CardNumberElement
            name="cardNumber"
            options={{
              style: { base: { fontFamily: 'Sura', fontSize: '14px', color: '#3f3f3f' } },
            }}
            className="form-control card-element"
          />
          <label htmlFor="cardNumber">Card Number</label>
        </div>
        <div className="d-flex flex-row justify-content-between w-100">
          <div className="form-floating w-50 mb-0">
            <CardExpiryElement
              name="cardExpiry"
              options={{
                style: { base: { fontFamily: 'Sura', fontSize: '14px', color: '#3f3f3f' } },
              }}
              className="form-control card-element"
            />
            <label htmlFor="cardExpiry">Expiration</label>
          </div>
          <div className="form-floating w-50 mb-0 ms-3">
            <CardCvcElement
              name="cardCvc"
              options={{
                placeholder: '123',
                style: { base: { fontFamily: 'Sura', fontSize: '14px', color: '#3f3f3f' } },
              }}
              className="form-control card-element"
            />
            <label htmlFor="cardCvc">CVC</label>
          </div>
        </div>
        <button
          className="btn-rounded-primary flex-centered p-2 mt-4"
          onClick={handleSubmit}
          disabled={isSaving}
        >
          {isSaving && <i className="fa fa-circle-notch fa-spin" />}Save Card
        </button>
      </div>
    </div>
  );
}

function NewOneTimeCard({ updatePaymentMethod }) {
  return (
    <Elements stripe={stripePromise}>
      <AddOneTimeCard updatePaymentMethod={updatePaymentMethod} />
    </Elements>
  );
}

export default NewOneTimeCard;
