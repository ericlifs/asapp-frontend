/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { action, computed, makeAutoObservable } from 'mobx';
import { createContext } from 'react';
import { getNewFavoritesState } from 'utils';
import { CityInfo, Favorites, FetchStatus, PreferredCitiesResponse } from 'interfaces';
import api, { API_CONFIG } from '../api';

class PreferencesStore {
  constructor() {
    makeAutoObservable(this);
  }

  public submitStatus = FetchStatus.Initial;

  public fetchStatus = FetchStatus.Initial;

  public favorites: Favorites = {};

  public submittingCity?: number;

  public fetchingError: string = '';

  public submittingError: string = '';

  protected timeoutId?: NodeJS.Timeout;

  @computed public get isFetching() {
    return this.fetchStatus === FetchStatus.Fetching;
  }

  @computed public get isSubmitting() {
    return this.submitStatus === FetchStatus.Fetching;
  }

  @computed
  public get activeFavorites() {
    return Object.values(this.favorites).filter(Boolean);
  }

  @action
  public async getFavorites(): Promise<void> {
    this.fetchingError = '';
    this.fetchStatus = FetchStatus.Fetching;

    try {
      const { data } = await api.get<PreferredCitiesResponse>(
        `${API_CONFIG.ENDPOINTS.PREFERENCES}/${API_CONFIG.ENDPOINTS.CITIES}`,
        {},
      );

      const citiesPromisesSettled = await Promise.allSettled(
        data.map((cityId: number) => api.get(`${API_CONFIG.ENDPOINTS.CITIES}/${cityId}`, {})),
      );

      this.favorites = citiesPromisesSettled.reduce((accum, cityResponse, index) => {
        const cityId = data[index];

        return {
          ...accum,
          [cityId]: cityResponse.status === 'fulfilled' ? cityResponse.value : cityResponse.reason,
        };
      }, {});

      this.fetchStatus = FetchStatus.Fetched;
    } catch (error) {
      this.fetchingError = error.message;
      this.fetchStatus = FetchStatus.Error;
    }
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

    this.submittingCity = city.geonameid;
    this.submitStatus = FetchStatus.Fetching;

    try {
      await api.patch<number>(`${API_CONFIG.ENDPOINTS.PREFERENCES}/${API_CONFIG.ENDPOINTS.CITIES}`, {
        [city.geonameid]: !this.favorites[city.geonameid],
      });

      this.favorites = getNewFavoritesState(this.favorites, city);
      this.submitStatus = FetchStatus.Fetched;
    } catch (err) {
      this.submittingError = err.message;
      this.submitStatus = FetchStatus.Error;

      this.timeoutId = setTimeout(() => {
        this.submittingError = '';
        this.submittingCity = undefined;
      }, 5000);
    }
  }
}

export default createContext(new PreferencesStore());
