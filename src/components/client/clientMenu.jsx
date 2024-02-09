import React from 'react';
import { useNavigate } from 'react-router-dom';

import Icon from '../common/icon';

import '../../styles/components/client.scss';

function ClientMenu({ client, petId, selectedSection, isLoading }) {
  const navigate = useNavigate();

  return (
    <div className="client-menu">
      <button
        className={`option flex-row-aligned ${selectedSection === 'OVERVIEW' ? 'selected' : ''}`}
        onClick={() => navigate(`/client/${client.id}`)}
        disabled={isLoading}
      >
        <Icon name="case" />
        Overview
      </button>
      <ul className="pets">
        {client.pets.map(pet => (
          <li
            key={pet.id}
            className={selectedSection === 'PET' && petId === pet.id ? 'selected' : ''}
            onClick={() => navigate(`/client/${client.id}/pet/${pet.id}`)}
          >
            {pet.name}
          </li>
        ))}
      </ul>
      <button
        className={`option flex-row-aligned ${
          selectedSection === 'PAYMENT_PLANS' ? 'selected' : ''
        }`}
        onClick={() => navigate(`/client/${client.id}/payment-plans`)}
        disabled={isLoading}
      >
        <Icon name="dollar_sign" />
        Payment Plans
      </button>
      <button
        className={`option flex-row-aligned ${
          selectedSection === 'PAYMENT_METHODS' ? 'selected' : ''
        }`}
        onClick={() => navigate(`/client/${client.id}/payment-methods`)}
        disabled={isLoading}
      >
        <Icon name="credit_card" />
        Payment Methods
      </button>
    </div>
  );
}

export default ClientMenu;
