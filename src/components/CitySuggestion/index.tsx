/* eslint-disable no-undef */
import { CityInfo } from 'interfaces';
import { observer } from 'mobx-react-lite';
import React, { useContext, useMemo } from 'react';
import { PreferencesStore } from 'stores';
import { ErrorMessage, AnimatedSuggestion, Loading } from 'ui';
import './index.scss';

interface CitySuggestionProps {
  city: CityInfo;
  rtl?: boolean;
}

const CitySuggestion: React.FC<CitySuggestionProps> = (props: CitySuggestionProps): JSX.Element => {
  const preferencesStore = useContext(PreferencesStore);

  //prettier-ignore
  const isFaved = useMemo(() => preferencesStore.preferredCities[props.city.geonameid], [preferencesStore.preferredCities, props.city]);
  const buttonText = useMemo((): string => (isFaved ? 'Remove' : 'Add'), [isFaved]);
  const buttonClass = useMemo((): string => (isFaved ? 'red' : ''), [isFaved]);
  const positionClass = useMemo((): string => (props.rtl ? 'left' : ''), [props.rtl]);

  const isSubmittingCurrentCity = useMemo(
    (): boolean => preferencesStore.submittingCity === props.city.geonameid,
    [props.city, preferencesStore.submittingCity],
  );

  const onButtonClicked = () => {
    preferencesStore.togglePreferredCity(props.city);
  };

  return (
    <div className="city-suggestion" key={props.city.geonameid}>
      <div className={`city-suggestion__row ${positionClass}`}>
        <h2 className="city-suggestion__name">{props.city.name}</h2>
      </div>
      <div className={`city-suggestion__row ${positionClass}`}>
        <h3 className="city-suggestion__country">{props.city.country}</h3>
        <h3 className="city-suggestion__subcountry">{props.city.subcountry}</h3>
      </div>
      <button
        className={`city-suggestion__button ${buttonClass} ${positionClass}`}
        disabled={preferencesStore.isSubmitting}
        onClick={onButtonClicked}
      >
        {buttonText}
      </button>
      <AnimatedSuggestion shown={isSubmittingCurrentCity}>
        <>
          {preferencesStore.isSubmitting && <Loading />}
          {preferencesStore.submittingError !== '' && (
            <ErrorMessage error={preferencesStore.submittingError} action="Retry" onClick={onButtonClicked} />
          )}
        </>
      </AnimatedSuggestion>
    </div>
  );
};

export default observer(CitySuggestion);
