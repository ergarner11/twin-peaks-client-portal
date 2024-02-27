import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useIdleTimer } from 'react-idle-timer';
import '../styles/global/react-popper-tooltip.css';
import { usePopperTooltip } from 'react-popper-tooltip';

import http from '../services/httpService';

import logo from '../assets/billing-logo-short.webp';

import ClientDetails from './clientDetails';

import Icon from './common/icon';
import { Mobile, NotMobile } from './common/responsive';

import '../styles/components/nav.scss';

function Navbar({ selectedTab }) {
  const [loggedInUser, setLoggedInUser] = useState(JSON.parse(localStorage.getItem('loggedIn')));

  const [showUserDetails, setShowUserDetails] = useState(false);
  const [visible, setVisible] = useState(false);

  const logout = async () => {
    try {
      await http.post('/logout');
      localStorage.removeItem('loggedIn');
      setLoggedInUser(undefined);
    } catch (error) {}
  };

  useIdleTimer({
    timeout: 1000 * 60 * 60 * 2,
    onIdle: logout,
    debounce: 500,
  });

  const { getTooltipProps, setTooltipRef, setTriggerRef } = usePopperTooltip({
    offset: [0, 0],
    trigger: 'click',
    onVisibleChange: () => setVisible(!visible),
  });

  if (!loggedInUser) {
    return <Navigate to="/login" />;
  }

  return (
    <React.Fragment>
      <Mobile>
        <nav>
          <div className="nav-tabs">
            <Link
              to={`/client/${loggedInUser.id}`}
              className={'nav-tab' + (selectedTab === 'OVERVIEW' ? ' selected' : '')}
            >
              <Icon name="fa fa-paw" />
              <span>Health Plans</span>
            </Link>
            <Link
              to={`/client/${loggedInUser.id}/payment-plans`}
              className={'nav-tab' + (selectedTab === 'PAYMENT_PLANS' ? ' selected' : '')}
            >
              <Icon name="fa fa-dollar-sign" />
              <span>Payment Plans</span>
            </Link>
            <Link
              to={`/client/${loggedInUser.id}/payment-methods`}
              className={'nav-tab' + (selectedTab === 'PAYMENT_METHODS' ? ' selected' : '')}
            >
              <Icon name="fa fa-wallet" />
              <span>Wallet</span>
            </Link>
            <Link
              to="/account"
              className={'nav-tab' + (selectedTab === 'account' ? ' selected' : '')}
            >
              <Icon name="user" />
              <span>Profile</span>
            </Link>
            <div className="nav-tab" onClick={logout}>
              <Icon name="right_arrow" />
              <span>Logout</span>
            </div>
          </div>
        </nav>
      </Mobile>
      <NotMobile>
        <nav className="container-fluid d-flex flex-row justify-content-center">
          <div className="nav-content flex-row-aligned justify-content-between flex-grow-1">
            <img src={logo} alt="Twin Peaks Veterinary Clinic logo" />
            <div className="nav-tabs">
              <div className="nav-tab" ref={setTriggerRef}>
                <Icon name="user" />
                <span>
                  {loggedInUser.first_name} {loggedInUser.last_name}
                </span>
                {visible && (
                  <div
                    ref={setTooltipRef}
                    {...getTooltipProps({ className: 'tooltip-container options' })}
                  >
                    <button
                      onClick={() => {
                        setShowUserDetails(true);
                        setVisible(false);
                      }}
                    >
                      Profile
                    </button>
                    <button onClick={logout}>Logout</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
        {showUserDetails && (
          <ClientDetails clientId={loggedInUser.id} handleClose={() => setShowUserDetails(false)} />
        )}
      </NotMobile>
    </React.Fragment>
  );
}

export default Navbar;
