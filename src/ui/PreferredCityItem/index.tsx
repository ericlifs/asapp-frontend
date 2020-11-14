import { CityInfo } from 'interfaces';
import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { PreferencesStore } from 'stores';
import { CitySuggestion, ErrorMessage } from 'ui';

interface PreferredCityItemProps {
  item: CityInfo | Error;
}

const PreferredCityItem: React.FC<PreferredCityItemProps> = (props: PreferredCityItemProps) => {
  const preferencesStore = useContext(PreferencesStore);

  if (props.item instanceof Error) {
    return (
      <ErrorMessage
        error={(props.item as Error).message}
        action="Retry"
        onClick={() => preferencesStore.retryFetchPreferredCitiesInformation()}
      />
    );
  }

  return <CitySuggestion city={props.item as CityInfo} />;
};

export default observer(PreferredCityItem);
