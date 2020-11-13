import { CityInfo } from 'interfaces';
import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { PreferencesStore } from 'stores';
import { CitySuggestion } from 'ui';
import ErrorMessage from 'ui/ErrorMessage';

interface FavoriteItemProps {
  item: CityInfo | Error;
}

const FavoriteItem: React.FC<FavoriteItemProps> = (props: FavoriteItemProps) => {
  const preferencesStore = useContext(PreferencesStore);

  if (props.item instanceof Error) {
    return (
      <ErrorMessage
        error={(props.item as Error).message}
        action="Retry"
        onClick={() => preferencesStore.retryFetchFavoritesInformation()}
      />
    );
  }

  return <CitySuggestion city={props.item as CityInfo} />;
};

export default observer(FavoriteItem);
