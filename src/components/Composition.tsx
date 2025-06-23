import { useEffect, useMemo, useRef, useState } from 'react';
import { FaPause, FaPlay } from 'react-icons/fa6';

import {
  Box,
  Flex,
  IconButton,
  SliderValueChangeDetails,
  VStack,
} from '@chakra-ui/react';

import { CANV_HT, CANV_WD, DURATION_FRAMES, MINTY } from '../constants';
import { useControls } from '../hooks/useControls';
import { useTimeLoop } from '../hooks/useTimeLoop';
import { ColorArray, Point } from '../types';
import FanBlade from '../utils/fanBlade';
import { mapTo } from '../utils/helpers';
import NullElement from '../utils/nullElement';
import Slider from './ui/slider';

const scale = 1;
const NUM_COLORS = 5;

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

  const nullElements = useMemo(() => {
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
    useTimeLoop(15000);
  const cycleFrame = 1 + Math.round(value * (DURATION_FRAMES - 1));

  useEffect(() => {
    if (!geomChecked) {
      return;
    }

    const update = () => {
      // Update all positions of our references
      const difference = mapTo(diff, 0, 100, 1, 8);

      nullElements.forEach((nE) => {
        const frame = isPlaying ? cycleFrame : manualFrame;
        nE.update(frame, balance / 100, difference);
      });

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

        const pv0 = { x: scale * px0, y: scale * py0 };
        const pv1 = { x: scale * px1, y: scale * py1 };
        const pv2 = { x: scale * px2, y: scale * py2 };
        const pv3 = { x: scale * px3, y: scale * py3 };

        fanBlades[j].update(pv0, pv1, pv2, pv3);
      }
    };

    const draw = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');

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
          (showBackground && renderColors && palette[backgroundIndex]) ||
          '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        fanBlades.forEach((fb) => {
          fb.render(ctx, palette, renderColors);
        });
      }
    };

    update();
    draw();
  }, [
    backgroundIndex,
    balance,
    cycleFrame,
    diff,
    fanBlades,
    geomChecked,
    isPlaying,
    manualFrame,
    nullElements,
    palette,
    renderColors,
    showBackground,
  ]);

  if (!bezierSplinePoints?.length) {
    return null;
  }

  const pad = 4;
  const extraPadding = 8;
  const gap = 8;
  const btnWidth = 48;
  const progressWidth = CANV_WD - btnWidth - pad - pad - gap - extraPadding;
  const trackHt = 6;
  const barHt = 2.5;
  const top = `${(barHt * 16) / 2 - 3}px`;
  const left = `${pad + btnWidth + gap}px`;

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

  return geomChecked ? (
    <VStack align='flex-start'>
      <canvas ref={canvasRef} style={canvasStyle} />
      <Flex
        w={1280}
        h='2.5rem'
        bg='#292929'
        outline='1px solid #404040'
        p={`${pad}px`}
        alignItems='center'
        gap={`${gap}px`}
        borderRadius='sm'
        position='relative'
      >
        <IconButton
          size='xs'
          aria-label='Play or pause animation'
          onClick={() => {
            if (isPlaying) {
              pause();
              setManualFrame(cycleFrame);
            } else {
              play();
            }
          }}
          w={`${btnWidth}px`}
        >
          {isPlaying ? <FaPause color='black' /> : <FaPlay color='#2bb79b' />}
        </IconButton>
        {isPlaying ? (
          <Flex w='full' h='100%' onClick={pause}>
            <Box
              h={`${trackHt}px`}
              w={progressWidth}
              bg='#111'
              borderRadius='full'
              position='absolute'
              top={top}
              left={left}
            />
            <Box
              h={`${trackHt}px`}
              style={{ width: `${value * progressWidth}px` }}
              bg={MINTY}
              borderRadius='full'
              position='absolute'
              top={top}
              left={left}
              zIndex={1}
            />
          </Flex>
        ) : (
          // See if it's possible to show a slider component here when animation is paused
          <Flex w='full' h='100%' align='center' onClick={pause}>
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
    </VStack>
  ) : (
    <Box bg='white' w={CANV_WD} h={CANV_HT} mt={2} />
  );
};

export default Composition;
