import { useMemo, useRef, useState } from 'react';

import { FaPause, FaPlay } from 'react-icons/fa6';
import { useAuthState } from 'react-firebase-hooks/auth';

import {
  Box,
  Flex,
  HStack,
  IconButton,
  SliderValueChangeDetails,
  VStack,
} from '@chakra-ui/react';

import { CANV_HT, CANV_WD, DURATION_FRAMES, MINTY } from '../constants';
import { auth } from '../firebase';
import { useControls } from '../hooks/useControls';
import { useProcessVideo } from '../hooks/useProcessVideo';
import { useTimeLoop } from '../hooks/useTimeLoop';
import { useUploadFrames } from '../hooks/useUploadFrames';
import { ColorArray, Point } from '../types';
import FanBlade from '../utils/fanBlade';
import { loggy, mapTo } from '../utils/helpers';
import NullElement from '../utils/nullElement';
import AuthDialog from './AuthDialog';
import Slider from './ui/slider';
import VideoGen from './VideoGen';
import Coverlay from './Coverlay';
import VideoPreviewModal from './VideoPreviewModal';

const SCALE = 1;
const NUM_COLORS = 5;
const RENDER_BTN_OFFSET = 48;
const PAD = 4;
const EXTRA_PADDING = 8;
const GAP = 8;
const PLAY_BTN_WD = 48;
const PROGRESS_WD =
  CANV_WD - PLAY_BTN_WD - 2 * PAD - GAP - EXTRA_PADDING - RENDER_BTN_OFFSET;
const TRACK_HT = 6;
const BAR_HT = 2.5;
const TOP = `${(BAR_HT * 16) / 2 - 3}px`;
const LEFT = `${PAD + PLAY_BTN_WD + GAP}px`;

// Get the device pixel ratio, falling back to 1.
const dpr = window.devicePixelRatio || 1;

const canvasStyle: React.CSSProperties = {
  position: 'relative',
  pointerEvents: 'none',
  transform: 'scale: (0.5)',
  width: `${CANV_WD}px`,
  height: `${CANV_HT}px`,
  marginTop: '8px',
};

const Composition = ({
  backgroundIndex,
  bezierSplinePoints,
  palette,
  renderColors,
  showBackground,
}: {
  backgroundIndex: number;
  bezierSplinePoints: Point[];
  palette: ColorArray;
  renderColors: boolean;
  showBackground: boolean;
}) => {
  const { balance, diff, geomChecked } = useControls();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [manualFrame, setManualFrame] = useState(1);
  const [isVideoPreviewOpen, setIsVideoPreviewOpen] = useState(false);
  const [authUser] = useAuthState(auth);

  const canvas = canvasRef.current;
  const ctx = canvas?.getContext('2d');

  const nullElements: NullElement[] = useMemo(() => {
    const temp = [];
    if (bezierSplinePoints?.length) {
      for (let j = 0; j < bezierSplinePoints.length; j++) {
        temp.push(new NullElement(bezierSplinePoints[j], j));
      }
      return temp;
    }

    return [];
  }, [bezierSplinePoints]);

  const fanBlades = useMemo(() => {
    const temp = [];
    for (let j = 0; j < nullElements.length - 1; j++) {
      const x0 = Math.random() * CANV_WD;
      const y0 = Math.random() * CANV_HT;
      const s = 40;
      const points = {
        pt0: { x: x0, y: y0 },
        pt1: { x: x0 + s, y: y0 },
        pt2: { x: x0 + s, y: y0 + s },
        pt3: { x: x0, y: y0 + s },
      };

      const fb = new FanBlade(points, j, NUM_COLORS, Math.random());
      temp.push(fb);
    }

    return temp;
  }, [nullElements.length]);

  const { isPlaying, pause, play, resetLastValue, setValue, value } =
    useTimeLoop(12800);
  const cycleFrame = 1 + Math.round(value * (DURATION_FRAMES - 1));

  const updateFanBlades = () => {
    for (let j = 0; j < nullElements.length - 1; j++) {
      const thisRef = nullElements[j];
      const nextRef = nullElements[j + 1];

      const px0 = thisRef.point0.x + thisRef.x;
      const py0 = thisRef.point0.y + thisRef.y;
      const px1 = thisRef.point1.x + thisRef.x;
      const py1 = thisRef.point1.y + thisRef.y;
      const px2 = nextRef.point1.x + nextRef.x;
      const py2 = nextRef.point1.y + nextRef.y;
      const px3 = nextRef.point0.x + nextRef.x;
      const py3 = nextRef.point0.y + nextRef.y;

      const pv0 = { x: SCALE * px0, y: SCALE * py0 };
      const pv1 = { x: SCALE * px1, y: SCALE * py1 };
      const pv2 = { x: SCALE * px2, y: SCALE * py2 };
      const pv3 = { x: SCALE * px3, y: SCALE * py3 };

      fanBlades[j].update(pv0, pv1, pv2, pv3);
    }
  };

  const update = () => {
    // Update all positions of our references
    const difference = mapTo(diff, 0, 100, 1, 8);

    nullElements.forEach((nE) => {
      const frame = isPlaying ? cycleFrame : manualFrame;
      nE.update(frame, balance / 100, difference);
    });

    updateFanBlades();
  };

  const draw = (): void => {
    if (canvas && ctx) {
      // Get the size of the canvas in CSS pixels.
      const rect = canvas.getBoundingClientRect();
      // Give the canvas pixel dimensions of their CSS size * the device pixel ratio.
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      // Scale all drawing operations by the dpr, so you don't have to worry about the difference.
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle =
        (showBackground && renderColors && palette[backgroundIndex]) || '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      fanBlades.forEach((fb) => {
        fb.render(ctx, palette, renderColors);
      });
    }
  };

  if (geomChecked) {
    update();
    draw();
  }

  const updateFrame = (details: SliderValueChangeDetails) => {
    const value = details.value[0];
    setManualFrame(value);
  };

  const handleValueChangeEnd = (details: SliderValueChangeDetails) => {
    const value = details.value[0];
    const v = mapTo(value, 1, DURATION_FRAMES, 0, 1);
    resetLastValue(v);
    setValue(v);
  };

  const handleClickTimeline = () => {
    pause();
    setManualFrame(cycleFrame);
  };

  const { isUploading, uploadFrames } = useUploadFrames({
    canvas,
    draw,
    nullElements,
    updateFanBlades,
  });

  const { processVideo, isRendering, videoCreateError, videoUrl } =
    useProcessVideo();

  const exportToVideo = async () => {
    loggy.info('Begin uploading frames…');
    await uploadFrames();

    loggy.info('Frames uploaded. Begin rendering video…');
    await processVideo();

    loggy.info('Video rendered. Showing preview…');
    setIsVideoPreviewOpen(true);
  };

  if (videoCreateError) {
    loggy.error(videoCreateError);
  }

  const isUploadingOrRendering = isUploading || isRendering;

  return (
    <>
      {geomChecked ? (
        <>
          <VStack align='flex-start'>
            {isUploadingOrRendering && (
              <Coverlay isUploading={isUploading} isRendering={isRendering} />
            )}
            <canvas ref={canvasRef} style={canvasStyle} />
            <HStack>
              {authUser ? (
                <VideoGen
                  exportToVideo={exportToVideo}
                  openPreviewModal={() => setIsVideoPreviewOpen(true)}
                  isUploading={isUploading}
                  isRendering={isRendering}
                  videoUrl={videoUrl}
                />
              ) : (
                <AuthDialog />
              )}

              {/* TODO: Can this animation progress bar be made into a separate component? */}
              <Flex
                w={CANV_WD - RENDER_BTN_OFFSET}
                h='2.5rem'
                bg='#292929'
                outline='1px solid #404040'
                p={`${PAD}px`}
                alignItems='center'
                gap={`${GAP}px`}
                borderRadius='sm'
                position='relative'
              >
                <IconButton
                  size='xs'
                  aria-label='Play or pause animation'
                  onClick={() => {
                    if (isPlaying) {
                      handleClickTimeline();
                    } else {
                      play();
                    }
                  }}
                  w={`${PLAY_BTN_WD}px`}
                  bg={MINTY}
                >
                  {isPlaying ? (
                    <FaPause color='black' />
                  ) : (
                    <FaPlay color='black' />
                  )}
                </IconButton>
                {isPlaying ? (
                  <Flex w='full' h='100%' onClick={handleClickTimeline}>
                    <Box
                      h={`${TRACK_HT}px`}
                      w={PROGRESS_WD}
                      bg='#111'
                      borderRadius='full'
                      position='absolute'
                      top={TOP}
                      left={LEFT}
                    />
                    <Box
                      h={`${TRACK_HT}px`}
                      style={{ width: `${value * PROGRESS_WD}px` }}
                      bg={MINTY}
                      borderRadius='full'
                      position='absolute'
                      top={TOP}
                      left={LEFT}
                      zIndex={1}
                    />
                  </Flex>
                ) : (
                  <Flex w='full' h='100%' align='center'>
                    <Slider
                      defaultValue={mapTo(value, 0, 1, 1, DURATION_FRAMES)}
                      isAnimProgressBar
                      max={DURATION_FRAMES}
                      min={1}
                      onValueChange={updateFrame}
                      onValueChangeEnd={handleValueChangeEnd}
                      showValueText={false}
                      size='sm'
                      value={manualFrame}
                    />
                  </Flex>
                )}
              </Flex>
            </HStack>
          </VStack>
        </>
      ) : (
        <Box bg='white' w={CANV_WD} h={CANV_HT} mt={2} />
      )}

      {/* Dialog for previewing video */}
      <VideoPreviewModal
        open={isVideoPreviewOpen}
        setOpen={setIsVideoPreviewOpen}
        videoUrl={videoUrl}
      />
    </>
  );
};

export default Composition;
