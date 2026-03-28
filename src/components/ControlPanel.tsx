/*
  TODO:
  1. [DONE] FIX THE DROPDOWN-SELECT, IT'S NOT WORKING
  2. [DONE] CREATE AND UPLOAD THUMBNAIL ON VIDEO CREATE
     [DONE] ADD VIDEO THUMBNAILS SOMEWHERE IN THE UI
  3. [DONE] MAKE RENDER JOB NON-BLOCKING; USER CAN INTERACT
            WITH THE UI, THEY JUST CAN'T INITIATE A NEW RENDER
  4. [DONE] ADD ABILITY TO DELETE A VIDEO
  5. [] ADD ABILITY TO DOWNLOAD A VIDEO
  6. [] LIMIT USER TO 3 VIDEOS
*/

import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  FaArrowRotateRight,
  FaEye,
  FaEyeSlash,
  FaSliders,
} from 'react-icons/fa6';
import { v4 as uuidv4 } from 'uuid';

import {
  CloseButton,
  Drawer,
  Flex,
  HStack,
  IconButton,
  Portal,
  SliderValueChangeDetails,
  Text,
  VStack,
} from '@chakra-ui/react';

import { auth } from '../firebase';
import { useControls } from '../hooks/useControls';
import { ColorArray, CtrlPoint } from '../types';
import { getRandomIndex } from '../utils/helpers';
import BgColorSelect from './BgColorSelect';
import Chips from './Chips';
import CompSelector from './CompSelector';
import Slider from './ui/slider';
import Switch from './ui/switch';
import NewComp from './CreateComp';
import EditComps from './ManageComps';
import Tagline from './Tagline';
import UserInfo from './UserInfo';
import VideoList from './VideoList';

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
  const [compId, setCompId] = useState<string[]>(['-']);
  const [isCreateCompOpen, setIsCreateCompOpen] = useState(false);
  const [isEditCompsOpen, setIsEditCompsOpen] = useState(false);
  const [authUser] = useAuthState(auth);

  const {
    balance,
    setBalance,
    diff,
    setDiff,
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

  return (
    <>
      <Drawer.Root placement='start' trapFocus={false} defaultOpen>
        <Drawer.Trigger asChild>
          <IconButton size='sm' color='black' m={2}>
            <FaSliders />
          </IconButton>
        </Drawer.Trigger>
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content bg='#eee'>
              <Drawer.Header p={4} pb={2}>
                <Drawer.Title>
                  <Flex align='center' gap={2}>
                    <FaSliders />
                    Controls
                  </Flex>
                </Drawer.Title>
              </Drawer.Header>
              <Drawer.Body p={0}>
                <VStack w='full' p={4} pt={2} gap={6} flex={1}>
                  <Flex direction='column' w='100%'>
                    {authUser && (
                      <UserInfo
                        userEmail={authUser.email || '[no email address]'}
                      />
                    )}
                  </Flex>

                  <CompSelector
                    numComps={comps.length}
                    onChangeComp={handleChangeComp}
                    compId={compId}
                    setCompId={setCompId}
                    openCreateModal={() => setIsCreateCompOpen(true)}
                    openEditModal={() => setIsEditCompsOpen(true)}
                    handleClickUpdate={handleClickUpdate}
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
                      <Text textStyle='sm'>Guide Paths</Text>
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
                      <Switch
                        size='sm'
                        checked={colorsLoaded && colorChecked}
                        onCheckedChange={(e) => setColorChecked(e.checked)}
                        disabled={!colorsLoaded}
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
                  {authUser && <VideoList />}
                </VStack>
              </Drawer.Body>
              <Drawer.Footer p={0}>
                <Tagline />
              </Drawer.Footer>
              <Drawer.CloseTrigger asChild>
                <CloseButton size='xs' bg='#eee' />
              </Drawer.CloseTrigger>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>

      {/* Dialog for creating a new comp */}
      <NewComp
        onClickSave={handleClickSave}
        open={isCreateCompOpen}
        setOpen={setIsCreateCompOpen}
      />

      {/* Dialog for editing existing comps */}
      <EditComps open={isEditCompsOpen} setOpen={setIsEditCompsOpen} />
    </>
  );
};

export default ControlPanel;
