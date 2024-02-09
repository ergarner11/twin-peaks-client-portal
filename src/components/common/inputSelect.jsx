import React from 'react';

function InputSelect({
  name,
  label,
  value,
  optionConfig,
  rawOptions,
  onChange,
  disabled,
  className,
}) {
  let options;

  if (rawOptions) {
    options = optionConfig.map(t => (
      <option key={t} value={t}>
        {t}
      </option>
    ));
  } else {
    options = optionConfig.map(t => (
      <option key={t.value} value={t.value}>
        {t.name}
      </option>
    ));
  }

  return (
    <div className={'form-floating ' + (className ? className : '')}>
      <select
        className="form-select"
        id={name}
        name={name}
        value={value}
        disabled={disabled}
        onChange={({ target }) => onChange(target.value)}
      >
        {options}
      </select>
      <label htmlFor={name}>{label}</label>
    </div>
  );
}

export default InputSelect;
