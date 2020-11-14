/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { observer } from 'mobx-react-lite';
import React, { useContext, useMemo, useState } from 'react';
import { PreferencesStore } from 'stores';
import { ErrorMessage, Loading } from 'ui';
import ChevronUp from 'assets/up-chevron.png';
import ChevronDown from 'assets/down-chevron.png';
import './index.scss';
import { CityInfo } from 'interfaces';

interface PreferredCitiesProps {
  heading: string;
  preferredCities: (CityInfo | Error)[];
  renderItem: (item: any) => JSX.Element;
}

const PreferredCities: React.FC<PreferredCitiesProps> = (props: PreferredCitiesProps) => {
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
          onClick={() => preferencesStore.getPreferredCities()}
        />
      );
    }

    if (props.preferredCities.length > 0) {
      return props.preferredCities.map(props.renderItem);
    }

    return <h2 className="preferred-cities__subtitle">Oops... you do not have preferred cities yet</h2>;
  }, [props.preferredCities, preferencesStore.isFetching]);

  return (
    <section className={`preferred-cities ${opened ? 'mobile-opened' : 'mobile-closed'}`}>
      <div className="preferred-cities__header" onClick={toggleMobileMenu}>
        <h1 className="preferred-cities__title">{props.heading}</h1>
        <img src={ImageSrc} className="preferred-cities__chevron" />
      </div>
      <div className="preferred-cities__content">{listContent}</div>
    </section>
  );
};

export default observer(PreferredCities);
