import { useEffect, useState } from 'react';

import { HStack } from '@chakra-ui/react';

import Artboard from './components/Artboard';
import ControlPanel from './components/ControlPanel';
import { ControlsProvider } from './context/ControlsProvider';
import { useFetchColors } from './hooks/useFetchColors';
import { ColorArray, CtrlPoint } from './types';
import { getRandomIndex } from './utils/helpers';

function App() {
  const [backgroundIndex, setBackgroundIndex] = useState(1);
  const [beziCtrlPts, setBeziCtrlPts] = useState<CtrlPoint[]>([]);
  const [bgChecked, setBgChecked] = useState(true);
  const [colorChecked, setColorChecked] = useState(true);
  const [compIndex, setCompIndex] = useState(0);
  const [palette, setPalette] = useState<ColorArray>([]);

  const { allColors } = useFetchColors();

  useEffect(() => {
    const savedComps = window.localStorage.getItem('saved_comps');
    if (savedComps) {
      const parsed = JSON.parse(savedComps);
      const pal = parsed?.[0]?.palette;
      setPalette(pal);
    } else if (allColors.length > 0) {
      const randomIndex = getRandomIndex(allColors.length);
      const pal = allColors[randomIndex];
      setPalette(pal);
    }
  }, [allColors]);

  return (
    <ControlsProvider>
      <HStack align='flex-start'>
        <ControlPanel
          allColors={allColors}
          backgroundIndex={backgroundIndex}
          beziCtrlPts={beziCtrlPts}
          bgChecked={bgChecked}
          colorChecked={colorChecked}
          onChangeComp={setCompIndex}
          palette={palette}
          setBgChecked={setBgChecked}
          setBackgroundIndex={setBackgroundIndex}
          setColorChecked={setColorChecked}
          setPalette={setPalette}
        />
        <Artboard
          backgroundIndex={backgroundIndex}
          beziCtrlPts={beziCtrlPts}
          bgChecked={bgChecked}
          colorChecked={colorChecked}
          compIndex={compIndex}
          palette={palette}
          setBeziCtrlPts={setBeziCtrlPts}
        />
      </HStack>
    </ControlsProvider>
  );
}

export default App;
