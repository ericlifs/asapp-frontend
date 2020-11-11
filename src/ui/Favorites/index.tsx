/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useMemo } from 'react';
import './index.scss';

interface FavoritesProps {
  heading: string;
  favorites: any[];
  renderItem: (item: any) => JSX.Element;
}

const Favorites: React.FC<FavoritesProps> = (props: FavoritesProps) => {
  const listContent = useMemo(() => {
    if (props.favorites.length > 0) {
      return <div className="favorites__list">{props.favorites.map(props.renderItem)}</div>;
    }

    return <h2 className="favorites__subtitle">Oops... you do not have favorites yet</h2>;
  }, [props.favorites]);

  return (
    <section className="favorites">
      <h1 className="favorites__title">{props.heading}</h1>
      {listContent}
    </section>
  );
};

export default Favorites;
