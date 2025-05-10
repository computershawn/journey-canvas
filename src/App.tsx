import { useState } from 'react';
import Artboard from './components/Artboard';
import ControlPanel from './components/ControlPanel';
import { HStack } from '@chakra-ui/react';

function App() {
  const [compIndex, setCompIndex] = useState(0);

  return (
    <HStack align='flex-start'>
      <ControlPanel onChangeComp={setCompIndex} />
      <Artboard compIndex={compIndex} />
    </HStack>
  );
}

export default App;
