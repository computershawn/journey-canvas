import { useEffect, useState } from 'react';

import { HStack } from '@chakra-ui/react';

import Artboard from './components/Artboard';
import ControlPanel from './components/ControlPanel';
import { ControlsProvider } from './context/ControlsProvider';
import { useFetchColors } from './hooks/useFetchColors';
import { ColorArray } from './types';
import { getRandomIndex } from './utils/helpers';

function App() {
  const [compIndex, setCompIndex] = useState(0);
  const [palette, setPalette] = useState<ColorArray>([]);
  const [bgChecked, setBgChecked] = useState(true);
  const [backgroundIndex, setBackgroundIndex] = useState(1);

  const { allColors } = useFetchColors();

  useEffect(() => {
    if (allColors.length > 0) {
      const randomIndex = getRandomIndex(allColors.length);
      const pal = allColors[randomIndex];
      setPalette(pal);
    }
  }, [allColors, allColors.length]);

  return (
    <ControlsProvider>
      <HStack align='flex-start'>
        <ControlPanel
          allColors={allColors}
          backgroundIndex={backgroundIndex}
          bgChecked={bgChecked}
          onChangeComp={setCompIndex}
          palette={palette}
          setBgChecked={setBgChecked}
          setBackgroundIndex={setBackgroundIndex}
          setPalette={setPalette}
        />
        <Artboard backgroundIndex={backgroundIndex} bgChecked={bgChecked} compIndex={compIndex} palette={palette} />
      </HStack>
    </ControlsProvider>
  );
}

export default App;
