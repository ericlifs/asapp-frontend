/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { action, computed, makeAutoObservable } from 'mobx';
import { createContext } from 'react';
import { getNewFavoritesState } from 'utils';
import { CityInfo, Favorites, FetchStatus } from 'interfaces';
import api, { API_CONFIG } from '../api';

class PreferencesStore {
  constructor() {
    makeAutoObservable(this);
  }

  public fetchStatus = FetchStatus.Initial;

  public favorites: Favorites = {};

  public submittingCity?: number;

  public error: string = '';

  protected timeoutId?: NodeJS.Timeout;

  @computed public get isFetching() {
    return this.fetchStatus === FetchStatus.Fetching;
  }

  @computed
  public get activeFavorites() {
    return Object.values(this.favorites).filter(Boolean);
  }

  /**
   * Adds or removes city from favorites lists
   * @param {CityInfo} city - City info object which will be added/removed from favorites list
   */
  @action
  public async toggleFavorite(city: CityInfo) {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    const [newState, newValue] = getNewFavoritesState(this.favorites, city);
    this.submittingCity = city.geonameid;
    this.fetchStatus = FetchStatus.Fetching;

    try {
      await api.patch<number>(`${API_CONFIG.ENDPOINTS.PREFERENCES}/${API_CONFIG.ENDPOINTS.CITIES}`, newValue);

      this.favorites = newState;
      this.fetchStatus = FetchStatus.Fetched;
    } catch (err) {
      this.error = err.message;
      this.fetchStatus = FetchStatus.Error;

      this.timeoutId = setTimeout(() => {
        this.error = '';
        this.submittingCity = undefined;
      }, 5000);
    }
  }
}

export default createContext(new PreferencesStore());
