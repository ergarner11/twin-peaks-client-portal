import React, { useState } from 'react';

import ActivateContract from './activateContract';
import UpdatePaymentMethod from './updatePaymentMethod';

import OneTimePayment from '../client/oneTimePayment';

import Icon from '../common/icon';
import { Mobile, NotMobile } from '../common/responsive';

import { formatDate, formatCurrency } from '../../util';
import Constants from '../../constants';

import '../../styles/components/contract.scss';

function ContractSnapshot({ contract }) {
  const [showActivateContract, setShowActivateContract] = useState(false);
  const [showMakePayment, setShowMakePayment] = useState(false);
  const [showUpdatePaymentMethod, setShowUpdatePaymentMethod] = useState(false);

  const clientOnHold = contract.isClientOnHold && contract.contract_phase !== Constants.FINALIZED;
  const onHold =
    contract.isOnHold ||
    (contract.contract_phase === Constants.FINALIZED && !contract.isCollections);
  const notRenewing =
    contract.isHealthPlan &&
    !contract.renewalInfo.isRenewing &&
    contract.deceased !== 'Y' &&
    contract.contract_phase !== Constants.FINALIZED;
  const contractName = JSON.parse(contract.initial_setup_info).contractName;

  const header = (
    <React.Fragment>
      <Mobile>
        <h2 className={`sura font-16 d-flex flex-column ${!contract.isCurrent ? ' red' : ''}`}>
          <span className="flex-row-aligned mb-1">
            <span className="me-2">
              {contract.isHealthPlan ? `${contractName} Health Plan` : 'Payment Plan'}
            </span>
            {clientOnHold && <Icon name="client_on_hold" />}
            {onHold && <Icon name="on_hold" />}
            {contract.isCollections && <Icon name="collections" />}
            {notRenewing && <Icon name="not_renewing" />}
          </span>
          {!contract.isEmployeePlan && <span>{contract.payment_interval}</span>}
        </h2>
      </Mobile>
      <NotMobile>
        <div className="flex-row-aligned">
          <h2 className={`sura font-16 me-2 ${!contract.isCurrent ? ' red' : ''}`}>
            {contract.isHealthPlan
              ? `${contractName} Health Plan ${
                  !contract.isEmployeePlan ? ` - ${contract.payment_interval}` : ''
                }`
              : 'Payment Plan'}
          </h2>
          {clientOnHold && <Icon name="client_on_hold" />}
          {onHold && <Icon name="on_hold" className="red" />}
          {contract.isCollections && <Icon name="collections" />}
          {notRenewing && <Icon name="not_renewing" />}
        </div>
      </NotMobile>
    </React.Fragment>
  );

  const contractDuration = className => {
    return (
      <div className={`form-control-read-only ${className ? className : ''}`}>
        <label htmlFor="planDuration">Plan Duration:</label>
        <p id="planDuration">
          {formatDate(contract.start_date)} - {formatDate(contract.end_date)}
          {contract.contract_phase === Constants.FINALIZED ? ' (Ended)' : ''}
        </p>
        {contract.early_cancellation_date && contract.early_cancellation_date !== 'N' && (
          <div className="mt-1 bold orange">
            *Cancellation scheduled for {formatDate(contract.early_cancellation_date)}
          </div>
        )}
      </div>
    );
  };

  const paymentMethod = className => {
    return (
      contract.isMonthly &&
      contract.contract_phase === Constants.OPEN &&
      contract.billing_active === 'Y' && (
        <div className={`form-control-read-only ${className}`}>
          <label htmlFor="paymentMethod">Payment Method:</label>
          <div className="d-flex">
            <p id="paymentMethod">
              {contract.automaticPaymentMethod.category === Constants.CARD
                ? 'Card'
                : 'Bank Account'}{' '}
              - {contract.automaticPaymentMethod.last4}
            </p>
            <button
              className="btn-text-primary font-14 sura ms-3"
              onClick={() => setShowUpdatePaymentMethod(true)}
            >
              Edit
            </button>
            {showUpdatePaymentMethod && (
              <UpdatePaymentMethod
                contract={contract}
                handleClose={() => setShowUpdatePaymentMethod(false)}
              />
            )}
          </div>
        </div>
      )
    );
  };

  const paymentStatus = className => {
    return (
      <div className={`d-flex flex-column justify-content-between ${className}`}>
        {!(!contract.hasRemainingBalance && contract.isCurrent) && (
          <div>
            <h2 className={contract.isCurrent ? '' : 'red'}>
              {formatCurrency(contract.amount_due)}
            </h2>
            <p className={`overdue ${contract.isCurrent ? '' : 'red'}`}>Overdue</p>
          </div>
        )}
        {!contract.hasRemainingBalance && contract.isCurrent && (
          <p className="attention font-16 sura">Paid in Full</p>
        )}
        {!contract.isCurrent && (
          <button
            className="btn-text-primary font-14"
            onClick={() => setShowMakePayment(true)}
            disabled={contract.isCurrent}
          >
            <Icon name="dollar_sign" />
            MAKE PAYMENT
          </button>
        )}
        {showMakePayment && (
          <OneTimePayment
            balance={contract.amount_due}
            clientId={contract.client_id}
            contractId={contract.id}
            handleClose={() => setShowMakePayment(false)}
          />
        )}
      </div>
    );
  };

  if (contract.contract_phase === Constants.PENDING) {
    return (
      <div className="contract-snapshot d-flex justify-content-between">
        <div className="flex-column w-100">
          {Number(contract.contract_status_id) === Constants.INITIATED && (
            <React.Fragment>
              <div className="d-flex activation-message p-3 mb-3">
                <NotMobile>
                  <Icon className="attention" name="on_hold" tooltipText="Action Required" />
                </NotMobile>
                <div>
                  <p className="sura font-14 mb-2">
                    <Mobile>
                      <Icon
                        className="attention mt-0 mb-1"
                        name="on_hold"
                        tooltipText="Action Required"
                      />
                    </Mobile>
                    {contract.isHealthPlan ? `${contract.name}'s Health` : 'Payment'} Plan needs to
                    be activated!{' '}
                    <span className="attention" onClick={() => setShowActivateContract(true)}>
                      <nobr>Click Here</nobr>
                    </span>{' '}
                    to complete the final steps <nobr>(1-2 minutes)</nobr>
                  </p>
                  <p className="sura font-12">You will need your payment method information.</p>
                </div>
              </div>
              {header}
              {contractDuration('mt-3')}
              {showActivateContract && (
                <ActivateContract
                  contract={contract}
                  handleClose={() => setShowActivateContract(false)}
                />
              )}
            </React.Fragment>
          )}
          {Number(contract.contract_status_id) === Constants.ACTIVATED && (
            <div className="d-flex justify-content-between">
              <div className="d-flex flex-column justify-content-between">
                {header}
                {contractDuration('mt-3')}
                <Mobile>
                  <p className="message mt-3 text">
                    <i className="fa fa-sync blue font-12" />
                    Activation Pending
                  </p>
                </Mobile>
              </div>
              <NotMobile>
                <p className="message">Activation Pending</p>
              </NotMobile>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column contract-snapshot">
      <Mobile>
        {header}
        {paymentStatus('my-3')}
        {contractDuration('')}
        {paymentMethod('mt-3')}
      </Mobile>
      <NotMobile>
        <div className="d-flex justify-content-between">
          <div className="d-flex flex-column justify-content-between">
            {header}
            <div className="d-flex pt-3">
              {contractDuration('')}
              {paymentMethod('ms-5')}
            </div>
          </div>
          {paymentStatus('text-end')}
        </div>
      </NotMobile>
    </div>
  );
}

export default ContractSnapshot;
