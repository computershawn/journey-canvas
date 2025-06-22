import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { FaArrowRotateRight, FaEye, FaEyeSlash } from 'react-icons/fa6';

import {
  Flex,
  Heading,
  HStack,
  IconButton,
  SliderValueChangeDetails,
  Text,
  VStack,
} from '@chakra-ui/react';

import { useControls } from '../hooks/useControls';
import { ColorArray, CtrlPoint } from '../types';
import { getRandomIndex } from '../utils/helpers';
import BgColorSelect from './BgColorSelect';
import Chips from './Chips';
import CompSelector from './CompSelector';
import Slider from './ui/slider';
import Switch from './ui/switch';
import SaveComp from './SaveComp';

const ControlPanel = ({
  allColors,
  backgroundIndex,
  beziCtrlPts,
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
  beziCtrlPts: CtrlPoint[];
  bgChecked: boolean;
  colorChecked?: boolean;
  onChangeComp: (index: number) => void;
  palette: ColorArray;
  setBackgroundIndex: (index: number) => void;
  setBgChecked: (checked: boolean) => void;
  setColorChecked: (checked: boolean) => void;
  setPalette: (palette: ColorArray) => void;
}) => {
  // const [parxChecked, setParxChecked] = useState(true);
  const [compName, setCompName] = useState<string[]>(['-']);
  const {
    balance,
    setBalance,
    diff,
    setDiff,
    geomChecked,
    setGeomChecked,
    pathsChecked,
    setPathsChecked,
    comps,
    setComps,
  } = useControls();

  useEffect(() => {
    const savedComps = window.localStorage.getItem('saved_comps');
    if (savedComps) {
      const parsed = JSON.parse(savedComps);
      const defaultCompName = parsed?.[0]?.name || '-';
      setCompName([defaultCompName]);
    }
  }, []);

  const colorsLoaded = allColors.length > 0;

  const pickColors = () => {
    if (colorsLoaded) {
      const randomIndex = getRandomIndex(allColors.length);
      const pal = allColors[randomIndex];
      setPalette(pal);
    }
  };

  const updateBalance = (details: SliderValueChangeDetails) => {
    const value = details.value[0];
    setBalance(value);
  };

  const updateDiff = (details: SliderValueChangeDetails) => {
    const value = details.value[0];
    setDiff(value);
  };

  // Save settings of current composition
  const handleClickSave = (name: string) => {
    if (beziCtrlPts.length < 6) {
      throw new Error('beziCtrlPts must contain at least 6 points');
    }

    const curveSetPoints = {
      pt1: { x: beziCtrlPts[0].x, y: beziCtrlPts[0].y },
      pt4: { x: beziCtrlPts[1].x, y: beziCtrlPts[1].y },
      pt5: { x: beziCtrlPts[2].x, y: beziCtrlPts[2].y },
      pt2: { x: beziCtrlPts[3].x, y: beziCtrlPts[3].y },
      pt6: { x: beziCtrlPts[4].x, y: beziCtrlPts[4].y },
      pt3: { x: beziCtrlPts[5].x, y: beziCtrlPts[5].y },
    };

    const updated = [
      ...comps,
      {
        backgroundIndex,
        balance,
        name,
        curveSetPoints,
        diff,
        id: uuidv4(),
        palette,
      },
    ];

    window.localStorage.setItem('saved_comps', JSON.stringify(updated));
    setComps(updated);
    setCompName([name]);
    onChangeComp(updated.length - 1);
  };

  // Set index and set slider values based on the newly selected composition
  const handleChangeComp = (i: number) => {
    const newBalance = comps[i].balance ?? 0;
    const newDiff = comps[i].diff ?? 0;
    const newPalette = comps[i].palette ?? Array(5).fill('#fff');
    const newBgIndex = comps[i].backgroundIndex ?? 0;
    setBackgroundIndex(newBgIndex);
    setBalance(newBalance);
    setDiff(newDiff);
    setPalette(newPalette);
    onChangeComp(i);
  };

  return (
    <VStack w={300} h='100vh' bg='#eee' p={4} align='flex-start' gap={6}>
      <Heading size='lg' mb={4}>
        journey
      </Heading>

      <CompSelector
        numComps={comps.length}
        onChangeComp={handleChangeComp}
        compName={compName}
        setCompName={setCompName}
      />

      <VStack w='full' gap={4} align='flex-start'>
        <Slider
          size='sm'
          label='Balance'
          value={balance}
          onValueChange={updateBalance}
        />
        <Slider
          size='sm'
          label='Difference'
          value={diff}
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

        {/* <Flex w='100%' h={8} align='center' justify='space-between'>
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
        </Flex> */}

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
      <SaveComp onClickSave={handleClickSave} />
    </VStack>
  );
};

export default ControlPanel;
