/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { action, computed, observable } from 'mobx';
import { createContext } from 'react';
import { getNewFavoritesState } from 'utils';
import { CityInfo, Favorites, FetchStatus, PreferredCitiesResponse } from 'interfaces';
import api, { API_CONFIG } from '../api';

class PreferencesStore {
  @observable public submitStatus = FetchStatus.Initial;

  @observable public fetchStatus = FetchStatus.Initial;

  @observable public favorites: Favorites = {};

  @observable public submittingCity?: number;

  @observable public fetchingError: string = '';

  @observable public submittingError: string = '';

  @observable protected timeoutId?: NodeJS.Timeout;

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

  /**
   * Takes an array of cities ids and foreach one it requests it information
   * @param {number[]} cities - Cities' ids whose information will be requested
   */
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

  /**
   * Takes the current favorites cities which information couldn't be fetched initially and tries to refetch it and save it within the store info
   * @async
   */
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

  /**
   * Gets user favorites cities from the backend and saves that information within the store
   * @async
   */
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

  /**
   * Saves city information within store favorites object and sets the store into a "success mode" after toggling favorite in the backend
   * @param {CityInfo} city - City info object which was added/removed from favorites list in the backend
   */
  @action
  protected onFavoriteSuccessfullyToggled(city: CityInfo) {
    this.favorites = getNewFavoritesState(this.favorites, city);
    this.submitStatus = FetchStatus.Fetched;
    this.submittingCity = undefined;
  }

  /**
   * Clears current error information saved within the store
   */
  @action
  clearCurrentErrorAfterFiveSeconds() {
    this.timeoutId = setTimeout(() => {
      this.submittingError = '';
      this.submittingCity = undefined;
    }, 5000);
  }

  /**
   * Saves error information within the store and after 5 seconds it reverts those changes
   * @param {Error} error - Error information
   */
  @action
  protected onFavoriteErrorToggled(error: Error) {
    this.submittingError = error.message;
    this.submitStatus = FetchStatus.Error;

    this.clearCurrentErrorAfterFiveSeconds();
  }

  /**
   * Calls backend for toggling city from favorites lists and saves that change within the store
   * @param {CityInfo} city - City info object which will be added/removed from favorites list
   * @async
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
