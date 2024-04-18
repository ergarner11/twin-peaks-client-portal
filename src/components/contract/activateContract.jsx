import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';

import http from '../../services/httpService';

import PaymentMethodWidget from '../payment-method/paymentMethodWidget';

import ButtonPanel from '../common/buttonPanel';

import { formatCurrency } from '../../util';

function ActivateContract({ contract, handleClose }) {
  let parsedPreview;

  try {
    parsedPreview = JSON.parse(contract.initial_setup_info);
  } catch (e) {
    parsedPreview = contract.initial_setup_info;
  }

  const endPointName = contract.isHealthPlan ? 'healthPlan' : 'paymentPlan';
  const monthlyPayment = formatCurrency(parsedPreview.monthlyPaymentInfo.amount);

  const [automaticPaymentMethod, setAutomaticPaymentMethod] = useState({
    isStored: 'Y',
    isPreview: 'N',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setErrorMessage('');
    await http.post(`/${endPointName}/activate`, {
      contractId: contract.id,
      automaticPaymentMethodId: automaticPaymentMethod.id,
    });
    navigate(0);
  };

  return (
    <Modal show={true} onHide={handleClose} centered>
      <form>
        {errorMessage && <p className="error">{errorMessage}</p>}

        <h2>Monthly Payments:</h2>
        <p className="mt-1 mb-4 gray">{monthlyPayment} per month</p>
        <PaymentMethodWidget
          clientId={contract.client_id}
          labelText={[
            <span key={0}>
              Select <strong>automatic</strong> payment method:
            </span>,
          ]}
          displayStoredOnly={true}
          selectedPaymentMethod={automaticPaymentMethod}
          handleErrorMessage={setErrorMessage}
          handlePaymentMethodChange={setAutomaticPaymentMethod}
        />
        <ButtonPanel
          primaryButtonText="Save"
          handleCancel={handleClose}
          handleSubmit={handleSubmit}
          handleErrorMessage={setErrorMessage}
          disabled={!automaticPaymentMethod.id}
        />
      </form>
    </Modal>
  );
}

export default ActivateContract;
