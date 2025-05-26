import { useEffect, useMemo, useRef } from 'react';
import NullElement from '../utils/nullElement';
import FanBlade from '../utils/fanBlade';
import { CANV_HT, CANV_WD } from '../constants';
import { useControls } from '../hooks/useControls';
import { mapTo } from '../utils/helpers';
import { ColorArray, Point } from '../types';
import { Box } from '@chakra-ui/react';

const scale = 1;
const NUM_COLORS = 5;

// Get the device pixel ratio, falling back to 1.
const dpr = window.devicePixelRatio || 1;

const Composition = ({
  bezierSplinePoints,
  palette,
}: {
  bezierSplinePoints: Point[];
  palette: ColorArray;
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

  // const bezi = new BeziSpline(points, (val) => console.log(val));
  // const pts = getBezierSplinePoints(beziCtrlPts, 25);
  // let pts;
  // switch(pathOption) {
  //   case 0:
  //     pts = getStraightPath();
  //     break;
  //   case 1:
  //     // pts = getArcPoints(0.25 * Math.PI, NUM_POINTS, circleRadius, wd / 2, 260);
  //     pts = getArcPoints(2 * Math.PI, NUM_POINTS, circleRadius, wd / 2, ht / 2 - circleRadius);
  //     break;
  //   case 2:
  //   default:
  //     pts = bezi.getBezierSplinePoints(NUM_POINTS);
  // }

  // Initialize null elements
  // for (let j = 0; j < points.length; j++) {
  //   const temp = [];
  //   temp.push(new NullElement(points[j], j));
  //   setNullElements(temp);
  // }

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

  // useEffect(() => {
  //   const init = () => {
  //     const canvas = canvasRef.current;
  //     const ctx = canvas?.getContext('2d');
  //     if (canvas && ctx) {
  //       console.log('initialize');
  //       // Get the device pixel ratio, falling back to 1.
  //       const dpr = window.devicePixelRatio || 1;
  //       // Get the size of the canvas in CSS pixels.
  //       const rect = canvas.getBoundingClientRect();
  //       // Give the canvas pixel dimensions of their CSS
  //       // size * the device pixel ratio.
  //       canvas.width = rect.width * dpr;
  //       canvas.height = rect.height * dpr;
  //       // var ctx = canvas.getContext('2d');
  //       // Scale all drawing operations by the dpr, so you
  //       // don't have to worry about the difference.
  //       ctx.scale(dpr, dpr);
  //     }
  //   };

  //   init();
  // }, []);

  const { balance, cycleFrame, diff } = useControls();

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
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        fanBlades.forEach((fb, j) => {
          // const co = palette[j];
          fb.render(ctx, palette, true);
        });
      }
    };

    if (geomChecked) {
      update();
      draw();
    }
  }, [balance, cycleFrame, diff, fanBlades, geomChecked, nullElements, palette]);

  if (!bezierSplinePoints?.length) {
    return null;
  }

  // for (let j = 0; j < nullElements.length - 1; j++) {
  //   const points = {
  //     pt0: { x: 0, y: 0 },
  //     pt1: { x: 0, y: 0 },
  //     pt2: { x: 0, y: 0 },
  //     pt3: { x: 0, y: 0 },
  //   };

  //   const fb = new FanBlade(points, j);
  //   fanBlades.push(fb);
  // };

  // Replace existing null elements with a new set
  // set of x/y coordinates
  // const resetPoints = (_pts) => {
  //   const temp = [];
  //   for (let j = 0; j < _pts.length; j++) {
  //     temp.push(new NullElement(pts[j], j));
  //   }

  //   setNullElements(temp);
  // };

  // const eraser = useCallback(() => {
  //   const canvas = canvasRef.current;
  //   const ctx = canvas?.getContext('2d');
  //   if (canvas && ctx) {
  //     ctx.clearRect(0, 0, canvas.width, canvas.height);
  //   }
  // }, []);

  return geomChecked ? (
    <canvas
      id='composition'
      ref={canvasRef}
      style={{
        position: 'relative',
        pointerEvents: 'none',
        transform: 'scale: (0.5)',
        width: `${CANV_WD}px`,
        height: `${CANV_HT}px`,
        marginTop: '8px',
        // display: geomChecked ? 'block' : 'none',
      }}
    />
  ) : (
    <Box bg='white' w={CANV_WD} h={CANV_HT} mt={2} />
  );
};

export default Composition;

// class Fan {
//   constructor(_pts) {
//     this.fanBlades = [];
//     this.nullElements = [];

//     // Initialize null elements
//     for (let j = 0; j < _pts.length; j++) {
//       this.nullElements.push(new NullElement(_pts[j], j));
//     }

//     for (let j = 0; j < this.nullElements.length - 1; j++) {
//       const points = {
//         pt0: { x: 0, y: 0 },
//         pt1: { x: 0, y: 0 },
//         pt2: { x: 0, y: 0 },
//         pt3: { x: 0, y: 0 },
//       };

//       const fb = new FanBlade(points, j, 3);
//       this.fanBlades.push(fb);
//     };
//   }

//   // Replace existing null elements with a new set
//   // set of x/y coordinates
//   resetPoints(_pts) {
//     this.nullElements = [];

//     for (let j = 0; j < _pts.length; j++) {
//       this.nullElements.push(new NullElement(_pts[j], j));
//     }
//   }

//   update(currentCycleFrame) {
//     // Update all positions of our references
//     this.nullElements.forEach(nE => {
//       nE.update(currentCycleFrame);
//     });

//     for (let j = 0; j < this.nullElements.length - 1; j++) {
//       const thisRef = this.nullElements[j];
//       const nextRef = this.nullElements[j + 1];

//       const px0 = thisRef.point0.x + thisRef.x;
//       const py0 = thisRef.point0.y + thisRef.y;
//       const px1 = thisRef.point1.x + thisRef.x;
//       const py1 = thisRef.point1.y + thisRef.y;
//       const px2 = nextRef.point1.x + nextRef.x;
//       const py2 = nextRef.point1.y + nextRef.y;
//       const px3 = nextRef.point0.x + nextRef.x;
//       const py3 = nextRef.point0.y + nextRef.y;

//       const pv0 = { x: scale * px0, y: scale * py0 };
//       const pv1 = { x: scale * px1, y: scale * py1 };
//       const pv2 = { x: scale * px2, y: scale * py2 };
//       const pv3 = { x: scale * px3, y: scale * py3 };

//       this.fanBlades[j].update(pv0, pv1, pv2, pv3);
//     }
//   }

//   render() {
//     const fanCanvas = document.getElementById('fan');

//     if (fanCanvas.getContext) {
//       const ctx = fanCanvas.getContext('2d');
//       ctx.clearRect(0, 0, fanCanvas.width, fanCanvas.height);
//       this.fanBlades.forEach(fb => {
//         fb.render(ctx);
//       });
//     }
//   }
// }
