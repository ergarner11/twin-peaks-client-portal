import React, { useState, useEffect } from 'react';
import Collapse from 'react-bootstrap/Collapse';
import moment from 'moment-timezone';

import http from '../../services/httpService';

import Icon from '../common/icon';

import SchedulePayment from './schedulePayment';

import { formatCurrency, formatDate } from '../../util';
import Constants from '../../constants';

import '../../styles/components/contract.scss';

function RenewalInfo({ contract }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const [showSchedulePayment, setShowSchedulePayment] = useState(false);
  const [renewalCost, setRenewalCost] = useState(0);

  const { renewalInfo, end_date, start_date, automaticPaymentMethod } = contract;

  const endDate = formatDate(end_date);
  const newStartDate = moment(start_date, 'YYYY-MM-DD').add(1, 'years').format('MM/DD/YYYY');
  const newEndDate = moment(start_date, 'YYYY-MM-DD')
    .add(2, 'years')
    .subtract(1, 'days')
    .format('MM/DD/YYYY');
  const endOfWaitingPeriod = moment(start_date, 'YYYY-MM-DD').add(2, 'years').format('MM/DD/YYYY');

  useEffect(() => {
    const getRenewalCost = async () => {
      const response = await http.get(
        `/healthPlan/getRenewalCost?species_id=${contract.species_id}&percentage_off_id=${renewalInfo.percentage_off_id}&payment_interval_id=${renewalInfo.payment_interval_id}&pricing_version=${renewalInfo.pricing_version}`
      );
      setRenewalCost(Number(response.data.renewalCost));
    };
    if (renewalInfo.isRenewing) {
      getRenewalCost();
    }
  }, [contract, renewalInfo]);

  let popoverContent;

  if (renewalInfo.isRenewing) {
    popoverContent = (
      <React.Fragment>
        <p className="sura">
          {contract.name}'s Health Plan will automatically renew on{' '}
          <nobr className="bold">{newStartDate}</nobr> as follows:
        </p>
        <div className="form-control-read-only mt-3">
          <label className="mb-2" htmlFor="duration">
            Duration:
          </label>
          <p id="duration">
            {newStartDate} - {newEndDate}
          </p>
        </div>
        <div className="form-control-read-only mt-3">
          <label className="mb-2" htmlFor="renewalType">
            Type:
          </label>
          <p id="renewalType">
            {Number(renewalInfo.percentage_off_id) === Constants.FIFTY_PERCENT ? '50%' : '90%'}{' '}
            Health Plan
          </p>
        </div>
        <div className="form-control-read-only mt-3">
          <label className="mb-2" htmlFor="paymentOption">
            Payment Option:
          </label>
          <p id="paymentOption">
            {Number(renewalInfo.payment_interval_id) === Constants.MONTHLY ? 'Monthly' : 'Annual'}
          </p>
        </div>
        {Number(renewalInfo.payment_interval_id) === Constants.MONTHLY && (
          <div className="form-control-read-only mt-3">
            <label className="mb-2" htmlFor="monthlyParticipationCharge">
              Monthly Participation Charge:
            </label>
            <p id="monthlyParticipationCharge">{formatCurrency(renewalCost / 12)}</p>
          </div>
        )}
        {Number(renewalInfo.payment_interval_id) === Constants.ANNUAL && (
          <div className="form-control-read-only mt-3">
            <label className="mb-2" htmlFor="annualParticipationCharge">
              Annual Participation Charge:
            </label>
            <p id="annualParticipationCharge">{formatCurrency(renewalCost)}</p>
          </div>
        )}
        {!contract.isMonthly && (
          <React.Fragment>
            {Number(renewalInfo.payment_interval_id) === Constants.ANNUAL && (
              <div className="form-control-read-only mt-3">
                <label className="mb-2" htmlFor="automaticPayment">
                  Payment Scheduled:
                </label>
                <div className="d-flex">
                  <p id="automaticPayment">{automaticPaymentMethod ? 'Yes' : 'No'}</p>
                  <button
                    className="btn-text-primary sura font-14 ms-3"
                    onClick={() => setShowSchedulePayment(true)}
                  >
                    {automaticPaymentMethod ? 'Edit Scheduled Payment' : 'Schedule Payment'}
                  </button>
                  {showSchedulePayment && (
                    <SchedulePayment
                      contract={contract}
                      annualParticipationCharge={renewalCost}
                      handleClose={() => setShowSchedulePayment(false)}
                    />
                  )}
                </div>
              </div>
            )}
            {automaticPaymentMethod && (
              <div className="form-control-read-only mt-3">
                <label className="mb-2" htmlFor="paymentMethod">
                  Payment Method:
                </label>
                <p id="paymentMethod">
                  {automaticPaymentMethod.category === Constants.CARD ? 'Card' : 'Bank Account'} -{' '}
                  {automaticPaymentMethod.last4}
                </p>
              </div>
            )}
          </React.Fragment>
        )}
      </React.Fragment>
    );
  } else {
    popoverContent = (
      <React.Fragment>
        <p className="sura">
          {contract.name}'s Health Plan is set to not renew. The current plan will expire on{' '}
          <nobr>{endDate}</nobr> and {contract.name}{' '}
          <span className="bold">
            will not be eligible to sign up for another Health Plan until{' '}
            <nobr>{endOfWaitingPeriod}</nobr>.
          </span>
        </p>
        <p className="sura bold mt-4">
          If you wish to avoid this waiting period, you may opt to renew {contract.name}'s current
          Health Plan
        </p>
      </React.Fragment>
    );
  }

  return (
    <div className="renewal border-top">
      <div className="header flex-row-aligned py-3" onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded && <Icon name="less" />}
        {!isExpanded && <Icon name="more" />}
        <h3>Renewal</h3>
      </div>
      <Collapse in={isExpanded}>
        <div className="pb-4 ps-4">
          {popoverContent}
          <p className="border rounded sura p-3 mt-3">
            If you would like to make changes to your selected renewal options, please call us at{' '}
            <nobr>(970) 663-0218</nobr>
          </p>
        </div>
      </Collapse>
    </div>
  );
}

export default RenewalInfo;
