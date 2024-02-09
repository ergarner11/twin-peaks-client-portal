import React from 'react';

import Icon from './icon';

function InputCheckbox({ name, label, checked, onChange, disabled, className }) {
  return (
    <div className={'checkbox ' + (className ? className : '')}>
      <label htmlFor={name} className="d-flex align-items-start">
        <input
          type="checkbox"
          id={name}
          name={name}
          checked={checked}
          onChange={({ target }) => onChange(target.checked)}
          autoComplete="off"
          disabled={disabled}
        />
        {checked && <Icon name="check_mark" />}
        <span className={`sura ${disabled ? 'gray' : 'black'} ms-2`}>{label}</span>
      </label>
    </div>
  );
}

export default InputCheckbox;
