import React, { useState } from 'react';

import BillingActivity from '../contract/billingActivity';
import Contract from '../contract/contract';

import { Mobile, NotMobile } from '../common/responsive';

import { formatDate } from '../../util';
import Constants from '../../constants';

import '../../styles/components/contract.scss';

function ClientPaymentPlans({ client, clientIsCurrent, isLoading }) {
  const CURRENT_PAYMENT_PLANS = 0;
  const PREVIOUS_PAYMENT_PLANS = 1;

  const [selectedTabIndex, setSelectedTabIndex] = useState(CURRENT_PAYMENT_PLANS);
  const [tabInfo, setTabInfo] = useState([
    { text: 'Current Payment Plans', selected: 'Y', customClass: 'no-border-radius-left' },
    { text: 'Previous Payment Plans', selected: 'N' },
  ]);
  const { currentPaymentPlans, previousPaymentPlans } = client;

  const handleSelectNewTab = selectedTabIndex => {
    const newTabInfo = [...tabInfo];
    newTabInfo.forEach(t => (t.selected = 'N'));
    newTabInfo[selectedTabIndex].selected = 'Y';
    setTabInfo(newTabInfo);
    setSelectedTabIndex(selectedTabIndex);
  };

  return (
    <div className="content-panel">
      {isLoading && <i className="flex-centered h-100 fa fa-circle-notch fa-spin fa-2x subtle" />}
      {!isLoading && (
        <React.Fragment>
          <h2 className="mb-4">Payment Plans</h2>
          {selectedTabIndex === CURRENT_PAYMENT_PLANS && (
            <React.Fragment>
              {currentPaymentPlans.length > 0 &&
                currentPaymentPlans.map(contract => (
                  <Contract
                    key={contract.id}
                    contract={contract}
                    clientIsCurrent={clientIsCurrent}
                  />
                ))}

              {currentPaymentPlans.length === 0 && (
                <p className="message my-4 ms-2">No Payment Plans to display</p>
              )}

              {previousPaymentPlans.length > 0 && (
                <button
                  className="btn-text-primary mt-4 ms-2"
                  onClick={() => handleSelectNewTab(PREVIOUS_PAYMENT_PLANS)}
                >
                  View Previous Payment Plans
                </button>
              )}
            </React.Fragment>
          )}
          {selectedTabIndex === PREVIOUS_PAYMENT_PLANS && (
            <React.Fragment>
              <h2 className="mt-4 ms-2">Previous Payment Plans</h2>
              {previousPaymentPlans.map(t => {
                const endingReason =
                  Number(t.contract_status_id) === Constants.CANCELLED
                    ? 'Cancelled'
                    : Number(t.contract_status_id) === Constants.COLLECTIONS
                    ? 'Terminated'
                    : 'Expired';
                return (
                  <div className="mt-4 p-4 background-white rounded box-shadow" key={t.id}>
                    <Mobile>
                      <div className="pb-3">
                        <h3 className="d-flex flex-column">
                          <span>Payment Plan - {endingReason}</span>
                          <span className="font-14 my-2">
                            ({formatDate(t.start_date)} - {formatDate(t.end_date)})
                          </span>
                        </h3>
                      </div>
                    </Mobile>
                    <NotMobile>
                      <div className="flex-row-aligned justify-content-between pb-3">
                        <h3>
                          Payment Plan - {endingReason} ({formatDate(t.start_date)} -{' '}
                          {formatDate(t.end_date)})
                        </h3>
                      </div>
                    </NotMobile>
                    <BillingActivity contract={t} />
                  </div>
                );
              })}
              <button
                className="btn-text-primary mt-4 ms-2"
                onClick={() => handleSelectNewTab(CURRENT_PAYMENT_PLANS)}
              >
                View Current Payment Plans
              </button>
            </React.Fragment>
          )}
        </React.Fragment>
      )}
    </div>
  );
}

export default ClientPaymentPlans;
