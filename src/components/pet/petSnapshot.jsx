import React from 'react';
import { useNavigate } from 'react-router-dom';

import ContractSnapshot from '../contract/contractSnapshot';
import PetHeader from '../pet/petHeader';

import Icon from '../common/icon';

import Constants from '../../constants';

import '../../styles/components/pet.scss';

function PetSnapshot({ pet, clientIsCurrent }) {
  const navigate = useNavigate();

  const isPending = pet.currentHealthPlans.find(t => t.contract_phase === Constants.PENDING);

  if (isPending) {
    return (
      <div className="pet-snapshot content pending">
        <PetHeader pet={pet} />
        {pet.currentHealthPlans.map(contract => (
          <div key={contract.id} className="mt-4">
            <ContractSnapshot
              contract={contract}
              clientIsCurrent={clientIsCurrent}
              hideLinks={true}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className="pet-snapshot d-flex justify-content-between"
      onClick={() => navigate(`/client/${pet.client_id}/pet/${pet.id}`)}
    >
      <div className="content w-100">
        <PetHeader pet={pet} />
        {pet.currentHealthPlans.length > 0 &&
          pet.currentHealthPlans.map(contract => (
            <div key={contract.id} className="mt-3">
              <ContractSnapshot
                contract={contract}
                clientIsCurrent={clientIsCurrent}
                hideLinks={true}
              />
            </div>
          ))}

        {pet.currentHealthPlans.length === 0 && (
          <div className="d-flex justify-content-between align-items-end">
            {!pet.isDeceased && pet.inWaitingPeriod && <p className="message">In Waiting Period</p>}
            {(pet.isDeceased || !pet.inWaitingPeriod) && (
              <p className="message">No Active Health Plan</p>
            )}
          </div>
        )}
      </div>
      <div className="more-details d-flex justify-content-center align-items-center">
        <Icon name="more" className="m-0" />
      </div>
    </div>
  );
}

export default PetSnapshot;
