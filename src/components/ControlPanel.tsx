import { useState } from 'react';
import {
  FaArrowRight,
  FaArrowRotateRight,
  FaCloudArrowDown,
  FaEye,
  FaEyeSlash,
  FaFloppyDisk,
  FaPause,
  FaPlay,
} from 'react-icons/fa6';

import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  HStack,
  IconButton,
  SliderValueChangeDetails,
  Text,
  VStack,
} from '@chakra-ui/react';

import { useControls } from '../hooks/useControls';
import { ColorArray } from '../types';
import Chips from './Chips';
import CompSelector from './CompSelector';
import Slider from './ui/slider';
import Switch from './ui/switch';
import { getRandomIndex } from '../utils/helpers';

const ControlPanel = ({
  allColors,
  backgroundIndex,
  bgChecked,
  onChangeComp,
  palette,
  setBackgroundIndex,
  setBgChecked,
  setPalette,
}: {
  allColors: ColorArray[];
  backgroundIndex: number;
  bgChecked: boolean;
  onChangeComp: (index: number) => void;
  palette: ColorArray;
  setBackgroundIndex: (index: number) => void;
  setBgChecked: (checked: boolean) => void;
  setPalette: (palette: ColorArray) => void;
}) => {
  const [parxChecked, setParxChecked] = useState(true);
  const [colorChecked, setColorChecked] = useState(true);
  // const [bgChecked, setBgChecked] = useState(true);
  const [playing, setPlaying] = useState(false);
  const {
    balance,
    setBalance,
    cycleFrame,
    setCycleFrame,
    diff,
    setDiff,
    geomChecked,
    setGeomChecked,
    pathsChecked,
    setPathsChecked,
  } = useControls();

  const colorsLoaded = allColors.length > 0;

  const pickColors = () => {
    if (colorsLoaded) {
      const randomIndex = getRandomIndex(allColors.length);
      const pal = allColors[randomIndex];
      setPalette(pal);
    }
  };

  const cycleBackground = () => {
    const index =
      backgroundIndex < palette.length - 1 ? backgroundIndex + 1 : 0;
    setBackgroundIndex(index);
  };

  const saveComp = () => {
    console.log('save current composition to storage');
  };

  const exportImage = () => {
    console.log('export current comp as image');
  };

  const updateFrame = (details: SliderValueChangeDetails) => {
    const value = details.value[0];
    setCycleFrame(value);
  };

  const updateBalance = (details: SliderValueChangeDetails) => {
    const value = details.value[0];
    setBalance(value);
  };

  const updateDiff = (details: SliderValueChangeDetails) => {
    const value = details.value[0];
    setDiff(value);
  };

  const DURATION_FRAMES = 384; // TODO: Consider making this variable

  return (
    <VStack w={300} h='100vh' bg='#eee' p={4} align='flex-start' gap={6}>
      <Heading size='lg' mb={4}>
        journey
      </Heading>
      <CompSelector onChangeComp={onChangeComp} />

      <VStack w='full' gap={4} align='flex-start'>
        <Slider
          size='sm'
          defaultValue={cycleFrame}
          label='Frame'
          min={1}
          max={DURATION_FRAMES}
          onValueChange={updateFrame}
        />
        <IconButton
          size='xs'
          aria-label='Play or pause animation'
          onClick={() => setPlaying(!playing)}
          w='full'
        >
          {playing ? <FaPlay color='green' /> : <FaPause color='black' />}
        </IconButton>
        <Slider
          size='sm'
          defaultValue={balance}
          label='Balance'
          onValueChange={updateBalance}
        />
        <Slider
          size='sm'
          defaultValue={diff}
          label='Difference'
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
        {/* <IconButton
          size='xs'
          aria-label='Play or pause animation'
          onClick={() => setPlaying(!playing)}
          w='full'
        >
          {playing ? <FaPlay color='green' /> : <FaPause color='black' />}
        </IconButton> */}
      </VStack>

      <VStack w='full' gap={2} align='flex-start'>
        <Flex w='100%' align='center' justify='space-between'>
          <Text textStyle='sm' opacity={pathsChecked ? 1 : '0.625'}>
            Guide Paths
          </Text>
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
          <Text textStyle='sm' opacity={geomChecked ? 1 : '0.625'}>
            Geometry
          </Text>
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
          <Text textStyle='sm' opacity={parxChecked ? 1 : '0.625'}>
            Particles
          </Text>
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
            checked={colorsLoaded && colorChecked}
            onCheckedChange={(e) => setColorChecked(e.checked)}
            disabled={!colorsLoaded}
          >
            Color
          </Switch>
          <HStack>
            {colorChecked && palette.length > 0 && (
              <Chips palette={palette} selectedIndex={backgroundIndex} />
            )}
            <IconButton
              size='xs'
              aria-label='Pick random palette'
              disabled={!colorChecked || !colorsLoaded}
              onClick={pickColors}
            >
              <FaArrowRotateRight color='black' />
            </IconButton>
          </HStack>
        </Flex>

        <Flex w='100%' align='center' justify='space-between'>
          <Switch
            size='sm'
            checked={colorsLoaded && bgChecked}
            onCheckedChange={(e) => setBgChecked(e.checked)}
            disabled={!colorsLoaded || !colorChecked}
          >
            Background
          </Switch>
          <HStack>
            {colorChecked && bgChecked && palette.length > 0 && (
              <Box
                w={12}
                h={6}
                bg={palette[backgroundIndex]}
                border='1px solid black'
                borderRadius='sm'
              />
            )}
            <IconButton
              size='xs'
              aria-label='Pick random palette'
              disabled={!colorChecked || !bgChecked || !colorsLoaded}
              onClick={cycleBackground}
            >
              <FaArrowRight color='black' />
            </IconButton>
          </HStack>
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
