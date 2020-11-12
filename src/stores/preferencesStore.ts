/* eslint-disable no-unused-vars */
import { action, computed, makeAutoObservable } from 'mobx';
import { createContext } from 'react';
import { getNewFavoritesState } from 'utils';
import { CityInfo, Favorites } from 'interfaces';

class PreferencesStore {
  constructor() {
    makeAutoObservable(this);
  }

  public favorites: Favorites = {};

  @computed
  public get activeFavorites() {
    return Object.values(this.favorites).filter(Boolean);
  }

  /**
   * Adds or removes city from favorites lists
   * @param {CityInfo} city - City info object which will be added/removed from favorites list
   */
  @action
  public toggleFavorite(city: CityInfo) {
    this.favorites = getNewFavoritesState(this.favorites, city);
  }
}

export default createContext(new PreferencesStore());
