import { useEffect, useState } from 'react';

import { ColorArray } from '../types';
import { loggy } from '../utils/helpers';

export const useFetchColors = () => {
  const [allColors, setAllColors] = useState<ColorArray[]>([]);

  useEffect(() => {
    const getColors = async () => {
      const colorsUrl =
        'https://raw.githubusercontent.com/Jam3/nice-color-palettes/master/200.json';

      try {
        const data: ColorArray[] = await fetch(colorsUrl).then((res) =>
          res.json()
        );
        setAllColors(data);
      } catch (error) {
        loggy.error('Error fetching colors:', error);
      }
    };

    getColors();
  }, []);

  return { allColors };
};
