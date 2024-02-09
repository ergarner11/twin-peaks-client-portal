import React from 'react';
import { Mobile, NotMobile } from '../common/responsive';

import PaymentMethod from './paymentMethod';

import Icon from '../common/icon';

import Constants from '../../constants';

function PaymentMethodMaster({
  paymentMethods,
  handleEdit,
  handleDelete,
  handleAddNewPaymentMethod,
}) {
  return (
    <React.Fragment>
      {paymentMethods.map((t, i) => {
        return (
          <React.Fragment key={i}>
            <Mobile>
              <div className="background-white d-flex justify-content-between p-3 mb-2">
                <PaymentMethod paymentMethod={t} />
                <div className="d-flex">
                  {t.category === Constants.CARD && (
                    <button
                      className="blue sura mt-1 align-items-start"
                      onClick={() => handleEdit(t)}
                    >
                      <Icon name="edit" />
                    </button>
                  )}
                  <button
                    className="red sura ms-2 mt-1 align-items-start"
                    onClick={() => handleDelete(t)}
                  >
                    <Icon name="delete" />
                  </button>
                </div>
              </div>
            </Mobile>
            <NotMobile>
              <div className="payment-method justify-content-center w-100">
                <div className="payment-method-info justify-content-between">
                  <PaymentMethod paymentMethod={t} />
                  <div className="d-flex">
                    {t.category === Constants.CARD && (
                      <button className="btn-text-primary" onClick={() => handleEdit(t)}>
                        Edit
                      </button>
                    )}
                    <button className="btn-text-error mx-3" onClick={() => handleDelete(t)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </NotMobile>
          </React.Fragment>
        );
      })}
      {paymentMethods.length === 0 && <p className="font-16 sura">No saved payment methods</p>}
      <button className="btn-text-primary mt-3" onClick={handleAddNewPaymentMethod}>
        <Icon name="add" />
        New Payment Method
      </button>
    </React.Fragment>
  );
}

export default PaymentMethodMaster;
