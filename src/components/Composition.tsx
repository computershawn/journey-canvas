import { useMemo, useRef, useState } from 'react';
import { CtrlPoint } from '../types';
import NullElement from '../utils/nullElement';
import FanBlade from '../utils/fanBlade';
import { Button } from '@chakra-ui/react';
// import BeziSpline from '../utils/bezier';
import { getBezierSplinePoints } from '../utils/helpers';

const scale = 1;
const numColors = 5;

const Composition = ({
  beziCtrlPts,
  wd,
  ht,
}: {
  beziCtrlPts: CtrlPoint[];
  wd: number;
  ht: number;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // const fanBlades = [];
  // const nullElements = [];
  // const [nullElements, setNullElements] = useState<NullElement[]>([]);
  const nullElements = useMemo(() => {
    const temp = [];
    for (let j = 0; j < beziCtrlPts.length; j++) {
      temp.push(new NullElement(beziCtrlPts[j], j));
    }
    return temp;
  }, [beziCtrlPts]);
  console.log('nullElements', nullElements);

  if (beziCtrlPts.length === 0) {
    return null;
  }

  // const bezi = new BeziSpline(points, (val) => console.log(val));
  // const numLoops = 325;
  const pts = getBezierSplinePoints(beziCtrlPts, 25);
  // let pts;
  // switch(pathOption) {
  //   case 0:
  //     pts = getStraightPath();
  //     break;
  //   case 1:
  //     // pts = getArcPoints(0.25 * Math.PI, numLoops, circleRadius, wd / 2, 260);
  //     pts = getArcPoints(2 * Math.PI, numLoops, circleRadius, wd / 2, ht / 2 - circleRadius);
  //     break;
  //   case 2:
  //   default:
  //     pts = bezi.getBezierSplinePoints(numLoops);
  // }

  // Initialize null elements
  // for (let j = 0; j < points.length; j++) {
  //   const temp = [];
  //   temp.push(new NullElement(points[j], j));
  //   setNullElements(temp);
  // }

  // const fanBlades = useMemo(() => {
  //   console.log('nullElements', nullElements);
  //   const temp = [];
  //   for (let j = 0; j < nullElements.length - 1; j++) {
  //     const points = {
  //       pt0: { x: 0, y: 0 },
  //       pt1: { x: 0, y: 0 },
  //       pt2: { x: 0, y: 0 },
  //       pt3: { x: 0, y: 0 },
  //     };

  //     const fb = new FanBlade(points, j, numColors);
  //     temp.push(fb);
  //   };

  //   return temp;
  // }, [nullElements]);

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
  const resetPoints = (_pts) => {
    const temp = [];
    for (let j = 0; j < _pts.length; j++) {
      temp.push(new NullElement(pts[j], j));
    }

    setNullElements(temp);
  };

  const update = (currentCycleFrame: number) => {
    // Update all positions of our references
    nullElements.forEach((nE) => {
      nE.update(currentCycleFrame);
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
    const tempNullElements = [];
    for (let j = 0; j < pts.length; j++) {
      tempNullElements.push(new NullElement(pts[j], j));
    }

    const tempFanBlades = [];
    for (let j = 0; j < tempNullElements.length - 1; j++) {
      const fanBladePoints = {
        pt0: { x: 0, y: 0 },
        pt1: { x: 0, y: 0 },
        pt2: { x: 0, y: 0 },
        pt3: { x: 0, y: 0 },
      };

      const fb = new FanBlade(fanBladePoints, j, numColors);
      tempFanBlades.push(fb);
    }

    if (tempFanBlades.length === 0 || tempNullElements.length == 0) {
      console.log('oh no');
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      tempFanBlades.forEach((fb) => {
        fb.render(ctx);
      });
    }
  };

  // const eraser = useCallback(() => {
  //   const canvas = canvasRef.current;
  //   const ctx = canvas?.getContext('2d');
  //   if (canvas && ctx) {
  //     ctx.clearRect(0, 0, canvas.width, canvas.height);
  //   }
  // }, []);

  const doStuff = () => {
    update(1);
    draw();
  };

  return (
    <>
      <Button variant='outline' onClick={doStuff}>
        click me!
      </Button>
      <canvas
        ref={canvasRef}
        width={wd}
        height={ht}
        style={{ border: '1px solid black' }}
      />
    </>
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
