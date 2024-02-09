import React from 'react';

function InputNumber({ name, label, value, onChange, className, disabled }) {
  return (
    <div className={'form-floating ' + (className ? className : '')}>
      <input
        className="form-control"
        type="number"
        id={name}
        name={name}
        value={value}
        placeholder={label}
        onChange={({ target }) => onChange(Number(target.value))}
        autoComplete="off"
        disabled={disabled}
      />
      <label htmlFor={name}>{label}</label>
    </div>
  );
}

export default InputNumber;
