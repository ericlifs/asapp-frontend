import { CityInfo } from 'interfaces';
import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect } from 'react';
import { CitiesStore, PreferencesStore } from 'stores';
import { CitySuggestion, Dropdown, Favorites } from 'ui';

function App() {
  const citiesStore = useContext(CitiesStore);
  const preferencesStore = useContext(PreferencesStore);

  useEffect(() => {
    citiesStore.getAllCities();
  }, []);

  const onDropdownInputChange = async (term: string): Promise<void> => {
    citiesStore.getCitiesByFilter(term);
  };

  const onDropdownEndReached = async (): Promise<void> => {
    citiesStore.getMoreCities();
  };

  return (
    <div className="App">
      <section className="leftbar-section">
        <Favorites
          heading="Your favorites"
          favorites={preferencesStore.activeFavorites}
          renderItem={(item: CityInfo) => <CitySuggestion key={item.geonameid} city={item} />}
        />
      </section>
      <section className="main-section">
        <Dropdown
          placeholder="Type to filter by city name or country"
          onInputChange={onDropdownInputChange}
          endReached={!citiesStore.hasMoreCitiesToFetch}
          error={citiesStore.error}
          suggestions={citiesStore.currentCitiesList}
          isFetching={citiesStore.isFetching}
          renderItem={(item: CityInfo) => <CitySuggestion key={item.geonameid} city={item} />}
          onEndReached={onDropdownEndReached}
        />
      </section>
    </div>
  );
}

export default observer(App);
