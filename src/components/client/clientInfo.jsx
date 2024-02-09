import React from 'react';

import '../../styles/components/client.scss';

function ClientInfo({ client, isLoading }) {
  return (
    <div className="client-info">
      {isLoading && <i className="flex-centered h-100 fa fa-circle-notch fa-spin fa-2x subtle" />}
      {!isLoading && (
        <React.Fragment>
          <div className="flex-row-aligned justify-content-between">
            <h1>
              {client.first_name} {client.last_name}
            </h1>
          </div>
          <div className="mt-3">
            <div className="flex-row-aligned">
              <label className="me-2">Email:</label>
              <p>
                {client.email ? client.email : <span className="error font-14">Not Provided</span>}
              </p>
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

export default ClientInfo;
