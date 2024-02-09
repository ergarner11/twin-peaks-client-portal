import React from 'react';

function InputText({ name, type, label, value, onChange, disabled, className, autoFocus }) {
  return (
    <div className={'form-floating ' + (className ? className : '')}>
      <input
        className="form-control"
        type={type ? type : 'text'}
        id={name}
        name={name}
        value={value}
        placeholder={label}
        onChange={({ target }) => onChange(target.value)}
        autoComplete="off"
        disabled={disabled}
        autoFocus={autoFocus || false}
      />
      <label htmlFor={name}>{label}</label>
    </div>
  );
}

export default InputText;
