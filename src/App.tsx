import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { CitiesStore } from './stores';
import Dropdown from './ui/Dropdown';

function App() {
  const citiesStore = useContext(CitiesStore);

  useEffect(() => {
    citiesStore.getAllCities();
  }, []);

  const onDropdownInputChange = async (term: string): Promise<void> => {
    citiesStore.getCitiesByFilter(term);
  };

  return (
    <div className="App">
      <Dropdown
        placeholder="Type to filter by city name or country"
        onInputChange={onDropdownInputChange}
        isFetching={citiesStore.isFetching}
      />
    </div>
  );
}

export default observer(App);
