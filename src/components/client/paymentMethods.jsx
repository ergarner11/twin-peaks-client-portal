import React, { useState } from 'react';

import PaymentMethodWidget from '../payment-method/paymentMethodWidget';

function PaymentMethods({ clientId }) {
  const [errorMessage, setErrorMessage] = useState('');

  return (
    <div className="content-panel">
      {!clientId && <i className="flex-centered h-100 fa fa-circle-notch fa-spin fa-2x subtle" />}
      {clientId && (
        <React.Fragment>
          {errorMessage && <p className="error">{errorMessage}</p>}
          <PaymentMethodWidget
            className="m-auto"
            clientId={clientId}
            masterCopy={true}
            handleErrorMessage={setErrorMessage}
            handlePaymentMethodChange={() => {}}
          />
        </React.Fragment>
      )}
    </div>
  );
}

export default PaymentMethods;
