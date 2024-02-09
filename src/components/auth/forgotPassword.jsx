import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import http from '../../services/httpService';

import Input from '../common/input';

import logo from '../../assets/billing-logo.webp';

import '../../styles/components/auth.scss';

function ForgotPassword() {
  const [username, setUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    try {
      await http.post('/forgotPassword', { username, portalType: 'CLIENT' });
      setErrorMessage('');
      setSucceeded(true);
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit}>
        <img src={logo} alt="Twin Peaks Veterinary Clinic logo" />
        {errorMessage && <p className="error align-self-start"> {errorMessage} </p>}

        {!succeeded && (
          <React.Fragment>
            <Input
              className="mt-2"
              name="username"
              value={username}
              label="Username"
              onChange={setUsername}
            />

            <button className="btn-filled-primary w-100 my-4" type="submit" disabled={isLoading}>
              {isLoading && <i className="fa fa-circle-notch fa-spin" />}Email me a password reset
              link
            </button>
          </React.Fragment>
        )}

        {succeeded && (
          <p className="sura font-14 input-width mb-4">
            Thank you! If account exists, an email containing a password reset link has been sent to
            the email address associated with the account
          </p>
        )}

        <Link to="/login" className="btn-text-primary font-16 fw-bolder">
          Back to Sign In
        </Link>
      </form>
    </div>
  );
}

export default ForgotPassword;
