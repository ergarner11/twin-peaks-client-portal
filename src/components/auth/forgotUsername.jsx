import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import http from '../../services/httpService';

import Input from '../common/input';

import logo from '../../assets/billing-logo.webp';

import '../../styles/components/auth.scss';

function ForgotUsername() {
  const [lastName, setLastName] = useState('');
  const [petName, setPetName] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    try {
      await http.post('/forgotUsername', { lastName, petName });
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
        {errorMessage && <p className="error input-width"> {errorMessage} </p>}

        {!succeeded && (
          <React.Fragment>
            <p className="sura font-11 gray input-width mt-2">
              Enter the Last Name of the primary person on your Twin Peaks account
            </p>
            <Input
              className="my-2"
              name="lastName"
              value={lastName}
              label="Last Name"
              onChange={setLastName}
            />
            <p className="sura font-11 gray input-width mt-2">
              Enter the name of any pet covered by a Health Plan owned by the person above
            </p>
            <Input
              className="my-2"
              name="petName"
              value={petName}
              label="Pet Name"
              onChange={setPetName}
            />

            <button className="btn-filled-primary w-100 my-5" type="submit" disabled={isLoading}>
              {isLoading && <i className="fa fa-circle-notch fa-spin" />}Email my username to me
            </button>
          </React.Fragment>
        )}

        {succeeded && (
          <React.Fragment>
            <p className="sura font-14 input-width mb-4">
              Thank you! If account exists, an email containing your username has been sent to the
              email address associated with the account.
            </p>
            <p className="sura font-14 input-width mt-2 mb-4">
              If you do not receieve and email within a few minutes, please call us at{' '}
              <nobr>(970) 663-0218</nobr> for assistance.
            </p>
          </React.Fragment>
        )}

        <Link to="/login" className="btn-text-primary font-16 fw-bolder">
          Go to Sign In
        </Link>
      </form>
    </div>
  );
}

export default ForgotUsername;
