import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';

import http from '../../services/httpService';

import ButtonPanel from '../common/buttonPanel';
import InputNumber from '../common/inputNumber';
import InputSelect from '../common/inputSelect';

function EditPaymentMethod({ clientId, paymentMethodId, refreshPaymentMethods, handleClose }) {
  const [expirationMonth, setExpirationMonth] = useState(1);
  const [expirationYear, setExpirationYear] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async () => {
    setErrorMessage('');

    const params = {
      clientId,
      paymentMethodId,
      expirationMonth,
      expirationYear,
    };

    await http.post('/client/editPaymentMethod', params);
    await refreshPaymentMethods();
  };

  return (
    <Modal show={true} onHide={handleClose} centered>
      <form>
        {errorMessage && <p className="error input-width">{errorMessage}</p>}
        <h2 className="mb-2">Card Expiration Details</h2>
        <InputSelect
          className="m-0 mt-3"
          name="roleId"
          value={expirationMonth}
          label="Expiration Month"
          optionConfig={[
            { name: 'January', value: 1 },
            { name: 'February', value: 2 },
            { name: 'March', value: 3 },
            { name: 'April', value: 4 },
            { name: 'May', value: 5 },
            { name: 'June', value: 6 },
            { name: 'July', value: 7 },
            { name: 'August', value: 8 },
            { name: 'September', value: 9 },
            { name: 'October', value: 10 },
            { name: 'November', value: 11 },
            { name: 'December', value: 12 },
          ]}
          onChange={setExpirationMonth}
        />
        <InputNumber
          className="m-0 mt-3"
          name="expirationYear"
          value={expirationYear}
          label="Expiration Year (ex: 2023)"
          onChange={setExpirationYear}
        />
        <ButtonPanel
          primaryButtonText="Update Card"
          handleCancel={handleClose}
          handleSubmit={handleSubmit}
          handleErrorMessage={setErrorMessage}
        />
      </form>
    </Modal>
  );
}

export default EditPaymentMethod;
