import CityInfo from './cityInfo';

type CitiesResponse = {
  data: CityInfo[];
  total: number;
  links: {
    first: string;
    next?: string;
    prev?: string;
    last: string;
  };
  filter?: string;
};

export default CitiesResponse;
