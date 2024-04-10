import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';

import http from '../../services/httpService';

import PaymentMethodWidget from '../payment-method/paymentMethodWidget';

import ButtonPanel from '../common/buttonPanel';

import { formatCurrency, formatPaymentMethod, validateCurrency } from '../../util';

function OneTimePayment({ balance, clientId, contractId, handleClose }) {
  const [paymentMethod, setPaymentMethod] = useState({ isStored: 'Y', isPreview: 'N' });
  const [fullOrPartial, setFullOrPartial] = useState('full');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [previewPaymentAmount, setPreviewPaymentAmount] = useState(balance);

  const [currentStep, setCurrentStep] = useState('paymentDetails');

  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleFullOrPartialChange = value => {
    setFullOrPartial(value);
    setPaymentAmount(value === 'full' ? balance : 0);
    setPreviewPaymentAmount(value === 'full' ? balance : 0);
  };

  const handlePaymentAmountChange = ({ target }) => {
    if (!validateCurrency(target.value)) {
      return;
    }
    setPaymentAmount(target.value);
    setPreviewPaymentAmount(Math.round(target.value * 100));
  };

  const handleSubmit = async () => {
    setErrorMessage('');

    const params = {
      clientId,
      contractId,
      paymentAmount: previewPaymentAmount,
      paymentMethod: paymentMethod,
    };

    if (currentStep === 'paymentDetails') {
      await http.post('/client/oneTimePayment/validate', params);
      setCurrentStep('preview');
    } else {
      await http.post('/client/oneTimePayment', params);
      setTimeout(() => navigate(0), 3000);
    }
  };

  return (
    <Modal show={true} onHide={handleClose} centered>
      <form>
        {errorMessage && <p className="error">{errorMessage}</p>}
        {currentStep === 'paymentDetails' && (
          <React.Fragment>
            <h2>Make a Payment</h2>
            <span className="fw-bolder font-16 my-2">{`${formatCurrency(balance)} due now`}</span>
            <div className="radio-line align-items-start mb-2">
              <input
                className="mt-2"
                type="radio"
                id="full"
                name="fullOrPartial"
                checked={fullOrPartial === 'full'}
                value="full"
                onChange={({ target }) => handleFullOrPartialChange(target.value)}
              />
              <label className="fw-bolder news-cycle font-16" htmlFor="full">
                Pay Outstanding Balance: {formatCurrency(balance)}
              </label>
            </div>
            <div className="radio-line align-items-start mb-3">
              <input
                className="mt-2"
                type="radio"
                id="partial"
                name="fullOrPartial"
                checked={fullOrPartial === 'partial'}
                value="partial"
                onChange={({ target }) => handleFullOrPartialChange(target.value)}
              />
              <label className="fw-bolder news-cycle font-16" htmlFor="partial">
                Pay a different amount
                {fullOrPartial === 'partial' && (
                  <input
                    className="d-block border-0 mt-1"
                    type="text"
                    id="paymentAmount"
                    name="paymentAmount"
                    value={paymentAmount}
                    onChange={handlePaymentAmountChange}
                    disabled={fullOrPartial === 'full'}
                  />
                )}
              </label>
            </div>
            <PaymentMethodWidget
              clientId={clientId}
              selectedPaymentMethod={paymentMethod}
              handleErrorMessage={setErrorMessage}
              handlePaymentMethodChange={paymentMethod => setPaymentMethod({ ...paymentMethod })}
            />

            <ButtonPanel
              primaryButtonText="Preview Payment"
              handleCancel={handleClose}
              handleSubmit={handleSubmit}
              handleErrorMessage={setErrorMessage}
            />
          </React.Fragment>
        )}

        {currentStep === 'preview' && (
          <React.Fragment>
            <h2>Payment Preview</h2>
            <div className="form-control-read-only mt-3">
              <label className="mb-2" htmlFor="paymentMethod">
                Payment Method:
              </label>
              <p id="paymentMethod">{formatPaymentMethod(paymentMethod)}</p>
            </div>
            <div className="form-control-read-only mt-3">
              <label className="mb-2" htmlFor="paymentAmount">
                Payment Amount:
              </label>
              <p id="paymentAmount">{formatCurrency(previewPaymentAmount)}</p>
            </div>
            <div className="form-control-read-only mt-3">
              <label className="mb-2" htmlFor="newBalance">
                New Outstanding Balance:
              </label>
              <p id="newBalance">
                {fullOrPartial === 'full'
                  ? '$0.00'
                  : formatCurrency(balance - previewPaymentAmount)}
              </p>
            </div>
            <ButtonPanel
              primaryButtonText="Confirm Payment"
              handleCancel={handleClose}
              handleSubmit={handleSubmit}
              handleBack={() => {
                setErrorMessage('');
                setCurrentStep('paymentDetails');
              }}
              handleErrorMessage={setErrorMessage}
            />
          </React.Fragment>
        )}
      </form>
    </Modal>
  );
}

export default OneTimePayment;
