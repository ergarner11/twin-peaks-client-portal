import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';

import http from '../services/httpService';

import Icon from './common/icon';
import Input from './common/input';
import Page from './common/page';
import PasswordRequirements from './common/passwordRequirements';

import '../styles/components/user-details.scss';

function ClientDetails({ clientId, handleClose, isPage }) {
  const [client, setClient] = useState({});
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [editingItem, setEditingItem] = useState('');
  const [clientUpdated, setClientUpdated] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const getClient = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await http.get(`/client/getById?client_id=${clientId}`);
      setClient(response.data);
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
    setIsLoading(false);
  }, [clientId]);

  useEffect(() => {
    getClient();
  }, [getClient]);

  const handleEditChange = item => {
    setEditingItem(item ? item : '');
    setErrorMessage('');
    setUsername(item === 'username' ? client.username : '');
    setPassword('');
    setConfirmPassword('');
  };

  const handleSubmit = async (params, endPoint) => {
    if (isLoading) return;
    try {
      setIsLoading(true);

      params.clientId = clientId;
      await http.post(`client/${endPoint}`, params);

      setClientUpdated(true);
      await getClient();
      handleEditChange();
    } catch (error) {
      setIsLoading(false);
      setErrorMessage(error.response.data.message);
    }
  };

  const handleCloseEnhanced = () => {
    if (clientUpdated) {
      navigate(0);
    } else {
      handleClose();
    }
  };

  const item = (label, value) => {
    return (
      <div className="item">
        <label>{label}</label>
        <span>{value}</span>
      </div>
    );
  };

  const content = (
    <form className="user-details">
      {isLoading && (
        <i className="flex-centered w-100 p-4 fa fa-circle-notch fa-spin fa-2x subtle" />
      )}
      {!isLoading && (
        <React.Fragment>
          <p className="error">{errorMessage}</p>
          {item('First Name', client.first_name)}
          {item('Last Name', client.last_name)}
          {item('Email', client.email)}
          <div className={'item' + (editingItem === 'username' ? ' edit-mode' : '')}>
            <label>Username</label>
            {editingItem !== 'username' && (
              <React.Fragment>
                <span>{client.username}</span>
                <button
                  type="button"
                  className="btn-text-primary"
                  onClick={() => handleEditChange('username')}
                >
                  <Icon name="edit" />
                </button>
              </React.Fragment>
            )}
            {editingItem === 'username' && (
              <div className="d-flex flex-column align-items-start">
                <Input
                  className="m-0"
                  name="username"
                  value={username}
                  label="New Username"
                  onChange={setUsername}
                />
                <Buttons
                  handleEditChange={handleEditChange}
                  handleSubmit={() => handleSubmit({ username }, 'updateUsername')}
                />
              </div>
            )}
          </div>
          <div className={'item' + (editingItem === 'password' ? ' edit-mode' : '')}>
            <label>Password</label>
            {editingItem !== 'password' && (
              <React.Fragment>
                <span>---****</span>
                <button
                  type="button"
                  className="btn-text-primary"
                  onClick={() => handleEditChange('password')}
                >
                  <Icon name="edit" />
                </button>
              </React.Fragment>
            )}
            {editingItem === 'password' && (
              <div className="d-flex flex-column align-items-start">
                <Input
                  className="m-0"
                  type="password"
                  name="password"
                  value={password}
                  label="New Password"
                  onChange={setPassword}
                />
                <Input
                  className="m-0 mt-3"
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  label="Retype New Password"
                  onChange={setConfirmPassword}
                />
                <PasswordRequirements />
                <Buttons
                  handleEditChange={handleEditChange}
                  handleSubmit={() => {
                    if (password !== confirmPassword) {
                      setErrorMessage('The provided passwords do not match. Please try again.');
                      return;
                    }
                    handleSubmit({ password }, 'updatePassword');
                  }}
                />
              </div>
            )}
          </div>
        </React.Fragment>
      )}
    </form>
  );

  if (isPage) {
    return (
      <Page selectedTab="account">
        <div className="background-gray rounded box-shadow p-3">{content}</div>
      </Page>
    );
  }
  return (
    <Modal show={true} onHide={handleCloseEnhanced} centered>
      <div className="d-flex w-auto align-items-end mt-4 mb-2 me-3 p-0">
        <button className="h-auto" onClick={handleCloseEnhanced}>
          <Icon name="close" className="m-0" />
        </button>
      </div>
      {content}
    </Modal>
  );
}

export default ClientDetails;

function Buttons({ handleEditChange, handleSubmit }) {
  return (
    <div className="d-flex justify-content-end input-width mt-3">
      <button type="button" className="btn-text-secondary me-3" onClick={() => handleEditChange()}>
        Cancel
      </button>
      <button
        type="button"
        className="h-auto p-2 btn-rounded-primary"
        onClick={() => handleSubmit()}
      >
        Save
      </button>
    </div>
  );
}
