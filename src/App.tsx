import { useState } from 'react';
import './App.css';
import Artboard from './components/Artboard';
import Controls from './components/Controls';
import { Heading, HStack, VStack } from '@chakra-ui/react';
import CompSelector from './components/CompSelector';

function App() {
  const [compIndex, setCompIndex] = useState(0);

  return (
    <HStack align='flex-start'>
      <VStack w={300} h='100vh' bg='#eee' p={4} align='flex-start'>
        <Heading size='lg' mb={4}>
          journey
        </Heading>
        <CompSelector onChangeComp={setCompIndex} />
        <Controls />
      </VStack>
      <Artboard compIndex={compIndex} />
    </HStack>
  );
}

export default App;
