import React, { useState, useEffect } from 'react';

import http from '../../services/httpService';

import PetHealthPlans from './petHealthPlans';
import PetHeader from './petHeader';

import '../../styles/components/pet.scss';

function Pet({ petId, clientIsCurrent, allowPaymentPlans }) {
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
        const response = await http.get(`/pet/getById?pet_id=${petId}`);
        setPet(response.data);
      } catch (error) {
        setErrorMessage(error.response.data.message);
      }
      setIsLoading(false);
    };
    getPet();
  }, [petId]);

  return (
    <div className="content-panel">
      {isLoading && <i className="flex-centered h-100 fa fa-circle-notch fa-spin fa-2x subtle" />}
      {!isLoading && errorMessage && <p className="error flex-centered mt-5">{errorMessage}</p>}
      {!isLoading && !errorMessage && (
        <React.Fragment>
          <div className="pet-info border rounded p-3">
            <PetHeader pet={pet} />
            <div className="flex-row-aligned">
              <label>Species:</label>
              <p>{pet.species}</p>
            </div>
          </div>
          <PetHealthPlans
            pet={pet}
            clientIsCurrent={clientIsCurrent}
            allowPaymentPlans={allowPaymentPlans}
          />
        </React.Fragment>
      )}
    </div>
  );
}

export default Pet;
