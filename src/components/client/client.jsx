import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import http from '../../services/httpService';

import mountains from '../../assets/mountain-logo.svg';

import { Mobile, NotMobile } from '../common/responsive';
import Page from '../common/page';

import ClientInfo from './clientInfo';
import ClientMenu from './clientMenu';
import ClientOverview from './clientOverview';
import ClientPaymentPlans from './clientPaymentPlans';
import ClientTopbar from './clientTopbar';
import Pet from '../pet/pet';
import PaymentMethods from './paymentMethods';

function Client() {
  const location = useLocation();
  const params = useParams();

  let selectedSection;
  if (location.pathname.includes('payment-plans')) {
    selectedSection = 'PAYMENT_PLANS';
  } else if (location.pathname.includes('pet')) {
    selectedSection = 'PET';
  } else if (location.pathname.includes('payment-methods')) {
    selectedSection = 'PAYMENT_METHODS';
  } else {
    selectedSection = 'OVERVIEW';
  }

  const [client, setClient] = useState({
    isCurrent: true,
    pets: [],
    currentPaymentPlans: [],
    previousPaymentPlans: [],
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getClient = async () => {
      try {
        setIsLoading(true);
        const { data: client } = await http.get(
          `/client/getCompleteById?client_id=${params.clientId}`
        );
        client.pets = client.pets.filter(t => t.currentHealthPlans.length > 0);
        setClient(client);
      } catch (error) {
        setErrorMessage(error.response.data.message);
      }
      setIsLoading(false);
    };
    getClient();
  }, [params.clientId]);

  const activeSection = (
    <React.Fragment>
      {selectedSection === 'OVERVIEW' && <ClientOverview client={client} isLoading={isLoading} />}
      {selectedSection === 'PET' && (
        <Pet
          petId={params.petId}
          clientIsCurrent={client.isCurrent}
          allowPaymentPlans={client.no_payment_plans === 'N'}
        />
      )}
      {selectedSection === 'PAYMENT_PLANS' && (
        <ClientPaymentPlans
          client={client}
          clientIsCurrent={client.isCurrent}
          isLoading={isLoading}
        />
      )}
      {selectedSection === 'PAYMENT_METHODS' && (
        <PaymentMethods clientId={client.id} isLoading={isLoading} />
      )}
    </React.Fragment>
  );

  return (
    <Page selectedTab={selectedSection}>
      {errorMessage && <p className="error flex-centered h-100 background-white">{errorMessage}</p>}
      {!errorMessage && (
        <Mobile>
          <ClientInfo client={client} isLoading={isLoading} />
          <div className="d-flex flex-column flex-grow-1 mx-0 mt-4">
            <ClientTopbar
              client={client}
              petId={params.petId}
              selectedSection={selectedSection}
              isLoading={isLoading}
            />
            {activeSection}
          </div>
        </Mobile>
      )}
      {!errorMessage && (
        <NotMobile>
          <ClientInfo client={client} isLoading={isLoading} />
          <div className="d-flex mx-0 mt-4 flex-grow-1">
            <div className="client-sidebar background-white box-shadow w-25">
              <div className="flex-centered">
                <img src={mountains} alt="" />
                <h1>Dashboard</h1>
              </div>
              <ClientMenu
                client={client}
                petId={params.petId}
                selectedSection={selectedSection}
                isLoading={isLoading}
              />
            </div>
            <div className="d-flex flex-column w-75">{activeSection}</div>
          </div>
        </NotMobile>
      )}
    </Page>
  );
}

export default Client;
