import React from 'react';
import '../../styles/global/react-popper-tooltip.css';
import { usePopperTooltip } from 'react-popper-tooltip';

import BillingActivity from './billingActivity';
import ContractSnapshot from './contractSnapshot';
import RenewalInfo from './renewalInfo';

import Icon from '../common/icon';
import { Mobile, NotMobile } from '../common/responsive';

import { formatCurrency } from '../../util';
import Constants from '../../constants';

import '../../styles/components/contract.scss';

function Contract({ contract, clientIsCurrent, hideLinks }) {
  const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip({
      trigger: 'click',
      placement: 'top',
    });

  const previewInfo =
    contract && contract.initial_setup_info ? JSON.parse(contract.initial_setup_info) : undefined;

  const paymentSchedule = (
    <React.Fragment>
      {contract.isMonthly && (
        <button className="btn-text-secondary pe-4" type="button" ref={setTriggerRef}>
          <Icon name="calendar" className="blue" />
          <span className="blue sura font-14">Payment Schedule</span>
        </button>
      )}
      {visible && (
        <div ref={setTooltipRef} {...getTooltipProps({ className: 'tooltip-container' })}>
          <div {...getArrowProps({ className: 'tooltip-arrow' })} />
          <div className="d-flex">
            <div className="d-flex flex-column me-4">
              <span className="sura font-16 fw-bold mb-2">Date</span>
              {previewInfo.paymentDates.allDates.map((t, i) => (
                <span key={i} className="sura font-16">
                  {t}
                </span>
              ))}
            </div>
            <div className="d-flex flex-column">
              <span className="sura font-16 fw-bold mb-2">Amount</span>
              {previewInfo.paymentDates.allDates.map((t, i) => (
                <span key={i} className="sura font-16">
                  <span>
                    {formatCurrency(
                      i === 0
                        ? previewInfo.initialPaymentInfo.items.find(t => t.key === 'FIRST_PAYMENT')
                            .amount
                        : previewInfo.monthlyPaymentInfo.amount
                    )}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );

  return (
    <div className="background-white d-flex flex-column box-shadow rounded p-3 mt-3">
      <ContractSnapshot
        contract={contract}
        clientIsCurrent={clientIsCurrent}
        hideLinks={hideLinks}
      />
      {contract.contract_phase !== Constants.PENDING && (
        <React.Fragment>
          <Mobile>
            <div className="py-4">
              <div className="mb-2">{paymentSchedule}</div>
            </div>
          </Mobile>
          <NotMobile>
            <div className="flex-row-aligned justify-content-between py-4">
              <div className="d-flex">{paymentSchedule}</div>
            </div>
          </NotMobile>
          {contract.isHealthPlan &&
            !contract.isEmployeePlan &&
            contract.contract_phase === Constants.OPEN &&
            contract.deceased !== 'Y' && <RenewalInfo contract={contract} />}
          <BillingActivity contract={contract} />
        </React.Fragment>
      )}
    </div>
  );
}

export default Contract;
