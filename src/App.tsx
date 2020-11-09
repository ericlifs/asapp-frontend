import React from 'react';
import api from './api';
import API_CONFIG from './api/config';
import Dropdown from './ui/Dropdown';

function App() {
  const onDropdownInputChange = (term: string) => {
    api.get(API_CONFIG.ENDPOINTS.CITIES, { filter: term, offset: 0, limit: 20 });
  };

  return (
    <div className="App">
      <Dropdown
        placeholder="Type to filter by city name or country"
        onInputChange={onDropdownInputChange}
      />
    </div>
  );
}

export default App;
