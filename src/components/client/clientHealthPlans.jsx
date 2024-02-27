import React, { useState, useEffect } from 'react';
import Collapse from 'react-bootstrap/Collapse';

import http from '../../services/httpService';

import PetHealthPlans from '../pet/petHealthPlans';

import Icon from '../common/icon';

import '../../styles/components/contract.scss';

function ClientHealthPlans({ client }) {
  const [healthPlanPets, setHealthPlanPets] = useState([]);
  const [isExpanded, setIsExpanded] = useState([]);

  useEffect(() => {
    const getHealthPlanPets = async () => {
      try {
        setIsLoading(true);
        const response = await http.get(`/client/getHealthPlanPets?client_id=${client.id}`);
        const healthPlanPets = response.data;
        setHealthPlanPets(healthPlanPets);
        const isExpandedBase = [];
        for (let i = 0; i < healthPlanPets.length; i++) {
          isExpandedBase.push(true);
        }
        setIsExpanded(isExpandedBase);
      } catch (error) {
        setErrorMessage(error.response.data.message);
      }
      setIsLoading(false);
    };

    if (client.id) {
      getHealthPlanPets();
    }
  }, [client]);

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="content-panel">
      {errorMessage && <p className="error">{errorMessage}</p>}
      {isLoading && <i className="flex-centered h-100 fa fa-circle-notch fa-spin fa-2x subtle" />}
      {!isLoading && (
        <React.Fragment>
          <h2 className="mb-4">Health Plans</h2>
          {healthPlanPets.map((t, i) => (
            <div key={i} className="p-3 mb-3 border">
              <h2
                onClick={() => {
                  const updatedIsExpanded = { ...isExpanded };
                  updatedIsExpanded[i] = !isExpanded[i];
                  setIsExpanded(updatedIsExpanded);
                }}
              >
                {isExpanded[i] && <Icon name="less" />}
                {!isExpanded[i] && <Icon name="more" />}
                {t.name}
              </h2>
              <Collapse in={isExpanded[i]}>
                <div>
                  <PetHealthPlans pet={t} client={client} />
                </div>
              </Collapse>
            </div>
          ))}

          {healthPlanPets.length === 0 && (
            <p className="message my-4 ms-2">No Health Plans to display</p>
          )}
        </React.Fragment>
      )}
    </div>
  );
}

export default ClientHealthPlans;
