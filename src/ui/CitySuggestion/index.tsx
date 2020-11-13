/* eslint-disable no-undef */
import { CityInfo } from 'interfaces';
import { observer } from 'mobx-react-lite';
import React, { useContext, useMemo } from 'react';
import { PreferencesStore } from 'stores';
import AnimatedSuggestion from 'ui/AnimatedSuggestion';
import ErrorMessage from 'ui/ErrorMessage';
import Loading from 'ui/Loading';
import './index.scss';

interface CitySuggestionProps {
  city: CityInfo;
}

const CitySuggestion: React.FC<CitySuggestionProps> = (props: CitySuggestionProps): JSX.Element => {
  const preferencesStore = useContext(PreferencesStore);

  //prettier-ignore
  const isFaved = useMemo(() => preferencesStore.favorites[props.city.geonameid], [preferencesStore.favorites, props.city]);
  const buttonText = useMemo((): string => (isFaved ? 'Remove' : 'Add'), [isFaved]);
  const buttonClass = useMemo((): string => (isFaved ? 'red' : ''), [isFaved]);

  const isSubmitting = useMemo((): boolean => preferencesStore.submittingCity === props.city.geonameid, [
    props.city,
    preferencesStore.submittingCity,
  ]);

  const onButtonClicked = () => {
    preferencesStore.toggleFavorite(props.city);
  };

  return (
    <div className="city-suggestion" key={props.city.geonameid}>
      <div className="city-suggestion__row">
        <h2 className="city-suggestion__name">{props.city.name}</h2>
      </div>
      <div className="city-suggestion__row">
        <h3 className="city-suggestion__country">{props.city.country}</h3>
        <h3 className="city-suggestion__subcountry">{props.city.subcountry}</h3>
      </div>
      <button
        className={`city-suggestion__button ${buttonClass}`}
        disabled={preferencesStore.isFetching}
        onClick={onButtonClicked}
      >
        {buttonText}
      </button>
      <AnimatedSuggestion shown={isSubmitting}>
        <>
          {preferencesStore.isFetching && <Loading />}
          {preferencesStore.error !== '' && (
            <ErrorMessage error={preferencesStore.error} action="Retry" onClick={onButtonClicked} />
          )}
        </>
      </AnimatedSuggestion>
    </div>
  );
};

export default observer(CitySuggestion);
