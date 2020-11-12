/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useDebounce, usePercentageScrolled } from 'hooks';
import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import Loading from '../Loading';
import './index.scss';

interface DropdownProps {
  placeholder: string;
  isFetching: boolean;
  suggestions: any[];
  error: string;
  endReached: boolean;
  renderItem: (item: any) => JSX.Element;
  onInputChange: (value: string) => void | Promise<void>;
  onEndReached?: () => void | Promise<void>;
}

const Dropdown: React.FC<DropdownProps> = (props: DropdownProps) => {
  const [term, setTerm] = useState<string>('');
  const [focused, setFocused] = useState<boolean>(false);
  const debouncedTerm = useDebounce<string>(term, 600);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const percentageScrolled = usePercentageScrolled(suggestionsRef.current);

  const onInputValueChange = (ev: ChangeEvent<HTMLInputElement>) => {
    setTerm(ev.target.value);
  };

  useEffect(() => {
    props.onInputChange(debouncedTerm.trim());
  }, [debouncedTerm]);

  useEffect(() => {
    if (percentageScrolled === 100 && !props.isFetching && props.onEndReached && !props.endReached) {
      props.onEndReached();
    }
  }, [percentageScrolled, props.endReached]);

  const errorContent = useMemo(() => {
    if (props.error !== '') {
      return (
        <>
          <h2 className="dropdown__error">Oops... {props.error}</h2>
          <h1 className="dropdown__retry" onClick={props.onEndReached}>
            Retry
          </h1>
        </>
      );
    }

    return null;
  }, [props.error]);

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
      <div className={`dropdown__suggestions ${focused ? 'shown' : ''}`} ref={suggestionsRef}>
        {props.suggestions.length > 0 && props.suggestions.map(props.renderItem)}
        {props.isFetching && <Loading />}
        {errorContent}
      </div>
    </div>
  );
};

export default React.memo(Dropdown);
