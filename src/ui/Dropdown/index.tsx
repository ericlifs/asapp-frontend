import React, { ChangeEvent, useState } from 'react';
import './index.scss';

interface DropdownProps {
  placeholder: string;
}

const Dropdown: React.FC<DropdownProps> = (props: DropdownProps) => {
  const [term, setTerm] = useState<string>('');

  const onInputValueChange = (ev: ChangeEvent<HTMLInputElement>) => {
    setTerm(ev.target.value);
  };

  return (
    <div className="dropdown">
      <input
        className="dropdown__input"
        placeholder={props.placeholder}
        value={term}
        onChange={onInputValueChange}
      />
    </div>
  );
};

export default Dropdown;
