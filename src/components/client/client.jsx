import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import http from '../../services/httpService';

import { Mobile, NotMobile } from '../common/responsive';
import Page from '../common/page';

import ClientHealthPlans from './clientHealthPlans';
import ClientPaymentPlans from './clientPaymentPlans';
import PaymentMethods from './paymentMethods';

import '../../styles/components/client.scss';

function Client() {
  const location = useLocation();
  const params = useParams();

  const [client, setClient] = useState({ pets: [] });
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const getClient = async () => {
      try {
        setIsLoading(true);
        const { data: client } = await http.get(
          `/client/getCompleteById?client_id=${params.clientId}`
        );
        setClient(client);
      } catch (error) {
        setErrorMessage(error.response.data.message);
      }
      setIsLoading(false);
    };
    getClient();
  }, [params.clientId]);

  const selectedSection = location.pathname.includes('payment-plans')
    ? 'PAYMENT_PLANS'
    : location.pathname.includes('payment-methods')
    ? 'PAYMENT_METHODS'
    : 'HEALTH_PLANS';

  const activeSection = (
    <React.Fragment>
      {selectedSection === 'HEALTH_PLANS' && <ClientHealthPlans client={client} />}
      {selectedSection === 'PAYMENT_PLANS' && <ClientPaymentPlans client={client} />}
      {selectedSection === 'PAYMENT_METHODS' && <PaymentMethods clientId={client.id} />}
    </React.Fragment>
  );

  return (
    <Page selectedTab={selectedSection}>
      {errorMessage && <p className="error flex-centered h-100 background-white">{errorMessage}</p>}
      {!errorMessage && (
        <React.Fragment>
          <div className="client-info border-bottom">
            {isLoading && (
              <i className="flex-centered h-100 fa fa-circle-notch fa-spin fa-2x subtle" />
            )}
            {!isLoading && (
              <React.Fragment>
                <div className="flex-row-aligned justify-content-between">
                  <h1>
                    {client.first_name} {client.last_name}
                  </h1>
                </div>
                <div className="mt-3">
                  <div className="attribute">
                    <label className="me-2">Email:</label>
                    <p>{client.email || <span className="error font-14">Not Provided</span>}</p>
                  </div>
                </div>
              </React.Fragment>
            )}
          </div>
          <Mobile>
            <div className="d-flex flex-column flex-grow-1 mx-0">{activeSection}</div>
          </Mobile>
          <NotMobile>
            <div className="d-flex mx-0 flex-grow-1">
              <div className="background-white box-shadow w-25">
                <div className="client-menu">
                  <button
                    className={`option flex-row-aligned ${
                      selectedSection === 'HEALTH_PLANS' ? 'selected' : ''
                    }`}
                    onClick={() => navigate(`/client/${client.id}/health-plans`)}
                    disabled={isLoading}
                  >
                    Health Plans
                  </button>
                  <button
                    className={`option flex-row-aligned ${
                      selectedSection === 'PAYMENT_PLANS' ? 'selected' : ''
                    }`}
                    onClick={() => navigate(`/client/${client.id}/payment-plans`)}
                    disabled={isLoading}
                  >
                    Payment Plans
                  </button>
                  <button
                    className={`option flex-row-aligned ${
                      selectedSection === 'PAYMENT_METHODS' ? 'selected' : ''
                    }`}
                    onClick={() => navigate(`/client/${client.id}/payment-methods`)}
                    disabled={isLoading}
                  >
                    Payment Methods
                  </button>
                </div>
              </div>
              <div className="d-flex flex-column w-75">{activeSection}</div>
            </div>
          </NotMobile>
        </React.Fragment>
      )}
    </Page>
  );
}

export default Client;
