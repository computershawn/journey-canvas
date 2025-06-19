import { useState } from 'react';

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
  Heading,
  HStack,
  IconButton,
  SliderValueChangeDetails,
  Text,
  VStack,
} from '@chakra-ui/react';

import { useControls } from '../hooks/useControls';
import { ColorArray } from '../types';
import { getRandomIndex } from '../utils/helpers';
import BgColorSelect from './BgColorSelect';
import Chips from './Chips';
import CompSelector from './CompSelector';
import Slider from './ui/slider';
import Switch from './ui/switch';

const ControlPanel = ({
  allColors,
  backgroundIndex,
  bgChecked,
  colorChecked,
  onChangeComp,
  palette,
  setBackgroundIndex,
  setBgChecked,
  setColorChecked,
  setPalette,
}: {
  allColors: ColorArray[];
  backgroundIndex: number;
  bgChecked: boolean;
  colorChecked?: boolean;
  onChangeComp: (index: number) => void;
  palette: ColorArray;
  setBackgroundIndex: (index: number) => void;
  setBgChecked: (checked: boolean) => void;
  setColorChecked: (checked: boolean) => void;
  setPalette: (palette: ColorArray) => void;
}) => {
  const [parxChecked, setParxChecked] = useState(true);
  const {
    balance,
    setBalance,
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

  const saveComp = () => {
    console.log('save current composition to storage');
  };

  const exportImage = () => {
    console.log('export current comp as image');
  };

  const updateBalance = (details: SliderValueChangeDetails) => {
    const value = details.value[0];
    setBalance(value);
  };

  const updateDiff = (details: SliderValueChangeDetails) => {
    const value = details.value[0];
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
      </VStack>

      <VStack w='full' gap={2} align='flex-start'>
        <Flex w='100%' h={8} align='center' justify='space-between'>
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

        <Flex w='100%' h={8} align='center' justify='space-between'>
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

        <Flex w='100%' h={8} align='center' justify='space-between'>
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

        <Flex w='100%' h={8} align='center' justify='space-between'>
          <Switch
            size='sm'
            checked={colorsLoaded && colorChecked}
            onCheckedChange={(e) => setColorChecked(e.checked)}
            disabled={!colorsLoaded}
            opacity={colorChecked ? 1 : '0.625'}
          >
            Colors
          </Switch>
          {colorChecked && palette.length > 0 && (
            <HStack>
              <Chips palette={palette} />
              <IconButton
                size='xs'
                aria-label='Pick random palette'
                disabled={!colorChecked || !colorsLoaded}
                onClick={pickColors}
              >
                <FaArrowRotateRight color='black' />
              </IconButton>
            </HStack>
          )}
        </Flex>

        <Flex w='100%' h={8} align='center' justify='space-between'>
          <Switch
            size='sm'
            checked={colorsLoaded && bgChecked}
            onCheckedChange={(e) => setBgChecked(e.checked)}
            disabled={!colorsLoaded || !colorChecked}
            opacity={colorChecked && !bgChecked ? '0.625' : '1'}
          >
            Background
          </Switch>
          {colorChecked && bgChecked && palette.length > 0 && (
            <BgColorSelect
              palette={palette}
              pickColor={setBackgroundIndex}
              selectedIndex={backgroundIndex}
            />
          )}
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
