import { useEffect, useState } from 'react';

const useDebounce = <T>(value: T, timeout: number): T => {
  const [state, setState] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setState(value), timeout);

    return (): void => {
      clearTimeout(handler);
    };
  }, [value, timeout]);

  return state;
};

export default useDebounce;
