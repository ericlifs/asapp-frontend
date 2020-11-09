import React, { ChangeEvent, useEffect, useState } from 'react';
import { useDebounce } from '../../hooks';
import './index.scss';

interface DropdownProps {
  placeholder: string;
  onInputChange: (value: string) => void | Promise<void>;
}

const Dropdown: React.FC<DropdownProps> = (props: DropdownProps) => {
  const [term, setTerm] = useState<string>('');
  const debouncedTerm = useDebounce<string>(term, 600);

  const onInputValueChange = (ev: ChangeEvent<HTMLInputElement>) => {
    setTerm(ev.target.value);
  };

  useEffect(() => {
    if (debouncedTerm.trim()) {
      props.onInputChange(debouncedTerm.trim());
    }
  }, [debouncedTerm]);

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
