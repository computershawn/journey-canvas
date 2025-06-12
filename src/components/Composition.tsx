import { useEffect, useMemo, useRef } from 'react';

import { Box, Flex, IconButton, VStack } from '@chakra-ui/react';

import { CANV_HT, CANV_WD, DURATION_FRAMES } from '../constants';
import { useControls } from '../hooks/useControls';
import { useTimeLoop } from '../hooks/useTimeLoop';
import { ColorArray, Point } from '../types';
import FanBlade from '../utils/fanBlade';
import { mapTo } from '../utils/helpers';
import NullElement from '../utils/nullElement';
import { FaPause, FaPlay } from 'react-icons/fa6';

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
  const { geomChecked } = useControls();
  const canvasRef = useRef<HTMLCanvasElement>(null);
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

  // const { balance, cycleFrame, diff } = useControls();
  const { balance, diff } = useControls();

  const { isPlaying, play, pause, value } = useTimeLoop(15000);
  const cycleFrame = Math.round(value * DURATION_FRAMES);

  useEffect(() => {
    const update = () => {
      // Update all positions of our references
      const difference = mapTo(diff, 0, 100, 1, 8);

      nullElements.forEach((nE) => {
        nE.update(cycleFrame, balance / 100, difference);
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

    if (geomChecked) {
      update();
      draw();
    }
  }, [
    backgroundIndex,
    balance,
    cycleFrame,
    diff,
    fanBlades,
    geomChecked,
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
  const progressWidth = 1280 - btnWidth - pad - pad - gap - extraPadding;

  return geomChecked ? (
    <VStack align='flex-start'>
      <canvas ref={canvasRef} style={canvasStyle} />
      <Flex
        w={1280}
        bg='#292929'
        outline="1px solid #404040"
        p={`${pad}px`}
        alignItems='center'
        gap={`${gap}px`}
        borderRadius='sm'
      >
        <IconButton
          size='xs'
          aria-label='Play or pause animation'
          onClick={() => (isPlaying ? pause() : play())}
          // w='full'
          w={`${btnWidth}px`}
        >
          {isPlaying ? <FaPlay color='green' /> : <FaPause color='black' />}
        </IconButton>
        <Box h='1px' w={`${value * progressWidth}px`} bg='#a2ffec' />
      </Flex>
    </VStack>
  ) : (
    <Box bg='white' w={CANV_WD} h={CANV_HT} mt={2} />
  );
};

export default Composition;
