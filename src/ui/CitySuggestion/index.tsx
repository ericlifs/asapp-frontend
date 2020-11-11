/* eslint-disable no-undef */
import { observer } from 'mobx-react-lite';
import React, { useContext, useMemo } from 'react';
import { CityInfo } from '../../interfaces';
import { PreferencesStore } from '../../stores';
import './index.scss';

interface CitySuggestionProps {
  city: CityInfo;
}

const CitySuggestion: React.FC<CitySuggestionProps> = (props: CitySuggestionProps): JSX.Element => {
  const preferencesStore = useContext(PreferencesStore);

  const isFaved = useMemo(() => {
    return Boolean(preferencesStore.favorites[props.city.geonameid]);
  }, [preferencesStore.favorites, props.city]);

  const buttonText = useMemo((): string => {
    if (isFaved) {
      return 'Remove';
    }

    return 'Add';
  }, [isFaved]);

  const buttonClass = useMemo((): string => {
    if (isFaved) {
      return 'red';
    }

    return '';
  }, [isFaved]);

  const onButtonClicked = () => {
    preferencesStore.toggleFavorite(props.city);
  };

  return (
    <div className="city-suggestion" key={props.city.geonameid}>
      <div className="city-suggestion__row">
        <h2>{props.city.name}</h2>
      </div>
      <div className="city-suggestion__row">
        <h3>{props.city.country}</h3>
        <h3 className="city-suggestion__subcountry">{props.city.subcountry}</h3>
      </div>
      <button className={`city-suggestion__button ${buttonClass}`} onClick={onButtonClicked}>
        {buttonText}
      </button>
    </div>
  );
};

export default observer(CitySuggestion);
