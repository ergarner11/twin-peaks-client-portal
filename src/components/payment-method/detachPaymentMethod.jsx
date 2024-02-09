import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';

import http from '../../services/httpService';

import ButtonPanel from '../common/buttonPanel';

import { formatPaymentMethod } from '../../util';

function DetachPaymentMethod({ clientId, paymentMethod, refreshPaymentMethods, handleClose }) {
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async () => {
    await http.post('/client/detachPaymentMethod', {
      clientId,
      paymentMethodId: paymentMethod.id,
    });
    await refreshPaymentMethods();
  };

  return (
    <Modal show={true} onHide={handleClose} centered>
      <form>
        {errorMessage && <p className="error">{errorMessage}</p>}
        <p className="sura font-16 fw-bolder mb-4">
          Are you sure you want to delete <nobr>{formatPaymentMethod(paymentMethod)}</nobr>?
        </p>
        <p className="sura font-16">
          It will no longer be available for any payments on this account.
        </p>
        <ButtonPanel
          primaryIsError={true}
          primaryButtonText="Yes, Delete"
          secondaryButtonText="No, Cancel"
          handleCancel={handleClose}
          handleSubmit={handleSubmit}
          handleErrorMessage={setErrorMessage}
        />
      </form>
    </Modal>
  );
}

export default DetachPaymentMethod;
