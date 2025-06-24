import { useEffect, useState } from 'react';
import { FaArrowRotateRight, FaEye, FaEyeSlash } from 'react-icons/fa6';
import { v4 as uuidv4 } from 'uuid';

import {
  Flex,
  Heading,
  HStack,
  IconButton,
  Link,
  SliderValueChangeDetails,
  Text,
  VStack,
} from '@chakra-ui/react';

import logoTypeUrl from '/journey-logotype.svg';
import { useControls } from '../hooks/useControls';
import { ColorArray, CtrlPoint } from '../types';
import { getRandomIndex } from '../utils/helpers';
import BgColorSelect from './BgColorSelect';
import Chips from './Chips';
import CompSelector from './CompSelector';
import Slider from './ui/slider';
import Switch from './ui/switch';
import NewComp from './CreateComp';
import OptionsMenu from './OptionsMenu';
import EditComps from './ManageComps';

const Tagline = () => (
    <Text textStyle='sm' color='#000' mt="auto">
      {/* <Box as='span' opacity='0.625'>
        copyright © 2025 shawn jackson
      </Box>{' '} */}
      <Link
        _hover={{ opacity: 1, color: '#000' }}
        _focus={{ outlineWidth: 1, outlineColor: 'rgb(255,255,255,0.25)' }}
        variant='plain'
        href='https://github.com/computershawn/journey-canvas'
        opacity={0.625}
        target='_blank'
        color='#000'
        transition={'opacity 0.2s ease-in-out'}
      >
        @computershawn
      </Link>
    </Text>
);

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
  isWide,
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
  isWide: boolean;
}) => {
  // const [parxChecked, setParxChecked] = useState(true);
  const [compId, setCompId] = useState<string[]>(['-']);
  const [isCreateCompOpen, setIsCreateCompOpen] = useState(false);
  const [isEditCompsOpen, setIsEditCompsOpen] = useState(false);

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
      const defaultCompId = parsed?.[0]?.id || '0';
      setCompId([defaultCompId]);
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

  // Save current as new composition
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

    const id = uuidv4();

    const updated = [
      ...comps,
      {
        backgroundIndex,
        balance,
        name: name.trim(),
        curveSetPoints,
        diff,
        id,
        palette,
      },
    ];

    window.localStorage.setItem('saved_comps', JSON.stringify(updated));
    setComps(updated);
    setCompId([id]);
    onChangeComp(updated.length - 1);
  };

  // Update current composition
  const handleClickUpdate = () => {
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

    const updated = comps.map((c) => {
      if (c.id === compId[0]) {
        return {
          ...c,
          backgroundIndex,
          balance,
          curveSetPoints,
          diff,
          palette,
        };
      }
      return c;
    });

    window.localStorage.setItem('saved_comps', JSON.stringify(updated));
    setComps(updated);
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

  const openCreateComp = () => {
    setIsCreateCompOpen(true);
    setIsEditCompsOpen(false);
  };
  const openEditComps = () => {
    setIsCreateCompOpen(false);
    setIsEditCompsOpen(true);
  };

  const panelWidth = isWide ? 300 : 216;

  return (
    <VStack w={panelWidth} h='100vh' bg='#eee' p={4} align='flex-start' gap={6}>
      <Heading size='lg' mb={4} w='full'>
        <Flex justify='space-between'>
          <img src={logoTypeUrl} alt='Journey Logo' width='80' />
          <OptionsMenu
            onUpdateExistingComp={handleClickUpdate}
            onCreateComp={openCreateComp}
            onEditComps={openEditComps}
          />
        </Flex>
      </Heading>

      <CompSelector
        numComps={comps.length}
        onChangeComp={handleChangeComp}
        compId={compId}
        setCompId={setCompId}
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
              <Chips wide={isWide} palette={palette} />
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
      <Tagline />

      {/* Dialog for creating a new comp */}
      <NewComp
        onClickSave={handleClickSave}
        open={isCreateCompOpen}
        setOpen={setIsCreateCompOpen}
      />

      {/* Dialog for editing existing comps */}
      <EditComps open={isEditCompsOpen} setOpen={setIsEditCompsOpen} />
    </VStack>
  );
};

export default ControlPanel;
