import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useDebounce } from '../../hooks';
import './index.scss';

interface DropdownProps {
  placeholder: string;
  isFetching: boolean;
  onInputChange: (value: string) => void | Promise<void>;
}

const Dropdown: React.FC<DropdownProps> = (props: DropdownProps) => {
  const [term, setTerm] = useState<string>('');
  const [focused, setFocused] = useState<boolean>(false);
  const debouncedTerm = useDebounce<string>(term, 600);

  const onInputValueChange = (ev: ChangeEvent<HTMLInputElement>) => {
    setTerm(ev.target.value);
  };

  const showSuggestions = useMemo(() => {
    return props.isFetching && focused;
  }, [props.isFetching, focused]);

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
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {showSuggestions && (
        <div className="dropdown__suggestions">{props.isFetching && <h1>Loading</h1>}</div>
      )}
    </div>
  );
};

export default Dropdown;
