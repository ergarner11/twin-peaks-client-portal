import React from 'react';

import Navbar from '../navbar';
import logo from '../../assets/billing-logo-short.webp';

import { Mobile, NotMobile } from './responsive';

function Page({ children, selectedTab }) {
  return (
    <div className="page">
      <NotMobile>
        <Navbar selectedTab={selectedTab} />
      </NotMobile>
      <Mobile>
        <div className="mobile-header">
          <img src={logo} alt="Twin Peaks Veterinary Clinic logo" />
        </div>
      </Mobile>
      <div className="container d-flex flex-column flex-grow-1 mt-3">{children}</div>
      <Mobile>
        <Navbar selectedTab={selectedTab} />
      </Mobile>
    </div>
  );
}

export default Page;
