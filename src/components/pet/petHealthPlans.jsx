import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';

import http from '../../services/httpService';

import BillingActivity from '../contract/billingActivity';
import Contract from '../contract/contract';

import { Mobile, NotMobile } from '../common/responsive';

import { formatDate } from '../../util';
import Constants from '../../constants';

import '../../styles/components/contract.scss';

function PetHealthPlans({ pet, client }) {
  const [healthPlans, sethealthPlans] = useState([]);

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getHealthPlans = async () => {
      try {
        setIsLoading(true);
        const response = await http.get(
          `/pet/getHealthPlans?pet_id=${pet.id}&client_id=${client.id}`
        );
        sethealthPlans(response.data);
      } catch (error) {
        setErrorMessage(error.response.data.message);
      }
      setIsLoading(false);
    };

    if (pet.id && client.id) {
      getHealthPlans();
    }
  }, [pet, client]);

  const CURRENT_HEALTH_PLAN = 0;
  const PREVIOUS_HEALTH_PLANS = 1;

  const [selectedTabIndex, setSelectedTabIndex] = useState(CURRENT_HEALTH_PLAN);
  const [tabInfo, setTabInfo] = useState([
    { text: 'Current Health Plan', selected: 'Y', customClass: 'no-border-radius-left' },
    { text: 'Previous Health Plans', selected: 'N' },
  ]);

  const handleSelectNewTab = selectedTabIndex => {
    const newTabInfo = [...tabInfo];
    newTabInfo.forEach(t => (t.selected = 'N'));
    newTabInfo[selectedTabIndex].selected = 'Y';
    setTabInfo(newTabInfo);
    setSelectedTabIndex(selectedTabIndex);
  };

  const currentHealthPlans = healthPlans.filter(
    t => t.contract_phase !== Constants.FINALIZED || !t.isCurrent
  );
  const previousHealthPlans = healthPlans.filter(
    t => t.contract_phase === Constants.FINALIZED && t.isCurrent
  );

  return (
    <div>
      {errorMessage && <p className="error flex-centered h-100 background-white">{errorMessage}</p>}
      {isLoading && <i className="flex-centered h-100 fa fa-circle-notch fa-spin fa-2x subtle" />}
      {selectedTabIndex === CURRENT_HEALTH_PLAN && (
        <React.Fragment>
          {currentHealthPlans.map(contract => (
            <Contract key={contract.id} contract={contract} />
          ))}
          {currentHealthPlans.length === 0 && (
            <div className="mt-3">
              {(!pet.inWaitingPeriod || pet.isDeceased) && (
                <p className="message my-4 ms-2">No Health Plan to display for this pet</p>
              )}
              {!pet.isDeceased && pet.inWaitingPeriod && (
                <div className="notice">
                  <h3>Notice of Waiting Period:</h3>
                  <p>
                    Due to non-renewal of {pet.name}'s previous Health Plan, {pet.name} will not be
                    able to sign up for a new Health Plan until{' '}
                    {formatDate(moment(pet.waiting_period_end_date).add(1, 'days'))}.
                  </p>
                </div>
              )}
            </div>
          )}
          {previousHealthPlans.length > 0 && (
            <button
              className="btn-text-primary mt-4 ms-2"
              onClick={() => handleSelectNewTab(PREVIOUS_HEALTH_PLANS)}
            >
              View Previous Health Plans
            </button>
          )}
        </React.Fragment>
      )}
      {selectedTabIndex === PREVIOUS_HEALTH_PLANS && (
        <React.Fragment>
          <h2 className="mt-4 ms-2">Previous Health Plans</h2>
          {previousHealthPlans.map(t => {
            const endingReason =
              Number(t.contract_status_id) === Constants.CONVERTED
                ? 'Converted'
                : Number(t.contract_status_id) === Constants.CANCELLED
                ? 'Cancelled'
                : Number(t.contract_status_id) === Constants.COLLECTIONS
                ? 'Terminated'
                : 'Expired';
            return (
              <div className="mt-4 p-4 background-white rounded box-shadow" key={t.id}>
                <Mobile>
                  <div className="pb-3">
                    <h3 className="d-flex flex-column">
                      <span>
                        {JSON.parse(t.initial_setup_info).contractName} {t.payment_interval} -{' '}
                        {endingReason}
                      </span>
                      <span className="font-14 my-2">
                        ({formatDate(t.start_date)} - {formatDate(t.end_date)})
                      </span>
                    </h3>
                  </div>
                </Mobile>
                <NotMobile>
                  <div className="flex-row-aligned justify-content-between pb-3">
                    <h3>
                      {JSON.parse(t.initial_setup_info).contractName} {t.payment_interval} -{' '}
                      {endingReason} ({formatDate(t.start_date)} - {formatDate(t.end_date)})
                    </h3>
                  </div>
                </NotMobile>
                <BillingActivity contract={t} />
              </div>
            );
          })}
          <button
            className="btn-text-primary mt-4 ms-2"
            onClick={() => handleSelectNewTab(CURRENT_HEALTH_PLAN)}
          >
            View Current Health Plan
          </button>
        </React.Fragment>
      )}
    </div>
  );
}

export default PetHealthPlans;
