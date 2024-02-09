import React from 'react';

import '../../styles/components/input-either-or.scss';

function InputEitherOr({ name, label, value, option1, option2, onChange, disabled, className }) {
  return (
    <div
      className={`form-control-multiline input-either-or input-width ${className ? className : ''}`}
    >
      <label>{label}</label>
      <div className="mt-3">
        <input
          type="radio"
          id={`${name}-${option1.name}`}
          name={name}
          value={option1.value}
          checked={value === option1.value}
          onChange={onChange}
          disabled={disabled}
        />
        <label
          htmlFor={`${name}-${option1.name}`}
          className={`option1 ${value === option1.value ? 'selected' : ''}`}
        >
          {option1.name}
        </label>
        <input
          type="radio"
          id={`${name}-${option2.name}`}
          name={name}
          value={option2.value}
          checked={value === option2.value}
          onChange={onChange}
          disabled={disabled}
        />
        <label
          htmlFor={`${name}-${option2.name}`}
          className={`option2 ${value === option2.value ? 'selected' : ''}`}
        >
          {option2.name}
        </label>
      </div>
    </div>
  );
}

export default InputEitherOr;
