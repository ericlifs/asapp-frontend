import { action, computed, observable } from 'mobx';
import { createContext } from 'react';
import api from '../api';
import API_CONFIG from '../api/config';
import { CitiesResponse, CityInfo, FetchStatus } from '../interfaces';

const LIMIT = 20;

class CitiesStore {
  @observable public fetchStatus = FetchStatus.Initial;

  @observable public allCities: CityInfo[] = [];

  @observable public filteredCities: CityInfo[] = [];

  @observable public currentFilter: string = '';

  @observable public error: string = '';

  @observable protected allCitiesPage: number = 0;

  @observable protected allCitiesTotal: number = 0;

  @observable protected filteredCitiesPage: number = 0;

  @observable protected filteredCitiesTotal: number = 0;

  @computed public get isFilteringMode() {
    return this.currentFilter !== '';
  }

  @computed public get currentCitiesList() {
    if (this.isFilteringMode) {
      return this.filteredCities;
    }

    return this.allCities;
  }

  @computed public get isFetching() {
    return this.fetchStatus === FetchStatus.Fetching;
  }

  @computed public get hasMoreCitiesToFetch() {
    const totalPages = this.isFilteringMode ? this.filteredCitiesTotal : this.allCitiesTotal;
    const currentPage = this.isFilteringMode ? this.filteredCitiesPage : this.allCitiesPage;
    const fetchesToDo = Math.ceil(totalPages / LIMIT);

    return fetchesToDo > currentPage;
  }

  /**
   * Fetches next page of cities list (used for all cities list or filtered cities list)
   * @param {string} filter - Term that will be used for filtering cities
   * @param {number} offset - Current offset that will be used for paginating cities
   * @async
   */
  @action
  protected async fetchCitiesByTerm(filter = '', offset = 0): Promise<CitiesResponse | undefined> {
    this.error = '';
    this.fetchStatus = FetchStatus.Fetching;

    try {
      // I do a GET request to the backend with the provided filter and page/offset
      const response = await api.get<CitiesResponse>(API_CONFIG.ENDPOINTS.CITIES, {
        filter,
        offset: offset * LIMIT,
        limit: LIMIT,
      });

      this.fetchStatus = FetchStatus.Fetched;

      return response;
    } catch (error) {
      this.error = error.message;
      this.fetchStatus = FetchStatus.Error;
    }
  }

  /**
   * Clears the previous filter state information from the store
   */
  @action
  protected resetFilter(): void {
    this.filteredCities = [];
    this.filteredCitiesPage = 0;
    this.filteredCitiesTotal = 0;
  }

  /**
   * Fetches next page of cities list, saves the response into store and increases by one the current page (used for all cities list or filtered cities list)
   * @param {string} filter - Term that will be used for filtering cities
   * @async
   */
  @action
  public async getCitiesByFilter(filter: string) {
    // If the filter is different than the previous one I reset the filter information and save the new one
    if (filter !== this.currentFilter) {
      this.resetFilter();
      this.currentFilter = filter;
    }

    // If the filter is not empty, I fetch the cities by the term and the current page for filtering mode
    if (filter) {
      const response = await this.fetchCitiesByTerm(filter, this.filteredCitiesPage);

      if (response) {
        // I save the response data into store and increase the current page by one
        this.filteredCities = [...this.filteredCities, ...response.data];
        this.filteredCitiesTotal = response.total;
        this.filteredCitiesPage += 1;
      }
    }
  }

  /**
   * Fetches next page of all cities list, saves the response into store and increases by one the current page
   * @async
   */
  @action
  public async getAllCities() {
    // I do a new GET cities request filtering by the empty filter and the current page for all cities mode
    const response = await this.fetchCitiesByTerm('', this.allCitiesPage);

    if (response) {
      // I save the response data into store and increase the current page by one
      this.allCities = [...this.allCities, ...response.data];
      this.allCitiesTotal = response.total;
      this.allCitiesPage += 1;
    }
  }

  /**
   * Fetches cities lists (all or filtered) next page information
   */
  @action
  public getMoreCities() {
    // If there is a filter, I should get more cities by filtering by that term
    if (this.isFilteringMode) {
      return this.getCitiesByFilter(this.currentFilter);
    }

    // Otherwise I get more cities but without using any filter.--.,jhjmnb
    this.getAllCities();
  }
}

export default createContext(new CitiesStore());
