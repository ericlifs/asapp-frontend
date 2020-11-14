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
    // I used a Promise.allSettled instead of a Promise.all because otherwise after facing the first error it would stop
    // doing the remaining requests (Promise.allSettled does every request even if an error is thrown in the first request)
    const citiesInformationById = await Promise.allSettled(
      cities.map((city: number) => api.get(`${API_CONFIG.ENDPOINTS.CITIES}/${city}`, {})),
    );

    return citiesInformationById.reduce((favorites, cityResponse, currentIndex) => {
      const cityId = cities[currentIndex];

      return {
        ...favorites,
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
      // I go through the local preferred cities information finding for the cities that got an error while
      // trying to get the whole city information
      const citiesToFetch = Object.keys(this.favorites).reduce((accum: number[], currentCity) => {
        const cityId = Number(currentCity);

        // If it's an instance of an Error object it's because there was an error while doing the GET
        // request for getting the city information by id
        if (this.favorites[cityId] instanceof Error) {
          return [...accum, cityId];
        }

        return accum;
      }, []);

      // I call the getFavoritesCitiesInformation function again but only with the cities that got an error
      const res = await this.getFavoritesCitiesInformation(citiesToFetch);

      // I save the new information into store
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
      // Gets the preferred cities IDs already selected by the user
      const { data } = await api.get<PreferredCitiesResponse>(
        `${API_CONFIG.ENDPOINTS.PREFERENCES}/${API_CONFIG.ENDPOINTS.CITIES}`,
        {},
      );

      // Does a GET for each ID in order to get the city information and saves that preferred information locally within the store
      // (in order to avoid doing more requests in the future)
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
    // I get the new preferred list state by calling a utils function which based on the current state
    // and a city, returns a new preferred list
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
      // Performs a patch for toggling the city in the backend
      await api.patch(`${API_CONFIG.ENDPOINTS.PREFERENCES}/${API_CONFIG.ENDPOINTS.CITIES}`, {
        [city.geonameid]: !this.favorites[city.geonameid],
      });

      // If the patch was succesfull I also save the store locally (in order to avoid doing a GET)
      this.onFavoriteSuccessfullyToggled(city);
    } catch (error) {
      // There was an error while doing the patch, so I put the store into an error state
      this.onFavoriteErrorToggled(error);
    }
  }
}

export default createContext(new PreferencesStore());
