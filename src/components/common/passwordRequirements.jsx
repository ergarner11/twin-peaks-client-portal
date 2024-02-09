import React from 'react';

function PasswordRequirements({ className }) {
  return (
    <div className={`password-requirements ms-3 mb-2 ${className ? className : ''}`}>
      <p className="mt-2 mb-1 sura">Password must contain...</p>
      <ul className="ms-5">
        <li className="h-auto pt-2 sura">a minimum of 8 characters</li>
        <li className="h-auto pt-2 sura">at least one lowercase letter</li>
        <li className="h-auto pt-2 sura">at least one uppercase letter</li>
        <li className="h-auto pt-2 sura">at least one number number</li>
        <li className="h-auto pt-2 sura">
          at least one symbol
          <span className="ms-2 d-block">! @ # ^ & * ( ) + _ , . {} ? -</span>
        </li>
      </ul>
    </div>
  );
}

export default PasswordRequirements;
