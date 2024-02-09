import React from 'react';

import PetSnapshot from '../pet/petSnapshot';

import '../../styles/components/client.scss';

function ClientOverview({ client, isLoading }) {
  return (
    <div className="content-panel">
      {isLoading && <i className="flex-centered h-100 fa fa-circle-notch fa-spin fa-2x subtle" />}
      {!isLoading && client.pets.length === 0 && (
        <div className="d-flex flex-column align-items-center p-5">
          <p className="no-result">No pets to display for this client</p>
        </div>
      )}
      {!isLoading && client.pets.length > 0 && (
        <React.Fragment>
          {client.pets.map((pet, i) => (
            <PetSnapshot key={i} pet={pet} clientIsCurrent={client.isCurrent} />
          ))}
        </React.Fragment>
      )}
    </div>
  );
}

export default ClientOverview;
