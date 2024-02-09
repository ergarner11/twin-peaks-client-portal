import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import http from '../../services/httpService';

import Input from '../common/input';

import logo from '../../assets/billing-logo.webp';

import '../../styles/components/auth.scss';
import PasswordRequirements from '../common/passwordRequirements';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  const urlParams = useParams();

  const handleSubmit = async e => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);

    if (password !== confirmPassword) {
      setErrorMessage('The provided passwords do not match. Please try again.');
      setIsLoading(false);
      return;
    }

    try {
      await http.post('/resetPassword', {
        userId: urlParams.userId,
        resetToken: urlParams.resetToken,
        password,
        portalType: 'CLIENT',
      });

      localStorage.removeItem('loggedIn');
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
            <Input
              className="mb-2"
              name="password"
              type="password"
              value={password}
              label="New Password"
              onChange={setPassword}
            />

            <Input
              className="my-2"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              label="Confirm New Password"
              onChange={setConfirmPassword}
            />
            <PasswordRequirements className="w-100" />

            <button
              className="w-100 btn-filled-primary mt-4 mb-3"
              type="submit"
              disabled={isLoading}
            >
              {isLoading && <i className="fa fa-circle-notch fa-spin" />}Reset Password
            </button>
          </React.Fragment>
        )}

        {succeeded && (
          <p className="sura font-14 input-width mb-4">Thank you! Your password has been reset.</p>
        )}

        <Link to="/login" className="btn-text-primary fw-bolder font-16 w-auto">
          Go to Sign In
        </Link>
      </form>
    </div>
  );
}

export default ResetPassword;
