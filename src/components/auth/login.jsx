import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';

import http from '../../services/httpService';

import Input from '../common/input';

import logo from '../../assets/billing-logo.webp';

import '../../styles/components/auth.scss';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedInUser, setLoggedInUser] = useState({});

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);

    try {
      const { data: loggedInUser } = await http.post('/login', {
        username,
        password,
        portalType: 'CLIENT',
      });

      localStorage.setItem('loggedIn', JSON.stringify(loggedInUser));
      setLoggedInUser(loggedInUser);
      setRedirect(true);
    } catch (error) {
      setIsLoading(false);
      setErrorMessage(error.response.data.message);
    }
  };

  if (redirect) {
    return <Navigate to={`/client/${loggedInUser.id}`} />;
  }

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit}>
        <img src={logo} alt="Twin Peaks Veterinary Clinic logo" />
        {errorMessage && <p className="error input-width"> {errorMessage} </p>}
        <Input
          className="mb-2"
          name="username"
          value={username}
          label="Username"
          onChange={setUsername}
        />
        <Input
          className="my-2"
          name="password"
          type="password"
          value={password}
          label="Password"
          onChange={setPassword}
        />

        <span className="align-self-start font-14 fw-bolder">
          Forgot{' '}
          <Link to="/forgot-username" className="btn-text-secondary font-14 fw-bolder">
            username
          </Link>{' '}
          or{' '}
          <Link to="/forgot-password" className="btn-text-secondary font-14 fw-bolder">
            password
          </Link>
          ?
        </span>

        <button className="btn-filled-primary w-100 my-5" type="submit" disabled={isLoading}>
          {isLoading && <i className="fa fa-circle-notch fa-spin" />}Sign In
        </button>

        <div className="fw-bolder align-self-start font-16">
          <span className="me-2">Don't have an account?</span>
          <Link to="/register" className="btn-text-primary">
            Register here
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
