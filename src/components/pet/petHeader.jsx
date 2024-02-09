import React from 'react';

import Icon from '../common/icon';

import Constants from '../../constants';

function PetHeader({ pet }) {
  const currentHealthPlan = pet.currentHealthPlans.filter(t => t.isHealthPlan)[0];

  return (
    <div className="flex-row-aligned justify-content-between mb-3">
      <div className="flex-row-aligned">
        <h2 className="me-2">{pet.name}</h2>
        {Number(pet.species_id) === Constants.CANINE && <Icon name="dog" />}
        {Number(pet.species_id) === Constants.FELINE && <Icon name="cat" />}
        {pet.isDeceased && <Icon name="deceased" />}
        {pet.inWaitingPeriod &&
          !pet.isDeceased &&
          (!currentHealthPlan || currentHealthPlan.contract_phase === Constants.FINALIZED) && (
            <Icon name="waiting_period" />
          )}
        {currentHealthPlan &&
          !currentHealthPlan.renewalInfo.isRenewing &&
          !pet.isDeceased &&
          currentHealthPlan.contract_phase !== Constants.FINALIZED && <Icon name="not_renewing" />}
      </div>
    </div>
  );
}

export default PetHeader;
