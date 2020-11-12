/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useDebounce, usePercentageScrolled } from 'hooks';
import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import ErrorMessage from 'ui/ErrorMessage';
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

  const clearFilter = () => {
    setTerm('');
    props.onInputChange('');
  };

  useEffect(() => {
    props.onInputChange(debouncedTerm.trim());
  }, [debouncedTerm]);

  useEffect(() => {
    if (percentageScrolled === 100 && !props.isFetching && props.onEndReached && !props.endReached) {
      props.onEndReached();
    }
  }, [percentageScrolled, props.endReached]);

  const SuggestionsContent = useMemo(() => {
    if (props.suggestions.length === 0 && !props.isFetching) {
      return <ErrorMessage error={'No results'} action="Clear filter" onClick={clearFilter} />;
    }

    return props.suggestions.map(props.renderItem);
  }, [props.suggestions, props.isFetching, props.renderItem]);

  const ErrorContent = useMemo(() => {
    return <ErrorMessage error={props.error} action="Retry" onClick={props.onEndReached} />;
  }, [props.error, props.onEndReached]);

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
      <div className={`dropdown__suggestions ${focused ? 'shown' : 'shown'}`} ref={suggestionsRef}>
        {SuggestionsContent}
        {props.isFetching && <Loading />}
        {props.error && ErrorContent}
      </div>
    </div>
  );
};

export default React.memo(Dropdown);
