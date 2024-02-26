import React, { useState, useEffect } from 'react';

import http from '../../services/httpService';

import PetHealthPlans from './petHealthPlans';

import Icon from '../common/icon';

import Constants from '../../constants';

import '../../styles/components/pet.scss';

function Pet({ petId, client }) {
  const [pet, setPet] = useState({
    name: '',
    healthPlans: [],
    currentHealthPlans: [],
    previousHealthPlans: [],
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getPet = async () => {
      try {
        setIsLoading(true);
        const response = await http.get(
          `/pet/getCompleteById?pet_id=${petId}&client_id=${client.id}`
        );
        setPet(response.data);
      } catch (error) {
        setErrorMessage(error.response.data.message);
      }
      setIsLoading(false);
    };

    if (petId && client.id) {
      getPet();
    }
  }, [petId, client]);

  const currentHealthPlan = pet.currentHealthPlans.filter(t => t.isHealthPlan)[0];

  return (
    <div className="content-panel">
      {isLoading && <i className="flex-centered h-100 fa fa-circle-notch fa-spin fa-2x subtle" />}
      {!isLoading && errorMessage && <p className="error flex-centered mt-5">{errorMessage}</p>}
      {!isLoading && !errorMessage && (
        <React.Fragment>
          <div className="pet-info border rounded p-3">
            <div className="flex-row-aligned justify-content-between mb-3">
              <div className="flex-row-aligned">
                <h2 className="me-2">{pet.name}</h2>
                {Number(pet.species_id) === Constants.CANINE && <Icon name="dog" />}
                {Number(pet.species_id) === Constants.FELINE && <Icon name="cat" />}
                {pet.isDeceased && <Icon name="deceased" />}
                {pet.inWaitingPeriod &&
                  !pet.isDeceased &&
                  (!currentHealthPlan ||
                    currentHealthPlan.contract_phase === Constants.FINALIZED) && (
                    <Icon name="waiting_period" />
                  )}
                {currentHealthPlan &&
                  !currentHealthPlan.renewalInfo.isRenewing &&
                  !pet.isDeceased &&
                  currentHealthPlan.contract_phase !== Constants.FINALIZED && (
                    <Icon name="not_renewing" />
                  )}
              </div>
            </div>
            <div className="flex-row-aligned">
              <label>Species:</label>
              <p>{pet.species}</p>
            </div>
          </div>
          <PetHealthPlans pet={pet} clientIsCurrent={client.isCurrent} />
        </React.Fragment>
      )}
    </div>
  );
}

export default Pet;
