import { createContext } from 'react';
import { makeAutoObservable, action, computed } from 'mobx';
import api from '../api';
import { CitiesResponse, CityInfo, FetchStatus } from '../interfaces';
import API_CONFIG from '../api/config';

class CitiesStore {
  constructor() {
    makeAutoObservable(this);
  }

  public fetchStatus = FetchStatus.Initial;

  public allCities: CityInfo[] = [];

  public filteredCities: CityInfo[] = [];

  public currentFilter: string = '';

  protected allCitiesPage: number = 0;

  protected filteredCitiesPage: number = 0;

  @computed public get currentCitiesList() {
    if (this.currentFilter !== '') {
      return this.filteredCities;
    }

    return this.allCities;
  }

  @computed public get isFetching() {
    return this.fetchStatus === FetchStatus.Fetching;
  }

  protected async fetchCitiesByTerm(filter = '', offset = 0): Promise<CitiesResponse> {
    return api.get<CitiesResponse>(API_CONFIG.ENDPOINTS.CITIES, {
      filter,
      offset: offset * 20,
      limit: 20,
    });
  }

  @action protected resetFilter(filter: string): void {
    this.filteredCities = [];
    this.currentFilter = filter;
    this.filteredCitiesPage = 0;
  }

  @action public async getCitiesByFilter(filter: string) {
    if (filter !== this.currentFilter) {
      this.resetFilter(filter);
    }

    if (filter) {
      this.fetchStatus = FetchStatus.Fetching;

      try {
        const res = await this.fetchCitiesByTerm(filter, this.filteredCitiesPage);

        this.filteredCities = [...this.filteredCities, ...res.data];
        this.fetchStatus = FetchStatus.Fetched;
        this.filteredCitiesPage += 1;
      } catch (err) {
        this.fetchStatus = FetchStatus.Error;
      }
    }
  }

  @action public async getAllCities() {
    this.fetchStatus = FetchStatus.Fetching;

    try {
      const res = await this.fetchCitiesByTerm('', this.allCitiesPage);

      this.allCities = [...this.allCities, ...res.data];
      this.fetchStatus = FetchStatus.Fetched;
      this.allCitiesPage += 1;
    } catch (err) {
      this.fetchStatus = FetchStatus.Error;
    }
  }

  public getMoreCities() {
    if (this.currentFilter) {
      return this.getCitiesByFilter(this.currentFilter);
    }

    this.getAllCities();
  }
}

export default createContext(new CitiesStore());
