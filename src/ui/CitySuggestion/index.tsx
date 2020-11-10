/* eslint-disable no-undef */
import React from 'react';
import { CityInfo } from '../../interfaces';
import './index.scss';

interface CitySuggestionProps {
  city: CityInfo;
}

const CitySuggestion: React.FC<CitySuggestionProps> = (props: CitySuggestionProps): JSX.Element => {
  return (
    <div className="city-suggestion" key={props.city.geonameid}>
      <div className="city-suggestion__row">
        <h2>{props.city.name}</h2>
      </div>
      <div className="city-suggestion__row">
        <h3>{props.city.country}</h3>
        <h3 className="city-suggestion__subcountry">{props.city.subcountry}</h3>
      </div>
    </div>
  );
};

export default CitySuggestion;
