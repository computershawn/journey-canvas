import { useState } from 'react';
import {
  FaArrowRotateRight,
  FaCloudArrowDown,
  FaEye,
  FaEyeSlash,
  FaFloppyDisk,
  FaPause,
  FaPlay,
} from 'react-icons/fa6';

import {
  Button,
  ButtonGroup,
  Flex,
  Heading,
  IconButton,
  SliderValueChangeDetails,
  Text,
  VStack,
} from '@chakra-ui/react';

// import { mapTo } from '../utils/helpers';
import Slider from './ui/slider';
import Switch from './ui/switch';
import CompSelector from './CompSelector';
import { useControls } from '../hooks/useControls';

const ControlPanel = ({
  onChangeComp,
}: {
  onChangeComp: (index: number) => void;
}) => {
  const [pathsChecked, setPathsChecked] = useState(true);
  const [geomChecked, setGeomChecked] = useState(true);
  const [parxChecked, setParxChecked] = useState(true);
  const [colorChecked, setColorChecked] = useState(true);
  const [bgChecked, setBgChecked] = useState(true);
  const [playing, setPlaying] = useState(false);
  const { balance, setBalance, diff, setDiff } = useControls();

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

  const updateFrame = (details: SliderValueChangeDetails) => {
    const value = details.value[0];
    console.log('go to frame number', value);
    // goToFrameNumber(value);
  };

  const updateBalance = (details: SliderValueChangeDetails) => {
    const value = details.value[0];
    setBalance(value);
  };

  const updateDiff = (details: SliderValueChangeDetails) => {
    const value = details.value[0];
    // const num = mapTo(value, 0, 100, 1, 8);
    // console.log('set diff to', num);
    // setDiff(num);
    setDiff(value);
  };

  return (
    <VStack w={300} h='100vh' bg='#eee' p={4} align='flex-start' gap={6}>
      <Heading size='lg' mb={4}>
        journey
      </Heading>
      <CompSelector onChangeComp={onChangeComp} />

      <VStack w='full' gap={4} align='flex-start'>
        <Slider
          size='sm'
          defaultValue={0}
          label='Frame'
          wd={240}
          onValueChange={updateFrame}
        />
        <Slider
          size='sm'
          defaultValue={balance}
          label='Balance'
          wd={240}
          onValueChange={updateBalance}
        />
        <Slider
          size='sm'
          defaultValue={diff}
          label='Difference'
          wd={240}
          onValueChange={updateDiff}
        />

        {/* <Button
          variant='outline'
          aria-label='Play animation'
          w='full'
          onClick={() => setPlaying(!playing)}
        >
          {playing ? (
            <>
              <FaPlay color='green' /> Play
            </>
          ) : (
            <>
              <FaPlay color='black' /> Pause
            </>
          )}
        </Button> */}
        <IconButton
          size='xs'
          aria-label='Play or pause animation'
          onClick={() => setPlaying(!playing)}
          w='full'
        >
          {playing ? <FaPlay color='green' /> : <FaPause color='black' />}
        </IconButton>
      </VStack>

      <VStack w='full' gap={2} align='flex-start'>
        <Flex w='100%' align='center' justify='space-between'>
          <Text textStyle='sm' opacity={pathsChecked ? 1 : '0.625'}>Paths</Text>
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
          <Text textStyle='sm' opacity={geomChecked ? 1 : '0.625'}>Geometry</Text>
          <IconButton
            size='xs'
            aria-label='hide or show shapes'
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
          <Text textStyle='sm' opacity={parxChecked ? 1 : '0.625'}>Particles</Text>
          <IconButton
            size='xs'
            aria-label='hide or show particles'
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
      </VStack>

      <ButtonGroup size='xs' variant='outline' w='full' pt={4} mt='auto'>
        <Button aria-label='Save composition' flexGrow={1} onClick={saveComp}>
          <FaFloppyDisk color='black' /> Save
        </Button>
        <Button aria-label='Export as JPEG' flexGrow={1} onClick={exportImage}>
          <FaCloudArrowDown color='black' /> Export
        </Button>
      </ButtonGroup>
    </VStack>
  );
};

export default ControlPanel;
