import { useState } from 'react';

import { HStack } from '@chakra-ui/react';

import Artboard from './components/Artboard';
import ControlPanel from './components/ControlPanel';
import { ControlsProvider } from './context/ControlsProvider';

function App() {
  const [compIndex, setCompIndex] = useState(0);

  return (
    <ControlsProvider>
      <HStack align='flex-start'>
        <ControlPanel onChangeComp={setCompIndex} />
        <Artboard compIndex={compIndex} />
      </HStack>
    </ControlsProvider>
  );
}

export default App;
