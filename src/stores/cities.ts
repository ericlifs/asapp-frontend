import { createContext } from 'react';
import { makeAutoObservable, action, computed } from 'mobx';
import api from '../api';
import { CitiesResponse, CityInfo, FetchStatus } from '../interfaces';
import API_CONFIG from '../api/config';

class CitiesStore {
  constructor() {
    makeAutoObservable(this);
  }

  public fetchAllCitiesStatus = FetchStatus.Initial;

  public allCities: CityInfo[] = [];

  @computed public get isFetching() {
    return this.fetchAllCitiesStatus === FetchStatus.Fetching;
  }

  protected async fetchCitiesByTerm(filter = '', offset = 0): Promise<CitiesResponse> {
    return api.get<CitiesResponse>(API_CONFIG.ENDPOINTS.CITIES, {
      filter,
      offset,
      limit: 20,
    });
  }

  @action public async getCitiesByFilter(filter: string) {
    await this.fetchCitiesByTerm(filter);
  }

  @action public async getAllCities() {
    this.fetchAllCitiesStatus = FetchStatus.Fetching;

    try {
      const res = await this.fetchCitiesByTerm();

      this.allCities = res.data;
      this.fetchAllCitiesStatus = FetchStatus.Fetched;
    } catch (err) {
      this.fetchAllCitiesStatus = FetchStatus.Error;
    }
  }
}

export default createContext(new CitiesStore());
