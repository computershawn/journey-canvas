import {
  FaArrowRotateRight,
  FaCloudArrowDown,
  FaEye,
  FaEyeSlash,
  FaFloppyDisk,
} from 'react-icons/fa6';

import {
  Button,
  ButtonGroup,
  Flex,
  IconButton,
  Text,
  VStack,
} from '@chakra-ui/react';

import Slider from './ui/slider';
import Switch from './ui/switch';
import { useState } from 'react';
import { FaPlay } from 'react-icons/fa';

const Controls = () => {
  const [pathsChecked, setPathsChecked] = useState(true);
  const [geomChecked, setGeomChecked] = useState(true);
  const [parxChecked, setParxChecked] = useState(true);
  const [colorChecked, setColorChecked] = useState(true);
  const [bgChecked, setBgChecked] = useState(true);
  const [playing, setPlaying] = useState(false);

  const pickColors = () => {
    console.log('pick colors');
  };

  const cycleBackground = () => {
    console.log('cycle background color');
  };

  const saveComp = () => {
    console.log('save current composition to storage');
  };

  const exportImage = () => {
    console.log('export current comp as image');
  };

  return (
    <>
      <VStack bg='#eee' p={2} gap={2} align='flex-start'>
        <Slider size='sm' defaultValue={0} label='frame' wd={240} />
        <Slider size='sm' defaultValue={0} label='balance' wd={240} />
        <Slider size='sm' defaultValue={0} label='diff' wd={240} />

        <Button
          variant='outline'
          aria-label='Play animation'
          w='full'
          onClick={() => setPlaying(!playing)}
        >
          <FaPlay color={playing ? 'green' : 'black'} /> Animate
        </Button>
      </VStack>

      <VStack bg='#eee' p={2} gap={2} align='flex-start'>
        <Flex w='100%' align='center' justify='space-between'>
          <Text textStyle='sm'>Paths</Text>
          <IconButton
            size='xs'
            aria-label='hide or show path'
            onClick={() => setPathsChecked(!pathsChecked)}
          >
            {pathsChecked ? (
              <FaEye color='black' />
            ) : (
              <FaEyeSlash color='black' />
            )}
          </IconButton>
        </Flex>

        <Flex w='100%' align='center' justify='space-between'>
          <Text textStyle='sm'>Geometry</Text>
          <IconButton
            size='xs'
            aria-label='hide or show path'
            onClick={() => setGeomChecked(!geomChecked)}
          >
            {geomChecked ? (
              <FaEye color='black' />
            ) : (
              <FaEyeSlash color='black' />
            )}
          </IconButton>
        </Flex>

        <Flex w='100%' align='center' justify='space-between'>
          <Text textStyle='sm'>Particles</Text>
          <IconButton
            size='xs'
            aria-label='hide or show path'
            onClick={() => setParxChecked(!parxChecked)}
          >
            {parxChecked ? (
              <FaEye color='black' />
            ) : (
              <FaEyeSlash color='black' />
            )}
          </IconButton>
        </Flex>

        <Flex w='100%' align='center' justify='space-between'>
          <Switch
            size='sm'
            checked={colorChecked}
            onCheckedChange={(e) => setColorChecked(e.checked)}
          >
            Color
          </Switch>
          <IconButton
            size='xs'
            aria-label='Pick random palette'
            disabled={!colorChecked}
            onClick={pickColors}
          >
            <FaArrowRotateRight color='black' />
          </IconButton>
        </Flex>

        <Flex w='100%' align='center' justify='space-between'>
          <Switch
            size='sm'
            checked={bgChecked}
            onCheckedChange={(e) => setBgChecked(e.checked)}
          >
            Background
          </Switch>
          <IconButton
            size='xs'
            aria-label='Pick random palette'
            disabled={!bgChecked}
            onClick={cycleBackground}
          >
            <FaArrowRotateRight color='black' />
          </IconButton>
        </Flex>

        <ButtonGroup size='xs' variant='outline' w='full' pt={4}>
          <Button aria-label='Save composition' flexGrow={1} onClick={saveComp}>
            <FaFloppyDisk color='black' /> Save
          </Button>
          <Button
            aria-label='Export as JPEG'
            flexGrow={1}
            onClick={exportImage}
          >
            <FaCloudArrowDown color='black' /> Export
          </Button>
        </ButtonGroup>
      </VStack>
    </>
  );
};

export default Controls;
