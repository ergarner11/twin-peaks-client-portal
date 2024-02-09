import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';

import http from '../../services/httpService';

import ButtonPanel from '../common/buttonPanel';

import PaymentMethodWidget from '../payment-method/paymentMethodWidget';

function UpdatePaymentMethod({ contract, handleClose }) {
  const [paymentMethod, setPaymentMethod] = useState({ isStored: 'Y', isPreview: 'N' });

  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setErrorMessage('');

    const params = {
      contractId: contract.id,
      paymentMethodId: paymentMethod.id,
    };

    await http.post('/healthPlan/updatePaymentMethod', params);
    navigate(0);
  };

  return (
    <Modal show={true} onHide={handleClose} centered>
      <form>
        {errorMessage && <p className="error">{errorMessage}</p>}
        <h2 className="mb-3">Monthly Payment Method</h2>
        <PaymentMethodWidget
          clientId={contract.client_id}
          selectedPaymentMethod={contract.currentPaymentMethod}
          displayStoredOnly={true}
          handleErrorMessage={setErrorMessage}
          handlePaymentMethodChange={setPaymentMethod}
        />
        <ButtonPanel
          primaryButtonText="Update Payment Method"
          handleCancel={handleClose}
          handleSubmit={handleSubmit}
          handleErrorMessage={setErrorMessage}
        />
      </form>
    </Modal>
  );
}

export default UpdatePaymentMethod;
