import React from 'react';
import { useNavigate } from 'react-router-dom';

import Icon from '../common/icon';

import Constants from '../../constants';

import '../../styles/components/client.scss';

function ClientPets({ client, isLoading }) {
  const navigate = useNavigate();

  return (
    <div className="content-panel">
      {isLoading && <i className="flex-centered h-100 fa fa-circle-notch fa-spin fa-2x subtle" />}
      {!isLoading && client.pets.length === 0 && (
        <p className="sura font-16 mb-4 ms-1">No pets to display for this client</p>
      )}
      {!isLoading && client.pets.length > 0 && (
        <React.Fragment>
          {client.pets.map((pet, i) => (
            <div
              key={i}
              className="pet-snapshot d-flex justify-content-between"
              onClick={() => navigate(`/client/${pet.client_id}/pet/${pet.id}`)}
            >
              <div className="content w-100">
                <div className="flex-row-aligned justify-content-between mb-3">
                  <div className="flex-row-aligned">
                    <h2 className="me-2">{pet.name}</h2>
                    {Number(pet.species_id) === Constants.CANINE && <Icon name="dog" />}
                    {Number(pet.species_id) === Constants.FELINE && <Icon name="cat" />}
                    {pet.isDeceased && <Icon name="deceased" />}
                  </div>
                </div>
              </div>
              <div className="more-details d-flex justify-content-center align-items-center">
                <Icon name="more" className="m-0" />
              </div>
            </div>
          ))}
        </React.Fragment>
      )}
    </div>
  );
}

export default ClientPets;
