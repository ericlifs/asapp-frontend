/* eslint-disable no-unused-vars */
import { RefObject, useEffect } from 'react';

// prettier-ignore
const useOnClickOutside = (ref: RefObject<HTMLElement>, handler: (event: MouseEvent | TouchEvent) => void): RefObject<HTMLElement>[] => {
  useEffect((): (() => void) => {
    const node = ref.current;

    const listener = (event: MouseEvent | TouchEvent): void => {
      if (!ref.current || ref.current!.contains(event.target as Node)) {
        return;
      }

      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return (): void => {
      if (node) {
        document.removeEventListener('mousedown', listener);
        document.removeEventListener('touchstart', listener);
      }
    };
  }, [ref.current]);

  return [ref];
};

export default useOnClickOutside;
