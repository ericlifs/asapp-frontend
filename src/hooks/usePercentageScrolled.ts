import { useEffect, useState } from 'react';

const usePercentageScrolled = (element: HTMLElement | null): number => {
  const [scrollPercentage, setScrollPercentage] = useState(0);

  const onElementScrolled = (): void => {
    const maxY = element!.scrollHeight! - element!.clientHeight!;
    const percentage = (element!.scrollTop * 100) / maxY;

    setScrollPercentage(percentage);
  };

  useEffect(() => {
    if (element) {
      element.addEventListener('scroll', onElementScrolled);

      return () => {
        element?.removeEventListener('scroll', onElementScrolled);
      };
    }
  }, [element]);

  return scrollPercentage;
};

export default usePercentageScrolled;
