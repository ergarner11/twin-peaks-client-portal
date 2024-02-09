import React, { useState } from 'react';

import ClientMenu from './clientMenu';

import Icon from '../common/icon';

import mountains from '../../assets/mountain-logo.svg';

import '../../styles/components/client.scss';

function ClientTopbar({ client, petId, selectedSection, isLoading }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getPetName = () => {
    const pet = client.pets.find(t => Number(t.id) === Number(petId));
    return pet ? pet.name : '';
  };

  const sectionNameMapping = {
    OVERVIEW: 'Overview',
    PAYMENT_PLANS: 'Payment Plans',
    PET: getPetName(),
    PAYMENT_METHODS: 'Payment Methods',
  };

  return (
    <div className="box-shadow rounded mb-3">
      <div
        className={`client-topbar background-white flex-row-aligned justify-content-between p-3 ${
          isExpanded ? 'rounded-top' : 'rounded'
        }`}
      >
        <div className="flex-row-aligned pointer" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded && <Icon name="less" className="align-self-start mt-1" />}
          {!isExpanded && <Icon name="more" className="align-self-start mt-1" />}
          <h2>{sectionNameMapping[selectedSection]}</h2>
        </div>
        <img src={mountains} style={{ width: '90px', height: '50px' }} alt="" />
      </div>
      {isExpanded && (
        <ClientMenu
          client={client}
          petId={petId}
          selectedSection={selectedSection}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}

export default ClientTopbar;
