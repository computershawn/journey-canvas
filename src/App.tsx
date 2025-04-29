import './App.css';
import Artboard from './components/Artboard';
import Controls from './components/Controls';
import { HStack } from '@chakra-ui/react';

function App() {
  return (
    <HStack align="flex-start">
      <Controls />
      <Artboard />
    </HStack>
  );
}

export default App;
