import React from 'react';

import Icon from '../common/icon';
import { Mobile, NotMobile } from '../common/responsive';

import { formatPaymentMethod } from '../../util';
import Constants from '../../constants';

function PaymentMethod({ paymentMethod }) {
  const { category, institutionName, last4, expirationDate } = paymentMethod;

  return (
    <div className="d-flex w-auto">
      {category === Constants.CARD && <Icon name="credit_card" className="subtle mt-1" />}
      {category !== Constants.CARD && <Icon name="bank" className="subtle" />}
      <Mobile>
        <div className="d-flex flex-column ms-2">
          <span className="sura font-16">
            {institutionName}, <nobr>x-{last4}</nobr>
          </span>
          {category === Constants.CARD && <span className="sura dark-gray">{expirationDate}</span>}
        </div>
      </Mobile>
      <NotMobile>{formatPaymentMethod(paymentMethod)}</NotMobile>
    </div>
  );
}

export default PaymentMethod;
