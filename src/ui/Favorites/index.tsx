/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { observer } from 'mobx-react-lite';
import React, { useContext, useMemo, useState } from 'react';
import { PreferencesStore } from 'stores';
import { ErrorMessage, Loading } from 'ui';
import ChevronUp from 'assets/up-chevron.png';
import ChevronDown from 'assets/down-chevron.png';
import './index.scss';

interface FavoritesProps {
  heading: string;
  favorites: any[];
  renderItem: (item: any) => JSX.Element;
}

const Favorites: React.FC<FavoritesProps> = (props: FavoritesProps) => {
  const preferencesStore = useContext(PreferencesStore);
  const [opened, setOpened] = useState(false);

  const toggleMobileMenu = () => {
    setOpened((prevOpened) => !prevOpened);
  };

  const ImageSrc = useMemo(() => (opened ? ChevronUp : ChevronDown), [opened]);

  const listContent = useMemo(() => {
    if (preferencesStore.isFetching) {
      return <Loading />;
    }

    if (preferencesStore.fetchingError) {
      return (
        <ErrorMessage
          error={preferencesStore.fetchingError}
          action="Retry"
          onClick={() => preferencesStore.getFavorites()}
        />
      );
    }

    if (props.favorites.length > 0) {
      return props.favorites.map(props.renderItem);
    }

    return <h2 className="favorites__subtitle">Oops... you do not have favorites yet</h2>;
  }, [props.favorites, preferencesStore.isFetching]);

  return (
    <section className={`favorites ${opened ? 'mobile-opened' : 'mobile-closed'}`}>
      <div className="favorites__header" onClick={toggleMobileMenu}>
        <h1 className="favorites__title">{props.heading}</h1>
        <img src={ImageSrc} className="favorites__chevron" />
      </div>
      <div className="favorites__content">{listContent}</div>
    </section>
  );
};

export default observer(Favorites);
