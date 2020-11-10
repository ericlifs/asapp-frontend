import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { CitiesStore } from './stores';
import Dropdown from './ui/Dropdown';
import CitySuggestion from './ui/CitySuggestion';
import { CityInfo } from './interfaces';

function App() {
  const citiesStore = useContext(CitiesStore);

  useEffect(() => {
    citiesStore.getAllCities();
  }, []);

  const onDropdownInputChange = async (term: string): Promise<void> => {
    citiesStore.getCitiesByFilter(term);
  };

  const onDropdownEndReached = async (): Promise<void> => {
    citiesStore.getAllCities();
  };

  return (
    <div className="App">
      <Dropdown
        placeholder="Type to filter by city name or country"
        onInputChange={onDropdownInputChange}
        suggestions={citiesStore.allCities}
        isFetching={citiesStore.isFetching}
        renderItem={(item: CityInfo) => <CitySuggestion city={item} />}
        onEndReached={onDropdownEndReached}
      />
    </div>
  );
}

export default observer(App);
