import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';

import CompleteRegistration from './components/auth/completeRegistration';
import ForgotPassword from './components/auth/forgotPassword';
import ForgotUsername from './components/auth/forgotUsername';
import Login from './components/auth/login';
import Register from './components/auth/register';
import ResetPassword from './components/auth/resetPassword';

import Client from './components/client/client';

import ClientDetails from './components/clientDetails';

import './styles/global/style.scss';

let loggedInUser = JSON.parse(localStorage.getItem('loggedIn'));

const ProtectedRoute = () => {
  loggedInUser = JSON.parse(localStorage.getItem('loggedIn'));
  return loggedInUser ? <Outlet /> : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/client/:clientId/pet/:petId" element={<Client />} />
          <Route path="/client/:clientId/payment-plans" element={<Client />} />
          <Route path="/client/:clientId/payment-methods" element={<Client />} />
          <Route exact path="/client/:clientId" element={<Client />} />
          {loggedInUser && (
            <Route
              exact
              path="/account"
              element={<ClientDetails clientId={loggedInUser.id} isPage={true} />}
            />
          )}
        </Route>
        <Route path="/forgot-username" element={<ForgotUsername />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:userId/:resetToken" element={<ResetPassword />} />
        <Route path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route path="/register/:userId/:registrationToken" element={<CompleteRegistration />} />
        <Route
          path="*"
          element={<Navigate to={loggedInUser ? `/client/${loggedInUser.id}` : '/login'} />}
        />
      </Routes>
    </Router>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
