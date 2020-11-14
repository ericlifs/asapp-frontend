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

  protected async getFavoritesCitiesInformation(cities: number[]) {
    const citiesPromisesSettled = await Promise.allSettled(
      cities.map((city: number) => api.get(`${API_CONFIG.ENDPOINTS.CITIES}/${city}`, {})),
    );

    return citiesPromisesSettled.reduce((accum, cityResponse, index) => {
      const cityId = cities[index];

      return {
        ...accum,
        [cityId]: cityResponse.status === 'fulfilled' ? cityResponse.value : cityResponse.reason,
      };
    }, {});
  }

  @action
  public async retryFetchFavoritesInformation() {
    this.fetchStatus = FetchStatus.Fetching;

    try {
      const citiesToFetch = Object.keys(this.favorites).reduce((accum: number[], currentCity) => {
        const cityId = Number(currentCity);

        if (this.favorites[cityId] instanceof Error) {
          return [...accum, cityId];
        }

        return accum;
      }, []);

      const res = await this.getFavoritesCitiesInformation(citiesToFetch);

      this.favorites = {
        ...this.favorites,
        ...res,
      };

      this.fetchStatus = FetchStatus.Fetched;
    } catch (err) {
      console.log(err);
    }
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

      this.favorites = await this.getFavoritesCitiesInformation(data);

      this.fetchStatus = FetchStatus.Fetched;
    } catch (error) {
      this.fetchingError = error.message;
      this.fetchStatus = FetchStatus.Error;
    }
  }

  @action protected onFavoriteSuccessfullyToggled(city: CityInfo) {
    this.favorites = getNewFavoritesState(this.favorites, city);
    this.submitStatus = FetchStatus.Fetched;
  }

  @action clearCurrentError() {
    this.submittingError = '';
    this.submittingCity = undefined;
  }

  @action protected onFavoriteErrorToggled(error: Error) {
    this.submittingError = error.message;
    this.submitStatus = FetchStatus.Error;

    this.timeoutId = setTimeout(() => this.clearCurrentError(), 5000);
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
      await api.patch(`${API_CONFIG.ENDPOINTS.PREFERENCES}/${API_CONFIG.ENDPOINTS.CITIES}`, {
        [city.geonameid]: !this.favorites[city.geonameid],
      });

      this.onFavoriteSuccessfullyToggled(city);
    } catch (error) {
      this.onFavoriteErrorToggled(error);
    }
  }
}

export default createContext(new PreferencesStore());
