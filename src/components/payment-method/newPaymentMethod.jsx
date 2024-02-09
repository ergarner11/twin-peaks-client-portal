import React, { useState, useEffect } from 'react';
import { PaymentElement, Elements, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Modal from 'react-bootstrap/Modal';

import http from '../../services/httpService';

import Icon from '../common/icon';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function AddStoredPaymentMethod({ refreshPaymentMethods }) {
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

    let result = await stripe.confirmSetup({
      elements,
      redirect: 'if_required',
    });

    if (result.error) {
      setIsSaving(false);
      setErrorMessage(result.error.message);
      return;
    }

    refreshPaymentMethods(result.setupIntent.payment_method);
  };

  return (
    <div>
      {errorMessage && <p className="error">{errorMessage}</p>}
      <div className="d-flex flex-column mt-3">
        <PaymentElement />
        <button
          className="btn-rounded-primary flex-centered p-2 mt-4"
          onClick={handleSubmit}
          disabled={isSaving}
        >
          {isSaving && <i className="fa fa-circle-notch fa-spin" />}Save
        </button>
      </div>
    </div>
  );
}

function NewPaymentMethod({ client, refreshPaymentMethods, handleClose }) {
  const [clientSecret, setClientSecret] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const getClientSecret = async () => {
      try {
        const response = await http.get(`/client/getClientSecret?client_id=${client.id}`);
        setClientSecret(response.data);
      } catch (error) {
        setErrorMessage(error.response.data.message);
      }
    };

    getClientSecret();
  }, [client.id]);

  return (
    <Modal className="new-payment-method background-gray" show={true} onHide={handleClose} centered>
      <div className="d-flex w-auto align-items-end mt-4 mb-2 me-3 p-0">
        <button className="h-auto" onClick={handleClose}>
          <Icon name="close" />
        </button>
      </div>
      <div className="pt-2">
        {errorMessage && <p className="error input-width">{errorMessage}</p>}
        <h2>New Payment Method</h2>
        <div className="w-100 mt-3">
          {clientSecret && (
            <div className={`add-card p-4 box-shadow rounded background-white`}>
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret: clientSecret,
                }}
              >
                <AddStoredPaymentMethod refreshPaymentMethods={refreshPaymentMethods} />
              </Elements>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default NewPaymentMethod;
