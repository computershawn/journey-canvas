import { useState } from 'react';

import palettes from 'nice-color-palettes/200';

import { HStack } from '@chakra-ui/react';

import Artboard from './components/Artboard';
import { Toaster } from './components/ui/toaster';
import ControlPanel from './components/ControlPanel';
import { ControlsProvider } from './context/ControlsProvider';
import { ColorArray, CtrlPoint } from './types';

function App() {
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  const [beziCtrlPts, setBeziCtrlPts] = useState<CtrlPoint[]>([]);
  const [bgChecked, setBgChecked] = useState(true);
  const [colorChecked, setColorChecked] = useState(true);
  const [compIndex, setCompIndex] = useState(0);
  const [palette, setPalette] = useState<ColorArray>([]);

  const allColors = palettes as ColorArray[];

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
      <Toaster />
    </ControlsProvider>
  );
}

export default App;
