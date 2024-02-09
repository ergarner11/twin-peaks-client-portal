import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';

import moment from 'moment';

import http from '../../services/httpService';

import ButtonPanel from '../common/buttonPanel';
import InputEitherOr from '../common/inputEitherOr';
import PaymentMethodWidget from '../payment-method/paymentMethodWidget';

import { formatCurrency } from '../../util';

function SchedulePayment({ contract, annualParticipationCharge, handleClose }) {
  const [automaticPayment, setAutomaticPayment] = useState(
    !contract.currentPaymentMethod ? 'N' : 'Y'
  );
  const [paymentMethod, setPaymentMethod] = useState(
    contract.currentPaymentMethod ? contract.currentPaymentMethod : { isStored: 'Y' }
  );

  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const renewalDate = moment(contract.start_date).add(1, 'years').format('MM/DD/YYYY');

  const handleAutomaticPaymentChange = value => {
    setAutomaticPayment(value);
    setPaymentMethod(value === 'Y' ? { isStored: 'Y' } : null);
  };

  const handleSubmit = async () => {
    setErrorMessage('');

    const params = {
      contractId: contract.id,
      automaticPayment: automaticPayment,
    };

    if (automaticPayment === 'Y') {
      params.paymentMethodId = paymentMethod.id;
    }

    await http.post('/healthPlan/updateScheduledPayment', params);
    navigate(0);
  };

  return (
    <Modal show={true} onHide={handleClose} centered>
      <form>
        {errorMessage && <p className="error">{errorMessage}</p>}
        <h2 className="mb-3">Upcoming Renewal Payment</h2>
        <React.Fragment>
          <p className="sura font-14 p-3 border rounded mb-3">
            {contract.name}'s Health Plan will renew on {renewalDate}. The Annual Participation
            Charge of {formatCurrency(Number(annualParticipationCharge))} will be due at that time.{' '}
            {automaticPayment === 'N' && (
              <span className="fw-bold">
                For your convenience, we recommend scheduling your payment.
              </span>
            )}
          </p>
          <InputEitherOr
            name="automaticPayment"
            label="Schedule Payment Now?"
            value={automaticPayment}
            option1={{ name: 'Yes', value: 'Y' }}
            option2={{ name: 'No', value: 'N' }}
            onChange={({ target }) => handleAutomaticPaymentChange(target.value)}
          />
          {automaticPayment === 'Y' && (
            <PaymentMethodWidget
              clientId={contract.client_id}
              labelText="Select payment method to be charged on Renewal Date:"
              selectedPaymentMethod={paymentMethod}
              displayStoredOnly={true}
              handleErrorMessage={setErrorMessage}
              handlePaymentMethodChange={setPaymentMethod}
            />
          )}
          {automaticPayment === 'N' && (
            <p className="sura font-14 p-3 border rounded">
              You will be responsible to pay the Annual Participation Charge manually on the Renewal
              Date.
            </p>
          )}
        </React.Fragment>
        <ButtonPanel
          primaryButtonText="Confirm Changes"
          handleCancel={handleClose}
          handleSubmit={handleSubmit}
          handleErrorMessage={setErrorMessage}
        />
      </form>
    </Modal>
  );
}

export default SchedulePayment;
