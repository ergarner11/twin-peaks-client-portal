import React, { useState } from 'react';

import PaymentMethodWidget from '../payment-method/paymentMethodWidget';

function PaymentMethods({ clientId, isLoading }) {
  const [errorMessage, setErrorMessage] = useState('');

  let content;

  if (!clientId || isLoading) {
    content = <i className="flex-centered h-100 fa fa-circle-notch fa-spin fa-2x subtle" />;
  } else {
    content = (
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
    );
  }

  return <div className="content-panel">{content}</div>;
}

export default PaymentMethods;
