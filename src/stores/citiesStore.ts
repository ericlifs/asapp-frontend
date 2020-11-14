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

  @action
  protected async fetchCitiesByTerm(filter = '', offset = 0): Promise<CitiesResponse | undefined> {
    this.error = '';
    this.fetchStatus = FetchStatus.Fetching;

    try {
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

  @action
  protected resetFilter(filter: string): void {
    this.filteredCities = [];
    this.currentFilter = filter;
    this.filteredCitiesPage = 0;
    this.filteredCitiesTotal = 0;
  }

  @action
  public async getCitiesByFilter(filter: string) {
    if (filter !== this.currentFilter) {
      this.resetFilter(filter);
    }

    if (filter) {
      const response = await this.fetchCitiesByTerm(filter, this.filteredCitiesPage);

      if (response) {
        this.filteredCities = [...this.filteredCities, ...response.data];
        this.filteredCitiesTotal = response.total;
        this.filteredCitiesPage += 1;
      }
    }
  }

  @action
  public async getAllCities() {
    const response = await this.fetchCitiesByTerm('', this.allCitiesPage);

    if (response) {
      this.allCities = [...this.allCities, ...response.data];
      this.allCitiesTotal = response.total;
      this.allCitiesPage += 1;
    }
  }

  @action
  public getMoreCities() {
    if (this.isFilteringMode) {
      return this.getCitiesByFilter(this.currentFilter);
    }

    this.getAllCities();
  }
}

export default createContext(new CitiesStore());
